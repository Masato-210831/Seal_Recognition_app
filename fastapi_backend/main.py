from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
import glob
from aiofiles import open as async_open
from my_utils.functions import run, imgarrtobyte, pdftoimg
from os.path import basename
import onnxruntime as ort


app = FastAPI()

# POSTされた画像の保存ディレクトリのパス
imgs_store_path = './img_store'

#===========================================
# postされたファイルをファイルシステムに保存
#===========================================
@app.post("/uploadfile/")
# async def create_upload_file(files: list[UploadFile] | None = None):
async def create_upload_file(files: list[UploadFile]):
    
    if not files:
       raise HTTPException(status_code=400, detail="ファイルをアップロードしてください")
    else:
        # img_storeフォルダがない場合、作成する
        os.makedirs(imgs_store_path, exist_ok=True)
        
        # ファイルの保存
        await pdftoimg(files, imgs_store_path)
        
        response = {"filename": [file.filename for file in files]}
        
                    
        # 保存したファイル名を返信
        return JSONResponse(content=response)
    
    
#==================
# 未押印の物体検知
#==================
@app.post("/predict/")
# 画像フォルダのパス
def predict():
    # ファイルをアップロードしているかの確認
    if not os.path.exists(imgs_store_path):
       raise HTTPException(status_code=400, detail="ファイルをアップロードしてください")
   
    # ファイルのパスを取得 
    imgs_path = glob.glob(imgs_store_path + '/*')
    imgs_path.sort() # globでは順番にファイルを取得しないのでソートする。
    
    # 物体検知後の結果保存
    no_seal_detection = 0
    filename_folder = []
    imgs_holder = []
    print("取得したパス：", imgs_path)

    # ==========
    # 推論
    # ==========

    # 1画像ごとに処理
    session = ort.InferenceSession('best.onnx')
    for img_path in imgs_path:
        
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
        'no_seal_imgs_list':filename_folder,
        'image_list': imgs_holder
    }
    
    # 画像保存ディレクトリの削除
    shutil.rmtree(imgs_store_path)


    return JSONResponse(content=response)


