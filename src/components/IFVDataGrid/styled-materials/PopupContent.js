import { Box } from "@material-ui/core";
import styled from "styled-components";

export const PopupContent = styled(Box)`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 2.5em 1.75em;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  gap: 0em;
  overflow-x: hidden;
  overflow-y: scroll;
`;
