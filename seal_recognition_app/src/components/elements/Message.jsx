import React from 'react'
import { Box, Typography } from "@mui/material";

const Message = ({errorMessage, storedResult}) => {
  return (
    <>
      {/* ファイルの保存完了時に表示 */}
      {/* {storedResult && (
        <Box sx={{mb:1}}>
          <Typography>ファイルの送信が完了しました。</Typography>
          <Typography>物体検知可能です！！</Typography>
        </Box>
      )} */}

      {/* エラーの時だけ表示 */}
      {errorMessage && (
        <Typography color="error" variant="body1" sx={{ display: "block", mb:1 }}>
          エラーメッセージ：
          <br />
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default Message
