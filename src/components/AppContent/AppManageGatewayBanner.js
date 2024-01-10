import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Gear } from "react-bootstrap-icons";
import { withCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { setGatewayManager } from "../../redux/Slices/gatewayManagerSlice";
import OverlayContext from "./AppOverlayContext";
import * as common from "../../common";

const AppManageGatewayBanner = (props) => {
  const { t, i18n } = useTranslation();
  const { name: currGatewayName, address: gatewayIP } = useSelector(
    (state) => state.activeGateway,
  );

  const dispatch = useDispatch();

  const AppOverlayContext = useContext(OverlayContext);
  const initGatewayCount = AppOverlayContext.gatewayCount;

  const [gatewayBannerShown, setGatewayBannerShown] = useState(false);
  const [gatewayShown, setGatewayShown] = useState(false);
  const [gatewayName, setGatewayName] = useState(
    t(`commons.gateway.banner.noneSelected`, { GATEWAY: common.GATEWAY }),
  );
  const [gatewayAddress, setGatewayAddress] = useState(
    t(`commons.gateway.banner.noneSelected`, { GATEWAY: common.GATEWAY }),
  );

  const [gatewayCount, setGatewayCount] = useState(initGatewayCount);
  const isAnyGatewayOnline =
    AppOverlayContext?.gatewayList.filter(({ offline }) => !offline).length ??
    0;

  const showManageGatewayOverlay = () => {
    if (!gatewayShown) {
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown + ",mng-gtw",
      );

      dispatch(
        setGatewayManager({
          isModalOpen: true,
          selectedGateway: "",
        }),
      );
    } else {
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown.replace(
          /(,mng-gtw,)|(,mng-gtw$)/,
          ",",
        ),
      );

      dispatch(
        setGatewayManager({
          isModalOpen: true,
          selectedGateway: "",
        }),
      );
    }
  };

  useEffect(() => {
    let names = AppOverlayContext.componentsShown.split(",");

    if (names.indexOf("mng-gtw") !== -1) {
      setGatewayShown(true);
    } else {
      setGatewayShown(false);
    }

    if (names.indexOf("gtw-bnr") !== -1) {
      setGatewayBannerShown(true);
    } else {
      setGatewayBannerShown(false);
    }
  }, [AppOverlayContext.componentsShown]);

  useEffect(() => {
    let location = JSON.parse(JSON.stringify(props.location));
    if (location.key) {
      delete location.key;
    }

    let search = new URLSearchParams(location.search);
    let oldSearch = search.toString();

    if (AppOverlayContext.gatewaySelectionMode !== "init") {
      if (AppOverlayContext.gatewaySelectionMode !== "") {
        search.set("gatewaySelection", AppOverlayContext.gatewaySelectionMode);
      } else {
        search.delete("gatewaySelection");
      }

      let newSearch = search.toString();

      if (oldSearch !== newSearch) {
        location.search = newSearch;

        props.history.push(location);
      }
    }
  }, [AppOverlayContext.gatewaySelectionMode]);

  useEffect(() => {
    setGatewayName(
      currGatewayName ||
        t(`commons.gateway.banner.noneSelected`, {
          GATEWAY: common.GATEWAY,
        }),
    );
    setGatewayAddress(
      gatewayIP ||
        t(`commons.gateway.banner.noneSelected`, {
          GATEWAY: common.GATEWAY,
        }),
    );
  }, [AppOverlayContext.selectedGateway, currGatewayName, gatewayIP]);

  useEffect(() => {
    setGatewayCount(AppOverlayContext.gatewayList.length);
  }, [AppOverlayContext.gatewayList]);

  useEffect(() => {
    let location = JSON.parse(JSON.stringify(props.location));

    if (location.key) {
      delete location.key;
    }

    let search = new URLSearchParams(location.search);
    let selectedGateway = window.sessionStorage.getItem("ba-selected-gateway");
    let activeGSMode = search.get("gatewaySelection");
    let newActiveGSMode = activeGSMode;

    if (activeGSMode !== "initial") {
      if (selectedGateway === null) {
        newActiveGSMode = "switch";
      } else {
        if (activeGSMode === null) {
          newActiveGSMode = "";
        } else {
          newActiveGSMode = "switch";
        }
      }

      if (activeGSMode !== newActiveGSMode) {
        AppOverlayContext.setGatewaySelectionMode(newActiveGSMode);
      }
    } else {
      if (selectedGateway !== null) {
        window.sessionStorage.removeItem("ba-selected-gateway");
      }
    }

    if (activeGSMode === "initial") {
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",mng-gtw",
      );
    } else if (activeGSMode === "switch") {
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",mng-gtw,gtw-bnr",
      );
    } else {
      AppOverlayContext.setComponentsShown(
        AppOverlayContext.componentsShown
          .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
      );
    }
  }, []);

  return (
    <$.StyledBox
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: "59",
        right: "0em",
        top: "0em",
        background: "#D4EDFF",
        padding: "0.35em 0.5em",
        fontWeight: "500",
        // fontFamily: "",
        color: "#333",
        cursor: "pointer",
        opacity: gatewayBannerShown ? "1" : "0",
        pointerEvents: gatewayBannerShown ? "all" : "none",
      }}
      onClick={showManageGatewayOverlay}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0em 1.25em",
          fontSize: "0.75em",
          borderRight: "0.1em solid #333",
        }}
      >
        {t(`commons.gateway.banner.peak.title`, {
          GATEWAY: common.GATEWAY,
          TAC_SERVER: common.TAC_SERVER,
        })}
        <br />
        {t(`commons.gateway.banner.peak.info`, {
          gatewayCount,
          GATEWAY: common.GATEWAY,
          TAC_SERVER: common.TAC_SERVER,
        })}
      </Box>

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "0em 0.5em 0em 1em",
          fontWeight: "600",
          fontSize: "1em",
          color: "#333",
          maxWidth: "18em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {typeof gatewayName === "string"
          ? gatewayName.length > 0
            ? gatewayName
            : gatewayAddress
          : gatewayAddress}
      </Box>

      <IconButton
        style={{
          color: "#FFF",
          background: "#0094FD",
          padding: "0.25em",
          marginLeft: "0.5em",
          marginTop: "0em",
          marginBottom: "0em",
        }}
      >
        <Gear size={"0.6em"} />
      </IconButton>

      <Dialog
        open={
          gatewayName ===
            t(`commons.gateway.banner.noneSelected`, {
              GATEWAY: common.GATEWAY,
            }) && isAnyGatewayOnline
        }
        aria-labelledby="no-gateway-selected-title"
        aria-describedby="no-gateway-selected-description"
      >
        <$.DialogBoxContent>
          <$.DialogBoxContentSpinner />

          <$.DialogBoxContentStatus>
            {
              (t(`commons.gateway.banner.prompt.switch`),
              { GATEWAY: common.GATEWAY })
            }
          </$.DialogBoxContentStatus>
        </$.DialogBoxContent>
      </Dialog>
    </$.StyledBox>
  );
};

export default withRouter(withCookies(AppManageGatewayBanner));

const $ = {
  StyledBox: styled(Box)`
    @media (max-width: 320px) {
      width: 100%;
      border-radius: 0px 0px 0px 0px;
    }
    border-radius: 0px 0px 0px 20px;
  `,
  DialogBoxContent: styled(DialogContent)`
    min-width: 400px;
    min-height: 200px;
    padding: 2rem;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  `,
  DialogBoxContentStatus: styled(Typography)`
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.2pt;
  `,
  DialogBoxContentSpinner: styled(CircularProgress)`
    width: 180px !important;
    height: 180px !important;

    & .MuiCircularProgress-circleIndeterminate {
      stroke-width: 1;
    }

    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
};
