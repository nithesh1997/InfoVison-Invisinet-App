import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Backdrop, PortalContent } from "./styled-materials";

const Portal = ({ children, PortalState, handleClosePortal, zAxis = 1 }) => {
  const portal = document.createElement("div");

  const [portalState, setPortalState] = PortalState;
  const [display, setDisplay] = useState("none");

  if (!document.getElementById("portal")) {
    portal.id = "portal";
    portal.style.width = "100vw";
    portal.style.height = "100vh";
    portal.style.position = "absolute";
    portal.style.top = "0%";
    portal.style.left = "0%";
    portal.style.zIndex = `${zAxis}`;
    portal.style.display = display;
    portal.style.placeItems = "center";

    document.body.appendChild(portal);
  }

  const closePortal = (event, handleClosePortal) => {
    if (typeof event.target.className === "string") {
      if (event.target.className.includes("portal-backdrop")) {
        handleClosePortal(event, setPortalState);
      }
    }
  };

  useEffect(() => {
    document.getElementById("portal").style.zIndex = `${zAxis}`;
  }, [zAxis]);

  useEffect(() => {
    document.getElementById("portal") && portalState.isPortal
      ? setDisplay("grid")
      : setDisplay("none");
  }, [portalState]);

  useEffect(() => {
    document.getElementById("portal") &&
      (document.getElementById("portal").style.display = display);
  }, [display]);

  return ReactDOM.createPortal(
    <Backdrop
      className="portal-backdrop"
      isDisplay={portalState.isPortal}
      onClick={(event) => closePortal(event, handleClosePortal)}
    >
      <PortalContent key={display}>{children}</PortalContent>
    </Backdrop>,
    document.getElementById(`portal`),
  );
};

export default Portal;
