import React from "react";
import * as Mat from "@mui/material";
import styled from "styled-components";
import ToolTip from "../../../../../../../utils/Tooltip/Tooltip";
import { Zoom } from "@material-ui/core";
import { fontFamily } from "../../../../../../../style/theme";
import { useTranslation } from "react-i18next";
const initProps = {
  variant: "contained",
  disabled: true,
  onClick: (event) => alert("The Button Action is not configured..!"),
};

const GenericButton = ({ buttonName, backgroundColor, ...props }) => {
  const { t } = useTranslation();

  return (
    <ToolTip
      TransitionComponent={Zoom}
      title={
        buttonName === t("commons.doneText")
          ? t("commons.saveText")
          : buttonName === t("commons.cancelText")
          ? t("commons.cancelText")
          : null
      }
    >
      <Styled.Button
        backgroundColor={backgroundColor}
        buttonName={buttonName}
        {...initProps}
        {...props}
        sx={{ fontFamily }}
      >
        {buttonName || "Action Button"}
      </Styled.Button>
    </ToolTip>
  );
};

export default GenericButton;

const Styled = {
  Button: styled(Mat.Button)`
    &.MuiButton-root {
      width: 98px;
      height: 32px;
      /* font-family: "Montserrat"; */
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-transform: capitalize;
      border-radius: 4px;
      /* border: ${(props) =>
        props.backgroundColor === "primary"
          ? "2px solid #0094FD"
          : props.backgroundColor === "secondary"
          ? "2px solid #F0F0F0"
          : props.backgroundColor === "danger"
          ? "2px solid #FF3D3D"
          : null}; */
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0094FD"
          : props.backgroundColor === "secondary"
          ? "#F0F0F0"
          : props.backgroundColor === "danger"
          ? "#FF3D3D"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary" ||
        props.backgroundColor === "danger"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
      min-width: 38px;
      padding: 8px 16px;
    }

    &.MuiButton-root:hover {
      /* border: ${(props) =>
        props.backgroundColor === "primary"
          ? "2px solid #0074C7"
          : props.backgroundColor === "secondary"
          ? "2px solid #EDEDF0"
          : props.backgroundColor === "danger"
          ? "2px solid #962A1A"
          : null}; */
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0074C7"
          : props.backgroundColor === "secondary"
          ? "#EDEDF0"
          : props.backgroundColor === "danger"
          ? "#962A1A"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary" ||
        props.backgroundColor === "danger"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
    }

    &.MuiButton-root.Mui-focusVisible {
      /* border: ${(props) =>
        props.backgroundColor === "primary"
          ? "1px solid #0063A9"
          : props.backgroundColor === "secondary"
          ? "1px solid #8A8886"
          : null}; */
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
    }

    &.MuiButton-root.Mui-focusVisible {
      /* border: ${(props) =>
        props.backgroundColor === "primary"
          ? "1px solid #0063A9"
          : props.backgroundColor === "secondary"
          ? "1px solid #8A8886"
          : null}; */
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
