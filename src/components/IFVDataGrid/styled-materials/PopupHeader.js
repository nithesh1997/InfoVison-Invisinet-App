import { Box } from "@material-ui/core";
import styled from "styled-components";

export const PopupHeader = styled(Box)`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1.5em;
  border-bottom: 0.2em solid rgba(2, 147, 254, 1);
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
`;
