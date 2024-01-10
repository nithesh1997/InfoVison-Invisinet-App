import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Cell = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "flex-end"
      : "flex-start"};
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  /* padding: 0 1em; */
  padding: 0.5em 0em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  text-align: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "right"
      : "left"};
`;
