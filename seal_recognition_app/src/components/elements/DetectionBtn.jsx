import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import axios from "axios";

const DetectionBtn = () => {
  const [result, setResult] = useState("");
  const [numDetect, setNumDetect] = useState(0);
  const [imgs, setImgs] = useState([""]);
  const [imgsName, setImgsName] = useState([]);
  const [classList, setClassList] = useState([]);
  const [clsConfList, setClsConfList] = useState([]);
  console.log(result, numDetect, imgs, imgsName);

  const imgDetection = () => {
    // POSTするURL
    const post_url = "http://127.0.0.1:8000/predict/ ";

    // 物体検出ののPOST
    axios
      .post(post_url)
      .then(function (res) {
        console.log("responseは", res.data);
        console.log("responseは", res.data.result);

        setResult(res.data.result);
        setNumDetect(res.data.no_seal_detection);
        setImgs(res.data.image_list);
        setImgsName(res.data.no_seal_imgs_list);
        setClassList(res.data.classes);
        setClsConfList(res.data.image_list);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ bgcolor: "warning.main", width: 300 }}
        onClick={imgDetection}
      >
        未押印の検知開始
      </Button>
      <Typography variant="h5" color="darkred" sx={{mt:3}}>
        {result}
      </Typography>
      <Box>
        {imgsName.map((name, index) => (
          <div key={index}>
            <Typography>ファイル名：{name}</Typography>
            <img
              src={`data:image/jpeg;base64, ${imgs[index]}`}
              alt={name}
              style={{ maxWidth: "600px", height: "auto"}}
            />
          </div>
        ))}
      </Box>
    </>
  );
};

export default DetectionBtn;
