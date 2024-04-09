import React from "react";
import { Box, Typography, Divider, List, ListItem } from "@mui/material";

const MethodList = () => {
  return (
    <>
      <Box
        sx={{
          margin: {md:"32px 0 8px 0", sm:"24px 0 8px 0", xs:"16px 0 8px 0"},
          border: 1,
          borderStyle: "dashed",
          borderColor: "#A6A6A6",
          padding: {sm:3, xs:2},
          borderRadius: 1,
        }}
      >
        <Box sx={{ mb: {sm:3, xs:2} }}>
          <Typography sx={{ fontWeight: "bold" }}>未押印検出とは</Typography>
          <Typography sx={{ mt: {sm:1.5, xs:1}, ml: 1, fontSize:{sm:16, xs:14} }}>
            記録用紙・申請用紙などの押印欄に未押印があるか検出し、ラベル付き当該ファイルを表示します。
          </Typography>
          <Typography sx={{ mt: 1, ml: 1, fontSize:{sm:16, xs:14} }}>
            <Typography variant="span" sx={{ color: "darkred" }}>
              PDFファイルの検出
            </Typography>
            も対応しています。
          </Typography>

          <Divider
            sx={{ mt: {sm:3, xs:2}, borderStyle: "dashed", borderColor: "#A6A6A6" }}
          ></Divider>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>使い方</Typography>

          <List
            component="ol"
            sx={{
              pl: 3,
              pt: {sm:0.5, xs:0},
              pb:0,
              listStyleType: "decimal",
              fontSize:{sm:16, xs:14}
            }}
          >
            <ListItem sx={{ display: "list-item",  pl:0 }}>
              ファイル選択ボタンを押して、未押印検出をしたいファイルを選択してください。
              <br />
              対応ファイル：JPEG, JPG, PNG, PDF
            </ListItem>
            <ListItem sx={{ display: "list-item", pl:0 }}>
              ファイル送信ボタンを押してください。
            </ListItem>
            <ListItem sx={{ display: "list-item", pl:0, pb:0 }}>
              ファイルの送信が完了したら、検出開始ボタンを押して未押印検出を開始してください。
            </ListItem>
          </List>
        </Box>
      </Box>
    </>
  );
};

export default MethodList;
