import React from "react";
import { Box, Typography } from "@mui/material";
import { List, ListItem } from "@mui/joy";

const MethodList = () => {
  return (
    <>
      <Box
        sx={{
          margin: "32px 0 8px 0",
          border: 1,
          borderStyle: "dashed",
          borderColor: "#A6A6A6",
          padding: "24px",
        }}
      >
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          使い方
        </Typography>

        <List marker="decimal" sx={{ pl: 3, pt: 0 }}>
          <ListItem>
            ファイル選択ボタンを押して、未押印検知をしたいファイルを選択してください。
            <br />
            対応ファイル：JPEG, JPG, PNG, PDF
          </ListItem>
          <ListItem>ファイル送信ボタンを押してください。</ListItem>
          <ListItem>
            ファイルの送信が完了したら、未押印ボタンを押して未押印検知を開始してください。
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default MethodList;
