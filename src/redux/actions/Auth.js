import { setActiveGateway } from "../../Gateway/activeGatewaySlice";
import Utility from "./Utility";
import * as common from "../../common";

// Clear session
const clearSession = () => {
  window.sessionStorage.clear();
};

// isBem API call's on complete handler
const isBemOnCompleteHandler = (
  response,
  callAPI,
  GatewayListAPIResponder,
  AppOverlayContext,
  props,
  setShowSignIn,
  setSkipNextAuthCheck,
  skipAuthCheck,
  AppConfig,
  setIsAppReady,
  instance,
  signedIn,
  RunEffect = [undefined, undefined],
  dispatch,
  isLoggedOut,
  recentGatewayIP,
) => {
  const [runEffect, setRunEffect] = RunEffect;

  if (response.state === "ISBEM_AUTH_SUCCESSFUL") {
    if (skipAuthCheck !== true) {
      // The user is authorized
      let location = JSON.parse(JSON.stringify(props.location));
      let search = new URLSearchParams(location.search);

      if (location.pathname === AppConfig.pages.sgn.path) {
        let returnURL = search.get("return");

        try {
          returnURL = JSON.parse(returnURL);
        } catch (error) {
          returnURL = null;
        }

        if (returnURL === null) {
          setSkipNextAuthCheck(true);
          props.history.push(AppConfig.pages.dsh.path);

          return;
        } else {
          setSkipNextAuthCheck(true);
          props.history.push(returnURL);

          return;
        }
      } else if (location.pathname === "" || location.pathname === "/") {
        setSkipNextAuthCheck(true);
        props.history.push(AppConfig.pages.dsh.path);

        return;
      }
    }

    if (skipAuthCheck === true) {
      let location = JSON.parse(JSON.stringify(props.location));
      let search = new URLSearchParams(location.search);

      if (
        search.get("gatewaySelection") === "switch" &&
        search.get("forceAdd") === "true"
      ) {
        return;
      }
    }

    // Select default gw if needed
    // Check if gateway is already selected
    let currGW = window.sessionStorage.getItem("ba-selected-gateway");

    try {
      currGW = JSON.parse(currGW);
      if (typeof currGW.address !== "string") {
        throw new Error("Invalid address detected. Not a string.");
      }
    } catch (error) {
      currGW = null; // Indicate that gateway is not already selected
      window.sessionStorage.removeItem("ba-selected-gateway");
    }

    // No default gateway selected
    // let location = JSON.parse(JSON.stringify(props.location));
    // let search = new URLSearchParams(location.search);
    if (currGW !== null) {
      AppOverlayContext.setSelectedGateway(currGW);
      dispatch(setActiveGateway({ ...currGW }));
    }

    window.gatewayListAuthCheckInstance = new Date().getTime();
    window.gatewayListAuthCheckSignedIn =
      props.location.pathname === AppConfig.pages.sgn.path;

    if (runEffect === "" && isLoggedOut.current) {
      callAPI({
        path: "getGatewaysStatus",
        data: {},
        responder: GatewayListAPIResponder,
        onComplete: GatewayListOnCompleteHandler,
        onCompleteArguments: [
          AppOverlayContext,
          props,
          setSkipNextAuthCheck,
          setIsAppReady,
          window.gatewayListAuthCheckInstance,
          window.gatewayListAuthCheckSignedIn,
          AppConfig,
          dispatch,
          recentGatewayIP,
        ],
      });

      setRunEffect("getGatewaysStatusFetched");
      isLoggedOut.current = false;
    }
  } else {
    if (skipAuthCheck !== true) {
      // The user is not authorized
      clearSession();
      let location = JSON.parse(JSON.stringify(props.location));
      if (location.pathname !== AppConfig.pages.sgn.path) {
        if (location.key) {
          delete location.key;
        }
        let search = new URLSearchParams();
        search.set("return", JSON.stringify(location));
        // search.set("securityCheckLogOut", true);
        location = {};
        location.pathname = AppConfig.pages.sgn.path;
        location.search = search.toString();
        setSkipNextAuthCheck(true);

        props.history.push(location);
        return;
      } else {
        setShowSignIn(true);
      }
    } else {
      setShowSignIn(true);
    }
  }
};

// Gateway list API call's on complete handler
const GatewayListOnCompleteHandler = (
  response,
  AppOverlayContext,
  props,
  setSkipNextAuthCheck,
  setIsAppReady,
  instance,
  signedIn,
  AppConfig,
  dispatch,
  recentGatewayIP,
) => {
  let data = [];
  const payload = response.data;
  const [recentGateway] = payload.filter(
    ({ address }) => address === recentGatewayIP,
  );

  if (response.state === "GATEWAY_LIST_SUCESS") {
    data = response.data;

    data = data.map((gw) => {
      let newgw = { ...gw };

      if (typeof newgw.name !== "string") {
        newgw.name = "";
      }

      return newgw;
    });

    let dataLen = data.length;
    if (dataLen !== 0) {
      window.gatewayListData = data;
      AppOverlayContext.setGatewayList(window.gatewayListData);
      // dispatch();
    }

    // Ensure that the selected gateway is online and in the gateway list
    let currGW = window.sessionStorage.getItem("ba-selected-gateway");
    let ind = -1;

    try {
      currGW = JSON.parse(currGW);

      if (typeof currGW.address !== "string") {
        throw new Error("Invalid address detected. Not a string.");
      }
    } catch (error) {
      currGW = null; // Indicate that gateway is not already selected
      window.sessionStorage.removeItem("ba-selected-gateway");
    }

    if (currGW !== null) {
      ind = window.gatewayListData.findIndex(
        (gw) =>
          gw.address === currGW.address &&
          (gw.offline === "false" || gw.offline === false),
      );

      if (ind === -1) {
        window.sessionStorage.removeItem("ba-selected-gateway");
        AppOverlayContext.setSelectedGateway({});
        dispatch(setActiveGateway({}));
      }
    }

    // Find the default gateway's index
    let defGWIndex = -1;
    for (let count = 0; count < dataLen; count += 1) {
      if (data[count].offline === false || data[count].offline === "false") {
        defGWIndex = count;
        break;
      }
    }

    let location = JSON.parse(JSON.stringify(props.location));
    let search = new URLSearchParams(location.search);

    if (
      search.get("gatewaySelection") === "switch" &&
      search.get("forceAdd") === "true"
    ) {
      if (ind === -1 && currGW !== null) {
        alert(
          'Your selected invisigate/controller ("' +
            currGW.address +
            "\") is either offline or no longer available.\nAlso, we couldn't find another online invisigate/controller to connect to.\n\nPlease add or select an online invisigate/controller to continue.",
        );
      }

      setIsAppReady(true);
      return;
    }

    if (defGWIndex === -1) {
      AppOverlayContext.setComponentsShown(
        (comp) => comp.replace(/(,mng-gtw,)|(,mng-gtw$)/, ",") + ",mng-gtw",
      );
      search.set("gatewaySelection", "switch");
      search.set("forceAdd", "true");
      setSkipNextAuthCheck(true);
      location.search = search.toString();

      if (location.key) {
        delete location.key;
      }

      props.history.push(location);
      if (ind === -1 && currGW !== null) {
        alert(
          'Your selected invisigate/controller ("' +
            currGW.address +
            "\") is either offline or no longer available.\nAlso, we couldn't find another online invisigate/controller to connect to.\n\nPlease add or select an online invisigate/controller to continue.",
        );
      } else {
        alert(
          "We couldn't find an online invisigate/controller to connect to.\n\nPlease add or select an online invisigate/controller to continue.",
        );
      }
    } else {
      if (ind === -1) {
        let defGW = {
          name: data[defGWIndex].name,
          address: data[defGWIndex].address,
          checked: true,
        };

        window.sessionStorage.setItem(
          "ba-selected-gateway",
          JSON.stringify(defGW),
        );

        const recentGatewayObject = {
          name: recentGateway?.name ?? defGW.name,
          address: recentGateway?.address ?? defGW.address,
          checked: true,
        };

        AppOverlayContext.setSelectedGateway(recentGatewayObject);
        dispatch(setActiveGateway({ ...recentGatewayObject }));

        if (currGW !== null) {
          alert(
            'Your selected invisigate/controller ("' +
              currGW.address +
              '") is either offline or no longer available.\nWe\'ve selected another online invisigate/controller ("' +
              defGW.address +
              '") for you.\n\nYou may change it by clicking on the "Manage ' +
              common.GATEWAY +
              "/" +
              common.TAC_SERVER +
              '" banner if needed.',
          );
        }
      }
    }

    setIsAppReady(true);
  } else {
    alert(
      "Unable to fetch invisigate/controller list. Please try again.\n\nError Details:\n" +
        Utility.getErrorsFromResponse(response, true),
    );

    throw new Error("Unable to fetch invisigate/controller list.");
  }
};

const Auth = {
  verifyAndRedirect: (
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
    RunEffect,
    dispatch,
    isLoggedOut,
    recentGatewayIP,
  ) => {
    setSkipNextAuthCheck(false);

    if (skipAuthCheck === true) {
      window.isBemAuthCheckInstance = new Date().getTime();
      window.isBemAuthCheckSignedIn =
        props.location.pathname === AppConfig.pages.sgn.path;
      isBemOnCompleteHandler(
        { state: "ISBEM_AUTH_SUCCESSFUL", data: "" },
        callAPI,
        GatewayListAPIResponder,
        AppOverlayContext,
        props,
        setShowSignIn,
        setSkipNextAuthCheck,
        skipAuthCheck,
        AppConfig,
        setIsAppReady,
        window.isBemAuthCheckInstance,
        window.isBemAuthCheckSignedIn,
        RunEffect,
        dispatch,
        isLoggedOut,
        recentGatewayIP,
      );
    } else {
      // Check user's session's auth
      window.isBemAuthCheckInstance = new Date().getTime();
      window.isBemAuthCheckSignedIn =
        props.location.pathname === AppConfig.pages.sgn.path;

      callAPI({
        path: "isBem",
        data: {},
        responder: isBemAPIResponder,
        onComplete: isBemOnCompleteHandler,
        onCompleteArguments: [
          callAPI,
          GatewayListAPIResponder,
          AppOverlayContext,
          props,
          setShowSignIn,
          setSkipNextAuthCheck,
          false,
          AppConfig,
          setIsAppReady,
          window.isBemAuthCheckInstance,
          window.isBemAuthCheckSignedIn,
          RunEffect,
          dispatch,
          isLoggedOut,
          recentGatewayIP,
        ],
      });
    }
  },
  logOut: (
    props,
    AppConfig,
    setShowSignIn,
    AppOverlayContext,
    RunEffect,
    isLoggedOut,
    setRecentGateway,
    isAnyConstraint,
  ) => {
    const [runEffect, setRunEffect] = RunEffect;
    isLoggedOut.current = true;
    clearSession();

    setRecentGateway && setRecentGateway();
    let _location = JSON.parse(JSON.stringify(props.location));

    if (_location.key) {
      delete _location.key;
    }

    let search = new URLSearchParams();

    search.set("return", JSON.stringify(_location));

    if (isAnyConstraint === "user-forced-to-logout") {
      search.set("securityCheckLogOut", true);
    }

    _location = {};

    _location.pathname = AppConfig.pages.sgn.path;
    _location.search = search.toString();

    AppOverlayContext.setSelectedGateway({});

    props.history.push(_location);

    setRunEffect("");
    setShowSignIn(true);
  },
  forcelogOut: (props, AppConfig, AppOverlayContext, setRecentGateway) => {
    clearSession();

    setRecentGateway && setRecentGateway();
    let _location = JSON.parse(JSON.stringify(props.location));

    if (_location.key) {
      delete _location.key;
    }

    let search = new URLSearchParams();

    search.set("return", JSON.stringify(_location));

    _location = {};

    _location.pathname = AppConfig.pages.sgn.path;
    _location.search = search.toString();

    AppOverlayContext.setSelectedGateway({});

    props.history.push(_location);
    document.location.reload();
  },
};

export default Auth;
