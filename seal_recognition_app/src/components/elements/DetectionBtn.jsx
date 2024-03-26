import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
} from "@mui/material";
import axios from "axios";
import { display, flexbox, fontWeight } from "@mui/system";

const DetectionBtn = () => {
  const [result, setResult] = useState("");
  const [imgs, setImgs] = useState([""]);
  const [imgsName, setImgsName] = useState([]);
  const [classList, setClassList] = useState([]);
  const [clsConfList, setClsConfList] = useState([]);
  // console.log(result, imgs, imgsName);

  const imgDetection = () => {
    // POSTするURL
    const post_url = "http://127.0.0.1:8000/predict/ ";

    // 物体検出ののPOST
    axios
      .post(post_url)
      .then((res) => {
        console.log("responseは", res.data);
        console.log("responseは", res.data.result);

        setResult(res.data.result);
        setImgs(res.data.image_list);
        setImgsName(res.data.no_seal_imgs_names);
        setClassList(res.data.classes);
        setClsConfList(res.data.cls_conf);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  console.log("clsConfListは:", classList);
  console.log("clsConfListは0:", classList[0]);

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

      {/* 物体検知結果の表示 */}
      <Typography variant="h5" color="darkred" sx={{ mt: 3 }}>
        {result}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Box>
          {/* ファイル名＋画像 */}
          {imgsName.map((name, index) => (
            <div key={name}>
              <Typography variant="h6" sx={{ mt: 3, mb: 0.5 }}>
                ファイル名：{name}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ border: 1, mr: 3 }}>
                  <img
                    src={`data:image/jpeg;base64, ${imgs[index]}`}
                    alt={name}
                    style={{ maxWidth: "600px", height: "auto" }}
                  />
                </Box>

                {/* 識別結果＋スコアのテーブル */}
                <Box>
                  <TableContainer>
                    <Table sx={{ minWidth: 1 / 4 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">識別結果</TableCell>
                          <TableCell align="center">信頼スコア</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clsConfList[index].map((value, idx) => {
                          return (
                            <TableRow key={idx + value}>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: 0 }}
                              >
                                {classList[index][idx]}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: 0 }}
                              >
                                {value}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </div>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default DetectionBtn;
