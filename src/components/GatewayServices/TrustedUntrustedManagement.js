import { Box, Divider, Typography, withStyles } from "@material-ui/core";
import ToolTip from "../../utils/Tooltip/Tooltip";
import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { withCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { usePortalState } from "../../../src/Portal/hooks/usePortalState";
import callAPI from "../../apis/callAPI";
import { ActivationConfigAPIResponder } from "../../apis/responders/activation-config-api-responder";
import { DistributedIdentitiesAPIResponder } from "../../apis/responders/distributed-identities-api-responder";
import {
  GatewayServicesAPIResponder,
  modifyServiceResponder,
} from "../../apis/responders/gateway-services-api-responder";
import {
  GatewayServicesByNameAPIResponder,
  modifyServiceByNameResponder,
} from "../../apis/responders/gateway-services-by-name-api-responder";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import { pubsubAPIResponder } from "../../apis/responders/pubsubAPIResponder";
import { RksAddressAPIResponder } from "../../apis/responders/rks-address-api-resonder";
import { TrustedAPIResponder } from "../../apis/responders/trusted-api-responder";
import { GetNTPResponder } from "../../apis/responders/GetNTPResponder";
import Config from "../../Config";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import ErrorLogo from "../../images/page_error_v2.svg";
import Auth from "../../redux/actions/Auth";
import Utility from "../../redux/actions/Utility";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import Switch from "../General/Switch";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import { ContextToggle } from "./ComponentsGatewayServices/ContextToggle";
import NetworkTimeTable from "./ComponentsGatewayServices/NetworkTimeTable";
import Pub from "./ComponentsGatewayServices/Pub";
import PubSubPopup from "./ComponentsGatewayServices/PubSubPopup";
import SecureShell from "./ComponentsGatewayServices/SecureShell";
import Syslog from "./ComponentsGatewayServices/Syslog";
import { Styled } from "./GatewayserviceStyling/trusteduntrustedManagement.style";
import IdentitiesPopup from "./IdentitiesPopup";
import RemoteKeyPopup from "./RemoteKeyPopup";
import UntrustedPopup from "./UntrustedPopup";
import AlertDialogGw from "./Utils/AlertDialogGw";
import { gatewayServices } from "../../utils/GeneralComponentNames";
import { GlobalModal } from "../../style/Card/Modal";
import Style from "../../style";
import styled from "styled-components";
import DisplaySettingsRounded from "@mui/icons-material/DisplaySettingsRounded";
import NetworkTImeComponent from "./NetworkTImeComponent";
import { InfoCircle } from "react-bootstrap-icons";
import ToolerTip from "../IFVDataGrid/styled-materials/ToolerTip";
import { useTranslation } from "react-i18next";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#8fdc6a",
        border: "1px solid rgba(0,0,0,.25)",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: "1px solid rgba(0,0,0,.25)",
    borderRadius: "2rem",
    opacity: 1,
    backgroundColor: "#C1C4CE",
  },
  checked: false,
}))(Switch);

/* INITIAL VARIABLES STATES */
const initAlertContent = {
  contentTitle: "",
  contentText: "",
  contentInfo: "",
  callback: () => {},
};

const initRebootPrompt = {
  show: false,
  title: "",
  content: <></>,
  agree: { name: <></>, args: [], handler: () => {} },
  disagree: { name: <></>, args: [], handler: () => {} },
};

const remoteKeyAgent = "rkagent";
const distributedIdentities = "DistIdent";
const distributedIdentitiesTAC = "DistIdent";
const publisherSubscriber = "PubSub";
const restApi = "RestAPI";
const secureShell = "ssh";
const sysLog = "RemoteSyslog";
const networkTimeProtocol = "ntp";

const initDistIdentConfig = {
  alg: "",
  groups: [],
  timeout: 0,
  tcp_ident_tag: 0,
};

const TrustedUntrustedManagement = (props) => {
  const { t, i18n } = useTranslation();

  const trustedRef = useRef();
  const unTrustedRef = useRef();

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const { activationConfig } = useContext(OverlayContext);

  const { gatewayConfig, activeGateway } = useSelector((state) => state);

  const [portalState, setPortalState] = usePortalState();
  const [runEffect, setRunEffect] = useState("initPage");
  const [runEffect1, setRunEffect1] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);
  const [selectedContextValue, setSelectedContextValue] = useState("bump0");
  const [chassis, setChassis] = useState("");
  const [rksAddressData, setRksAddressDataData] = useState({
    id: 0,
    rkservice: "not configured",
    pk_file: "",
    cert_file: "",
    ca_file: "",
  });
  const [pubSubApiData, setPubSubApiData] = useState({
    enable: 0,
    id: 0,
    publisherRunning: 0,
    publisherip: "not configured",
    subscriberRunning: 0,
  });

  const [activationConfigData, setActivationConfigData] = useState({});
  const [gatewayServicesData, setGatewayServicesData] = useState([]);
  const [gatewayServiceByNameData, setGatewayServiceByNameData] = useState([]);
  const [syslog, setSyslog] = useState({});
  const [syslogChecked, setSysLogChecked] = useState(false);
  const [distidentChecked, setDistidentChecked] = useState(false);
  const [distidentCheckedTAC, setDistidentCheckedTAC] = useState(false);
  const [distIdentData, setDistIdentData] = useState({});
  const [distIdentDataTAC, setDistIdentDataTAC] = useState({});
  const [distIdentConfig, setDistIdentConfig] = useState(initDistIdentConfig);
  const [distIdentConfigTemp, setDistIdentConfigTemp] =
    useState(initDistIdentConfig);
  const [pubsubData, setPubSubData] = useState({});
  const [pubsubChecked, setpubSubChecked] = useState(false);
  const [rksServiceData, setRksServiceData] = useState({});
  const [rkserviceChecked, setRkserviceChecked] = useState(false);
  const [ssd, setSSD] = useState({});
  const [ssdChecked, setSSDChecked] = useState(false);
  const [restAPI, setRestAPI] = useState({});
  const [isRestApiChecked, setIsRestApiChecked] = useState(false);
  const [ntpAPI, setNtpAPI] = useState({});
  const [isNtpChecked, setIsNtpChecked] = useState(false);
  const [radioNTPChecked, setRadioNTPChecked] = useState(false);
  const [ntpData, setNtpData] = useState([]);
  const [trusted, setTrusted] = useState(true);
  const [trustedToggle, setTrustedToggle] = useState(false);
  const [trustedChecked, setTrustedChecked] = useState(false);
  const [unTrustedToggle, setUnTrustedToggle] = useState(false);
  const [untrustedChecked, setUntrustedChecked] = useState(false);
  const [radioIasChecked, setRadioIasChecked] = useState(false);
  const [radioRksChecked, setRadioRksChecked] = useState(false);
  const [radioDistIdentChecked, setRadioDistIdentChecked] = useState(false);
  const [radioDistIdentCheckedTAC, setRadioDistIdentCheckedTAC] =
    useState(false);
  const [radioTrustedChecked, setRadioTrustedChecked] = useState(false);
  const [radioUnTrustedChecked, setRadioUnTrustedChecked] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertContent, setAlertContent] = useState(initAlertContent);
  const [errorContext, setErrorContext] = useState(null);
  const [flagErr, setFlagErr] = useState(null);
  const [rebootPrompt, setRebootPrompt] = useState(initRebootPrompt);
  const [contextFailed, setContextFailed] = useState(false);
  const [display, setDisplay] = useState(false);
  const [postEffects, setPostEffects] = useState(true);
  const [postEffectsBump0, setPostEffectsBump0] = useState(true);
  const [initialResponse, setInitialResponse] = useState({});
  const [initialResponseBump0, setInitialResponseBump0] = useState({});
  const [initialRk, setInitialRk] = useState("");

  const gatewayIP = activeGateway.address;

  const handleContextToggle = (event) => {
    setSelectedContextValue(event.target.value);
    setRunEffect("initPageAgain");
  };

  useEffect(() => {
    if (
      gatewayConfig.chassis_model === "5010" ||
      gatewayConfig.chassis_model === "2010"
    ) {
      setChassis("run");
    }
    return () => {
      "";
    };
  }, [gatewayConfig]);

  const openModel = () => {
    setDisplay(true);
  };

  const handleClosePortalnoBackdrop = () => {
    setDisplay(false);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    const callback = alertContent?.callback ?? undefined;
    callback && callback();
  };

  const toggleTrustedPopup = () => {
    setTrustedToggle(!trustedToggle);
  };

  const toggleUnTrustedPopup = () => {
    setUnTrustedToggle(!unTrustedToggle);
  };

  useEffect(() => {
    if (window.innerWidth <= 1024 && trustedToggle) {
      trustedRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (window.innerWidth <= 1024 && unTrustedToggle) {
      unTrustedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [trustedToggle, unTrustedToggle]);

  const handleChangeTrustedToggle = (event) => {
    setTrustedToggle(!trustedToggle);
  };

  const handleChangeUntrustedToggle = (event) => {
    setUnTrustedToggle(!unTrustedToggle);
  };

  const onCompleteGetNTPs = (response) => {
    setLoading(false);
    response.state === "GETNTP_SUCESS" && setNtpData(response.data);
  };

  const networkCall = () => {
    setDisplay(true);
    callAPI({
      path: "getNTPs",
      params: { gatewayIP },
      data: {},
      responder: GetNTPResponder,
      onComplete: onCompleteGetNTPs,
    });

    setLoading(true);
  };

  const GatewayServicesIASRadioOnCompleteHandler = (response, text) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setRadioIasChecked(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.restApi.toggle.prompt.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.restApi.toggle.prompt.success.message`,
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setIsRestApiChecked((prev) => !prev);
      setRadioIasChecked(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.restApi.toggle.prompt.error.title`,
        ),
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.restApi.toggle.prompt.error.message.0`,
              {
                text,
              },
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.restApi.toggle.prompt.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });

      setOpenAlertDialog(true);
    }
  };

  const GatewayServicesNTPRadioOnCompleteHandler = (response, text) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setRadioNTPChecked(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.networkTimeProtocol.toggle.prompt.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.networkTimeProtocol.toggle.prompt.success.message`,
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setIsNtpChecked((prev) => !prev);
      setRadioNTPChecked(false);
      setAlertContent({
        contentTitle: `${t(
          `page.gatewayServer.services.context.networkTimeProtocol.toggle.prompt.error.title`,
        )}..!`,
        contentText: (
          <>
            {
              (t(
                `page.gatewayServer.services.context.networkTimeProtocol.toggle.prompt.error.message.0`,
              ),
              { text })
            }
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.networkTimeProtocol.toggle.prompt.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });

      setOpenAlertDialog(true);
    }
  };

  const GatewayServicesRemoteKeyRadioOnCompleteHandler = (
    response,
    text = "Toggling",
  ) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setRadioRksChecked(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.remoteKeyAgent.toggle.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.remoteKeyAgent.toggle.success.message`,
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setRkserviceChecked((prev) => !prev);
      setRadioRksChecked(false);
      setAlertContent({
        contentTitle: `${t(
          `page.gatewayServer.services.context.remoteKeyAgent.toggle.error.title`,
        )}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.toggle.error.message.0`,
              {
                text,
              },
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.toggle.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    }
  };

  const GatewayServicesDistIdentRadioOnCompleteHandler = (
    response,
    text = "Toggling",
  ) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setRadioDistIdentChecked(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.success.message`,
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setDistidentChecked((prev) => !prev);
      setRadioDistIdentChecked(false);
      setAlertContent({
        contentTitle: `${t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.error.title`,
        )}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.distributedIdentities.toggle.error.message.0`,
              {
                text,
              },
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.distributedIdentities.toggle.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    }
  };

  const GatewayServiceByNameDistIdentRadioOnCompleteHandler = (
    response,
    text = "Toggling",
  ) => {
    if (response.state === "GATEWAY_SERVICES_BY_NAME_SUCCESS") {
      setRadioDistIdentCheckedTAC(false);
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.success.message`,
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setDistidentCheckedTAC((prev) => !prev);
      setRadioDistIdentCheckedTAC(false);
      setAlertContent({
        contentTitle: `${t(
          `page.gatewayServer.services.context.distributedIdentities.toggle.error.title`,
        )}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.distributedIdentities.toggle.error.message.0`,
              {
                text,
              },
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.distributedIdentities.toggle.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    }
  };

  const trustedInrefaceOnCompleteHandler = useCallback(
    (response, text = "toggling") => {
      if (response.state === "SET_TRUSTED_SUCESS") {
        setRadioTrustedChecked(false);
        AppOverlayContext.setActivationConfig({
          ut_vlan: activationConfig.ut_vlan,
          ut_ip4: activationConfig.ut_ip4,
          ut_gw4: activationConfig.ut_gw4,
          ut_ip6: activationConfig.ut_ip6,
          ut_gw6: activationConfig.ut_gw6,
          ut_enable: activationConfig.ut_enable,
          tr_vlan: activationConfig.tr_vlan,
          tr_ip4: activationConfig.tr_ip4,
          tr_gw4: activationConfig.tr_gw4,
          tr_ip6: activationConfig.tr_ip6,
          tr_gw6: activationConfig.tr_gw6,
          tr_enable: trustedChecked ? 0 : 1,
          ca_not_after: activationConfig.ca_not_after,
          gw_not_after: activationConfig.gw_not_after,
        });
        setRunEffect("logoutFromSession");
      } else if (response.state === "SET_TRUSTED_FAILURE") {
        setTrustedChecked((prev) => !prev);
        setRadioTrustedChecked(false);
        setAlertContent({
          contentTitle: `${t(
            `page.gatewayServer.services.trustedInterface.prompt.error.title`,
          )}..!`,
          contentText: (
            <>
              {t(
                `page.gatewayServer.services.trustedInterface.prompt.error.message.0`,
                { text },
              )}
              <br />
              <br />
              {t(
                `page.gatewayServer.services.trustedInterface.prompt.error.message.1`,
              )}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </>
          ),
          contentInfo: "",
        });
        setOpenAlertDialog(true);
      }
    },
    [AppOverlayContext, activationConfig, trustedChecked],
  );

  const unTrustedInrefaceOnCompleteHandler = useCallback(
    (response, text = "toggling") => {
      if (response.state === "SET_TRUSTED_SUCESS") {
        setRadioUnTrustedChecked(false);
        AppOverlayContext.setActivationConfig({
          ut_vlan: activationConfig.ut_vlan,
          ut_ip4: activationConfig.ut_ip4,
          ut_gw4: activationConfig.ut_gw4,
          ut_ip6: activationConfig.ut_ip6,
          ut_gw6: activationConfig.ut_gw6,
          ut_enable: untrustedChecked ? 0 : 1,
          tr_vlan: activationConfig.tr_vlan,
          tr_ip4: activationConfig.tr_ip4,
          tr_gw4: activationConfig.tr_gw4,
          tr_ip6: activationConfig.tr_ip6,
          tr_gw6: activationConfig.tr_gw6,
          tr_enable: activationConfig.tr_enable,
          ca_not_after: activationConfig.ca_not_after,
          gw_not_after: activationConfig.gw_not_after,
        });

        setRunEffect("logoutFromSession");
      } else if (response.state === "SET_TRUSTED_FAILURE") {
        setUntrustedChecked((prev) => !prev);
        setRadioUnTrustedChecked(false);
        setAlertContent({
          contentTitle: `${t(
            `page.gatewayServer.services.untrustedInterface.prompt.error.title`,
          )}..!`,
          contentText: (
            <>
              {t(
                `page.gatewayServer.services.untrustedInterface.prompt.error.message.0`,
                { text },
              )}
              <br />
              <br />
              {t(
                `page.gatewayServer.services.untrustedInterface.prompt.error.message.1`,
              )}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </>
          ),
          contentInfo: "",
        });
        setOpenAlertDialog(true);
      }
    },
    [AppOverlayContext, activationConfig, untrustedChecked],
  );

  const toggleRadio = (event, value) => {
    if (value === "RestAPI") {
      setIsRestApiChecked((prev) => !prev);
      setRadioIasChecked(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name: selectedContextValue,
          ui_name: restAPI.ui_name,
          svc_name: restAPI.svc_name,
          ns_code: restAPI.ns_code,
          enable: isRestApiChecked ? 0 : 1,
          state: restAPI.state,
          svc_type: restAPI.svc_type,
          config_chg: restAPI.config_chg,
          service: restAPI.service,
          id: restAPI.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [
          isRestApiChecked
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: GatewayServicesIASRadioOnCompleteHandler,
      });
    }

    if (value === "ntp") {
      setIsNtpChecked((prev) => !prev);
      setRadioNTPChecked(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name: selectedContextValue,
          ui_name: ntpAPI.ui_name,
          svc_name: ntpAPI.svc_name,
          ns_code: ntpAPI.ns_code,
          enable: isNtpChecked ? 0 : 1,
          state: ntpAPI.state,
          svc_type: ntpAPI.svc_type,
          config_chg: ntpAPI.config_chg,
          service: ntpAPI.service,
          id: ntpAPI.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [
          isNtpChecked ? t(`commons.disablingText`) : t(`commons.enablingText`),
        ],
        onComplete: GatewayServicesNTPRadioOnCompleteHandler,
      });
    }

    if (value === "RKS") {
      setRkserviceChecked((prev) => !prev);
      setRadioRksChecked(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name: selectedContextValue,
          ui_name: rksServiceData.ui_name,
          svc_name: rksServiceData.svc_name,
          ns_code: rksServiceData.ns_code,
          enable: rkserviceChecked ? 0 : 1,
          state: rksServiceData.state,
          svc_type: rksServiceData.svc_type,
          config_chg: rksServiceData.config_chg,
          service: rksServiceData.service,
          id: rksServiceData.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [
          rkserviceChecked
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: GatewayServicesRemoteKeyRadioOnCompleteHandler,
      });
    }

    if (value === "DIST_IDENT") {
      setDistidentChecked((prev) => !prev);
      setRadioDistIdentChecked(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
          ui_name: distIdentData.ui_name,
          svc_name: distIdentData.svc_name,
          ns_code: distIdentData.ns_code,
          enable: distidentChecked ? 0 : 1,
          state: distIdentData.state,
          svc_type: distIdentData.svc_type,
          config_chg: distIdentData.config_chg,
          service: distIdentData.service,
          id: distIdentData.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [
          distidentChecked
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: GatewayServicesDistIdentRadioOnCompleteHandler,
      });
    }

    if (value === "DIST_IDENT_TAC") {
      setDistidentCheckedTAC((prev) => !prev);
      setRadioDistIdentCheckedTAC(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name: "bump0",
          ui_name: distIdentDataTAC.ui_name,
          svc_name: distIdentDataTAC.svc_name,
          ns_code: distIdentDataTAC.ns_code,
          enable: distidentCheckedTAC ? 0 : 1,
          state: distIdentDataTAC.state,
          svc_type: distIdentDataTAC.svc_type,
          config_chg: distIdentDataTAC.config_chg,
          service: distIdentDataTAC.service,
          id: distIdentDataTAC.id,
        },
        responder: modifyServiceByNameResponder,
        onCompleteArguments: [
          distidentCheckedTAC
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: GatewayServiceByNameDistIdentRadioOnCompleteHandler,
      });
    }

    if (value === "TRUSTED") {
      setTrustedChecked((prev) => !prev);
      setRadioTrustedChecked(true);
      setRebootPrompt({
        show: true,
        title: t(`page.gatewayServer.services.prompt.title`),
        content: <>{t(`page.gatewayServer.services.prompt.message`)}</>,
        agree: {
          name: <>{t(`commons.okayText`)}</>,
          args: [],
          handler: () => {
            setRunEffect("switchTrustedToggle");
            setRebootPrompt(initRebootPrompt);
          },
        },
        disagree: {
          name: <>{t(`commons.cancelText`)}</>,
          args: [],
          handler: () => {
            setRunEffect("");
            setRebootPrompt(initRebootPrompt);
            setTrustedChecked((prev) => !prev);
            setRadioTrustedChecked(false);
          },
        },
      });
    }

    if (value === "UNTRUSTED") {
      setUntrustedChecked((prev) => !prev);
      setRadioUnTrustedChecked(true);
      setRebootPrompt({
        show: true,
        title: t(`page.gatewayServer.services.prompt.title`),
        content: <>{t(`page.gatewayServer.services.prompt.message`)}</>,
        agree: {
          name: <>{t(`commons.okayText`)}</>,
          args: [],
          handler: () => {
            setRunEffect("switchUntrustedToggle");
            setRebootPrompt(initRebootPrompt);
          },
        },
        disagree: {
          name: <>{t(`commons.cancelText`)}</>,
          args: [],
          handler: () => {
            setRunEffect("");
            setRebootPrompt(initRebootPrompt);
            setUntrustedChecked((prev) => !prev);
            setRadioUnTrustedChecked(false);
          },
        },
      });
    }
  };

  const DistributedIdentitiesOnCompleteHandler = useCallback(
    (response) => {
      setLoadingContext(false);
      setLoading(false);
      if (
        response.state === "DISTRIBUTED_IDENTITIES_SUCESS" &&
        response.data !== ""
      ) {
        setDistIdentConfig(response.data);
        setDistIdentConfigTemp(response.data);
      }
    },
    [AppOverlayContext],
  );

  const GatewayServicesOnCompleteHandler = useCallback((response) => {
    const payload = response.data;

    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      const filterPayload = (UI_NAME) => {
        const [result] = payload.filter(
          (service) => service.ui_name === UI_NAME,
        );

        return result;
      };

      const filterToggleStatus = (UI_NAME) => {
        const [result] = payload.filter(
          (service) => service.ui_name === UI_NAME,
        );

        return Boolean(result?.enable ?? 0);
      };

      setGatewayServicesData(payload);

      setSyslog(filterPayload(sysLog));
      setDistIdentData(filterPayload(distributedIdentities));
      setPubSubData(filterPayload(publisherSubscriber));
      setRksServiceData(filterPayload(remoteKeyAgent));
      setSSD(filterPayload(secureShell));
      setRestAPI(filterPayload(restApi));
      setNtpAPI(filterPayload(networkTimeProtocol));

      setSysLogChecked(filterToggleStatus(sysLog));
      setDistidentChecked(filterToggleStatus(distributedIdentities));
      setpubSubChecked(filterToggleStatus(publisherSubscriber));
      setRkserviceChecked(filterToggleStatus(remoteKeyAgent));
      setSSDChecked(filterToggleStatus(secureShell));
      setIsRestApiChecked(filterToggleStatus(restApi));
      setIsNtpChecked(filterToggleStatus(networkTimeProtocol));
    } else {
      setFlagErr(true);
      setErrorContext(() => (
        <>
          <p style={{ textAlign: "center" }}>
            {t(
              `page.gatewayServer.services.context.toggle.prompt.error.message`,
            )}
          </p>
          {Utility.getErrorsFromResponse(response)}
        </>
      ));

      setLoadingContext(false);
    }
  }, []);

  const GatewayServiceByNameOnCompleteHandler = useCallback((response) => {
    const payload = response.data;

    if (response.state === "GATEWAY_SERVICES_BY_NAME_SUCCESS") {
      const filterPayload = (UI_NAME) => {
        const [result] = payload.filter(
          (service) => service.ui_name === UI_NAME,
        );

        return result;
      };

      const filterToggleStatus = (UI_NAME) => {
        const [result] = payload.filter(
          (service) => service.ui_name === UI_NAME,
        );
        return Boolean(result?.enable ?? 0);
      };
      setGatewayServiceByNameData(payload);
      setDistIdentDataTAC(filterPayload(distributedIdentitiesTAC));
      setDistidentCheckedTAC(filterToggleStatus(distributedIdentitiesTAC));
    } else {
      setFlagErr(true);
      setErrorContext(() => (
        <>
          <p style={{ textAlign: "center" }}>
            {t(
              `page.gatewayServer.services.context.toggle.prompt.error.message`,
            )}
          </p>
          {Utility.getErrorsFromResponse(response)}
        </>
      ));
      setLoadingContext(false);
    }
  }, []);

  const ActivationConfigOnCompleteHandler = useCallback(
    (response) => {
      let data = response.data ?? [];
      setLoadingContext(false);

      if (
        response.state === "ACTIVATION_CONFIG_SUCESS" &&
        response.data !== ""
      ) {
        AppOverlayContext.setActivationConfig(data);
        setTrustedChecked(data?.tr_enable === 1);
        setUntrustedChecked(data?.ut_enable === 1);
      }
    },
    [AppOverlayContext],
  );

  const RksAddressOnCompleteHandler = useCallback(
    (response) => {
      let data = response.data ?? {};
      data.rkservice =
        data.rkservice === "not Configured" ? "" : data.rkservice;
      setLoadingContext(false);

      if (response.state === "RKS_ADDRESS_SUCESS" && response.data !== "") {
        setLoading(false);
        setRksAddressDataData(data);
        AppOverlayContext.setRskAddress({ dataRk: data });
      }
    },
    [AppOverlayContext],
  );

  const PubsubOnCompleteHandler = (response) => {
    let data = response.data ?? {};
    data.publisherip =
      data.publisherip === "not configured" ? "" : data.publisherip;
    setLoadingContext(false);

    if (response.state === "PUBSUB_ADDRESS_SUCESS" && response.data !== "") {
      setLoading(false);
      setPubSubApiData(data);
    }
  };

  const onCompleterksaddress = (response) => {
    let data = response.data ?? [];
    setLoading(false);

    if (response.state === "RKS_ADDRESS_SUCESS" && response.data !== "") {
      setRksAddressDataData(response.data);

      AppOverlayContext.setRskAddress({ dataRk: data });
    } else {
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.error.title`,
        ),
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.prompt.error.message.0`,
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.prompt.error.message.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    }
  };

  useEffect(() => {
    if (runEffect === "switchTrustedToggle") {
      callAPI({
        path: "setActivationService",
        params: { gatewayIP },
        data: {
          tr_vlan: activationConfig.tr_vlan,
          tr_ip4: activationConfig.tr_ip4,
          tr_gw4: activationConfig.tr_gw4,
          tr_ip6: activationConfig.tr_ip6,
          tr_gw6: activationConfig.tr_gw6,
          tr_enable: trustedChecked ? 1 : 0,
          ut_vlan: activationConfig.ut_vlan,
          ut_ip4: activationConfig.ut_ip4,
          ut_gw4: activationConfig.ut_gw4,
          ut_ip6: activationConfig.ut_ip6,
          ut_gw6: activationConfig.ut_gw6,
          ut_enable: activationConfig.ut_enable,
          ca_not_after: activationConfig.ca_not_after,
          gw_not_after: activationConfig.gw_not_after,
        },
        responder: TrustedAPIResponder,
        onCompleteArguments: [
          trustedChecked
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: trustedInrefaceOnCompleteHandler,
      });
    }

    setRunEffect("");
  }, [
    activationConfig,
    gatewayIP,
    runEffect,
    trustedChecked,
    trustedInrefaceOnCompleteHandler,
  ]);

  useEffect(() => {
    if (runEffect === "switchUntrustedToggle") {
      callAPI({
        path: "setActivationService",
        params: { gatewayIP },
        data: {
          ut_vlan: activationConfig.ut_vlan,
          ut_ip4: activationConfig.ut_ip4,
          ut_gw4: activationConfig.ut_gw4,
          ut_ip6: activationConfig.ut_ip6,
          ut_gw6: activationConfig.ut_gw6,
          ut_enable: untrustedChecked ? 1 : 0,
          tr_vlan: activationConfig.tr_vlan,
          tr_ip4: activationConfig.tr_ip4,
          tr_gw4: activationConfig.tr_gw4,
          tr_ip6: activationConfig.tr_ip6,
          tr_gw6: activationConfig.tr_gw6,
          tr_enable: activationConfig.tr_enable,
          ca_not_after: activationConfig.ca_not_after,
          gw_not_after: activationConfig.gw_not_after,
        },
        responder: TrustedAPIResponder,
        onCompleteArguments: [
          untrustedChecked
            ? t(`commons.disablingText`)
            : t(`commons.enablingText`),
        ],
        onComplete: unTrustedInrefaceOnCompleteHandler,
      });
    }

    setRunEffect("");
  }, [
    activationConfig,
    gatewayIP,
    runEffect,
    trustedChecked,
    trustedInrefaceOnCompleteHandler,
    unTrustedInrefaceOnCompleteHandler,
    untrustedChecked,
    loadingContext,
  ]);

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
    }

    setRunEffect("");
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
    const isRule = runEffect === "initPage" || runEffect === "initPageAgain";

    if (isRule && gatewayConfig.chassis_model !== "XXXX") {
      setLoadingContext(true);

      callAPI({
        path: "activationConfig",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: ActivationConfigAPIResponder,
        onComplete: ActivationConfigOnCompleteHandler,
      });

      callAPI({
        path: "gatewayServies",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: GatewayServicesAPIResponder,
        onComplete: GatewayServicesOnCompleteHandler,
      });

      if (gatewayConfig.chassis_model !== "5010") {
        callAPI({
          path: "rksaddress",
          params: {
            gatewayIP,
            context:
              gatewayConfig.chassis_model === "5010"
                ? "mgt"
                : selectedContextValue,
          },
          data: {},
          responder: RksAddressAPIResponder,
          onComplete: RksAddressOnCompleteHandler,
        });
      }

      callAPI({
        path: "pubsubApi",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: pubsubAPIResponder,
        onComplete: PubsubOnCompleteHandler,
      });

      callAPI({
        path: "distributedIdentities",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: DistributedIdentitiesAPIResponder,
        onComplete: (response) => {
          if (
            gatewayConfig.chassis_model === "5010" &&
            selectedContextValue === "bump0" &&
            runEffect1 === "DistributedBump0"
          ) {
            setInitialResponseBump0(response);
            setTimeout(() => setPostEffectsBump0(true), 0);
          } else {
            setInitialResponse(response);
            setTimeout(() => setPostEffects(true), 0);
          }
        },
      });
    } else if (chassis == "run") {
      callAPI({
        path: "activationConfig",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: ActivationConfigAPIResponder,
        onComplete: ActivationConfigOnCompleteHandler,
      });

      callAPI({
        path: "gatewayServies",
        params: {
          gatewayIP,
          context:
            gatewayConfig.chassis_model === "5010"
              ? "mgt"
              : selectedContextValue,
        },
        data: {},
        responder: GatewayServicesAPIResponder,
        onComplete: GatewayServicesOnCompleteHandler,
      });

      if (gatewayConfig.chassis_model !== "5010") {
        callAPI({
          path: "rksaddress",
          params: { gatewayIP, context: selectedContextValue },
          data: {},
          responder: RksAddressAPIResponder,
          onComplete: RksAddressOnCompleteHandler,
        });
      }

      callAPI({
        path: "pubsubApi",
        params: { gatewayIP, context: selectedContextValue },
        data: {},
        responder: pubsubAPIResponder,
        onComplete: PubsubOnCompleteHandler,
      });

      callAPI({
        path: "distributedIdentities",
        params: { gatewayIP, context: selectedContextValue },
        data: {},
        responder: DistributedIdentitiesAPIResponder,
        onComplete: (response) => {
          if (
            gatewayConfig.chassis_model === "5010" &&
            selectedContextValue === "bump0" &&
            runEffect1 === "DistributedBump0"
          ) {
            setInitialResponseBump0(response);
            setTimeout(() => setPostEffectsBump0(true), 0);
          } else {
            setInitialResponse(response);
            setTimeout(() => setPostEffects(true), 0);
          }
        },
      });
    }
    setRunEffect("");
    setChassis("");
  }, [
    ActivationConfigOnCompleteHandler,
    DistributedIdentitiesOnCompleteHandler,
    GatewayServicesOnCompleteHandler,
    RksAddressOnCompleteHandler,
    gatewayIP,
    runEffect,
    selectedContextValue,
    chassis,
  ]);

  useEffect(() => {
    if (gatewayConfig.chassis_model === "5010") {
      callAPI({
        path: "distributedIdentities",
        params: { gatewayIP, context: "bump0" },
        data: {},
        responder: DistributedIdentitiesAPIResponder,
        onComplete: (response) => {
          setInitialResponseBump0(response);
          setTimeout(() => setPostEffectsBump0(true), 0);
        },
      });
    }
  }, [gatewayConfig.chassis_model, gatewayIP]);

  useEffect(() => {
    if (gatewayConfig.chassis_model === "5010") {
      setSelectedContextValue("mgt");
      callAPI({
        path: "getGatewayServiceByName",
        params: { gatewayIP, context: selectedContextValue, name: "DistIdent" },
        data: {},
        responder: GatewayServicesByNameAPIResponder,
        onComplete: GatewayServiceByNameOnCompleteHandler,
      });
    }
  }, [
    GatewayServiceByNameOnCompleteHandler,
    gatewayConfig.chassis_model,
    gatewayIP,
  ]);

  const tac =
    gatewayConfig.chassis_model === "XXXX" ||
    gatewayConfig.chassis_model === "5010";

  const bump0Name = `${t(
    "page.gatewayServer.services.context.distributedIdentities.text",
  )} [bump0]`;
  const mgtName = `${t(
    "page.gatewayServer.services.context.distributedIdentities.text",
  )} [mgt]`;

  return (
    <>
      <Styled.StyledContainer component={"section"}>
        <AppInContentHeader
          title={AppConfig.pages.tum.title}
          breadcrumb={AppConfig.pages.tum.breadcrumb}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#eff2f7",
            margin: "1em 1em",
            border: "1px solid #e0e0e0",
          }}
        >
          <>
            <ContextToggle
              toggleTitle={`${t(`page.gatewayServer.services.context.text`)}: `}
              selectedValue={tac ? "mgt" : selectedContextValue}
              handleChange={handleContextToggle}
              isSwitchDisabled={
                loadingContext || openAlertDialog || contextFailed
              }
            />
            {gatewayConfig.chassis_model === "XXXX" ? (
              <WidthFillerSkeleton animation="wave" />
            ) : (
              <>
                {loadingContext ? (
                  <WidthFillerSkeleton animation="wave" />
                ) : (
                  <>
                    {flagErr ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "auto",
                          height: "300px",
                        }}
                      >
                        <Box>
                          <Styled.StyledImages style={{ margin: "1rem 0" }}>
                            <Styled.StyledErrorLogo
                              src={ErrorLogo}
                              alt={t("commons.errorText")}
                              width={"100"}
                            />
                          </Styled.StyledImages>

                          <Typography
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: "600",
                              color: "tomato",
                            }}
                          >
                            {errorContext}
                          </Typography>
                        </Box>
                      </div>
                    ) : (
                      <StyledParent>
                        <StyledCompdivLeft>
                          {gatewayConfig.chassis_model === "5010" ? (
                            <div
                              style={{
                                background: "",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  background: "",
                                  width: "45%",
                                  display: "flex",
                                  alignItems: "center",
                                  paddingLeft: "1em",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontWeight: "600",
                                  }}
                                >
                                  {bump0Name}
                                </Typography>
                              </div>

                              <div
                                style={{
                                  background: "",
                                  width: "60%",
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                                container
                                item
                                xs={6}
                                direction="row"
                              >
                                <div
                                  style={{
                                    width: "40%",
                                    background: "",
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Styled.Spinner
                                    style={{
                                      visibility: radioDistIdentCheckedTAC
                                        ? "visible"
                                        : "hidden",
                                      marginLeft: "3em",
                                      width: "20px",
                                      height: "20px",
                                    }}
                                  />

                                  <Typography
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "0.8rem",
                                      color:
                                        radioDistIdentCheckedTAC ||
                                        (initialResponseBump0?.data?.timeout ===
                                          0 &&
                                          !!initialResponseBump0?.data?.groups
                                            ?.length === false &&
                                          (initialResponseBump0?.data
                                            ?.tcp_ident_tag !== 1 ||
                                            initialResponseBump0?.data
                                              ?.tcp_ident_tag !== 2) &&
                                          !!!initialResponseBump0?.data?.alg) ||
                                        initialResponseBump0?.data?.alg ===
                                          "not configured" ||
                                        initialResponseBump0?.data
                                          ?.tcp_ident_tag === "not configured"
                                          ? "#6c757d"
                                          : "black",
                                    }}
                                  >
                                    {distidentCheckedTAC
                                      ? radioDistIdentCheckedTAC
                                        ? `${t("commons.enablingText")}...`
                                        : `${t("commons.enabledText")}`
                                      : radioDistIdentCheckedTAC
                                      ? `${t("commons.disablingText")}...`
                                      : `${t("commons.disabledText")}`}
                                  </Typography>

                                  <ToolTip
                                    id={`${gatewayServices}-distributed-identities-tac-tooltip`}
                                    label={
                                      (initialResponseBump0?.data?.timeout ===
                                        0 &&
                                        !!initialResponseBump0?.data?.groups
                                          ?.length === false &&
                                        (initialResponseBump0?.data
                                          ?.tcp_ident_tag !== 1 ||
                                          initialResponseBump0?.data
                                            ?.tcp_ident_tag !== 2) &&
                                        !!!initialResponseBump0?.data?.alg) ||
                                      initialResponseBump0?.data?.alg ===
                                        "not configured" ||
                                      initialResponseBump0?.data
                                        ?.tcp_ident_tag === "not configured"
                                        ? `${t(
                                            `page.gatewayServer.services.context.distributedIdentities.tooltip`,
                                          )} [ BUMP0 ]`
                                        : ""
                                    }
                                  >
                                    <span>
                                      <AntSwitch
                                        id={`${gatewayServices}-distributed-identities-tac-toggle`}
                                        disabled={
                                          radioDistIdentCheckedTAC ||
                                          (initialResponseBump0?.data
                                            ?.timeout === 0 &&
                                            !initialResponseBump0?.data?.groups
                                              ?.length &&
                                            (initialResponseBump0?.data
                                              ?.tcp_ident_tag !== 1 ||
                                              initialResponseBump0?.data
                                                ?.tcp_ident_tag !== 2) &&
                                            !!!initialResponseBump0?.data
                                              ?.alg) ||
                                          initialResponseBump0?.data?.alg ===
                                            "not configured" ||
                                          initialResponseBump0?.data
                                            ?.tcp_ident_tag === "not configured"
                                        }
                                        style={{
                                          cursor:
                                            initialResponseBump0?.data
                                              ?.timeout === 0 &&
                                            !!initialResponseBump0?.data?.groups
                                              ?.length === false &&
                                            (initialResponseBump0?.data
                                              ?.tcp_ident_tag !== 1 ||
                                              initialResponseBump0?.data
                                                ?.tcp_ident_tag !== 2) &&
                                            (!!!initialResponseBump0?.data
                                              ?.alg ||
                                              initialResponseBump0?.data
                                                ?.alg === "not configured")
                                              ? "not-allowed"
                                              : "pointer",
                                        }}
                                        checked={distidentCheckedTAC}
                                        onChange={(e) =>
                                          toggleRadio(e, "DIST_IDENT_TAC")
                                        }
                                      />
                                    </span>
                                  </ToolTip>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <Style.GenericButton
                                    id={`${gatewayServices}-distributed-identities-btn`}
                                    disabled={false}
                                    onClick={() => {
                                      openModel();
                                      setRunEffect1("DistributedBump0");
                                    }}
                                    buttonName={t("commons.configureText")}
                                    Icon={
                                      <DisplaySettingsRounded
                                        style={{
                                          width: "0.8em",
                                          height: "0.8em",
                                        }}
                                      />
                                    }
                                    backgroundColor="primary"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div
                            style={{
                              background: "",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                background: "",
                                width: "45%",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "1em",
                              }}
                            >
                              <Typography
                                style={{
                                  fontWeight: "600",
                                }}
                              >
                                {gatewayConfig.chassis_model !== "5010"
                                  ? t(
                                      "page.gatewayServer.services.context.distributedIdentities.text",
                                    )
                                  : mgtName}
                              </Typography>
                            </div>

                            <div
                              style={{
                                background: "",
                                width: "60%",
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                              }}
                              container
                              item
                              xs={6}
                              direction="row"
                            >
                              <div
                                style={{
                                  width: "40%",
                                  background: "",
                                  display: "flex",
                                  gap: "10px",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Styled.Spinner
                                  style={{
                                    visibility: radioDistIdentChecked
                                      ? "visible"
                                      : "hidden",
                                    marginLeft: "3em",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />

                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "0.8rem",
                                    color:
                                      radioDistIdentChecked ||
                                      (initialResponse?.data?.timeout === 0 &&
                                        !!initialResponse?.data?.groups
                                          ?.length === false &&
                                        (initialResponse?.data
                                          ?.tcp_ident_tag !== 1 ||
                                          initialResponse?.data
                                            ?.tcp_ident_tag !== 2) &&
                                        !!!initialResponse?.data?.alg) ||
                                      initialResponse?.data?.alg ===
                                        "not configured" ||
                                      initialResponse?.data?.tcp_ident_tag ===
                                        "not configured"
                                        ? "#6c757d"
                                        : "black",
                                  }}
                                >
                                  {distidentChecked
                                    ? radioDistIdentChecked
                                      ? `${t("commons.enablingText")}...`
                                      : `${t("commons.enabledText")}`
                                    : radioDistIdentChecked
                                    ? `${t("commons.disablingText")}...`
                                    : `${t("commons.disabledText")}`}
                                </Typography>

                                <ToolTip
                                  id={`${gatewayServices}-distributed-identities-tooltip`}
                                  label={
                                    (initialResponse?.data?.timeout === 0 &&
                                      !!initialResponse?.data?.groups
                                        ?.length === false &&
                                      (initialResponse?.data?.tcp_ident_tag !==
                                        1 ||
                                        initialResponse?.data?.tcp_ident_tag !==
                                          2) &&
                                      !!!initialResponse?.data?.alg) ||
                                    initialResponse?.data?.alg ===
                                      "not configured" ||
                                    initialResponse?.data?.tcp_ident_tag ===
                                      "not configured"
                                      ? t(
                                          `page.gatewayServer.services.context.distributedIdentities.tooltip`,
                                        )
                                      : ""
                                  }
                                >
                                  <span>
                                    <AntSwitch
                                      id={`${gatewayServices}-distributed-identities-toggle`}
                                      disabled={
                                        radioDistIdentChecked ||
                                        (initialResponse?.data?.timeout === 0 &&
                                          !initialResponse?.data?.groups
                                            ?.length &&
                                          (initialResponse?.data
                                            ?.tcp_ident_tag !== 1 ||
                                            initialResponse?.data
                                              ?.tcp_ident_tag !== 2) &&
                                          !!!initialResponse?.data?.alg) ||
                                        initialResponse?.data?.alg ===
                                          "not configured" ||
                                        initialResponse?.data?.tcp_ident_tag ===
                                          "not configured"
                                      }
                                      style={{
                                        cursor:
                                          initialResponse?.data?.timeout ===
                                            0 &&
                                          !!initialResponse?.data?.groups
                                            ?.length === false &&
                                          (initialResponse?.data
                                            ?.tcp_ident_tag !== 1 ||
                                            initialResponse?.data
                                              ?.tcp_ident_tag !== 2) &&
                                          (!!!initialResponse?.data?.alg ||
                                            initialResponse?.data?.alg ===
                                              "not configured")
                                            ? "not-allowed"
                                            : "pointer",
                                      }}
                                      checked={distidentChecked}
                                      onChange={(e) =>
                                        toggleRadio(e, "DIST_IDENT")
                                      }
                                    />
                                  </span>
                                </ToolTip>
                              </div>

                              <div style={{ width: "20%" }}>
                                <Style.GenericButton
                                  id={`${gatewayServices}-distributed-identities-btn`}
                                  disabled={false}
                                  onClick={() => {
                                    openModel();
                                    setRunEffect1("Distributed");
                                  }}
                                  buttonName={t("commons.configureText")}
                                  Icon={
                                    <DisplaySettingsRounded
                                      style={{
                                        width: "0.8em",
                                        height: "0.8em",
                                      }}
                                    />
                                  }
                                  backgroundColor="primary"
                                />
                              </div>
                            </div>
                          </div>

                          <Syslog
                            selectedValue={selectedContextValue}
                            syslogChecked={syslogChecked}
                            setSysLogChecked={setSysLogChecked}
                            syslog={syslog}
                            setAlertContent={setAlertContent}
                            setOpenAlertDialog={setOpenAlertDialog}
                            setRunEffect1={setRunEffect1}
                            openModel={openModel}
                            loading={loading}
                            setLoading={setLoading}
                            context={selectedContextValue}
                          />

                          <Pub
                            pubsub={pubsubChecked}
                            setpubSub={setpubSubChecked}
                            pubSubApiData={pubSubApiData}
                            setPubSubApiData={setPubSubApiData}
                            pubsubData={pubsubData}
                            gatewayIP={gatewayIP}
                            setAlertContent={setAlertContent}
                            setOpenAlertDialog={setOpenAlertDialog}
                            setRunEffect1={setRunEffect1}
                            selectedValue={selectedContextValue}
                            openModel={openModel}
                            handleClosePortalnoBackdrop={
                              handleClosePortalnoBackdrop
                            }
                            PubsubOnCompleteHandler={PubsubOnCompleteHandler}
                            loading={loading}
                            setLoading={setLoading}
                            context={
                              gatewayConfig.chassis_model === "5010"
                                ? "mgt"
                                : selectedContextValue
                            }
                          />

                          {gatewayConfig.chassis_model !== "5010" &&
                          selectedContextValue === "bump0" ? (
                            <div
                              style={{
                                background: "",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  background: "",
                                  width: "45%",
                                  display: "flex",
                                  alignItems: "center",
                                  paddingLeft: "1em",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontWeight: "600",
                                  }}
                                >
                                  {t(
                                    `page.gatewayServer.services.context.remoteKeyAgent.text`,
                                  )}
                                </Typography>
                              </div>

                              <div
                                style={{
                                  background: "",
                                  width: "60%",
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                                container
                                item
                                xs={6}
                                direction="row"
                              >
                                <div
                                  style={{
                                    width: "40%",
                                    background: "",
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Styled.Spinner
                                    style={{
                                      visibility: radioRksChecked
                                        ? "visible"
                                        : "hidden",
                                      width: "20px",
                                      height: "20px",
                                    }}
                                  />

                                  <Typography
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "0.8rem",
                                      color:
                                        !!!rksAddressData.rkservice ||
                                        rksAddressData.rkservice.toLocaleLowerCase() ===
                                          "not configured" ||
                                        selectedContextValue === "mgt"
                                          ? "#6c757d"
                                          : "black",
                                    }}
                                  >
                                    {rkserviceChecked
                                      ? radioRksChecked
                                        ? `${t("commons.enablingText")}...`
                                        : `${t("commons.enabledText")}`
                                      : radioRksChecked
                                      ? `${t("commons.disablingText")}...`
                                      : `${t("commons.disabledText")}`}
                                  </Typography>

                                  <div>
                                    <ToolTip
                                      id={`${gatewayServices}-remotekey-agent-tooltip`}
                                      label={
                                        !!!rksAddressData.rkservice ||
                                        rksAddressData.rkservice.toLocaleLowerCase() ===
                                          "not configured"
                                          ? t(
                                              `page.gatewayServer.services.context.remoteKeyAgent.tooltip`,
                                            )
                                          : ""
                                      }
                                    >
                                      <span>
                                        <AntSwitch
                                          id={`${gatewayServices}-remotekey-agent-toggle`}
                                          disabled={
                                            !!!rksAddressData.rkservice ||
                                            rksAddressData.rkservice.toLocaleLowerCase() ===
                                              "not configured" ||
                                            selectedContextValue === "mgt" ||
                                            radioRksChecked
                                          }
                                          style={{
                                            cursor:
                                              !!!rksAddressData.rkservice ||
                                              rksAddressData.rkservice.toLocaleLowerCase() ===
                                                "not configured" ||
                                              selectedContextValue === "mgt"
                                                ? "not-allowed"
                                                : "pointer",
                                          }}
                                          checked={rkserviceChecked}
                                          onChange={(e) =>
                                            toggleRadio(e, "RKS")
                                          }
                                        />
                                      </span>
                                    </ToolTip>
                                  </div>
                                </div>

                                <div style={{ width: "20%" }}>
                                  <Style.GenericButton
                                    id={`${gatewayServices}-remotekey-agent-btn`}
                                    buttonName={t(`commons.configureText`)}
                                    Icon={
                                      <DisplaySettingsRounded
                                        style={{
                                          width: "0.8em",
                                          height: "0.8em",
                                        }}
                                      />
                                    }
                                    backgroundColor="primary"
                                    disabled={
                                      selectedContextValue === "mgt"
                                        ? true
                                        : false
                                    }
                                    onClick={() => {
                                      openModel();
                                      setRunEffect1("RemoteKey");
                                      AppOverlayContext.setRskAddress(
                                        rksAddressData,
                                      );

                                      callAPI({
                                        path: "rksaddress",
                                        params: {
                                          gatewayIP,
                                          context: selectedContextValue,
                                        },
                                        data: {},
                                        responder: RksAddressAPIResponder,
                                        onComplete: onCompleterksaddress,
                                      });

                                      setLoading(true);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </StyledCompdivLeft>

                        <Styleddiv style={{ margin: "0.5em 0" }}>
                          <Divider
                            orientation="vertical"
                            style={{ marginLeft: "1em" }}
                          />
                        </Styleddiv>

                        <StyledCompdivRight>
                          <NetworkTImeComponent
                            radioNTPChecked={radioNTPChecked}
                            isNtpChecked={isNtpChecked}
                            networkCall={networkCall}
                            radioIasChecked={radioIasChecked}
                            setRunEffect1={setRunEffect1}
                          />

                          <SecureShell
                            ssdChecked={ssdChecked}
                            gatewayIP={gatewayIP}
                            setAlertContent={setAlertContent}
                            setOpenAlertDialog={setOpenAlertDialog}
                            setSSDChecked={setSSDChecked}
                            setSSD={setSSD}
                            ssd={ssd}
                            selectedValue={selectedContextValue}
                            context={selectedContextValue}
                          />

                          <div
                            style={{
                              background: "",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                background: "",
                                width: "35%",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "1em",
                              }}
                            >
                              <Typography
                                style={{
                                  fontWeight: "600",
                                }}
                              >
                                {t(
                                  `page.gatewayServer.services.context.restApi.text`,
                                )}
                              </Typography>
                            </div>

                            <div
                              style={{
                                background: "",
                                width: "60%",
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                              }}
                              container
                              item
                              xs={6}
                              direction="row"
                            >
                              <div
                                style={{
                                  width: "40%",
                                  background: "",
                                  display: "flex",
                                  gap: "10px",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Styled.Spinner
                                  style={{
                                    visibility: radioIasChecked
                                      ? "visible"
                                      : "hidden",
                                    width: "20px",
                                    height: "20px",
                                    marginLeft: "3em",
                                  }}
                                />

                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "0.8rem",
                                    color: "#6c757d",
                                  }}
                                >
                                  {isRestApiChecked
                                    ? radioIasChecked
                                      ? `${t("commons.enablingText")}...`
                                      : `${t("commons.enabledText")}`
                                    : radioIasChecked
                                    ? `${t("commons.disablingText")}...`
                                    : `${t("commons.disabledText")}`}
                                </Typography>

                                <AntSwitch
                                  id={`${gatewayServices}-rest-api-toggle`}
                                  disabled={true}
                                  style={{ cursor: "not-allowed" }}
                                  checked={isRestApiChecked}
                                />
                              </div>

                              <div
                                style={{ visibility: "hidden", width: "20%" }}
                              >
                                <Style.GenericButton
                                  id={`${gatewayServices}-rest-api-btn`}
                                  backgroundColor="primary"
                                  buttonName={t(`commons.configureText`)}
                                  Icon={
                                    <DisplaySettingsRounded
                                      style={{
                                        width: "0.8em",
                                        height: "0.8em",
                                      }}
                                    />
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </StyledCompdivRight>
                      </StyledParent>
                    )}
                  </>
                )}
              </>
            )}
          </>
        </div>

        <StyledMangement selectedContextValue={selectedContextValue}>
          {gatewayConfig.chassis_model !== "5010" ? (
            <StyledTrustedMangement>
              <div style={{ margin: "1em 1em 1em 0.5em" }}>
                <Typography style={{ fontWeight: 600, fontFamily: "Inter" }}>
                  {t(`page.gatewayServer.services.trustedInterface.title`)}
                </Typography>
              </div>

              <StyledTrustedCompOne>
                <StyledTrustedCompStyle>
                  <div>
                    <Typography
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "500",
                        marginLeft: "0.6em",
                      }}
                    >
                      {t(`page.gatewayServer.services.trustedInterface.text`)}
                    </Typography>
                  </div>

                  <StyledTrustedEvents class="float-end fw-normal">
                    <Styled.Spinner
                      style={{
                        visibility: radioTrustedChecked ? "visible" : "hidden",
                        marginRight: "10px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <Typography
                      style={{
                        fontFamily: "Inter",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color:
                          (activationConfig.tr_ip4 === "" &&
                            activationConfig.tr_ip6 === "") ||
                          trustedToggle
                            ? "#6c757d"
                            : "black",
                      }}
                    >
                      {trustedChecked
                        ? radioTrustedChecked
                          ? `${t("commons.enablingText")}...`
                          : `${t("commons.enabledText")}`
                        : radioTrustedChecked
                        ? `${t("commons.disablingText")}...`
                        : `${t("commons.disabledText")}`}
                    </Typography>
                    <ToolerTip
                      id={`${gatewayServices}-trusted-tooltip`}
                      label={
                        activationConfig.tr_ip4 === "" &&
                        activationConfig.tr_ip6 === ""
                          ? t(
                              `page.gatewayServer.services.trustedInterface.configureTooltip`,
                            )
                          : ""
                      }
                      title={
                        trustedChecked === false
                          ? t(
                              `page.gatewayServer.services.trustedInterface.configureTooltip`,
                            )
                          : ""
                      }
                    >
                      <span>
                        <AntSwitch
                          id={`${gatewayServices}-trusted-toggle`}
                          style={{
                            cursor:
                              (activationConfig.tr_ip4 === "" &&
                                activationConfig.tr_ip6 === "") ||
                              trustedToggle
                                ? "not-allowed"
                                : "pointer",
                          }}
                          disabled={
                            (activationConfig.tr_ip4 === "" &&
                              activationConfig.tr_ip6 === "") ||
                            trustedToggle
                          }
                          checked={trustedChecked}
                          onChange={(e) => toggleRadio(e, "TRUSTED")}
                        />
                      </span>
                    </ToolerTip>
                    <Style.GenericButton
                      id={`${gatewayServices}-trusted-btn`}
                      style={{ marginRight: "2px" }}
                      backgroundColor="primary"
                      buttonName={t(`commons.configureText`)}
                      Icon={
                        <DisplaySettingsRounded
                          style={{ width: "0.8em", height: "0.8em" }}
                        />
                      }
                      onClick={handleChangeTrustedToggle}
                      disabled={
                        trustedChecked ||
                        trustedToggle ||
                        loading ||
                        loadingContext
                      }
                    />
                    {trustedChecked || trustedToggle ? (
                      <ToolerTip
                        title={t(
                          `page.gatewayServer.services.trustedInterface.tooltip`,
                        )}
                      >
                        <InfoCircle
                          style={{ width: "1.3em", height: "1.3em" }}
                        />
                      </ToolerTip>
                    ) : null}
                  </StyledTrustedEvents>
                </StyledTrustedCompStyle>
              </StyledTrustedCompOne>

              {trustedToggle ? (
                <Styled.StyledFormWrapper
                  ref={trustedRef}
                  class="gatewaycolcontent trusted_table_ctn pt-1 pb-3 px-3"
                >
                  <UntrustedPopup
                    data={activationConfigData}
                    trusted={trusted}
                    handleTrustedClose={toggleTrustedPopup}
                  />
                </Styled.StyledFormWrapper>
              ) : (
                <Styled.StyledTableWrapper class="gw_config_table trusted_table">
                  <div class="table-responsive" style={{ overflowX: "auto" }}>
                    <Styled.StyledTableComponent class="table customtable">
                      <Styled.StyledTbodyComponent class="table_contenttext">
                        <Styled.StyledTrComponent>
                          <Styled.StyledTdComponent>
                            <Styled.StyledTableH6Component class="fw-bold">
                              {t(
                                `page.gatewayServer.services.trustedInterface.form.ipv4p.label`,
                              )}
                            </Styled.StyledTableH6Component>
                            <Styled.StyledTablePComponent class="mb-0">
                              {activationConfig.tr_ip4}
                            </Styled.StyledTablePComponent>
                          </Styled.StyledTdComponent>
                        </Styled.StyledTrComponent>
                        <Styled.StyledTrComponent>
                          <Styled.StyledTdComponent>
                            <Styled.StyledTableH6Component class="fw-bold">
                              {t(
                                `page.gatewayServer.services.trustedInterface.form.ipv4.label`,
                              )}
                            </Styled.StyledTableH6Component>
                            <Styled.StyledTablePComponent class="mb-0">
                              {activationConfig.tr_gw4}
                            </Styled.StyledTablePComponent>
                          </Styled.StyledTdComponent>
                        </Styled.StyledTrComponent>
                        <Styled.StyledTrComponent>
                          <Styled.StyledTdComponent>
                            <Styled.StyledTableH6Component class="fw-bold">
                              {t(
                                `page.gatewayServer.services.trustedInterface.form.ipv6p.label`,
                              )}
                            </Styled.StyledTableH6Component>
                            <Styled.StyledTablePComponent class="mb-0">
                              {activationConfig.tr_ip6}
                            </Styled.StyledTablePComponent>
                          </Styled.StyledTdComponent>
                        </Styled.StyledTrComponent>
                        <Styled.StyledTrComponent>
                          <Styled.StyledTdComponent>
                            <Styled.StyledTableH6Component class="fw-bold">
                              {t(
                                `page.gatewayServer.services.trustedInterface.form.ipv6.label`,
                              )}
                            </Styled.StyledTableH6Component>
                            <Styled.StyledTablePComponent class="mb-0">
                              {activationConfig.tr_gw6}
                            </Styled.StyledTablePComponent>
                          </Styled.StyledTdComponent>
                        </Styled.StyledTrComponent>
                        <Styled.StyledTrComponent>
                          <Styled.StyledTdComponent>
                            <Styled.StyledTableH6Component class="fw-bold">
                              {t(
                                `page.gatewayServer.services.trustedInterface.form.vLanId.label`,
                              )}
                            </Styled.StyledTableH6Component>
                            <Styled.StyledTablePComponent class="mb-0">
                              {activationConfig.tr_vlan}
                            </Styled.StyledTablePComponent>
                          </Styled.StyledTdComponent>
                        </Styled.StyledTrComponent>
                      </Styled.StyledTbodyComponent>
                    </Styled.StyledTableComponent>
                  </div>
                </Styled.StyledTableWrapper>
              )}
            </StyledTrustedMangement>
          ) : null}

          <StyledTrustedMangement>
            <div style={{ margin: "1em 1em 1em 0.5em" }}>
              <Typography style={{ fontWeight: 600, fontFamily: "Inter" }}>
                {t(`page.gatewayServer.services.untrustedInterface.title`)}
              </Typography>
            </div>
            <StyledTrustedCompOne>
              <StyledTrustedCompStyle>
                <div>
                  <Typography
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      marginLeft: "0.6em",
                    }}
                  >
                    {t(`page.gatewayServer.services.untrustedInterface.text`)}
                  </Typography>
                </div>
                <StyledTrustedEvents>
                  <Styled.Spinner
                    style={{
                      visibility: radioUnTrustedChecked ? "visible" : "hidden",
                      marginRight: "10px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <Typography
                    style={{
                      fontFamily: "Inter",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color:
                        (activationConfig.ut_ip4 === "" &&
                          activationConfig.ut_ip6 === "") ||
                        trustedToggle
                          ? "#6c757d"
                          : "black",
                    }}
                  >
                    {untrustedChecked
                      ? radioUnTrustedChecked
                        ? `${t("commons.enablingText")}...`
                        : `${t("commons.enabledText")}`
                      : radioUnTrustedChecked
                      ? `${t("commons.disablingText")}...`
                      : `${t("commons.disabledText")}`}
                  </Typography>
                  <ToolTip
                    id={`${gatewayServices}-untrusted-tooltip`}
                    label={
                      !activationConfig.ut_ip4 && !activationConfig.ut_ip6
                        ? t(
                            `page.gatewayServer.services.untrustedInterface.configureTooltip`,
                          )
                        : ""
                    }
                    title={
                      untrustedChecked === false
                        ? t(
                            `page.gatewayServer.services.untrustedInterface.configureTooltip`,
                          )
                        : ""
                    }
                  >
                    <span>
                      <AntSwitch
                        id={`${gatewayServices}-untrusted-toggle`}
                        style={{
                          cursor:
                            (!activationConfig.ut_ip4 &&
                              !activationConfig.ut_ip6) ||
                            unTrustedToggle
                              ? "not-allowed"
                              : "pointer",
                        }}
                        disabled={
                          (!activationConfig.ut_ip4 &&
                            !activationConfig.ut_ip6) ||
                          unTrustedToggle
                        }
                        checked={untrustedChecked}
                        onChange={(e) => toggleRadio(e, "UNTRUSTED")}
                      />
                    </span>
                  </ToolTip>
                  <Style.GenericButton
                    id={`${gatewayServices}-untrusted-btn`}
                    onClick={handleChangeUntrustedToggle}
                    disabled={
                      untrustedChecked ||
                      unTrustedToggle ||
                      loading ||
                      loadingContext
                    }
                    buttonName={t(`commons.configureText`)}
                    Icon={
                      <DisplaySettingsRounded
                        style={{ width: "0.8em", height: "0.8em" }}
                      />
                    }
                    backgroundColor="primary"
                  />

                  {untrustedChecked || unTrustedToggle ? (
                    <ToolerTip
                      title={t(
                        `page.gatewayServer.services.untrustedInterface.tooltip`,
                      )}
                    >
                      <InfoCircle style={{ width: "1.3em", height: "1.3em" }} />
                    </ToolerTip>
                  ) : null}
                </StyledTrustedEvents>
              </StyledTrustedCompStyle>
            </StyledTrustedCompOne>

            {unTrustedToggle ? (
              <Styled.StyledFormWrapper
                ref={unTrustedRef}
                class="gatewaycolcontent trusted_table_ctn pt-1 pb-3 px-3"
              >
                <UntrustedPopup
                  data={activationConfigData}
                  trusted={!trusted}
                  handleTrustedClose={toggleUnTrustedPopup}
                />
              </Styled.StyledFormWrapper>
            ) : (
              <Styled.StyledTableWrapper class="gw_config_table trusted_table">
                <div class="table-responsive" style={{ overflowX: "auto" }}>
                  <Styled.StyledTableComponent class="table customtable">
                    <Styled.StyledTbodyComponent class="table_contenttext">
                      <Styled.StyledTrComponent>
                        <Styled.StyledTdComponent>
                          <Styled.StyledTableH6Component class="fw-bold">
                            {t(
                              `page.gatewayServer.services.untrustedInterface.form.ipv4p.label`,
                            )}
                          </Styled.StyledTableH6Component>
                          <Styled.StyledTablePComponent class="mb-0">
                            {activationConfig.ut_ip4}
                          </Styled.StyledTablePComponent>
                        </Styled.StyledTdComponent>
                      </Styled.StyledTrComponent>
                      <Styled.StyledTrComponent>
                        <Styled.StyledTdComponent>
                          <Styled.StyledTableH6Component class="fw-bold">
                            {t(
                              `page.gatewayServer.services.untrustedInterface.form.ipv4.label`,
                            )}
                          </Styled.StyledTableH6Component>
                          <Styled.StyledTablePComponent class="mb-0">
                            {activationConfig.ut_gw4}
                          </Styled.StyledTablePComponent>
                        </Styled.StyledTdComponent>
                      </Styled.StyledTrComponent>
                      <Styled.StyledTrComponent>
                        <Styled.StyledTdComponent>
                          <Styled.StyledTableH6Component class="fw-bold">
                            {t(
                              `page.gatewayServer.services.untrustedInterface.form.ipv6p.label`,
                            )}
                          </Styled.StyledTableH6Component>
                          <Styled.StyledTablePComponent class="mb-0">
                            {activationConfig.ut_ip6}
                          </Styled.StyledTablePComponent>
                        </Styled.StyledTdComponent>
                      </Styled.StyledTrComponent>
                      <Styled.StyledTrComponent>
                        <Styled.StyledTdComponent>
                          <Styled.StyledTableH6Component class="fw-bold">
                            {t(
                              `page.gatewayServer.services.untrustedInterface.form.ipv6.label`,
                            )}
                          </Styled.StyledTableH6Component>
                          <Styled.StyledTablePComponent class="mb-0">
                            {activationConfig.ut_gw6}
                          </Styled.StyledTablePComponent>
                        </Styled.StyledTdComponent>
                      </Styled.StyledTrComponent>
                      <Styled.StyledTrComponent>
                        <Styled.StyledTdComponent>
                          <Styled.StyledTableH6Component class="fw-bold">
                            {t(
                              `page.gatewayServer.services.untrustedInterface.form.vLanId.label`,
                            )}
                          </Styled.StyledTableH6Component>
                          <Styled.StyledTablePComponent class="mb-0">
                            {activationConfig.ut_vlan}
                          </Styled.StyledTablePComponent>
                        </Styled.StyledTdComponent>
                      </Styled.StyledTrComponent>
                    </Styled.StyledTbodyComponent>
                  </Styled.StyledTableComponent>
                </div>
              </Styled.StyledTableWrapper>
            )}
          </StyledTrustedMangement>
        </StyledMangement>
      </Styled.StyledContainer>

      <GlobalModal
        open={display}
        Content={
          <>
            <>
              {runEffect1 === "RemoteKey" ? (
                <RemoteKeyPopup
                  rksAddressData={rksAddressData}
                  setRksAddressDataData={setRksAddressDataData}
                  loading={loading}
                  setAlertContent={setAlertContent}
                  setOpenAlertDialog={setOpenAlertDialog}
                  handleDistributedClosePortal={handleClosePortalnoBackdrop}
                  context={selectedContextValue}
                  handleClosePortal={() => {
                    setRunEffect1("");
                    setDisplay(false);
                  }}
                />
              ) : null}
            </>

            <>
              {runEffect1 === "Distributed" ? (
                <IdentitiesPopup
                  name={
                    gatewayConfig.chassis_model !== "5010"
                      ? `${t(`commons.configureText`)} ${t(
                          "page.gatewayServer.services.context.distributedIdentities.text",
                        )}`
                      : `${t(`commons.configureText`)} ${t(
                          "page.gatewayServer.services.context.distributedIdentities.text",
                        )} [mgt]`
                  }
                  loading={loading}
                  setLoading={setLoading}
                  portalState={portalState}
                  currRunEffect={runEffect1}
                  setCurrRunEffect={setRunEffect1}
                  setAlertContent={setAlertContent}
                  setOpenAlertDialog={setOpenAlertDialog}
                  context={selectedContextValue}
                  postEffects={postEffects}
                  setPostEffects={setPostEffects}
                  initialResponse={initialResponse}
                  setInitialResponse={setInitialResponse}
                  setInitialRk={setInitialRk}
                  handleClosePortal={() => {
                    setRunEffect1("");
                    setDisplay(false);
                  }}
                />
              ) : null}
            </>

            <>
              {runEffect1 === "DistributedBump0" ? (
                <IdentitiesPopup
                  name={`${t(`commons.configureText`)} ${t(
                    "page.gatewayServer.services.context.distributedIdentities.text",
                  )} [bump0]`}
                  loading={loading}
                  setLoading={setLoading}
                  portalState={portalState}
                  currRunEffect={runEffect1}
                  setCurrRunEffect={setRunEffect1}
                  setAlertContent={setAlertContent}
                  setOpenAlertDialog={setOpenAlertDialog}
                  context={"bump0"}
                  postEffectsBump0={postEffectsBump0}
                  setPostEffectsBump0={setPostEffectsBump0}
                  initialResponseBump0={initialResponseBump0}
                  setInitialResponseBump0={setInitialResponseBump0}
                  setInitialRk={setInitialRk}
                  handleClosePortal={() => {
                    setRunEffect1("");
                    setDisplay(false);
                  }}
                />
              ) : null}
            </>

            <>
              {runEffect1 === "pubSub" ? (
                <PubSubPopup
                  pubsub={pubsubChecked}
                  setpubSub={setpubSubChecked}
                  loading={loading}
                  pubSubApiData={pubSubApiData}
                  setPubSubApiData={setPubSubApiData}
                  setAlertContent={setAlertContent}
                  setOpenAlertDialog={setOpenAlertDialog}
                  context={
                    gatewayConfig.chassis_model === "5010"
                      ? "mgt"
                      : selectedContextValue
                  }
                  currRunEffect={runEffect1}
                  handleClosePortal={() => {
                    setRunEffect1("");
                    setDisplay(false);
                  }}
                  handleClosePortalnoBackdrop={handleClosePortalnoBackdrop}
                  isPubSubServiceEnabled={pubsubChecked}
                />
              ) : null}
            </>

            <>
              {runEffect1 === "ntp" ? (
                <NetworkTimeTable
                  data={ntpData}
                  loading={loading}
                  handleClosePortal={() => {
                    setRunEffect1("");
                    setDisplay(false);
                  }}
                />
              ) : null}
            </>
          </>
        }
      />

      <AlertDialogGw
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        contentTitle={alertContent.contentTitle}
        contentText={alertContent.contentText}
        contentInfo={alertContent.contentInfo}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleCloseAlertDialog}
        handleDisagree={true}
      />

      <AlertDialogGw
        open={rebootPrompt.show}
        contentTitle={rebootPrompt.title}
        contentText={rebootPrompt.content}
        agreeTitle={rebootPrompt.agree.name}
        disagreeTitle={rebootPrompt.disagree.name}
        handleAgree={() => {
          rebootPrompt.agree.handler(...rebootPrompt.agree.args);
        }}
        handleDisagree={() => {
          rebootPrompt.disagree.handler(...rebootPrompt.disagree.args);
        }}
      />
    </>
  );
};

export default withRouter(withCookies(TrustedUntrustedManagement));

const StyledParent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 1em 0;
  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 1em 0;
  }
`;

const Styleddiv = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`;

const StyledCompdivLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
`;

const StyledCompdivRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding-top: 0.6em;
  }
`;

const StyledMangement = styled(Box)`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  //opacity:${(props) => props.selectedContextValue === "mgt" && "0.5"};
  //pointer-events:${(props) => props.selectedContextValue === "mgt" && "none"};
  padding: 0 1em;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const StyledTrustedMangement = styled(Box)`
  width: 50%;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const StyledTrustedCompOne = styled(Box)`
  display: flex;
  flex-direction: column;
  background: rgb(239, 242, 247);
  height: 52px;
`;

const StyledTrustedCompStyle = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0.6em;
`;

const StyledTrustedEvents = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5em;
`;
