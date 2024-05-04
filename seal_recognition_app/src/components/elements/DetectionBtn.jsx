import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const DetectionBtn = ({
  setDetects,
  storedState,
  setErrorMessage,
  setShowInference,
  showInference,
}) => {

  const [storedResult, setStoredResult] = storedState;

  const imgDetection = () => {


    // 送信完了の文字を消す(物体検知をすると保管データを消すので)
    setStoredResult("");

    // 推論中の表示ON, detectsの初期化
    setShowInference(true);
    setDetects({
      result: "",
      imgs: [],
      imgsName: [],
      classList: [],
      clsConfList: [],
    });

    // POSTするURL
    // const post_url = "http://127.0.0.1:8000/predict/ ";
    const post_url = "https://detection-image-vdaepgddza-uc.a.run.app/predict/ ";
    // const post_url = "https://detection-image-2-vdaepgddza-uc.a.run.app/predict/ ";
    // const post_url = "http://35.232.161.234:8000/predict/ ";

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
        setShowInference(false);
      })
      .catch(function (error) {
        console.log(error);

        // 推論中の表示OFF
        setShowInference(false);

        if (error.response) {
          setErrorMessage(error.response.data.detail); // エラーメッセージを設定
        } else {
          setErrorMessage("推論中にエラーが発生しました。"); // 一般的なエラーメッセージを設定
        }
      });
  };

  return (
    <>
      <LoadingButton
          onClick={imgDetection}
          loading={showInference}
          endIcon={<PlayArrowIcon/>}
          loadingPosition="end"
          variant="contained"
          disabled={storedResult.data === undefined}
          color="warning"
          sx={{ width: 170, fontSize:{sm:16, xs:12}}}
        >
          <span>検出開始</span>
        </LoadingButton>
    </>
  );
};

export default DetectionBtn;
