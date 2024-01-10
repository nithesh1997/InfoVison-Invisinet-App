import { Box } from "@material-ui/core";
import styled from "styled-components";

export const CONTENT_WRAPPER = styled(Box)`
  position: relative;
  /* width: auto;
  height: auto; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% + 1em);
  height: 100%;
  /* margin: 0.4rem; */
  /* margin: 0.25em -0.5em; */
  margin: 0.5em 0em 0.25em 0em;
`;
