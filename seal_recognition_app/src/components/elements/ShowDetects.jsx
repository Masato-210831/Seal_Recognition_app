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
      <Typography variant="h3" color="darkred" sx={{ my: 4, fontSize:{sm:24, xs:16}}}>
        {detects.result}
      </Typography>

      <Box>
        {detects.imgsName.map((name, index) => (
          <Box key={name} sx={{mb:{sm:4, xs:3}}}>
            <Typography sx={{ mb: 0.5 }}>ファイル名：{name}</Typography>
            <Box sx={{ display: "flex", flexDirection:{sm:"row", xs:"column" } }}>
              <Box sx={{ mr: {sm:2, xs:0}, flex:{md:3, sm:2, xs:2} }}>
                <img
                  src={`data:image/jpeg;base64, ${detects.imgs[index]}`}
                  alt={name}
                  style={{ maxWidth: "100%", height: "auto"}}
                  border="1"
                />
              </Box>

              {/* 識別結果＋スコアのテーブル */}
              <Box sx={{mt:{sm:0, xs:1, flex:1}}}>
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
