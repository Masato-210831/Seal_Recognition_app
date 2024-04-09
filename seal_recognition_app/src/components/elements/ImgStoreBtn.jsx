import React, { useState, useEffect } from "react";
import axios from "axios";
import DetectionBtn from "./DetectionBtn";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';


const ImgStoreBtn = ({inputFiles, setStoredResult, setErrorMessage}) => {

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
    const post_url = "http://127.0.0.1:8000/uploadfile/ ";
    // const post_url = "https://detection-image-vdaepgddza-uc.a.run.app/uploadfile/ ";

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
      <LoadingButton
          onClick={pressbtn}
          endIcon={<SendIcon />}
          loading={initState}
          loadingPosition="end"
          variant="contained"
          sx={{width:170, fontSize:{sm:16, xs:12}}}
        >
          <span>ファイルの送信</span>
        </LoadingButton>
    </>
  );
};

export default ImgStoreBtn;
