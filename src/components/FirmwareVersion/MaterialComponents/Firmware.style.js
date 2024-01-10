import { Box, Button } from "@material-ui/core";
import styled from "styled-components";
import Style from "../../../style";

export const Styled = {
  StyledButton: styled(Button)`
    color: white;
    position: absolute;
    z-index: 1;
    top: 0em;
    right: 2.25em;
    width: auto;
    padding: 0.5em 1em;
    background-color: rgba(2, 147, 254, 1);

    &:hover {
      background-color: rgba(0, 95, 163, 1);
    }
  `,

  StyledBoxFirm: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    width: 100%;
    padding: 0em 2em 2em 2.25em;
    position: relative;
    & .IFV-DataGrid-action-bar {
      opacity: 0;
      pointer-events: none;
    }
  `,

  StyledUploadButton: styled(Style.GenericButton)`
    &.MuiButton-root {
      /* font-family: "Montserrat"; */
      font-size: 1em;
      font-weight: 600;
      text-transform: capitalize;
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
      /* min-width: 38px; */
      height: 2.2rem;
      padding: 0 1rem;
      position: absolute;
      z-index: 1;
      top: 0.4em;
      right: 2.25em;
      font-weight: 600;
    }

    &.MuiButton-root:hover {
      border: 2px solid #0074c7;
      background: #0074c7;
      color: #fff;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: #f9fafb;
    }
  `,
};
