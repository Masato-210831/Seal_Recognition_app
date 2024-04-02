import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

const DetectionBtn = ({ setDetects, setStoredResult, setErrorMessage, setShowInference }) => {
  const imgDetection = () => {
    
    // 送信完了の文字を消す(物体検知をすると保管データを消すので)
    setStoredResult("")

    // 推論中の表示ON
    setShowInference(true)

    // POSTするURL
    const post_url = "http://127.0.0.1:8000/predict/ ";

    // 物体検出ののPOST
    axios
      .post(post_url)
      .then((res) => {
        setDetects({
          result: res.data.result,
          imgs: res.data.image_list,
          imgsName: res.data.no_seal_imgs_names,
          classList: res.data.classes,
          clsConfList: res.data.cls_conf,
        });
          
          // 推論中の表示OFF
          setShowInference(false)
      })
      .catch(function (error) {
        console.log(error);

         // 推論中の表示OFF
         setShowInference(false)

         if (error.response) {
          setErrorMessage(error.response.data.detail); // エラーメッセージを設定
        } else {
          setErrorMessage("推論中にエラーが発生しました。"); // 一般的なエラーメッセージを設定
        }
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ bgcolor: "warning.main", width: 200 }}
        onClick={imgDetection}
      >
        未押印の検知開始
      </Button>
    </>
  );
};

export default DetectionBtn;
