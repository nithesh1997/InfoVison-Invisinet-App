import styled from "styled-components";
import { SACRED } from "./SACRED";

export const MULTILINE = styled(SACRED)`
  & .MuiInputBase-root {
    padding: 0;
  }

  & .MuiInputBase-input {
    /* max-height: 20px; */
    max-height: 8em;
    overflow-y: scroll;
  }
`;
