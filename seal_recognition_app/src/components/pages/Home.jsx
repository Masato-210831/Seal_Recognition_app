import React, { useState } from "react";
import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress'
import ImgStoreBtn from "../elements/ImgStoreBtn";
import UploadBtn from "../elements/UploadBtn";
import DetectionBtn from "../elements/DetectionBtn";
import ShowDetects from "../elements/ShowDetects";


const Home = () => {
  // アップロードするファイル
  const [inputFiles, setInputFiles] = useState([]);

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState("");

  // ファイルの送信完了の状態
  const [storedResult, setStoredResult] = useState("");

  // 推論中の画面表示
  const [showInference, setShowInference] = useState(false);

  // 画像検出の結果の状態保管関係
  const [detects, setDetects] = useState({
    result: "",
    imgs: [],
    imgsName: [],
    classList: [],
    clsConfList: [],
  });



  return (
    <>
      {/* アップロード ＆ 推論ボタン */}
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          sx={{
            maxWidth: 300,
            p: 1,
            borderRight: 1,
            borderColor: "grey.500",
            height: "100%",
            position: "fixed",
            bgcolor: "#fafafa",
          }}
        >
          <h3>ファイルのアップロード</h3>
          <Box>
            <UploadBtn inputFiles={inputFiles} setInputFiles={setInputFiles} />
          </Box>

          <Box gap={0.5} sx={{ display: "flex", flexDirection: "column" }}>
            <ImgStoreBtn
              inputFiles={inputFiles}
              storedState={[storedResult, setStoredResult]}
              errorState={[errorMessage, setErrorMessage]}
            />
            {storedResult && (
              <DetectionBtn
                setDetects={setDetects}
                setStoredResult={setStoredResult}
                setErrorMessage={setErrorMessage}
                setShowInference={setShowInference}
              />
            )}
          </Box>
        </Box>

        {/* 推論結果表示画面 */}
        <Box sx={{ pl: "300px", mx: "auto" }}>
          {showInference && (
            <Box sx={{textAlign:'center'}}>
              <h2>推論中・・・(初回は時間が掛かります)</h2>
              <Box sx={{width:'100%'}}><LinearProgress size='lg'/></Box>
            </Box>
          )}
          <Box>{detects.result && <ShowDetects detects={detects} />}</Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
