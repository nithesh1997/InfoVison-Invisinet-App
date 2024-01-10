import React from "react";
import * as Mat from "@mui/material";
import styled from "styled-components";
import { fontFamily } from "../../style/theme";

const initProps = {
  variant: "contained",
  disabled: true,
  onClick: (event) => alert("The Button Action is not configured..!"),
};
// let primary = "#0094FD";
// let secondary = "#F0F0F0";

const GenericButton = ({ buttonName, backgroundColor, ...props }) => {
  return (
    <Styled.Button
      backgroundColor={backgroundColor}
      buttonName={buttonName}
      {...initProps}
      {...props}
      sx={{ fontFamily }}
    >
      {buttonName || "Action Button"}
    </Styled.Button>
  );
};

export default GenericButton;

const Styled = {
  Button: styled(Mat.Button)`
    &.MuiButton-root {
      height: 2rem;
      width: auto;
      padding: 0.6rem;
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1.5;
      text-align: center;
      text-transform: capitalize;
      border: ${(props) =>
        props.backgroundColor === "primary"
          ? "2px solid #0094fd"
          : props.backgroundColor === "secondary"
          ? "2px solid #F0F0F0"
          : null};
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0094FD"
          : props.backgroundColor === "secondary"
          ? "#F0F0F0"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
      min-width: 38px;
      padding: 8px 16px;
    }

    &.MuiButton-root:hover {
      border: ${(props) =>
        props.backgroundColor === "primary"
          ? "2px solid #0074C7"
          : props.backgroundColor === "secondary"
          ? "#EDEDF0"
          : null};
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0074C7"
          : props.backgroundColor === "secondary"
          ? "#EDEDF0"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
    }

    &.MuiButton-root.Mui-disabled {
      background: #f0f0f0;
      border: 1px solid #f0f0f0;
      color: #a6a6a6;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }
  `,
};

/**

Red color to use on Cancel or Delete Button
border: 2px solid #e83b46;
background: #e83b46;

 */
