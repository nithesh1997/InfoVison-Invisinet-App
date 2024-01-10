import React from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
  max-width: none;
  height: 100vh;
  padding: 0px;
  overflow: ${(props) => {
    switch (props.scroll) {
      case "true":
        return "scroll";
      case "false":
        return "hidden";
      case "overflow":
        return "visible";
      case "auto":
        return "auto";
      default:
        return "hidden";
    }
  }};
  ${(props) =>
    props.bg === "auto" ? "" : "background-color: " + props.bg + ";"}
`;

const FullViewPortContainer = (props) => {
  return (
    <StyledContainer
      className={props.className}
      bg={props.bg !== undefined ? props.bg : "auto"}
      scroll={props.scroll !== undefined ? props.scroll : "false"}
    >
      {props.children}
    </StyledContainer>
  );
};

export default FullViewPortContainer;
