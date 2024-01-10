import Box from "@material-ui/core/Box";
import React, { useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import StatsContainerWidgetViewMoreModal from "../Dashboard/StatsContainerWidgetViewMoreModal";
import SelectedGateway from "../GatewayManagement/SelectedGateway";
import IdentitiesPopup from "../GatewayServices/IdentitiesPopup";
import RemoteKeyPopup from "../GatewayServices/RemoteKeyPopup";
import UntrustedPopup from "../GatewayServices/UntrustedPopup";
import { IFVDataGridPopup } from "../IFVDataGrid/TableComponents/IFVDataGridPopup";
import { DownloadLogs } from "../IFVDGDevelopment/__test__/DownloadLogs";
import { ViewLogs } from "../IFVDGDevelopment/__test__/ViewLogs";
import OverlayContext from "./AppOverlayContext";

const StyledOverlay = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex: 0 0 auto;
  position: absolute;
  left: 0em;
  top: 4.5em;
  z-index: 49;
  width: 100%;
  height: calc(100vh - 4.5em);
  background-color: transparent;
  opacity: 1;
  transition: background-color 0.25s ease-in;
  pointer-events: none;

  ${(props) => {
    if (props.bgShown) {
      return `
        pointer-events: all;
        background-color: rgba( 0, 0, 0, 0.4 );
        transition: background-color 0.25s ease-out;
      `;
    }
  }}
`;

const StyledOverlayContentThatFadesIn = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex: 0 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease-in;
  pointer-events: none;

  ${(props) => {
    if (props.hidden) {
      return `
        opacity: 1;
        pointer-events: all;
        transition: opacity 0.5s ease-out;
      `;
    }
  }}
`;

const AppContentOverlay = (props) => {
  const AppOverlayContext = useContext(OverlayContext);

  const [backdropShown, setBackdropShown] = useState(false);
  const [backdropActive, setBackdropActive] = useState(false);
  const [gatewayShown, setGatewayShown] = useState(false);
  const [isIFVDataGridPortal, setIsIFVDataGridPortal] = useState(false);
  const [statsWidgetViewMoreShown, setStatsWidgetViewMoreShown] =
    useState(false);
  const [untrustedPopupShown, setUntrustedPopupShown] = useState(false);
  const [distributedIdentitiesPopupShown, setDistributedIdentitiesPopupShown] =
    useState(false);
  const [remoteKeyPopupShown, setRemoteKeyPopupShown] = useState(false);
  const [downloadLogsShown, setDownloadLogsShown] = useState(false);
  const [viewLogsShown, setViewLogsShown] = useState(false);

  const handleClose = (event, state, popup) => {
    if (state === true && popup === "remote") {
      setRemoteKeyPopupShown(false);
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,gss-rkp,)|(,gss-rkp$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
      );
    }

    if (state === true && popup === "untrusted") {
      setUntrustedPopupShown(false);
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,gss-unp-,)|(,gss-unp$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
      );
    }

    if (state === true && popup === "identities") {
      setDistributedIdentitiesPopupShown(false);
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,gss-dip,)|(,gss-dip$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
      );
    }

    setBackdropActive(false);
    setBackdropShown(false);
  };

  useEffect(() => {
    if (window.overlayBackdropHideTimeout) {
      window.clearTimeout(window.overlayBackdropHideTimeout);
    }
    let names = AppOverlayContext.componentsShown.split(",");
    let backdropNeeded = false;
    let location = JSON.parse(JSON.stringify(props.location));

    location.key && delete location.key;

    if (names.indexOf("mng-gtw") !== -1) {
      backdropNeeded = true;
      setGatewayShown(true);

      if (
        names.indexOf("gtw-bnr") !== -1 &&
        AppOverlayContext.gatewaySelectionMode !== "init"
      ) {
        AppOverlayContext.setGatewaySelectionMode("switch");
      }
    } else {
      setGatewayShown(false);

      if (names.indexOf("gtw-bnr") !== -1) {
        AppOverlayContext.setGatewaySelectionMode("");
      }
    }

    if (names.indexOf("stw-vmr") !== -1) {
      backdropNeeded = true;
      setStatsWidgetViewMoreShown(true);
    } else {
      setStatsWidgetViewMoreShown(false);
    }

    if (names.indexOf("ifv-portal") !== -1) {
      backdropNeeded = true;
      setIsIFVDataGridPortal(true);
    } else {
      setIsIFVDataGridPortal(false);
    }

    if (names.indexOf("gss-unp") !== -1) {
      backdropNeeded = true;
      setUntrustedPopupShown(true);
    } else {
      setUntrustedPopupShown(false);
    }

    if (names.indexOf("gss-dip") !== -1) {
      backdropNeeded = true;
      setDistributedIdentitiesPopupShown(true);
    } else {
      setDistributedIdentitiesPopupShown(false);
    }

    if (names.indexOf("gss-rkp") !== -1) {
      backdropNeeded = true;
      setRemoteKeyPopupShown(true);
    } else {
      setRemoteKeyPopupShown(false);
    }

    if (names.indexOf("download-logs-portal") !== -1) {
      backdropNeeded = true;
      setDownloadLogsShown(true);
    } else {
      setDownloadLogsShown(false);
    }

    if (names.indexOf("view-logs-portal") !== -1) {
      backdropNeeded = true;
      setViewLogsShown(true);
    } else {
      setViewLogsShown(false);
    }

    if (backdropNeeded) {
      setBackdropShown(true);
      setBackdropActive(true);
    } else {
      window.overlayBackdropHideTimeout = setTimeout(() => {
        setBackdropShown(false);
        setBackdropActive(false);
      }, 250);
    }
  }, [AppOverlayContext.componentsShown]);

  return (
    <StyledOverlay
      className={"ba-gw-overlay-backdrop"}
      component={"section"}
      bgShown={backdropShown}
      bgActive={backdropActive}
      onClick={(event) => {
        let className = event.target.className;
        if (typeof className !== "string") {
          return;
        }

        if (
          event.target.className.match(
            /((^)|( ))ba-gw-overlay-backdrop(( )|($))/,
          ) === null
        ) {
          return;
        }

        if (gatewayShown) {
          let forceAdd = new URLSearchParams(props.location.search).get(
            "forceAdd",
          );
          if (forceAdd !== "true") {
            AppOverlayContext.setComponentsShown(
              AppOverlayContext.componentsShown
                .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
                .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
            );
            AppOverlayContext.setGatewaySelectionMode("");
          }
        }

        if (statsWidgetViewMoreShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,stw-vmr,)|(,stw-vmr$)/,
              ",",
            ),
          );
        }

        if (untrustedPopupShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,gss-unp,)|(,gss-unp$)/,
              ",",
            ),
          );
        }

        if (distributedIdentitiesPopupShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,gss-dip,)|(,gss-dip$)/,
              ",",
            ),
          );
        }

        if (remoteKeyPopupShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,gss-rkp,)|(,gss-rkp$)/,
              ",",
            ),
          );
        }

        if (isIFVDataGridPortal) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,ifv-portal,)|(,ifv-portal$)/,
              ",",
            ),
          );
        }

        if (downloadLogsShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,download-logs-portal,)|(,download-logs-portal$)/,
              ",",
            ),
          );
        }

        if (viewLogsShown) {
          AppOverlayContext.setComponentsShown(
            AppOverlayContext.componentsShown.replace(
              /(,view-logs-portal,)|(,view-logs-portal$)/,
              ",",
            ),
          );
        }
      }}
    >
      <StyledOverlayContentThatFadesIn hidden={gatewayShown}>
        {gatewayShown && (
          <SelectedGateway
            key={AppOverlayContext.componentsShown}
            readableKey={AppOverlayContext.componentsShown}
          />
        )}
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={statsWidgetViewMoreShown}>
        <StatsContainerWidgetViewMoreModal />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={isIFVDataGridPortal}>
        <IFVDataGridPopup />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={untrustedPopupShown}>
        <UntrustedPopup
          handleClose={(e) => handleClose(e, untrustedPopupShown, "untrusted")}
        />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={distributedIdentitiesPopupShown}>
        <IdentitiesPopup
          handleClose={(e) =>
            handleClose(e, distributedIdentitiesPopupShown, "identities")
          }
          data={AppContentOverlay.distributedIdentity}
        />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={remoteKeyPopupShown}>
        <RemoteKeyPopup
          handleClose={(e) => handleClose(e, remoteKeyPopupShown, "remote")}
        />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={downloadLogsShown}>
        <DownloadLogs
          handleClose={(e) =>
            handleClose(e, downloadLogsShown, "download-logs-portal")
          }
        />
      </StyledOverlayContentThatFadesIn>

      <StyledOverlayContentThatFadesIn hidden={viewLogsShown}>
        <ViewLogs
          handleClose={(e) => handleClose(e, viewLogsShown, "view-logs-portal")}
        />
      </StyledOverlayContentThatFadesIn>
    </StyledOverlay>
  );
};

export default withRouter(withCookies(AppContentOverlay));
