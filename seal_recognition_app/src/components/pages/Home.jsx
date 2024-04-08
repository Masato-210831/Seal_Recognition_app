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
      <Box sx={{ padding: "32px 24px", maxWidth: "1080px", margin: "0 auto" }}>
        <Heading word={"未押印の検知"} />

        <Box sx={{ mx: "50px" }}>
          <MethodList />

          <Box
            sx={{
              bgcolor: "#fafafa",
              mb: 4,
              border: 1,
              borderColor: "#A6A6A6",
              padding: "24px",
              boxShadow: "1px 1px 1px rgba(0, 0, 0, .5)",
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: "bold", mb: "16px" }}
            >
              ファイルの送信 & 物体検知
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
        </Box>

        {/* 推論結果表示画面 */}
        {showInference && (
          <>
            <Box sx={{ textAlign: "center", minWidth: "600px", mx: "auto" }}>
              <h2>推論中・・・</h2>
              <Box sx={{ width: "100%" }}>
                <LinearProgress size="g" />
              </Box>
            </Box>
          </>
        )}

        {detects.result !== "" && (
          <>
            <Heading word={"物体検知の結果"} />
            <Box sx={{ mx: "50px" }}>
              <Box>{detects.result && <ShowDetects detects={detects} />}</Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Home;
