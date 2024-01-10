import * as React from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Stack from "@mui/material/Stack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Button, Snackbar } from "@mui/material";

export default function MessageBars({
  // open = true,
  severity = "success",
  message = "Message about the state of this view",
  handleClose = () => {},
  ...props
}) {
  // const iconFunc = (severity) => {
  //   let icons;
  //   if (severity === "info") {
  //     return <InfoOutlinedIcon />;
  //   } else if (severity === "success") {
  //     return (icons = <CheckCircleOutlineOutlinedIcon />);
  //   } else if (severity === "warning") {
  //     return (icons = <InfoOutlinedIcon />);
  //   } else if (severity === "severeWarning") {
  //     return (icons = <WarningAmberOutlinedIcon />);
  //   } else if (severity === "error") {
  //     return (icons = <HighlightOffOutlinedIcon />);
  //   } else {
  //     return <CheckCircleOutlineOutlinedIcon />;
  //   }
  // };
  return (
    <>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}> */}{" "}
      <Alert
        onClose={handleClose}
        icon={
          severity === "info" ? (
            <InfoOutlinedIcon />
          ) : severity === "success" ? (
            <CheckCircleOutlineOutlinedIcon />
          ) : // ) : severity === "warning" ? (
          //   <InfoOutlinedIcon />
          severity === "warning" ? (
            <WarningAmberOutlinedIcon />
          ) : severity === "error" ? (
            <HighlightOffOutlinedIcon />
          ) : null
        }
        // icon={() => iconFunc(severity)}
        severity={severity}
        style={{ width: "800px" }}
        {...props}
      >
        {message}
      </Alert>
      {/* </Snackbar> */}
    </>
  );
}

// import React from "react";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
// import WarningAmberSharpIcon from "@mui/icons-material/WarningAmberSharp";
// import CloseIcon from "@mui/icons-material/Close";
// import { Typography } from "@material-ui/core";
// function MessageBars({
//   type = "info",
//   message = "Message about the state of this view",
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         width: "800px",
//         height: "32px",
//         backgroundColor: "#F8F8F8",
//         justifyContent: "space-between",
//         padding: "0 1em",
//         marginLeft: "500px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           gap: "10px",
//           alignSelf: "center",
//           //   alignItems: "center",
//           //   width: "800px",
//           //   height: "32px",
//           //   backgroundColor: "#F8F8F8",
//         }}
//       >
//         <div style={{ alignSelf: "center" }}>
//           {type === "info" ? (
//             <InfoOutlinedIcon style={{ color: "#605E5C" }} />
//           ) : type === "Success" ? (
//             <CheckCircleOutlineSharpIcon />
//           ) : type === "warning" ? (
//             <InfoOutlinedIcon style={{ color: "#605E5C" }} />
//           ) : type === "severeWarning" ? (
//             <WarningAmberSharpIcon />
//           ) : type === "error" ? (
//             <div
//               style={{
//                 width: "1.1rem",
//                 height: "1.1rem",
//                 border: "1px solid red",
//                 borderRadius: "50%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <CloseIcon style={{ color: "red", fontSize: "0.8rem" }} />
//             </div>
//           ) : null}
//         </div>
//         <div stys>
//           <Typography>{message}</Typography>
//         </div>
//       </div>
//       <div style={{ marginTop: "0.3em", alignSelf: "center" }}>
//         <CloseRoundedIcon style={{ color: "#201F1E" }} />
//       </div>
//     </div>
//   );
// }

// export default MessageBars;
