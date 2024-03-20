from my_utils.functions import run, imgarrtobyte
from os.path import basename
import glob
import onnxruntime as ort



# 画像フォルダのパス
imgs_path = glob.glob('img/img_071.jpg')

# 物体検知後の結果保存
no_seal_detection = 0
filename_folder = []
imgs_holder = []


# ==========
# 推論
# ==========

# 1画像ごとに処理
for img_path in imgs_path:
  session = ort.InferenceSession('best.onnx')
  
  # 返り値:
  # 未押印あり→ (1, RGB画像のndarray配列)
  # 押印のみ  → (0, None)
  cls_id, no_seal_img = run(session, img_path)
  print(f"-----FileName:{basename(img_path[:-4])}---------")
  print('推論結果:', cls_id)
  
  
  #未押印が検出された場合
  if cls_id == 1 :
    no_seal_detection += 1 # 未押印カウント
    
    # 当該画像配列のバイト化
    img_str = imgarrtobyte(no_seal_img)
    
    # Response用にファイル名、画像データの格納
    filename = basename(img_path[:-4])
    filename_folder.append(filename)
    imgs_holder.append(img_str)
  else:
    continue
  
# ===================
# 全画像の解析後
# ====================
  
# 総合的結果
result = '未押印検出されませんでした。' if no_seal_detection == 0 else '未押印が検出されました。'
  

response = {
    'result': result,
    'no_seal_detection': no_seal_detection,
    'image_list': imgs_holder
}


# return jsonify(response)

print(f"\n未押印検出数:{no_seal_detection}")
print('未押印ファイル名', filename_folder)
print(len(imgs_holder))
print('コメント:', result)
