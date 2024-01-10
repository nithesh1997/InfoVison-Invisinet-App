import styled from "styled-components";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  align-items: start;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: start;
  max-height: calc(100vh - 4.25em);
  overflow: auto;
`;
