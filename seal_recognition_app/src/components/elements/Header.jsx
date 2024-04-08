import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#7E7575",
          boxShadow: "0px 1px 4px 2px",
          padding: "0 24px",
        }}
      >
        <Toolbar sx={{ minWidth: "1080px", margin: "0 auto" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "28px" }}
          >
            未押印検出アプリ
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
