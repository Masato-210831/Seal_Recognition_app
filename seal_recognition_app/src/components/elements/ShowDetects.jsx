import React from "react";
import {
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";

const ShowDetects = ({ detects }) => {
  return (
    <>
      {/* 物体検知結果の表示 */}
      <Typography variant="h5" color="darkred" sx={{ mt: 3 }}>
        {detects.result}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Box>
          {detects.imgsName.map((name, index) => (
            <div key={name}>
              <Typography variant="h6" sx={{ mt: 3, mb: 0.5 }}>
                ファイル名：{name}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ border: 1, mr: 3 }}>
                  <img
                    src={`data:image/jpeg;base64, ${detects.imgs[index]}`}
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
                          <TableCell
                            align="center"
                            sx={{ fontSize: 16, fontWeight: "bold" }}
                          >
                            識別結果
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: 16, fontWeight: "bold" }}
                          >
                            信頼スコア
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detects.clsConfList[index].map((value, idx) => {
                          return (
                            <TableRow key={idx + value}>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: 0 }}
                              >
                                {detects.classList[index][idx]}
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

export default ShowDetects;
