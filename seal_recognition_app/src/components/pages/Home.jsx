import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ImgStoreBtn from "../elements/ImgStoreBtn";
import UploadBtn from "../elements/UploadBtn";
import DetectionBtn from "../elements/DetectionBtn";

const Home = () => {

  // アップロードするファイル
  const [inputFiles, setInputFiles] = useState([]);
  console.log("現在のinputFileの中身は:", Array.from(inputFiles));


  return (
    <>
      <Box>
        <UploadBtn inputFiles={inputFiles} setInputFiles={setInputFiles} />
      </Box>

      
      <Box gap={0.5} sx={{ display: "flex", flexDirection: "column" }}>
        <ImgStoreBtn inputFiles={inputFiles} />

        {/* {resResult && <DetectionBtn />} */} 
        <DetectionBtn />
      </Box>
    </>
  );
};

export default Home;
