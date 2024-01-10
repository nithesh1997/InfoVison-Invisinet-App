import { Checkbox } from "@material-ui/core";
import styled from "styled-components";

export const CheckBox = styled(Checkbox)`
  padding: 0.25em;

  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }

  &.Mui-checked:hover {
    background: rgba(2, 147, 254, 0.2);
  }

  & .MuiTouchRipple-child {
    background: rgba(2, 147, 254, 0.2);
  }

  & .MuiSvgIcon-root {
    width: 0.85em;
    height: 0.85em;
  }

  & .MuiSvgIcon-root {
    fill: rgba(2, 147, 254, 1);
  }
`;
