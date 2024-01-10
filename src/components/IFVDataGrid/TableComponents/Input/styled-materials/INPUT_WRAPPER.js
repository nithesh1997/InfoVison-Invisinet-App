import { Box } from "@material-ui/core";
import styled from "styled-components";

export const INPUT_WRAPPER = styled(Box)`
  box-sizing: border-box;
  position: relative;
  /* min-width: 124px;
  min-height: 64px; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  /* padding: 4px; */
  margin: 0;

  & .MuiFormControl-root {
    width: 100%;
  }
`;
