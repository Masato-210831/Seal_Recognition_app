import React from "react";
import "./App.css";
import "sanitize.css";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";


const theme = createTheme({
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      'Arial',
      '"Hiragino Kaku Gothic ProN"',
      'Meiryo',
      'sans-serif',
    ].join(','),
  },
});


const App = () => {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/notfound" element={<NotFound />}></Route>
      </Routes>
    </ThemeProvider>
    </>
  );
};

export default App;
