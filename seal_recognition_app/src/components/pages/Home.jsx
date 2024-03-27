import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ImgStoreBtn from "../elements/ImgStoreBtn";
import UploadBtn from "../elements/UploadBtn";
import DetectionBtn from "../elements/DetectionBtn";
import ShowDetects from "../elements/ShowDetects";

const Home = () => {
  // アップロードするファイル
  const [inputFiles, setInputFiles] = useState([]);

  // 画像検出の結果の状態保管関係
  const [detects, setDetects] = useState({
    result: "",
    imgs: [],
    imgsName: [],
    classList: [],
    clsConfList: [],
  });

  // ファイルの送信完了の状態
  const [storedResult, setStoredResult] = useState("");

  return (
    <>
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
            />
            {storedResult && (
              <DetectionBtn
                setDetects={setDetects}
                setStoredResult={setStoredResult}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ pl: "300px", mx: "auto" }}>
          <Box>{detects.result && <ShowDetects detects={detects} />}</Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
