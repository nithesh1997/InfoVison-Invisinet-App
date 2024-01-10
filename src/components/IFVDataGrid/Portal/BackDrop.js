import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Backdrop = styled(Box)`
  position: absolute;
  top: 4.5em;
  width: 100%;
  height: calc(100% - 4.5em);
  display: ${({ isDisplay }) => (isDisplay ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
`;
