import { createContext, useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import callAPI from "../../apis/callAPI";
import Config from "../../Config";
import { setGatewayConfig } from "../../Gateway/gatewayConfigSlice";
import { setGatewayInfo } from "../../Gateway/gatewaySlice";
import FullViewPortContainer from "../Containers/FullViewPortContainer";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import AppContentBody from "./AppContentBody";
import AppContentBodyOverlay from "./AppContentBodyOverlay";
import AppContentHeader from "./AppContentHeader";
import { AppMenuContextProvider } from "./AppMenuContext";
import Prompt from "../DeletePrompt/Prompt";
import Auth from "../../redux/actions/Auth";
import OverlayContext from "./AppOverlayContext";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import { setActiveGateway } from "../../Gateway/activeGatewaySlice";
import useWindowDimensions from "../CustomHooks/useWindowDimensions";
import { setWindowDimensions } from "../../redux/Slices/windowDimensionsSlice";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

export const GatewayExpiryDaysCountContext = createContext();

const StyledAppContent = styled(FullViewPortContainer)`
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const AppContent = (props) => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const AppOverlayContext = useContext(OverlayContext);

  const [ExpDaysCount, setExpDaysCount] = useState(`Expiry Day`);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [runEffect, setRunEffect] = useState("");
  const [prompt, setPrompt] = useState(false);

  //   const store = useSelector((state) => state);
  const { activeGateway, gateway } = useSelector((state) => state);

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const gatewayIP = activeGateway.address;

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    dispatch(setWindowDimensions({ width, height }));
  }, [width, height, dispatch]);

  // Get Current Gateway Status
  useEffect(() => {
    const successCode = "GET_CURRENT_GATEWAY_INFO_SUCCESS";
    const failureCode = "GET_CURRENT_GATEWAY_INFO_FAILURE";

    if (gatewayIP) {
      callAPI({
        path: "getCurrentGatewayStatus",
        params: { gatewayIP },
        data: {},
        responder: (res, onComplete, onCompleteArgs = []) => {
          const isGoodResponse = res.state === "GOOD_RESPONSE";
          const is200 = res.response.code === 200;

          const state = isGoodResponse && is200 ? successCode : failureCode;
          const data = isGoodResponse && is200 ? res.response.body : undefined;

          onComplete({ state, data }, ...onCompleteArgs);
        },
        onCompleteArguments: [],
        onComplete: (response) => {
          if (response.state === successCode) {
            dispatch(setGatewayInfo({ ...response.data }));
          } else {
            console.error(response);
          }

          setRunEffect((oldState) =>
            oldState === "userWarned" ? oldState : "checkIsExpiringSoon",
          );
        },
      });
    }
  }, [dispatch, gatewayIP, location]);

  // Get Gateway Model Details
  useEffect(() => {
    const successCode = "GATEWAY_CONFIG_SUCCESS";
    const failureCode = "GATEWAY_CONFIG_FAILURE";

    if (gatewayIP) {
      callAPI({
        path: "getCurrentGatewayConfig",
        params: { gatewayIP },
        data: {},
        responder: (res, onComplete, onCompleteArgs = []) => {
          const isGoodResponse = res.state === "GOOD_RESPONSE";
          const is200 = res.response.code === 200;

          const state = isGoodResponse && is200 ? successCode : failureCode;
          const data = isGoodResponse && is200 ? res.response.body : undefined;

          onComplete({ state, data }, ...onCompleteArgs);
        },
        onCompleteArguments: [],
        onComplete: (response) => {
          if (response.state === successCode) {
            dispatch(setGatewayConfig({ ...response.data }));
          } else {
            console.error(response);
          }
        },
      });
    }
  }, [dispatch, gatewayIP]);

  //Alert ExpiryDay
  useEffect(() => {
    if (
      runEffect === "checkIsExpiringSoon" &&
      !gateway.offline &&
      (gateway.gwExpiryDays <= 7 || gateway.gwExpiryDays < 0) &&
      gateway.gwExpiryDays !== null &&
      gateway.gwExpiryDays !== undefined
    ) {
      setDialogOpen(true);
      setRunEffect("userWarned");
    }
  }, [gateway, runEffect]);

  useEffect(() => {
    if (runEffect === "logoutFromSession") {
      const onCompleteLogoutHandler = (responder) => {
        setTimeout(() => {
          Auth.forcelogOut(
            { location, history },
            AppConfig,
            AppOverlayContext,
            () => dispatch(setRecentGateway({ address: gatewayIP })),
          );
        }, AppConfig.app.signOutDelay);
      };

      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: onCompleteLogoutHandler,
      });

      setRunEffect("");
    }
  }, [
    AppConfig,
    AppOverlayContext,
    dispatch,
    gatewayIP,
    history,
    location,
    props,
    runEffect,
  ]);

  useEffect(() => {
    if (!!!gatewayIP) {
      !!AppOverlayContext.gatewayList.length && setPrompt(true);
      window.sessionStorage.removeItem("ba-selected-gateway");
      AppOverlayContext.setSelectedGateway({});
      dispatch(setActiveGateway({ name: "", address: "", checked: false }));

      // Handle no online gateways available
      let location = JSON.parse(JSON.stringify(props.location));
      let search = new URLSearchParams(location.search);

      search.set("forceAdd", "true");
      location.search = search.toString();
      location.key && delete location.key;
      props.history.push(location);
    }
  }, []);

  return (
    <AppMenuContextProvider>
      <GatewayExpiryDaysCountContext.Provider
        value={[ExpDaysCount, setExpDaysCount]}
      >
        <StyledAppContent
          bg={AppTheme.__default.appContent.bg}
          scroll={"false"} // It is recommended to not allow overlay to scroll. Instead, create scrollable containers in the overlay if required.
        >
          <AppContentHeader
            setShowSignIn={props.setShowSignIn}
            RunEffect={props.RunEffect}
            isLoggedOut={props.isLoggedOut}
          />
          <AppContentBodyOverlay />
          <AppContentBody />
        </StyledAppContent>
      </GatewayExpiryDaysCountContext.Provider>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        divider={false}
        contentTitle={
          <>
            <p style={{ color: "red", fontWeight: 600 }}>
              {t("commons.gateway.prompt.certificate.expired.title", {
                GATEWAY: common.GATEWAY,
              })}
            </p>
          </>
        }
        contentText={
          gateway.gwExpiryDays === 0 ? (
            <>
              <p>
                <Trans
                  i18nKey={
                    "commons.gateway.prompt.certificate.expired.case1.error.0"
                  }
                  values={{
                    GATEWAY: common.GATEWAY,
                    gatewayName: gateway.name,
                  }}
                  components={[<b />]}
                >
                  {{ GATEWAY: common.GATEWAY }}{" "}
                  <b>({{ gatewayName: gateway.name }})</b> expiring today.
                </Trans>
              </p>

              <p>
                {t(`commons.gateway.prompt.certificate.expired.case1.error.1`)}
              </p>
            </>
          ) : gateway.gwExpiryDays < 0 ? (
            <>
              <p>
                <Trans
                  i18nKey={
                    "commons.gateway.prompt.certificate.expired.case2.error.0"
                  }
                  values={{
                    GATEWAY: common.GATEWAY,

                    gatewayName: gateway.name,

                    daysToGo: ` ${Math.abs(gateway.gwExpiryDays)}`,
                  }}
                  components={[<b />]}
                >
                  {{ GATEWAY: common.GATEWAY }}{" "}
                  <b>({{ gatewayName: gateway.name }})</b> expired{" "}
                  <b>{{ daysToGo: ` ${Math.abs(gateway.gwExpiryDays)}` }}</b>{" "}
                  day(s) ago.
                </Trans>
              </p>

              <p>
                {t(`commons.gateway.prompt.certificate.expired.case2.error.1`)}
              </p>
            </>
          ) : gateway.gwExpiryDays <= 7 ? (
            <>
              <p>
                <Trans
                  i18nKey={
                    "commons.gateway.prompt.certificate.expired.case3.error.0"
                  }
                  gatewayName={{ gatewayName: gateway.name }}
                  gatewayExpiryDays={{
                    gatewayExpiryDays: ` ${gateway.gwExpiryDays}`,
                  }}
                  values={{
                    GATEWAY: common.GATEWAY,

                    gatewayName: gateway.name,

                    gatewayExpiryDays: ` ${gateway.gwExpiryDays}`,
                  }}
                  components={[<b />]}
                >
                  {{ GATEWAY: common.GATEWAY }}{" "}
                  <b>({{ gatewayName: gateway.name }})</b> is about to expire in
                  <b>
                    {{ gatewayExpiryDays: ` ${gateway.gwExpiryDays}` }}
                  </b>{" "}
                  day(s).
                </Trans>
              </p>

              <p>
                {t(`commons.gateway.prompt.certificate.expired.case3.error.1`)}
              </p>
            </>
          ) : null
        }
        agreeTitle={t("commons.okayText")}
        handleAgree={() => {
          setDialogOpen(false);
          setRunEffect("userWarned");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setRunEffect("userWarned");
        }}
      />

      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={`${t(
          "commons.gateway.prompt.certificate.gatewayError.title",
          { GATEWAY: common.GATEWAY },
        )}!`}
        contentText={
          <>
            <p>
              {t(`commons.gateway.prompt.certificate.gatewayError.error.0`)}!
              <br />
              {t(`commons.gateway.prompt.certificate.gatewayError.error.1`)}.
            </p>
          </>
        }
        contentInfo={``}
        disagreeTitle={t("commons.okayText")}
        handleDisagree={() => setPrompt(false)}
      />
    </AppMenuContextProvider>
  );
};

export default withRouter(withCookies(AppContent));
