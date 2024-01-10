import React from "react";
import ReactDOM from "react-dom";
import { Backdrop, PortalContent } from "./styled-materials";

const Portal = ({
  children,
  portalState,
  setPortalState,
  downloadLogsState,
  viewLogsState,
  filterRuleConfig,
  upgradeRemoteFirmware,
  filterRuleConfigPortalRef,
  viewFilterRuleConfigPortalRef,
  upgradeRemoteFirmwarePortalRef,
}) => {
  const [display, setDisplay] = React.useState("none");
  const portal = document.createElement("div");

  if (!document.getElementById("portal")) {
    portal.id = "portal";
    portal.style.width = "100vw";
    portal.style.height = "100vh";
    portal.style.position = "absolute";
    portal.style.top = "0%";
    portal.style.left = "0%";
    portal.style.zIndex = "1000";
    portal.style.display = display;
    portal.style.placeItems = "center";

    document.body.appendChild(portal);
  }

  React.useEffect(() => {
    document.getElementById("portal") && portalState.isPortal
      ? setDisplay("grid")
      : setDisplay("none");
  }, [portalState]);

  React.useEffect(() => {
    document.getElementById("portal") &&
      (document.getElementById("portal").style.display = display);
  }, [display]);

  const closePortal = (event, handleClosePortal) => {
    if (typeof event.target.className === "string") {
      if (event.target.className.includes("portal-backdrop")) {
        if (!portalState.isProgressPending) {
          if (portalState.type === "__download") {
            if (downloadLogsState.isBulkAction) {
              downloadLogsState.setTaskStatus({
                inProgress: false,
                error: false,
                message: ``,
                payload: downloadLogsState.tableRows,
              });
            } else {
              setPortalState(() => ({ type: "__download", isPortal: true }));

              // downloadLogsState.setTaskStatus({
              //   inProgress: false,
              //   error: false,
              //   message: ``,
              //   payload: {},
              // });
            }
          } else if (portalState.type === "__view") {
            setPortalState(() => ({ type: "__view", isPortal: false }));
            viewLogsState.setTaskStatus({
              inProgress: false,
              error: false,
              message: ``,
              payload: {},
            });
          } else if (portalState.type === "filter-rules-configuration") {
            /* filterRuleConfig.setTaskStatus({
              inProgress: false,
              isError: false,
              message: ``,
              payload: {},
            }); */

            if (filterRuleConfigPortalRef.current) {
              if (filterRuleConfigPortalRef.current.closePortal) {
                // filterRuleConfigPortalRef.current.closePortal();
              }
            }
          } else if (portalState.type === "upgrade-remote-firmware") {
            if (upgradeRemoteFirmwarePortalRef.current) {
              if (upgradeRemoteFirmwarePortalRef.current.closePortal) {
                //upgradeRemoteFirmwarePortalRef.current.closePortal();
              }
            }
          } else if (portalState.type === "view-filter-rules-configuration") {
            if (viewFilterRuleConfigPortalRef.current) {
              if (viewFilterRuleConfigPortalRef.current.closePortal) {
                //viewFilterRuleConfigPortalRef.current.closePortal();
              }
            }
          }

          // setPortalState(() => ({ type: "", isPortal: false }));
        }
      }
    }
  };

  return ReactDOM.createPortal(
    <Backdrop
      className="portal-backdrop"
      isDisplay={portalState.isPortal}
      //onClick={closePortal}
    >
      <PortalContent>{children}</PortalContent>
    </Backdrop>,
    document.getElementById(`portal`),
  );
};

export default Portal;
