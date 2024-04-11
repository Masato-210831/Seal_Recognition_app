import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import ImgStoreBtn from "../elements/ImgStoreBtn";
import UploadBtn from "../elements/UploadBtn";
import DetectionBtn from "../elements/DetectionBtn";
import ShowDetects from "../elements/ShowDetects";
import Header from "../elements/Header";
import Heading from "../elements/Heading";
import MethodList from "../elements/MethodList";
import Message from "../elements/Message";

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
      <Header />
      {/* アップロード ＆ 推論ボタン */}
      <Box sx={{ padding: {md:"32px 24px", sm:"24px 16px", xs:"16px 16px"}, maxWidth: "1080px", margin: "0 auto" }}>
        <Heading word={"未押印の検出"} />

        <Box sx={{ mx: {md:"50px", sm:0} }}>
          <MethodList />

          <Box
            sx={{
              bgcolor: "#fafafa",
              mb: {md:4, sm:3, xs:3},
              border: 1,
              borderColor: "#A6A6A6",
              padding: {sm:3, xs:2},
              boxShadow: "1px 1px 1px rgba(0, 0, 0, .5)",
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>
              ファイルの送信 & 物体検出
            </Typography>

            <Box>
              <UploadBtn
                inputFiles={inputFiles}
                setInputFiles={setInputFiles}
              />
            </Box>

            <Message errorMessage={errorMessage} storedResult={storedResult} />
            <Box display={"flex"} gap={1}>
              <ImgStoreBtn
                inputFiles={inputFiles}
                setStoredResult={setStoredResult}
                setErrorMessage={setErrorMessage}
              />

              <DetectionBtn
                setDetects={setDetects}
                storedState={[storedResult, setStoredResult]}
                setErrorMessage={setErrorMessage}
                setShowInference={setShowInference}
                showInference = {showInference}
              />
            </Box>
            <Typography sx={{mt:1, fontSize:{sm:14, xs:12} }}>(注) 初回の送信は時間(約20秒)が掛かります。</Typography>
          </Box>
        </Box>

        {detects.result !== "" && (
          <>
            <Heading word={"物体検出の結果"} />
            <Box sx={{ mx: {md:"50px", sm:0, xs:0} }}>
              <Box>{detects.result && <ShowDetects detects={detects} />}</Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Home;
