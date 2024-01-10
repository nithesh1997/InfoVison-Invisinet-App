import { Box } from "@material-ui/core";
import styled from "styled-components";

export const HELPER_CONTAINER = styled(Box)`
  display: ${({ display }) => (display ? "grid" : "none")};
  box-sizing: border-box;
  word-wrap: break-word;
  /* position: absolute; */
  top: 95%;
  width: 100%;
`;
