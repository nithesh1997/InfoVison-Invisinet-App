import { IconButton } from "@material-ui/core";
import styled from "styled-components";

export const ActionIconButton = styled(IconButton)`
  visibility: ${(props) => (!props.isDisplay ? "hidden" : "visible")};
  ${(props) => {
    return !props.isDisplay
      ? `
      padding: 0em;
      margin: 0em 0em;
      &:hover {
        background-color: #d6eeff;
      }

      & svg {
        width: 0em;
        height: 0em;
      }
      `
      : `
      /* padding: 0.35em; */
      padding: 0.25em;
      /* margin: 0.35em 0.15em; */
      margin: 0em 0.1em;
      &:hover {
        background-color: ${props.hoverBg ? props.hoverBg : "#d6eeff"};
      }

      & svg {
        width: 0.75em;
        height: 0.75em;
      }
      `;
  }}
`;
