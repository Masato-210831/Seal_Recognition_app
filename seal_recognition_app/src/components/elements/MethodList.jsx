import React from "react";
import { Box, Typography, Divider, List, ListItem } from "@mui/material";

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
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: "bold" }}>未押印検知とは</Typography>
          <Typography sx={{ mt: 1.5, ml: 1 }}>
            記録用紙・申請用紙などの押印欄に未押印があるか検知し、ラベル付き当該ファイルを表示します。
          </Typography>
          <Typography sx={{ mt: 1, ml: 1 }}>
            <Typography variant="span" sx={{ color: "darkred" }}>
              PDFファイルの検知
            </Typography>
            も対応しています。
          </Typography>

          <Divider
            sx={{ mt: 3, borderStyle: "dashed", borderColor: "#A6A6A6" }}
          ></Divider>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>使い方</Typography>

          <List
            component="ol"
            sx={{
              pl: 3,
              pt: 0.5,
              listStyleType: "decimal",
            }}
          >
            <ListItem sx={{ display: "list-item",  pl:0 }}>
              ファイル選択ボタンを押して、未押印検知をしたいファイルを選択してください。
              <br />
              対応ファイル：JPEG, JPG, PNG, PDF
            </ListItem>
            <ListItem sx={{ display: "list-item", pl:0 }}>
              ファイル送信ボタンを押してください。
            </ListItem>
            <ListItem sx={{ display: "list-item", pl:0 }}>
              ファイルの送信が完了したら、未押印ボタンを押して未押印検知を開始してください。
            </ListItem>
          </List>
        </Box>
      </Box>
    </>
  );
};

export default MethodList;
