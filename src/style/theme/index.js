import { createTheme } from "@mui/material/styles";
import "@fontsource/inter";

export const fontFamily = [
  "Inter",
  "Montserrat",
  "Times New Roman" /* DO NOT REMOVE / UNCOMMENT */,
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",");

const responsive = createTheme({
  breakpoints: {
    values: {
      small: 0,
      mobile: 480,
      tablet: 768,
      laptop: 1024,
      desktop: 1200,
    },
  },
});

export const theme = createTheme({
  // [responsive.breakpoints.between("small", "desktop")]: {
  typography: {
    fontFamily,
    fontSize: 14,
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  palette: {
    type: "light",
  },
  //},
});
