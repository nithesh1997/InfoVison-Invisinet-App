/* eslint-disable no-whitespace-before-property */

import React from "react";
import styled from "styled-components";
import FullViewPortContainer from "./FullViewPortContainer";

const OverlayContainer = styled(FullViewPortContainer)`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;
`;

const FullViewPortOverlay = (props) => {
  return (
    <OverlayContainer
      className={props.className}
      bg={props.bg}
      scroll={"false"} // It is recommended to not allow overlay to scroll. Instead, create scrollable containers in the overlay if required.
    >
      {props.children}
    </OverlayContainer>
  );
};

export default FullViewPortOverlay;
