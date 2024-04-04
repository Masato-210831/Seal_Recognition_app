import React, { useState, useEffect } from "react";
import DetectionBtn from "./DetectionBtn";
import { Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { typography } from "@mui/system";

const ImgStoreBtn = ({inputFiles, storedState, errorState}) => {

  const [storedResult, setStoredResult] = storedState;
  const [errorMessage, setErrorMessage] = errorState;
  const [initState, setInitState] = useState(false)

  const files = inputFiles; // 送信する画像配列

  useEffect(() => {
    if (files.length === 0) {
      setStoredResult("");
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

    setStoredResult("")
    setInitState(true) // 送信中表示

    // POSTするURL
    // const post_url = "http://127.0.0.1:8000/uploadfile/ ";
    const post_url = "https://detection-image-vdaepgddza-uc.a.run.app/uploadfile/ ";

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
        setStoredResult(response);
        setInitState(false) // 送信中非表示
      })
      .catch(function (error) {
        console.log(error);
        setInitState(false) // 送信中非表示
        if (error.response) {
          setErrorMessage(error.response.data.detail); // エラーメッセージを設定
        } else {
          setErrorMessage("画像保存でエラーが発生しました。"); // 一般的なエラーメッセージを設定
        }
      });
  };

  return (
    <>
      {initState && (
        <Box>
          <Typography>ファイル送信中・・・</Typography>
          <Typography>初回は時間がかかります!!</Typography>
        </Box>
      )}

      {/* ファイルの保存完了時に表示 */}
      {storedResult && (
        <Box>
          <Typography>ファイルの送信が完了しました。</Typography>
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
        sx={{ display: "block", width: 200, opacity: 0.7 }}
      >
        ファイルの送信
      </Button>
    </>
  );
};

export default ImgStoreBtn;
