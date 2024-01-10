import { Box } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const GridPortal = React.memo(
  ({
    children,
    setIsPortal,
    dontClosePopup,
    toggleIsEditModeHost,
    dirtyRows,
    setDirtyRows,
    dirtyRow,
    IsEditClosed,
  }) => {
    const portal = document.createElement("div");
    const [isEditClosed, setIsEditClosed] = IsEditClosed;

    if (!document.getElementById("ifv-portal")) {
      portal.id = "ifv-portal";
      portal.style.width = "100vw";
      portal.style.height = "100vh";
      portal.style.position = "absolute";
      portal.style.top = "0%";
      portal.style.left = "0%";
      portal.style.zIndex = "1";

      document.body.appendChild(portal);
    }

    const closePortal = (event) => {
      if (typeof event.target.className === "string") {
        if (event.target.className.includes("portal-backdrop")) {
          setIsPortal(true);
          setIsEditClosed(true);
        }
      }
    };

    return ReactDOM.createPortal(
      <PortalWrapper
        className="portal-backdrop"
        onClick={dontClosePopup && closePortal}
      >
        {children}
      </PortalWrapper>,
      document.getElementById("ifv-portal"),
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.closePortal !== nextProps.closePortal) {
      return false;
    }

    if (prevProps.children !== nextProps.children) {
      return false;
    }

    return true;
  },
);

const PortalWrapper = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export default GridPortal;
