import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#7E7575",
          boxShadow: "0px 1px 4px 2px",
        }}
      >
        <Toolbar sx={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "28px" }}
          >
            未押印検出アプリ
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
