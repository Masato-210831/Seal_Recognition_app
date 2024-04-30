from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
import glob
from my_utils.functions import run, imgarrtobyte, img_save
from os.path import basename
import onnxruntime as ort
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI()

# CORS対応
origins = [
    "https://masa-devs.net",
    "http://localhost:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# POSTされた画像の保存ディレクトリのパス
imgs_store_path = './img_store'

#===========================================
# postされたファイルをファイルシステムに保存
#===========================================
@app.post("/uploadfile/")
# async def create_upload_file(files: list[UploadFile] | None = None):
async def create_upload_file(files: list[UploadFile]):

    # img_storeフォルダがない場合、作成する
    os.makedirs(imgs_store_path, exist_ok=True)
    
    for file in files:
        
      # 保存するファイルの選別(jpeg, jpg, png, pdf)
        if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
            raise HTTPException(status_code=400, detail="JPEG, JPG, PNG, PDFファイルをアップロードしてください。")
        
        # ファイルの保存
        await img_save(file, imgs_store_path)
    
    
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
       raise HTTPException(status_code=400, detail="アップロードファイルの保存をしてください")
   
    # ファイルのパスを取得 
    imgs_path = glob.glob(imgs_store_path + '/*')
    imgs_path.sort() # globでは順番にファイルを取得しないのでソートする。
    
    # 物体検知後の結果保存
    no_seal_detection = 0
    filename_holder = []
    imgs_holder = []
    cls_holder = []
    cls_conf_holder = []

    # ==========
    # 推論
    # ==========

    # 1画像ごとに処理
    session = ort.InferenceSession('./onnx/best.onnx')
    for img_path in imgs_path:
        
        # 返り値:
        # 未押印あり→ (1, RGB画像のndarray配列, classのリスト, 信頼スコアリスト)
        # 押印のみ  → (0, None)
        cls_id, no_seal_img, classes, cls_conf = run(session, img_path)
        print(f"-----FileName:{basename(img_path[:-4])}---------")
        print('推論結果:', cls_id)
    
        #未押印が検出された場合
        if cls_id == 1 :
            no_seal_detection += 1 # 未押印カウント
            
            # 当該画像配列のバイト化
            img_str = imgarrtobyte(no_seal_img)
            
            # Response用にファイル名、画像データの格納
            filename = basename(img_path[:-4])
            filename_holder.append(filename)
            imgs_holder.append(img_str)
            cls_holder.append(classes)
            cls_conf_holder.append(cls_conf)
        else:
            continue
    
    # ===================
    # 全画像の解析後
    # ====================
    
    # 総合的結果
    result = '未押印検出されませんでした。' if no_seal_detection == 0 else f'未押印が検出されました（合計：{no_seal_detection}ページ）'
    

    response = {
        'result': result,
        'no_seal_imgs_names':filename_holder,
        'classes': cls_holder,
        'cls_conf': cls_conf_holder,
        'image_list': imgs_holder,
    }
    
    # 画像保存ディレクトリの削除
    shutil.rmtree(imgs_store_path)


    return JSONResponse(content=response)


#=====================================
# Clound runのコールドスタート問題対策
#=====================================

# ヘルスチェックのエンドポイント
@app.get("/health")
def health_check():
    return {"status":"OK"}

# uvicronサーバーの立ち上がりを同期的に行う
if __name__ == "__main__":
    config = uvicorn.Config(app, host="0.0.0.0", port=8000)
    server = uvicorn.Server(config)
    server.run()
    


