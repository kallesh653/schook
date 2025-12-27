import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./utility components/app bar/Navbar";
import Footer from "./utility components/footer/Footer";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function Client() {
  const theme = useTheme();
  const location = useLocation();

  // Don't show Navbar on home page (it has its own StickyNav)
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      {!isHomePage && <Navbar />}
      <Box
        sx={{
          display: isHomePage ? "block" : "flex",
          justifyContent: isHomePage ? "normal" : "center",
          alignItems: isHomePage ? "normal" : "center",
          minHeight: isHomePage ? "auto" : "90vh",
          backgroundColor: isHomePage ? "transparent" : "#fefefe",
          width: "100%",
        }}
        component={"div"}
      >
        <Outlet />
      </Box>

      {!isHomePage && <Footer />}
    </>
  );
}
