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
        // className="container-hero"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          backgroundColor: "#fefefe",

        }}
        component={"div"}
      >
        <Outlet />
      </Box>

      {!isHomePage && <Footer />}
    </>
  );
}
