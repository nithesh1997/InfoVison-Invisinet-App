import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Wrapper = styled(Box)`
  /* font-family: "Montserrat", sans-serif; */
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: ${({ theme }) => theme.calcWidth};
  min-width: ${({ theme }) => {
    return theme.minWidth ? theme.minWidth + "px" : "auto";
  }};
  overflow: hidden;
  color: #212529;

  &.disabled {
    cursor: default;
    pointer-events: none;
  }

  & .MuiSvgIcon-root {
    fill: #2d7ee9;
  }

  & .MuiCheckbox-root {
  }

  & .Mui-checked .MuiSvgIcon-root {
    fill: #2d7ee9;
  }

  & .Mui-disabled .MuiSvgIcon-root {
    fill: #3b475c20;
  }

  & .MuiCheckbox-indeterminate {
  }

  & .MuiCheckbox-colorPrimary {
  }

  & .MuiCheckbox-colorSecondary {
  }
`;
