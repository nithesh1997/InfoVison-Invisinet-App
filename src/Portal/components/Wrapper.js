import React from "react";
import { PortalWrapper } from "../styled-materials";

export const Wrapper = ({ children, closePortal }) => {
  return (
    <PortalWrapper onClick={closePortal}>
      {/*  */}
      {children}
      {/*  */}
    </PortalWrapper>
  );
};
