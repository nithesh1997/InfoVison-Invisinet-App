import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Popup = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 40%;
  max-width: 800px;
  height: 80%;
  max-height: 800px;
  margin-top: 4.5em;
  border-radius: 0.5em;
  padding: 0em 0em 1em 0em;
  background: #fff;
  /* box-shadow: 0 4px 8px 0 rgba(2, 147, 254, 0.2),
    0 6px 20px 0 rgba(2, 147, 254, 0.2); */
`;
