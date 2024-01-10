import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import React from "react";
import { PortalCloseButton } from "../styled-materials";

export const ClosePortal = ({ closePortal }) => {
  return (
    <PortalCloseButton onClick={closePortal}>
      <CloseOutlinedIcon />
    </PortalCloseButton>
  );
};
