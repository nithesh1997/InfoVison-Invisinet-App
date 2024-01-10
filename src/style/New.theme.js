import { createTheme } from "@mui/material";
import "@fontsource/inter";

const theme = createTheme({
  typography: {
    fontFamily: [
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
    ].join(","),
    fontSize: 14,
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  palette: {
    type: "light",
  },
});

export default theme;
