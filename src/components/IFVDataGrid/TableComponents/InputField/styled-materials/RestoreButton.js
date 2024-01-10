import styled from "styled-components";
import { IconButton } from "@material-ui/core";

export const RestoreButton = styled(IconButton)`
  color: ${(props) => props.sign.focus};
  background: #f3f4f6;
  width: 1rem;
  height: 1rem;
  visibility: ${(props) => (props.isRestore ? "visible" : "hidden")};
  position: absolute;
  top: 4%;
  right: 2%;
  z-index: 9;

  .MuiIconButton-root:hover {
    background: "#F3F4F6";
  }
`;
