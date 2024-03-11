from typing import Annotated
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from aiofiles import open as async_open

app = FastAPI()


#===============
# postされたファイルをファイルシステムに保存
#===============
@app.post("/uploadfile/")
# async def create_upload_file(files: list[UploadFile] | None = None):
async def create_upload_file(files: list[UploadFile]):
    
    if not files:
        return {"message": "No upload file sent"}
    else:
        # img_storeフォルダがない場合、作成する
        folder_path = './img_store'
        os.makedirs(folder_path, exist_ok=True)
        
        # ファイルの保存
        for file in files:
            file_path = f'{folder_path}/{file.filename}'
            
            # ファイルの保存
            async with async_open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
                await f.close()
                
        # 保存したファイル名を返信
        return {"filename": [file.filename for file in files]}


