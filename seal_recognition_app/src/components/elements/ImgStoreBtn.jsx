import React, { useState, useEffect } from "react";
import DetectionBtn from "./DetectionBtn";
import { Button, Box, Typography } from "@mui/material";
import axios from "axios";

const ImgStoreBtn = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [resResult, setResResult] = useState("");

  const files = props.inputFiles; // 送信する画像配列

  useEffect(() => {
    if (files.length === 0) {
      setResResult("");
    }
  });

  // ボタンが押された時の挙動
  const pressbtn = () => {

    // アップロードファイルが空の場合
    if (files.length === 0) {
      setErrorMessage("ファイルをアップロードしてください");
      return;
    } else {
      setErrorMessage("");
    }

    // POSTするURL
    const post_url = "http://127.0.0.1:8000/uploadfile/ ";

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
        setResResult(response);
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
      {/* ファイルの保存完了時に表示 */}
      {resResult && (
        <Box>
          <Typography>アップロードファイルの保存が完了しました。</Typography>
          <Typography>物体検知可能です！！</Typography>
        </Box>
      )}

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