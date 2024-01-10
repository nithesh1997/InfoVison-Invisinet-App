import { Box, Checkbox, Dialog, IconButton, Typography } from "@mui/material";
import styled from "styled-components";

const Styled = {
  ComponentContainer: styled(Dialog)`
    border-radius: 1em;
  `,
  HeaderBox: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 0.4em;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);
  `,
  DialogTitle: styled(Typography)`
    &.MuiTypography-root {
      font-weight: 600;
      padding: 0 0 0 1em;
      font-family: "Inter";
    }
  `,
  CloseButton: styled(IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,
  FieldWrapper: styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    height: 98px;
  `,
  Box: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 0.25em;
    margin: 7px 16px 0px 16px;
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
  BackupTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 0.9em;
      font-weight: 400;
      padding: 0.9em 0 0 0;
      font-family: "Inter";
      @media (min-width: 321px) and (max-width: 1024px) {
        font-size: 0.8em;
        font-weight: 500;
      }
    }
  `,
  IconButton: styled(IconButton)`
    top: 0.2em;
    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};

export default Styled;
