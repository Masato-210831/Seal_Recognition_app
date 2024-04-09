import React from "react";
import {
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
      <Typography variant="h5" color="darkred" sx={{ my: 4 }}>
        {detects.result}
      </Typography>

      <Box>
        {detects.imgsName.map((name, index) => (
          <Box key={name} sx={{mb:4}}>
            <Typography sx={{ mb: 0.5 }}>ファイル名：{name}</Typography>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width:"50%" ,border: 1, mr: 2, flex:3 }}>
                <img
                  src={`data:image/jpeg;base64, ${detects.imgs[index]}`}
                  alt={name}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>

              {/* 識別結果＋スコアのテーブル */}
              <Box sx={{flex:1}}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontSize: 16, fontWeight: "bold", py:1, pl:1, pr:0.5 }}
                        >
                          識別結果
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: 16, fontWeight: "bold", py:1, pl:1, pr:0.5 }}
                        >
                          信頼スコア
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detects.clsConfList[index].map((value, idx) => {
                        return (
                          <TableRow key={idx + value}>
                            <TableCell align="center" sx={{ borderBottom: 0, pl:1, pr:0.5 }}>
                              {detects.classList[index][idx]}
                            </TableCell>
                            <TableCell align="center" sx={{ borderBottom: 0, pl:0.5, pr:1}}>
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
          </Box>
        ))}
      </Box>
    </>
  );
};

export default ShowDetects;
