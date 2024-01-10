import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { instanceOf } from "prop-types";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Cookies, withCookies } from "react-cookie";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Scroll from "react-scroll";
import { createGlobalStyle } from "styled-components";
import { createTheme } from "@mui/material/styles";
import callAPI from "./apis/callAPI";
import { GatewayListAPIResponder } from "./apis/responders/gateway-list-api-responder";
import { isBemAPIResponder } from "./apis/responders/is-bem-api-responder";
import { logoutApiResponder } from "./apis/responders/logoutApiResponder";
import OverlayContext from "./components/AppContent/AppOverlayContext";
import ScrollContext from "./components/AppContent/AppScrollContext";
import FullViewPortContainer from "./components/Containers/FullViewPortContainer";
import GeneralErrorBoundary from "./components/ErrorBoundaries/GeneralErrorBoundary";
import PageLoader from "./components/PageLoader/PageLoader";
import Config from "./Config";
import { setRecentGateway } from "./Gateway/recentGatewaySlice";
import Auth from "./redux/actions/Auth";
// import { getDesignToken } from "./style/Theme";
import { theme } from "./style/theme";
import { ProjectName } from "./utils/ProjectName/Index";
import { useTranslation } from "react-i18next";

let Events = Scroll.Events;

export const LogOutSessionContext = createContext(null);

const GlobalStyles = createGlobalStyle`
  body {
    overflow: hidden;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  .hidden {
    display: none !important;
  }

  .invisible {
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .MuiTooltip-tooltip {
    font-size: 0.9em;
  }

  ::-webkit-scrollbar {
      width: 0.5vw;
      height: 0.5vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
      background: rgba(192, 192, 192, 0.6);
      border-radius: 0.5vw;
  }

  ::-webkit-scrollbar-track:hover {
      background: rgba(192, 192, 192, 0.85);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #777;
      border-radius: 0.5vw;
  }

  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  }

  & .MuiAutocomplete-popper > .MuiPaper-root {
    /* font-family: "Inter", sans-serif; */
  }
`;

const AsyncSignIn = React.lazy(() => import("./components/SignIn/SignIn"));
const AsyncAppContent = React.lazy(() =>
  import("./components/AppContent/AppContent"),
);

const App = (props) => {
  const isLoggedOut = useRef(true);

  // Not being used, but to be removed later upon full testing.
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const AppScrollContext = useContext(ScrollContext);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const { address: recentGatewayIP } = useSelector(
    (state) => state.recentGateway,
  );

  const [isAppReady, setIsAppReady] = useState(false);
  const [skipNextAuthCheck, setSkipNextAuthCheck] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [runEffect, setRunEffect] = useState("");
  const [logoutSession, setLogoutSession] = useState(false);
  const RunEffect = useMemo(() => [runEffect, setRunEffect], [runEffect]);

  const handleOnIdle = (event) => {
    if (
      isAppReady &&
      props.location.pathname !== AppConfig.pages.sgn.path &&
      Math.ceil(getRemainingTime() / 1000) === 0 &&
      process.env.NODE_ENV.toLowerCase() === "production"
    ) {
      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: () => {
          Auth.logOut(
            props,
            AppConfig,
            setShowSignIn,
            AppOverlayContext,
            RunEffect,
            isLoggedOut,
            () => dispatch(setRecentGateway({ address: gatewayIP })),
            "user-forced-to-logout",
          );
        },
      });

      document.title = t(`commons.appName`, { ProjectName });
    }
  };

  const handleOnActive = (event) => {
    document.title = t(`commons.appName`, { ProjectName });
  };

  const handleOnAction = (event) => {
    document.title = t(`commons.appName`, { ProjectName });
  };

  const {
    start,
    reset,
    pause,
    resume,
    isIdle,
    isLeader,
    getElapsedTime,
    getLastIdleTime,
    getTotalIdleTime,
    getTotalActiveTime,
    getRemainingTime,
    getLastActiveTime,
  } = useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });

  var logoutIntervavId = setInterval(() => {
    if (
      isAppReady &&
      props.location.pathname !== AppConfig.pages.sgn.path &&
      Math.ceil(getRemainingTime() / 1000) < 30
    ) {
      document.title = t("commons.logout.warning", {
        timeout: `${Math.ceil(getRemainingTime() / 1000)}`,
      });

      if (Math.ceil(getRemainingTime() / 1000) === 0) {
        document.title = t(`commons.appName`, { ProjectName });
        clearInterval(logoutIntervavId);
      }
    }
  }, 1000);

  useEffect(() => {
    if (
      showSignIn &&
      isAppReady &&
      props.location.pathname !== AppConfig.pages.sgn.path
    ) {
      document.title = t(`commons.appName`, { ProjectName });
      reset();
    }
  }, [
    AppConfig.pages.sgn.path,
    getRemainingTime,
    isAppReady,
    props.location.pathname,
    reset,
    showSignIn,
  ]);

  // Below method will
  // - Check auth with isBem.
  // - Redirect if needed.
  // - Select default gateway.
  const callVerifyAndRedirect = (skipAuthCheck) => {
    Auth.verifyAndRedirect(
      props,
      callAPI,
      isBemAPIResponder,
      GatewayListAPIResponder,
      setShowSignIn,
      setSkipNextAuthCheck,
      AppOverlayContext,
      skipAuthCheck,
      AppConfig,
      setIsAppReady,
      [runEffect, setRunEffect],
      dispatch,
      isLoggedOut,
      recentGatewayIP,
    );
  };

  // It will run on page load, page refresh, and URL changes.
  useEffect(() => {
    let location = JSON.parse(JSON.stringify(props.location));

    if (skipNextAuthCheck) {
      setSkipNextAuthCheck(false);

      location.pathname !== AppConfig.pages.sgn.path
        ? callVerifyAndRedirect(true)
        : setShowSignIn(true);
    } else {
      callVerifyAndRedirect();
    }
  }, [props.location]);

  useEffect(() => {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, [AppScrollContext.scrollInfo]);

  useEffect(() => {
    if (logoutSession) {
      const onCompleteLogoutHandler = (responder) => {
        Auth.logOut(
          props,
          AppConfig,
          setShowSignIn,
          AppOverlayContext,
          RunEffect,
          isLoggedOut,
          () => dispatch(setRecentGateway({ address: gatewayIP })),
        );
      };

      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: onCompleteLogoutHandler,
      });

      setLogoutSession(false);
    }
  }, [AppConfig, AppOverlayContext, RunEffect, logoutSession, props]);

  React.useEffect(() => {
    const REACT_APP_VERSION = process.env.REACT_APP_VERSION;
    window.APP_INFO = {
      version: REACT_APP_VERSION,
      latestCommitHead: process.env.REACT_APP_LATEST_COMMIT_HEAD,
    };

    console.log(
      `%cINTERFACE_VERSION: ${REACT_APP_VERSION}-${process.env.REACT_APP_LATEST_COMMIT_HEAD}`,
      `font-weight: bold; color: #42B883; background: #222;`,
    );
  }, []);

  return (
    <LogOutSessionContext.Provider value={[logoutSession, setLogoutSession]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <GeneralErrorBoundary>
          {isAppReady &&
          props.location.pathname !== AppConfig.pages.sgn.path ? (
            <FullViewPortContainer>
              <Suspense
                fallback={
                  <GeneralErrorBoundary>
                    <PageLoader />
                  </GeneralErrorBoundary>
                }
              >
                <AsyncAppContent
                  setShowSignIn={setShowSignIn}
                  RunEffect={RunEffect}
                  isLoggedOut={isLoggedOut}
                />
              </Suspense>
            </FullViewPortContainer>
          ) : (
            <PageLoader className={showSignIn ? "hidden" : ""} />
          )}

          {showSignIn &&
          props.location.pathname === AppConfig.pages.sgn.path ? (
            <FullViewPortContainer>
              <Suspense
                fallback={
                  <GeneralErrorBoundary>
                    <PageLoader />
                  </GeneralErrorBoundary>
                }
              >
                <AsyncSignIn setShowSignIn={setShowSignIn} />
              </Suspense>
            </FullViewPortContainer>
          ) : (
            ""
          )}
        </GeneralErrorBoundary>

        <GlobalStyles />
      </ThemeProvider>
    </LogOutSessionContext.Provider>
  );
};

App.propTypes = { cookies: instanceOf(Cookies).isRequired };

export default withRouter(withCookies(App));
