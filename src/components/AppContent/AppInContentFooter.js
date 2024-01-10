import React, { useState, useContext, useEffect } from "react";
import { ProjectName } from "../../utils/ProjectName/Index";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import callAPI from "../../apis/callAPI";
import Config from "../../Config";
import AppMenuContext from "./AppMenuContext";
import { useTranslation } from "react-i18next";
import Monitor from "../../images/state-indicator-monitor.svg";
import Enforce from "../../images/state-indicator-enforce.svg";
import Bridge from "../../images/state-indicator-bridge.svg";
import { networkAPIResponder } from "../../apis/responders/networkAPIResponder";
import OverlayContext from "../AppContent/AppOverlayContext";

const StyledContainer = styled(Box)`
  display: flex;
  position: fixed;
  bottom: 0em;
  left: 19em;
  z-index: 99;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex: 0 0 auto;
  width: calc(100% - 19em);
  flex-wrap: nowrap;
  background: #f1f1f1;
  /* background: white; */
  margin-top: 0em;
  box-shadow: 0em -0.5em 1.25em rgba(0, 0, 0, 0.1);
  transition: width ${(props) => props.collapseDelay / 1000}s ease-out,
    left ${(props) => props.collapseDelay / 1000}s ease-out;

  &.collapsed {
    left: 4.5em;
    width: calc(100% - 4.5em);
    transition: width ${(props) => props.collapseDelay / 1000}s ease-in,
      left ${(props) => props.collapseDelay / 1000}s ease-in;
  }
  @media (max-width: 320px) {
    min-width: 100%;
    width: calc(100% - 0em);
    left: 0em;
  }
  @media (max-width: 640px) {
    left: 0em;
  }
`;
const StyledBox = styled(Box)`
  @media (max-width: 320px) {
    min-width: 100%;
  }
`;

const getCurrentYear = () => {
  const date = new Date();

  return date.getFullYear();
};

const AppInContentFooter = (props) => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const MenuContext = useContext(AppMenuContext);
  const AppOverlayContext = useContext(OverlayContext);
  let [sideMenuCollapsed, setSideMenuCollapsed] = useState(
    MenuContext.collapsed,
  );
  const [tacModeValue, setTacModeValue] = useState("");

  const [copyRightedOn, setCopyRightedOn] = useState(getCurrentYear);

  useEffect(() => {
    setSideMenuCollapsed(MenuContext.collapsed);
  }, [MenuContext.collapsed]);

  useEffect(() => {
    if (!AppConfig.tacMode) {
      callAPI({
        path: "network",
        params: {
          gatewayIP: AppOverlayContext.selectedGateway.address,
        },
        data: {},
        responder: networkAPIResponder,
        onComplete: networkOnCompleteHandler,
      });
    }
    setTacModeValue(AppConfig.tacMode);
  }, [AppConfig.tacMode]);

  const networkOnCompleteHandler = (response) => {
    let data = {};
    if (response.state === "NETWORK_SUCESS" && response.data !== "") {
      data = response.data;
    }
    AppConfig.setTacMode(data.mode ?? "");
  };

  const getFooterTextStyle = (value) => {
    if (tacModeValue === value) {
      return {
        color: "#000",
        fontWeight: "600",
      };
    }
    return { color: "#8c8c8c" };
  };

  return (
    <StyledContainer
      className={sideMenuCollapsed ? " collapsed" : ""}
      collapseDelay={AppConfig.app.sideMenu.collapseDelay}
    >
      <StyledBox
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0.75em 1.5em",
          fontWeight: "500",
          fontSize: "0.75em",
          color: "#333",
          textAlign: "right",
        }}
      >
        {/* <span style={{ fontWeight: "600" }}>
          <code style={{ margin: "0em 0.5em", color: "darkorange" }}>
            v{AppConfig.version.major}.{AppConfig.version.minor}.
            {AppConfig.version.build}-{AppConfig.version.type}
          </code>
        </span> */}
        {/* © {copyRightedOn} {ProjectName} | {t("commons.rightsReservedText")} */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "500",
          }}
        >
          <img
            src={
              tacModeValue === "Enforce"
                ? Enforce
                : tacModeValue === "Bridge"
                ? Bridge
                : Monitor
            }
            alt="icon"
            height={"15px"}
          />
          {tacModeValue === "Bridge" ? (
            <div style={{ padding: "0 10px", ...getFooterTextStyle("Bridge") }}>
              Bridge
            </div>
          ) : (
            <>
              <div
                style={{ padding: "0 10px", ...getFooterTextStyle("Enforce") }}
              >
                Enforce
              </div>
              <div style={getFooterTextStyle()}>|</div>
              <div
                style={{ padding: "0 10px", ...getFooterTextStyle("Monitor") }}
              >
                Monitor
              </div>
            </>
          )}
        </div>
        <div>
          © {copyRightedOn} {ProjectName}
        </div>
      </StyledBox>
    </StyledContainer>
  );
};

export default AppInContentFooter;
