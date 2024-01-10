import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Backdrop = styled(Box)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: ${({ isDisplay }) => (isDisplay ? "grid" : "none")};
  place-items: center;
  /* background: red; */
  background: rgba(0, 0, 0, 0.4);
`;
