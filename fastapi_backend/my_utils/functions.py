from fastapi import HTTPException
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import torch
import cv2
import time
import torchvision
import math
from io import BytesIO
import base64
from aiofiles import open as async_open
from pdf2image import convert_from_bytes


 # 実際にYOLOv5で予測し、結果を返す関数(前処理、後処理含む)
def run(session, input_file):
    """
    オリジナル画像にクラス、クラス確率のテキストが付与されたbboxを描画する。

    Parameters
    --------------
    session : (InferenceSession) YOLOv5で作成したonnxファイルを使ったInferenceSessionオブジェクト
    input_file : (str) 物体検出する画像のパス

    
    Return
    -----------
    output : 以下の2つのパラメータを返す
             (int) : 検出した物体に未押印があれば1, 押印しかなければ0。
             (ndarray | None) 未押印があれば、bboxを追加した画像のndarray、押印しかなければNone。
             (list | None) 未押印があれば、各bboxにおける押印、未押印のリスト、押印しかなければNone。
             (list | None) 未押印があれば、各bboxにおける信頼スコアのリスト、押印しかなければNone。
    
    """
    # 以下はYOLOv5の値と学習モデルからの値
    max_det = 1000  # 画像あたりの最大bbox数
    conf_thres = 0.6  # 信頼値の閾値
    iou_thres = 0.45  # NMS IOU の閾値
    imgsz = (640, 640) # インプットの画像サイズ
    agnostic_nms = False # 異なるbboxの重なりをマージするか
    hide_conf = False # 信頼度スコアの非表示をするか
    stride = 32 
    
    # onnxに保存されているメタデータ -> {'names': "{0: '押印', 1: '未押印'}", 'stride': '32'}
    meta = session.get_modelmeta().custom_metadata_map
    
    # metadataがあればをアンパックする
    if 'stride' in meta:
        stride, names = int(meta['stride']), eval(meta['names'])
    
    # 16ビット浮動小数点精度の使用
    fp16 = False
    
    # 画像のサイズをstrideの倍数にする
    imgsz = [max(math.ceil(x / stride) * stride, 0) for x in imgsz]
    
    
    #==============
    # 画像の前処理
    #==============
    
    np_img = cv2.imread(input_file)
    
    # 画像のリサイズ
    img = letterbox(np_img, [640, 640])[0]
    
    # (H,W,C) -> (C, H, W)
    # BGR -> RGB
    img = img.transpose((2, 0, 1))[::-1]
    img = np.ascontiguousarray(img)
    
    # テンソル化 -> 正規化
    img = torch.from_numpy(img)
    img = img.half() if fp16 else img.float()
    scaled_img = img / 255
    scaled_img = scaled_img.unsqueeze(0)
    
    
    # ===============
    # 推論 
    # ===============
    
    scaled_img = scaled_img.cpu().numpy()
    output_name = session.get_outputs()[0].name
    input_name = session.get_inputs()[0].name
    
    # yのshape:(データ数、bbox数, メタ情報)
    # メタ情報:[x中心, y中心, bboxの幅, bboxの高さ, 信頼スコア、 押印の確率, 未押印の確率]
    y = session.run([output_name], {input_name: scaled_img})[0]
    pred = torch.from_numpy(y) # テンソル化
    
    # NMS処理
    pred = non_max_suppression(pred, conf_thres, iou_thres, agnostic_nms, max_det=max_det)
    
    
    
    # ===============
    # 出力処理 
    # ==============
    pred_cls_list = pred[0][:, -1] # 全bboxのクラス識別結果
    no_seal_cls_id = list(eval(meta['names']))[1] # 未押印のcls_id
    
    
    # 未押印の識別があったら、画像出力の分岐
    if no_seal_cls_id in pred_cls_list:
    
        # --- 未押印あり -> bboxつきの画像配列を渡す処理 -------------
        for det in pred:
            process_img = np_img.copy() # np化したオリジナルimg
            if len(det):
        
                # bboxの情報をオリジナル画像用に調整
                det[:, :4] = scale_boxes(scaled_img.shape[2:], det[:, :4], process_img.shape).round()
        
                # bbox毎にイテレート
                for *xyxy, prob, cls_id in reversed(det):
                    cls_id = int(cls_id)
        
                    # bboxの色 (cv2に合わせるため、BGR)、YOLOv5に合わせている
                    # class_id:[0, 1]の2クラス用 -> いずれclassにしたら、インスタンス変数にしたい
                    color = [(56, 56, 255), (151, 157, 255)][cls_id]
                    label = names if hide_conf else f"{names[cls_id]} {prob:.2f}"
        
                    # 最後にPILで処理されて,ChannelがRGBに変わっているので注意!!
                    # 順々に検出したbboxの枠を作成しるのでinputのimg変数と格納する変数名を同じにする。
                    process_img = box_label(img = process_img, box = xyxy, label = label, color = color)
        
                # POSTのResponseのため、RGBに変換後、(C, H, W)に転置する。
                output_img = cv2.cvtColor(process_img, cv2.COLOR_BGR2RGB)

                # 各クラス情報と確率のリスト
                cls_info = det[:, -2:].data.numpy().astype(np.float64)
                classes = [ names[cls] for cls in cls_info[:, -1]]
                cls_conf =list(cls_info[:, 0].round(decimals=3)) # 下3桁まで表示
                
    
        # 1とbbox付き画像のndarray配列を返す予定
        return (1, output_img, classes, cls_conf)
    
    else:
        
        # --- 未押印なし -------------
        # 1と出力する、それ以外は未押印と出力を合わせるのでNone
        return (0, None, None, None)



# =====================================
# def run()に必要な関数
# =====================================

def box_label (
    img,
    box,
    label ="",
    color = (56, 56, 255),
    txt_color = (255, 255, 255),
    
):
    """
    オリジナル画像にクラス、クラス確率のテキストが付与されたbboxを描画する。

    Parameters
    --------------
    img : (ndarray) cv2処理されたオリジナル画像のndarray配列。
                    Channelは(B, G, R)。
    box : (tensor) リスケール画像のbboxの情報 [x1, y1, x2, y2]。
                   x1,y1はbboxの左上のx,y座標、x2, y2は右下のx,y座標を表す。
    label : (str) bboxに付与されるテキスト "bboxのクラス名 クラス確率(下2桁)"の文字列。
    color : (tuple | list-like) bboxの枠の色 (B, G, R)。
    txt_color : (tuple | list-like) bboxの付与するテキストの色。 
                                    PIL処理のため、Channelは(R, G, B)。

    
    Return
    -----------
    output : (ndarray) オリジナル画像にbbox(テキスト付き)を描画したndarray配列。
    
    """

    
    # YOLOv5の使用より (参照：ultralytics/ultralytics/utils/plotting.py)
    # line_widthは　1　と　2で挙動を確認済み
    line_width = max(math.floor(sum(img.shape) / 2 * 0.003), 2) # bboxの枠用に調整
    
    # p1:(x1, y1), p2:(x2, y2)
    p1, p2 = (int(box[0]), int(box[1])), (int(box[2]), int(box[3]))
    
    # bboxの描画
    cv2.rectangle(img, p1, p2, color, thickness=line_width, lineType=cv2.LINE_AA)
    
    if label:
        
        # 日本語フォントファイルのパス
        font_path = "font/Koruri-Bold.ttf"
    
        # 日本語フォントを読み込み
        font_size = int(line_width * 6)
        font = ImageFont.truetype(font_path, font_size)
    
        # テキストのサイズを計算
        text_bbox = font.getbbox(label) # return -> bboxの(left, top, right, bottom) 
        w, h = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
    
        # テキスト用の領域描画
        outside = p1[1] - h >= 3
        p2 = p1[0] + w + 7, p1[1] - h - 5 if outside else p1[1] + h + 5 # テキスト分の右上座標を計算 
        cv2.rectangle(img, p1, p2, color, -1, cv2.LINE_AA)  # テキスト領域の塗り潰し
    
        #------------ PIL (BGR -> RGB)　-------------
        # PILイメージに変換
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # BGR -> RGB変換
        img_pil = Image.fromarray(img)
        draw = ImageDraw.Draw(img_pil)
    
        # テキストを描画
        position = (p1[0]+ 4, p2[1] if outside else p1[1] + h + 2)
        draw.text(position, label, font=font, fill=txt_color)
    
        # ndarrayに変換
        img = np.array(img_pil)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # BGRに戻す
        

    return img
  
  
def scale_boxes(scaled_img_shape, boxes, img_shape):
  """
  渡されたbboxをオリジナル画像用に調整する。

  Parameters
  --------------
  scaled_img_shape : (tuple) リスケールした画像のshape()
  boxes : (tensor) リスケール画像用bboxの情報 [x1, y1, x2, y2]
                    x1,y1はbboxの左上のx,y座標、x2, y2は右下のx,y座標を表す
  img_shape : (tuple) オリジナル画像のshape, (H, W, C)の順番

  
  Return
  -----------
  output : (tensor) オリジナル画像用に調整したbboxの情報 [x1, y1, x2, y2]
                    オリジナル画像からはみ出る大きさのbboxはクリッピングされる。
  
  """
  
  ratio = min(scaled_img_shape[0] / img_shape[0], scaled_img_shape[1] / img_shape[1]) # new / old
  pad = (scaled_img_shape[1] - img_shape[1] * ratio) / 2, (scaled_img_shape[0] - img_shape[0] * ratio) / 2 # 片面のpad計算 
  
  # 元画像用にbboxを調整するため,
  # 片方のpad分を引き、リスケールの比率で割る
  boxes[:, [0, 2]] -= pad[0] # x padding
  boxes[:, [1, 3]] -= pad[1] # y padding
  boxes /= ratio 
  
  # 0以上、オリジナル画像の幅、高さ以内にbboxが入るようにクリップ
  clip_boxes(boxes, img_shape)

  return boxes


def clip_boxes(boxes, shape):
    """
    bboxがオリジナル画像の範囲内に収まるようにクリッピング
    0以上もしくはオリジナル画像の幅、高さに制限する。
    
    Parameters
    --------------
    boxes : (tensor) オリジナル画像用に調整したbbox, [x1, y1, x2, y2],
                     x1,y1はbboxの左上のx,y座標、x2, y2は右下のx,y座標を表す
    shape : (tuple) オリジナル画像のshape, (H, W, C)の順番


    Return
    -----------
    output : None 
             しかし、クリッピングにより変更がある場合は、直接boxesに直接変更が加えられる。
    
    """
    
    # bboxがオリジナル画像の範囲内に収まるようにクリッピング
    boxes[..., 0].clamp_(0, shape[1])  # x1
    boxes[..., 1].clamp_(0, shape[0])  # y1
    boxes[..., 2].clamp_(0, shape[1])  # x2
    boxes[..., 3].clamp_(0, shape[0])  # y2


def non_max_suppression(
    prediction, 
    conf_thres=0.25,
    iou_thres=0.45,
    agnostic=False,
    labels=(),
    max_det=300,
    nm=0,
):
    """
    
    YOLOの予測結果をNMS処理する。

    Parameters
    --------------
    prediction : (tensor) テンソル化したyoloが予測した結果
    conf_thres : (float) バウンディングボックス(bbox)の信頼度スコアの閾値
    iou_thres : (float) IOUの閾値
    agnostic : (Bool) 重なった異なるクラスのbboxを同一のbboxにするか
    labels : (tuple or list-like) 画像内のラベルの情報
    max_det : (int) 最大のbbox数
    nm : (int) マスク数
    
    Return
    -----------
    output : (tensor) NMS処理後のbbox情報を含むテンソル、[x1, y1, x2, y2, クラス確率, cls_id]のカラムに変換されている
                      x1,y1はbboxの左上のx,y座標、x2, y2は右下のx,y座標を表す
                      
    """
    batch_size = prediction.shape[0] # バッチサイズ
    num_class = prediction.shape[2] - nm - 5 # クラス数
    bool_cnf = prediction[..., 4] > conf_thres # bbox毎に信頼度スコアがconf_thresより大きいかのbool
    
    max_wh = 7680  # 最大のbboxの幅、高さ
    max_nms = 30000  # torchvision.ops.nms()のための最大のbbox数
    time_limit = 0.5 + 0.05 * batch_size  # タイムリミット(s)
    
    start = time.time()
    mi = 5 + num_class
    output = [torch.zeros((0, 6 + nm), device=prediction.device)] * batch_size
    
    
    for idx, x in enumerate(prediction):
    
        # conf_thresより大きい信頼度スコアを持つbboxsを抽出
        x = x[bool_cnf[idx]]
    
        # labelsを持っていた時の処理
        if labels and len(labels[idx]):
                lb = labels[idx]
                v = torch.zeros((len(lb), num_class + nm + 5), device=x.device)
                v[:, :4] = lb[:, 1:5]  # box
                v[:, 4] = 1.0  # conf
                v[range(len(lb)), lb[:, 0].long() + 5] = 1.0  # cls
                x = torch.cat((x, v), 0)
            
    
        # フィルター後のbboxがない場合
        if not x.shape[0]:
            continue
            
        x[:, 5:] *= x[:, 4:5] # 信頼度スコア*各cls確率
        box = xywh2xyxy(x[:, :4]) # [x1, y1, x2, y2]:bboxの左上と右下の座標に変換
        mask = x[:, mi:] # maskがなければ[]
    
        cls_prob, cls_id = x[:, 5:mi].max(1, keepdim=True) # 各bboxで確率の高いclsの値とcls_idを返す
    
        # [x1, y1, x2, y2, clsの確率, cls_id]のカラムの順に結合
        # clsの確率(本来のprob*信頼度スコア)がconf_thresより高いもののみ抽出
        x = torch.cat((box, cls_prob, cls_id.float(), mask), axis=1)[cls_prob.view(-1) > conf_thres]
    
        
        n = x.shape[0]
        if not n:
            continue
    
        # cls確率をキーにして降順に並び替え、且つ max_nmsを超えないようにする
        x = x[x[:, 4].argsort(descending=True)[:max_nms]] 
    
        # 異なるクラスのbboxを区別して評価するため、agnosticでクラス固有のbboxを作成
        c = x[:, 5:6] * (0 if agnostic else max_wh)
        boxes, scores = x[:, :4] + c, x[:, 4]
    
        # nms
        selected_idx = torchvision.ops.nms(boxes, scores, iou_thres)
        selected_idx = selected_idx[:max_det]

        output[idx] = x[selected_idx]
        finish = time.time()
        if (finish - start) > time_limit:
            break
            
    return output


def xywh2xyxy(x):
    """
    [x中心、y中心、bboxの幅, bboxの高さ] -> [bboxの左上のx、bboxの左上のy, bboxの右下のx, bboxの右下のy]
    
    """
    y = x.clone()
    y[..., 0] = x[..., 0] - x[..., 2] / 2  # bboxの左上のx
    y[..., 1] = x[..., 1] - x[..., 3] / 2  # bboxの左上のy
    y[..., 2] = x[..., 0] + x[..., 2] / 2  # bboxの右下のx
    y[..., 3] = x[..., 1] + x[..., 3] / 2  # bboxの右下のy
    return y
  
  
def letterbox(
  img,
  new_shape=(640, 640),
  color=(114, 114, 114),
  scaleup=True,
):
  """
  指定されたサイズに画像をリサイズを行う。

  Parameters
  --------------
  img : (ndarray) 画像のndarray配列
  new_shape : (tuple) リサイズしたい画像サイズ
  color : (tuple:(B, G, R)) パディングの色
  scaleup : (Bool) スケールアップを行う場合はTrue

  Return
  -----------
  padded_img : (ndarray) リサイズされた画像のndarray配列
  ratio : (tuple リサイズした比率
  (dw, dh) : (int:(横、高さ)) パディングした数値(横、高さ)
  """
  
  # アスペクト比を保った画像のリサイズ
  ori_shape = img.shape[:2] # [H, W, C] -> [H, W]
  r = min(new_shape[0] / ori_shape[0], new_shape[1] / ori_shape[1])
  
  # スケールアップなしの場合
  if not scaleup:
      r = min(r, 1.0)
  
  # アスペクト比を保ったまま、リスケール
  ratio = (r, r)
  new_unpad = (round(ori_shape[1] * r), round(ori_shape[0] * r)) # cv.resizeのため[W, H]にする
  
  # パディングする領域を算出
  dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
  dw, dh = dw / 2, dh / 2

  # dw, dfが.5の時の対応 -> この微調整をしないとsession.run()時のinputのshapeが合わなくなる
  top, bottom = round(dh - 0.1), round(dh + 0.1)
  left, right = round(dw - 0.1), round(dw + 0.1)
  
  # 画像のリサイズ
  if new_shape[::-1] != new_unpad:
      img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
      
  padded_img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)

  return padded_img, ratio, (dw, dh)


def imgarrtobyte(imgarr):
    """
    画像配列データをクライアントにレスポンスするためにテキストベース変換を行う

    Parameters
    --------------
    imgarr : (ndarray) RGB画像のndarray配列

    Return
    -----------
    img_str : (str) 画像のテキストデータ

    """
    
    img = Image.fromarray(imgarr) # PILオブジェクト化

    # メモリにバッファ作成し、画像を保存
    buffered = BytesIO() 
    img.save(buffered, format='JPEG') # バッファに保存
    img_byte = buffered.getvalue() # バイトデータとして取得
    img_base64 = base64.b64encode(img_byte)  # Base64のASCII文字(バイト列)にして、安全に送信できる。
    img_str = img_base64.decode('utf-8') # Pythonで扱うため,文字列変換
    return img_str




# POSTされた画像を保存する関数
async def img_save(file, imgs_store_path):
    """
    POSTでアップロードされた画像・PDFファイルを指定されたディレクトリにjpg形式で保存する
    PDFファイルは1ページごとに画像ファイルに変換される。

    Parameters
    --------------
    File : (UploadFile) POSTでアップロードされた画像のUploadFileオブジェクト
    imgs_store_path : (str) 画像を保存するディレクトリのパス

    Return
    -----------
    None 
    
    """
    
    # PDFは画像ファイルに変換後、保存
    if file.content_type == "application/pdf":
        # PDFファイルを読み込む
        pdf_bytes = await file.read()
        
        # byte形式のPDFを1ページごとPILオブジェクトに変換
        # 学習に使用したファイルは100x100 dpiなので合わせる
        image = convert_from_bytes(pdf_bytes, dpi=100)
        
        # アスペクト比を保ちつつ、1000のサイズにリサイズする
        image[0].thumbnail(size=(1000, 1000))
        
        # 画像を保存
        for i, image in enumerate(image):
            image_path = f'{imgs_store_path}/{file.filename[:-4]}_page_{i+1}.jpg'
            image.save(image_path, 'JPEG')
    else:
        image_byte = await file.read()
        
        # PILオブジェクトに変換
        image = Image.open(BytesIO(image_byte))
        
        # アスペクト比を保ちつつ、1000のサイズにリサイズする
        image.thumbnail(size=(1000, 1000))
        
        # リサイズした画像の保存
        file_path = f'{imgs_store_path}/{file.filename}'
        
        # PNGのようなRGBAをRGBに変換後、保存
        image.convert('RGB').save(file_path, 'JPEG')
            