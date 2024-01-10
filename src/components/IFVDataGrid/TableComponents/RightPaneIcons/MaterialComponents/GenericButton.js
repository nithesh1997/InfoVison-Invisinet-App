import * as Mat from "@mui/material";
import styled from "styled-components";
import ToolerTip from "../../../styled-materials/ToolerTip";
import { Zoom } from "@material-ui/core";
import { fontFamily } from "../../../../../style/theme";
import { useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { DataGridContext } from "../../../IFVDataGrid";
import { useLocation } from "react-router-dom";
import Config from "../../../../../Config";
import { useTranslation } from "react-i18next";

const initProps = {
  variant: "contained",
  disabled: true,
  onClick: (event) => alert("The Button Action is not configured..!"),
};

const GenericButton = ({
  visibility,
  buttonName,
  backgroundColor,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const { width, height } = useSelector(($) => $.windowDimensions);
  const { isCollapsed } = useSelector(($) => $.navigationMenu);
  const [isShowAsIconButton, setIsShowAsIconButton] = useState(false);
  const { gridSubconscious } = useContext(DataGridContext);
  let locations = useLocation();
  let isIcon = locations.pathname == AppConfig.pages.flr.path;

  useEffect(() => {
    if (width <= 945 && !isCollapsed) {
      setIsShowAsIconButton(true);
    } else if (width <= 768 && isIcon) {
      setIsShowAsIconButton(true);
    } else {
      setIsShowAsIconButton(false);
    }
  }, [isCollapsed, width]);

  return (
    <ToolerTip TransitionComponent={Zoom} title={buttonName ?? null}>
      <Styled.Button
        currentLang={i18n.language}
        visibility={visibility}
        backgroundColor={backgroundColor}
        buttonName={buttonName}
        isShowAsIconButton={isShowAsIconButton}
        {...initProps}
        {...props}
        style={{
          width: isShowAsIconButton && props.Icon ? "32px" : props.width,
          minWidth: isShowAsIconButton && props.Icon ? "32px" : null,
          borderRadius: isShowAsIconButton && props.Icon && "0.5rem",
        }}
        sx={{
          fontFamily,
        }}
        startIcon={isShowAsIconButton && props.Icon ? null : props.startIcon}
      >
        {isShowAsIconButton && props.Icon
          ? props.Icon
          : buttonName || "Action Button"}
      </Styled.Button>
    </ToolerTip>
  );
};

export default GenericButton;

const Styled = {
  IconButton: styled(Mat.IconButton)`
    &.MuiButton-root {
      visibility: ${(props) =>
        props.visibility === "hidden"
          ? "hidden"
          : props.visibility === "visible"
          ? "visible"
          : null};
      width: 98px;
      height: 32px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-transform: capitalize;
      border-radius: 4px;
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
      padding: 8px 16px;
    }

    &.MuiButton-root:hover {
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
  Button: styled(Mat.Button)`
    &.MuiButton-root {
      box-sizing: ${({ currentLang }) =>
        currentLang !== "en" ? "content-box" : ""};
      white-space: ${({ currentLang }) =>
        currentLang !== "en" ? "nowrap" : ""};
      visibility: ${(props) =>
        props.visibility === "hidden"
          ? "hidden"
          : props.visibility === "visible"
          ? "visible"
          : null};
      width: 98px;
      height: ${({ currentLang }) => (currentLang !== "en" ? "20px" : "32px")};
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-transform: capitalize;
      border-radius: 4px;
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
      /* padding: 8px 16px; */
    }

    &.MuiButton-root:hover {
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
