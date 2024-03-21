import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";

const ImgStoreBtn = (props) => {
  const [errorMessage, setErrorMessage] = useState("");

  // ボタンが押された時の挙動
  const pressbtn = () => {
    const files = props.inputFiles; // 送信する画像配列

    // アップロードファイルがからの場合
    if (files.length === 0) {
      setErrorMessage("ファイルをアップロードしてください");
      return;
    } else {
      setErrorMessage("");
    }

    const post_url = "http://127.0.0.1:8000/uploadfile/ "; // POSTするURL

    console.log("ファイルの中身は", Object.values(files));
    // FormDataオブジェクトに追加
    const formData = new FormData();
    Object.values(files).forEach((file) => formData.append("files", file));

    // アップロード画像のPOST
    axios
      .post(post_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("responseは", response.data);
        console.log("展開", [...response.data.filename]);
      })
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          setErrorMessage(error.response.data.detail); // エラーメッセージを設定
        } else {
          setErrorMessage("画像保存でエラーが発生しました。"); // 一般的なエラーメッセージを設定
        }
      });
  };

  return (
    <>
      {/* エラーの時だけ表示 */}
      {errorMessage && (
        <Typography color="error" variant="body1" sx={{ display: "block" }}>
          エラーメッセージ：
          <br />
          {errorMessage}
        </Typography>
      )}

      <Button
        onClick={pressbtn}
        variant="contained"
        sx={{ display: "block", width: 300, opacity: 0.7 }}
      >
        アップロードファイルの保存
      </Button>
    </>
  );
};

export default ImgStoreBtn;
