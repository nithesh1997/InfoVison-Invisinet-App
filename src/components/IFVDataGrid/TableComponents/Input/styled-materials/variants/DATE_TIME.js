import styled from "styled-components";
import { SACRED } from "./SACRED";

export const DATE_TIME = styled(SACRED)`
  &.MuiFormControl-root {
    max-width: 100%;
  }

  & .MuiInputLabel-outlined.MuiInputLabel-shrink {
    /* transform: translate(6%, -20%) scale(0.7); */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
