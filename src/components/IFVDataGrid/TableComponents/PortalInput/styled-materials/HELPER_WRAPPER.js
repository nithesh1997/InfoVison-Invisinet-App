import { Box } from "@material-ui/core";
import styled from "styled-components";

export const HELPER_WRAPPER = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0.4rem;
  margin: 0.2rem 0;
  border: 0px solid;
  overflow-wrap: break-word;
  max-width: 100%;
  /* box-shadow: 0 0 1rem 0.2rem #5b5b5b30; */
  border-color: ${({ borderColor }) => borderColor || "#5b5b5b30"};
  background: ${({ backgroundColor }) =>
    backgroundColor.concat("06") || "#21212F"};
`;
