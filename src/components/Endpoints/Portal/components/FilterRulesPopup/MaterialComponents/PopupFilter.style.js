import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { Checkbox } from "@mui/material";
import styled from "styled-components";

const Styled = {
  Btn: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 100%;
    padding: 1em 1em 0.5em 1em;
    font-size: 0.85em;
    gap: 2em;
  `,
  ParentBox: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    width: 100%;
    padding-bottom: 0.75em;
    border-bottom: 0.1em solid #ddd;
  `,

  BoxLeft: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-item: flex-start;
    flex-shrink: 0;
    position: relative;
    width: 15em;
    border-right: 0.1em solid #ddd;
  `,
  BoxLeftInner: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-item: flex-start;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-right: 1em;
  `,
  StyledTemplate: styled(Box)``,

  StyledDividerOne: styled(Divider)`
    margin: 0 0.5em 0 0;
    height: 28em;
    background-color: #e0e0e0;
  `,
  StyledDividerTwo: styled(Divider)`
    width: 90em;
    background-color: #e0e0e0;
  `,
  Typo: styled(Typography)`
    /* font-family: "Montserrat", sans-serif; */
    font-size: 0.85em;
    color: ${(props) =>
      props.checked && !props.disabled ? "rgba(2, 147, 254, 1)" : "#212529"};
    font-weight: ${(props) => (props.checked ? 700 : 400)};
    text-align: left;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    flex-grow: 1;
    padding: 0.5em 1em 0.5em 0em;
  `,
  Box: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 0.25em;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};

    &:hover {
      background-color: ${(props) =>
        props.disabled ? "transparent" : "#f1f1f1"};
    }
  `,
  CancelBtn: styled(Button)`
    color: #000000;
    border: 0.1em solid black;
    font-weight: bold;
    /* font-family: Montserrat; */
    background: transparent;
    margin: 0em 1em;
    padding: 0.5em 1.5em;
    &:hover {
      background: #eee;
    }
  `,
  ApplyBtn: styled(Button)`
    color: #ffffff;
    font-weight: bold;
    /* font-family: Montserrat; */
    background: #018ff6;
    margin: 0em 1em;
    padding: 0.5em 1.5em;
    border: 0.1em solid #018ff6;
    &:hover {
      background: #0d47a1;
      border-color: #0d47a1;
    }

    &.Mui-disabled {
      color: white;
      opacity: 0.8;
    }
  `,
  CheckBox: styled(Checkbox)`
    &.MuiCheckbox-root {
      flex-shrink: 0;
      padding: 0.25em;
      margin: 0.5em;
    }

    &:hover {
      /* background: rgba(2, 147, 254, 0.1); */
      background: transparent;
    }
    &.Mui-checked:hover {
      /* background: rgba(2, 147, 254, 0.2); */
      background: transparent;
    }

    & .MuiTouchRipple-child {
      /* background: rgba(2, 147, 254, 0.2); */
      background: transparent;
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: ${({ disabled }) =>
        disabled ? "#8A8A8A" : "rgba(2, 147, 254, 1)"};
    }
  `,
  Spinner: styled(CircularProgress)`
    margin-left: 1em;
    &.MuiCircularProgress-root {
      color: #fff;
    }
  `,
  TooltipButton: styled(IconButton)`
    padding: 0.2em;
    margin-left: -3px;
    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};

export default Styled;
