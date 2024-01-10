import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Backdrop = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: inherit;
  display: ${({ isDisplay }) => (isDisplay ? "grid" : "none")};
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
  overflow-x: scroll;
`;
