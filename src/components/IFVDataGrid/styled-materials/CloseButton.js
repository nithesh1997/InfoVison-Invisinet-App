import { IconButton } from "@material-ui/core";
import styled from "styled-components";

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0.4em;
  right: 0.5em;
  padding: 0.4em;
  &:hover {
    background: #d6eeff60;
  }
`;
