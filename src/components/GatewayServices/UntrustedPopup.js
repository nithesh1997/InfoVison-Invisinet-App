import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import callAPI from "../../apis/callAPI";
import { TrustedAPIResponder } from "../../apis/responders/trusted-api-responder";
import AlertDialog from "../../components/IFVDataGrid/GridPortal/AlertDialog";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { Styled } from "./GatewayserviceStyling/untrustedPopup.style";
import { GlobalTextField } from "../../style/TextField/TextField";
import { gatewayServices } from "../../utils/GeneralComponentNames";
import { useTranslation } from "react-i18next";

export default function UntrustedPopup(props) {
  const { t } = useTranslation();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const inputForIpv4Ref = useRef(null);
  const inputForGatewayIpv4Ref = useRef(null);
  const inputForIpv6Ref = useRef(null);
  const inputForGatewayIpv6Ref = useRef(null);
  const inputForLanRef = useRef(null);
  const buttonForSaveRef = useRef(null);

  const { activationConfig } = useContext(OverlayContext);
  const AppOverlayContext = useContext(OverlayContext);

  const [runEffect, setRunEffect] = useState("");
  const [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);

  const [ipvFour, setIpvFour] = useState(() => {
    return activationConfig[props.trusted ? "tr_ip4" : "ut_ip4"] ?? "";
  });
  const [gatewayFour, setGatewayFour] = useState(() => {
    return activationConfig[props.trusted ? "tr_gw4" : "ut_gw4"] ?? "";
  });
  const [ipvSix, setIpvSix] = useState(() => {
    return activationConfig[props.trusted ? "tr_ip6" : "ut_ip6"] ?? "";
  });
  const [gatewaySix, setGatewaySix] = useState(() => {
    return activationConfig[props.trusted ? "tr_gw6" : "ut_gw6"] ?? "";
  });
  const [lan, setLan] = useState(() => {
    return activationConfig[props.trusted ? "tr_vlan" : "ut_vlan"] ?? 0;
  });

  const [ipvFourError, setIpvFourError] = useState(false);
  const [gatewayFourError, setGatewayFourError] = useState(false);
  const [ipvSixError, setIpvSixError] = useState(false);
  const [gatewaySixError, setGatewaySixError] = useState(false);
  const [lanError, setLanError] = useState(false);

  const [ipvFourHelperText, setIpvFourHelperText] = useState(" ");
  const [gatewayFourHelperText, setGatewayFourHelperText] = useState(" ");
  const [ipvSixHelperText, setIpvSixHelperText] = useState(" ");
  const [gatewaySixHelperText, setGatewaySixHelperText] = useState(" ");
  const [lanHelperText, setLanHelperText] = useState(" ");
  const [attemptError, setAttemptError] = useState(true);
  const [disableSave, setDisableSave] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogTitle, setalertDialogTitle] = useState(() =>
    t(`commons.errorText !`),
  );
  const [statusText, setStatusText] = useState("");
  const [currState, setCurrState] = useState("");
  const [oldData, setOldData] = useState({
    ipvFour: "",
    gatewayFour: "",
    ipv6: "",
    gatewaySix: "",
    vLan: "",
    ca: null,
    gw: null,
  });

  useEffect(() => {
    setOldData({
      ipvFour: props?.trusted
        ? activationConfig.tr_ip4
        : activationConfig.ut_ip4,
      gatewayFour: props?.trusted
        ? activationConfig.tr_gw4
        : activationConfig.ut_gw4,
      ipv6: props?.trusted ? activationConfig.tr_ip6 : activationConfig.ut_ip6,
      gatewaySix: props?.trusted
        ? activationConfig.tr_gw6
        : activationConfig.ut_gw6,
      vLan: props?.trusted
        ? activationConfig.tr_vlan
        : activationConfig.ut_vlan,
      ca: activationConfig.ca_not_after,
      gw: activationConfig.gw_not_after,
    });
  }, []);

  const handleBlur = (event) => {
    const isIpvFour = oldData.ipvFour === ipvFour;
    const isIpv6 = oldData.ipv6 === ipvSix;
    const isGatewayFour = oldData.gatewayFour === gatewayFour;
    const isGatewaySix = oldData.gatewaySix === gatewaySix;
    const isVlan = Number(oldData.vLan) === Number(lan);
    const results = [isIpvFour, isIpv6, isGatewayFour, isGatewaySix, isVlan];
    const condition = !results.includes(false);

    setDisableSave(condition);
  };

  const handleChangeIpvFour = (event) => {
    setIpvFour(event.target.value.trim());
  };

  const validateIpvFour = (value) => {
    setIpvFour(value);

    const required = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.eitherOrMandatory`,
      ),
    };

    const inValidAddress = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalid`,
      ),
    };

    const inValidPrefix = {
      isValid: false,
      message: (
        <>
          <li>
            {t(
              `page.gatewayServer.services.trustedInterface.form.validation.invalidWithHelpers.0`,
            )}
          </li>
          <li>
            {t(
              `page.gatewayServer.services.trustedInterface.form.validation.invalidWithHelpers.1`,
            )}
          </li>
        </>
      ),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalid`,
      ),
    };

    const ipRegex = new RegExp(
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/,
    );
    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(ipRegex.test(ip));

    const isPrefix =
      prefix &&
      (isNaN(prefix) || parseInt(prefix) > 31 || parseInt(prefix) < 8);
    const isSlashes = !Boolean(value.split("/").length === 2);
    const isEndsWithSlash = value.endsWith("/");

    if (!Boolean(value.length)) {
      setIpvFourHelperText(required.message);
      setIpvFourError(true);
      return true;
    } else if (ipRegexTest) {
      setIpvFourHelperText(inValidAddress.message);
      setIpvFourError(true);
      return true;
    } else if (prefix === undefined || null || "") {
      setIpvFourHelperText(inValidPrefix.message);
      setIpvFourError(true);
      return true;
    } else if (isPrefix) {
      setIpvFourHelperText(inValidPrefix.message);
      setIpvFourError(true);
      return true;
    } else if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
      setIpvFourHelperText(inValidSlashes.message);
      setIpvFourError(true);
      return true;
    } else {
      setIpvFourHelperText("");
      setIpvFourError(false);
      return false;
    }
  };

  const handleIpvFourKeyPress = (event) => {
    const { key } = event;

    if (
      (key === "Enter" || key === "Tab") &&
      ipvFour.length !== 0 &&
      ipvFourError === false
    ) {
      inputForIpv4Ref.current.click();
    }
  };

  const handleFocusIpvFour = (e) => {
    setIpvFourHelperText("");
  };

  const handleIpvFourBlur = (event, subnet) => {
    let value = event.target.value;
    validateIpvFour(value);
    checkipvsixandipv4();
    handleBlur();
  };
  const checkipvsixandipv4 = () => {
    if (ipvSix !== "" && !ipvSixError && ipvFour === "") {
      setIpvFourHelperText("");
      setIpvFourError(false);
    }
    if (ipvSix !== "" && ipvSixError && ipvFour === "") {
      setIpvFourHelperText("");
      setIpvFourError(false);
    }
    if (ipvFour !== "" && !ipvFourError && ipvSix === "") {
      setIpvSixHelperText("");
      setIpvSixError(false);
    }
    if (ipvFour !== "" && ipvFourError && ipvSix === "") {
      setIpvSixHelperText("");
      setIpvSixError(false);
    }
  };

  /*IPvSIX*/

  const handleChangeIpvSix = (event, subnet) => {
    let value = event.target.value;
    setIpvSix(value);
  };

  const handleIpvSixBlur = (event, subnet) => {
    let value = event.target.value;
    validateIpvSix(value);
    checkipvsixandipv4();
    handleBlur();
  };

  const validateIpvSix = (value) => {
    setIpvSix(value);

    const inValidAddress = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalid`,
      ),
    };

    const inValidPrefix = {
      isValid: false,
      message: (
        <>
          <li>
            {t(
              `page.gatewayServer.services.trustedInterface.form.validation.invalidWithHelpers6.0`,
            )}
          </li>
          <li>
            {t(
              `page.gatewayServer.services.trustedInterface.form.validation.invalidWithHelpers6.1`,
            )}
          </li>
        </>
      ),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalid`,
      ),
    };

    const ipRegex = new RegExp(
      `^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$`,
    );

    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(ipRegex.test(ip));
    const isPrefix =
      prefix &&
      (isNaN(prefix) || parseInt(prefix) > 127 || parseInt(prefix) < 48);
    const isSlashes = !Boolean(value.split("/").length === 2);
    const isEndsWithSlash = value.endsWith("/");

    if (!Boolean(value.length)) {
      setIpvSixHelperText(
        t(
          `page.gatewayServer.services.trustedInterface.form.validation.eitherOrMandatory`,
        ),
      );
      setIpvSixError(true);
      return true;
    } else if (ipRegexTest) {
      setIpvSixHelperText(inValidAddress.message);
      setIpvSixError(true);
      return true;
    } else if (prefix === undefined || null || "") {
      setIpvSixHelperText(inValidPrefix.message);
      setIpvSixError(true);
      return true;
    } else if (isPrefix) {
      setIpvSixHelperText(inValidPrefix.message);
      setIpvSixError(true);
      return true;
    } else if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
      setIpvSixHelperText(inValidSlashes.message);
      setIpvSixError(true);
      return true;
    } else {
      if (ipvSix !== "" && !ipvSixError && ipvFour === "") {
        setIpvFourHelperText("");
        setIpvFourError(false);
      }
      if (ipvSix !== "" && ipvSixError && ipvFour === "") {
        setIpvFourHelperText("");
        setIpvFourError(false);
      }
      setIpvSixHelperText("");
      setIpvSixError(false);
      return false;
    }
  };

  const handleSixIpvFour = (e) => {
    setIpvSixHelperText("");
    setIpvSixError(false);
  };

  //IPv4GATEWAY
  const handleChangeGatewayFour = (event, subnet) => {
    let value = event.target.value;
    setGatewayFour(value);
  };

  const handleGatewayFourBlur = (event) => {
    handleBlur();
    const value = event.target.value;
    validateGatewayFour(value);
  };

  const validateGatewayFour = (value) => {
    setGatewayFour(value);

    const inValidAddress = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV4`,
      ),
    };

    const inValidPrefix = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV4`,
      ),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV4`,
      ),
    };

    const ipRegex = new RegExp(
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/,
    );

    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(ipRegex.test(ip));

    const isPrefix =
      prefix &&
      (isNaN(prefix) || parseInt(prefix) > 32 || parseInt(prefix) < 8);

    if (!Boolean(value.length)) {
      setGatewayFourHelperText("");
      setGatewayFourError(false);
      return false;
    } else if (ipRegexTest) {
      setGatewayFourHelperText(inValidAddress.message);
      setGatewayFourError(true);
    } else if (isPrefix) {
      setGatewayFourHelperText(inValidPrefix.message);
      setGatewayFourError(true);
    } else if (value.includes("/")) {
      setGatewayFourHelperText(inValidSlashes.message);
      setGatewayFourError(true);
    } else {
      setGatewayFourHelperText("");
      setGatewayFourError(false);
      return false;
    }
  };

  const handleGatewayFocusIpvFour = (e) => {
    setGatewayFourHelperText("");
  };

  //IPv6GATEWAY

  const handleChangeGatewaySix = (event, subnet) => {
    let value = event.target.value;
    setGatewaySix(value);
  };

  const validateGatewaySix = (value) => {
    setGatewaySix(value);

    const inValidAddress = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV6`,
      ),
    };

    const inValidPrefix = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV6`,
      ),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.trustedInterface.form.validation.invalidV6`,
      ),
    };

    const ipRegex = new RegExp(
      `^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$`,
    );

    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(ipRegex.test(ip));

    const isPrefix =
      prefix &&
      (isNaN(prefix) || parseInt(prefix) > 128 || parseInt(prefix) < 1);

    if (!Boolean(value.length)) {
      setGatewaySixHelperText("");
      setGatewaySixError(false);
      return false;
    } else if (ipRegexTest) {
      setGatewaySixHelperText(inValidAddress.message);
      setGatewaySixError(true);
      return true;
    } else if (isPrefix) {
      setGatewaySixHelperText(inValidPrefix.message);
      setGatewaySixError(true);
      return true;
    } else if (value.includes("/")) {
      setGatewaySixHelperText(inValidSlashes.message);
      setGatewaySixError(true);
      return true;
    } else {
      setGatewaySixHelperText("");
      setGatewaySixError(false);
      return false;
    }
  };

  const handleGatewaySixBlur = (event, subnet) => {
    handleBlur();
    let value = event.target.value;

    validateGatewaySix(value);
  };

  const handleGatewaySixIpvFour = (e) => {
    setGatewaySixHelperText("");
  };

  //VLan

  const handleLan = (event) => {
    setLan(event.target.value);
  };

  const validateLan = (val) => {
    if (val.length < 1) {
      setLanHelperText("");
      setLanError(false);
      setLan(0);
      return true;
    } else if (val.toString().startsWith("0") && val?.toString()?.length > 1) {
      setLanHelperText("Invalid vLAN");
      setLanError(true);
      return true;
    } else if (val.toString().includes(".")) {
      setLanHelperText("Invalid vLAN");
      setLanError(true);
      return true;
    } else if (Number(val) >= 0 && Number(val) <= 4095) {
      setLanHelperText("");
      setLanError(false);
      return false;
    } else {
      setLanHelperText("Invalid vLAN");
      setLanError(true);
      return true;
    }
  };

  function handleLanOnBlur(event) {
    const val = event.target.value;

    validateLan(val);
    handleBlur();
  }

  function handleVlanFocus() {
    setLanHelperText("");
  }

  const handleSubmited = (e) => {
    if (ipvSix !== "" && ipvFour !== "") {
      validateIpvFour(ipvFour);
      validateGatewayFour(gatewayFour);
      validateGatewaySix(gatewaySix);
      validateIpvSix(ipvSix);
      validateLan(lan);
    }
    if (ipvSix !== "" && ipvFour === "") {
      setIpvFourError(false);
      setIpvFourHelperText("");
      checkipvsixandipv4();
    } else if (ipvSix === "" && ipvFour !== "") {
      setIpvSixError(false);
      setIpvSixHelperText("");
      checkipvsixandipv4();
    }
    if (!!!ipvFour && !!!ipvSix) {
      setIpvSixError(true);
      setIpvSixHelperText(
        t(
          `page.gatewayServer.services.trustedInterface.form.validation.eitherOrMandatory`,
        ),
      );
      setIpvFourError(true);
      setIpvFourHelperText(
        t(
          `page.gatewayServer.services.trustedInterface.form.validation.eitherOrMandatory`,
        ),
      );
    } else if (disableSave) {
      setDialogOpen(true);
      setalertDialogTitle(
        t(
          `page.gatewayServer.services.trustedInterface.form.prompt.alert.title`,
        ),
      );
      setStatusText(
        t(
          `page.gatewayServer.services.trustedInterface.form.prompt.alert.message`,
        ),
      );
    } else {
      if (
        ipvFourError === false &&
        ipvSixError === false &&
        gatewaySixError === false &&
        gatewayFourError === false &&
        lanError === false &&
        props?.trusted === true
      ) {
        setIsAttemptOnGoing(true);

        callAPI({
          path: "set-trusted-data",
          params: { gatewayIP },
          data: {
            tr_vlan: Number(lan),
            tr_ip4: ipvFour,
            tr_gw4: gatewayFour,
            tr_ip6: ipvSix,
            tr_gw6: gatewaySix,
            ut_vlan: activationConfig.ut_vlan,
            ut_ip4: activationConfig.ut_ip4,
            ut_gw4: activationConfig.ut_gw4,
            ut_ip6: activationConfig.ut_ip6,
            ut_gw6: activationConfig.ut_gw6,
            ca_not_after: activationConfig.ca_not_after,
            gw_not_after: activationConfig.gw_not_after,
          },
          responder: TrustedAPIResponder,
          onComplete: trustedOnCompleteHandler,
        });
      } else if (
        ipvFourError === false &&
        ipvSixError === false &&
        gatewaySixError === false &&
        gatewayFourError === false &&
        lanError === false &&
        props?.trusted === false
      ) {
        setIsAttemptOnGoing(true);

        callAPI({
          path: "set-trusted-data",
          params: { gatewayIP },
          data: {
            ut_vlan: Number(lan),
            ut_ip4: ipvFour,
            ut_gw4: gatewayFour,
            ut_ip6: ipvSix,
            ut_gw6: gatewaySix,
            tr_vlan: activationConfig.tr_vlan,
            tr_ip4: activationConfig.tr_ip4,
            tr_gw4: activationConfig.tr_gw4,
            tr_ip6: activationConfig.tr_ip6,
            tr_gw6: activationConfig.tr_gw6,
            ca_not_after: activationConfig.ca_not_after,
            gw_not_after: activationConfig.gw_not_after,
          },
          responder: TrustedAPIResponder,
          onComplete: unTrustedOnCompleteHandler,
        });
      } else {
        setIsAttemptOnGoing(false);
      }
    }
  };

  const trustedOnCompleteHandler = (response) => {
    if (response.state === "SET_TRUSTED_SUCESS") {
      setCurrState("trusted:success");
      setAttemptError(false);
      setIsAttemptOnGoing(false);
      setIpvFour(ipvFour);
      setGatewayFour(gatewayFour);
      setIpvSix(ipvSix);
      setGatewaySix(gatewaySix);
      setLan(lan);
      setDialogOpen(true);
      setalertDialogTitle(
        t(
          `page.gatewayServer.services.trustedInterface.form.prompt.success.title`,
        ),
      );
      setStatusText(
        t(
          `page.gatewayServer.services.trustedInterface.form.prompt.success.message`,
        ),
      );
      AppOverlayContext.setActivationConfig({
        tr_vlan: Number(lan),
        tr_ip4: ipvFour,
        tr_gw4: gatewayFour,
        tr_ip6: ipvSix,
        tr_gw6: gatewaySix,
        tr_enable: activationConfig.tr_enable,
        ut_vlan: activationConfig.ut_vlan,
        ut_ip4: activationConfig.ut_ip4,
        ut_gw4: activationConfig.ut_gw4,
        ut_ip6: activationConfig.ut_ip6,
        ut_gw6: activationConfig.ut_gw6,
        ut_enable: activationConfig.ut_enable,
        ca_not_after: activationConfig.ca_not_after,
        gw_not_after: activationConfig.gw_not_after,
      });
    } else {
      setCurrState("trusted:failure");
      setAttemptError(true);
      setDialogOpen(true);
      setalertDialogTitle(
        `${t(
          `page.gatewayServer.services.trustedInterface.form.prompt.error.title`,
        )}..!`,
      );
      setStatusText(() => (
        <>
          {t(
            `page.gatewayServer.services.trustedInterface.form.prompt.error.message.0`,
          )}
          <br />
          <br />
          {t(
            `page.gatewayServer.services.trustedInterface.form.prompt.error.message.1`,
          )}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>
      ));

      setIsAttemptOnGoing(false);
    }
  };

  const unTrustedOnCompleteHandler = (response) => {
    if (response.state === "SET_TRUSTED_SUCESS") {
      setCurrState("untrusted:success");
      setAttemptError(false);
      setIsAttemptOnGoing(false);
      setIpvFour(ipvFour);
      setGatewayFour(gatewayFour);
      setIpvSix(ipvSix);
      setGatewaySix(gatewaySix);
      setLan(lan);
      setDialogOpen(true);
      setalertDialogTitle(
        t(
          `page.gatewayServer.services.untrustedInterface.form.prompt.success.title`,
        ),
      );
      setStatusText(
        t(
          `page.gatewayServer.services.untrustedInterface.form.prompt.success.message`,
        ),
      );
      AppOverlayContext.setActivationConfig({
        ut_vlan: Number(lan),
        ut_ip4: ipvFour,
        ut_gw4: gatewayFour,
        ut_ip6: ipvSix,
        ut_gw6: gatewaySix,
        ut_enable: activationConfig.ut_enable,
        tr_vlan: activationConfig.tr_vlan,
        tr_ip4: activationConfig.tr_ip4,
        tr_gw4: activationConfig.tr_gw4,
        tr_ip6: activationConfig.tr_ip6,
        tr_gw6: activationConfig.tr_gw6,
        tr_enable: activationConfig.tr_enable,
        ca_not_after: activationConfig.ca_not_after,
        gw_not_after: activationConfig.gw_not_after,
      });
    } else {
      setCurrState("untrusted:failure");
      setAttemptError(true);
      setIsAttemptOnGoing(false);
      setDialogOpen(true);
      setalertDialogTitle(
        `${t(
          `page.gatewayServer.services.untrustedInterface.form.prompt.error.title`,
        )}..!`,
      );
      setStatusText(() => (
        <>
          {t(
            `page.gatewayServer.services.untrustedInterface.form.prompt.error.message.0`,
          )}
          <br />
          <br />
          {t(
            `page.gatewayServer.services.untrustedInterface.form.prompt.error.message.1`,
          )}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>
      ));
    }
  };

  useEffect(() => {
    if (runEffect === "afterEffects") {
      currState.includes("success") && props.handleTrustedClose();
      setIpvFour(ipvFour);
      setGatewayFour(gatewayFour);
      setIpvSix(ipvSix);
      setGatewaySix(gatewaySix);
      setLan(lan);
    }

    setRunEffect("");
  }, [
    currState,
    gatewayFour,
    gatewaySix,
    ipvFour,
    ipvSix,
    lan,
    props,
    runEffect,
  ]);

  return (
    <Styled.StyledFormComponent class="mt-3">
      <Styled.StyledFormDivComponent class="mb-3 commonfeild">
        <GlobalTextField
          variant="outlined"
          margin="normal"
          fullWidth
          label={t(
            `page.gatewayServer.services.trustedInterface.form.ipv4p.label`,
          )}
          id={`${gatewayServices}-configureip-ipv4`}
          name="ipv4"
          color="secondary"
          value={ipvFour}
          onChange={(e) => handleChangeIpvFour(e, "/0")}
          onKeyUp={handleIpvFourKeyPress}
          onBlur={(e) => handleIpvFourBlur(e, "/0")}
          onFocus={(e) => handleFocusIpvFour(e)}
          aria-describedby="emailHelp"
          inputRef={inputForIpv4Ref}
          disabled={!isAttemptOnGoing ? "" : "true"}
          backgroundOnBlur={ipvFourError ? "#cc0000" : "#0094FD"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={ipvFourError ? "#cc0000" : ""}
          borderColor={ipvFourError ? "#cc0000" : ""}
          inputProps={{
            onKeyPress: (event) => {
              const { key } = event;
              if (
                key === "Enter" &&
                ipvFour.length !== 0 &&
                ipvFourError === false
              ) {
                inputForGatewayIpv4Ref.current.focus();
              }
            },
          }}
        />
        <Styled.StyledErrorDivComponent>
          {attemptError && ipvFourHelperText}
        </Styled.StyledErrorDivComponent>
      </Styled.StyledFormDivComponent>

      <Styled.StyledFormDivComponent class="mb-3 commonfeild">
        <GlobalTextField
          aria-describedby="emailHelp"
          type="text"
          variant="outlined"
          margin="normal"
          fullWidth
          label={t(
            `page.gatewayServer.services.trustedInterface.form.ipv4.label`,
          )}
          id={`${gatewayServices}-configure-gateway-ipv4`}
          color="secondary"
          onChange={(e) => handleChangeGatewayFour(e, "/0")}
          disabled={!isAttemptOnGoing ? "" : "true"}
          onBlur={(e) => handleGatewayFourBlur(e, "/0")}
          onFocus={(e) => handleGatewayFocusIpvFour(e)}
          backgroundOnBlur={gatewayFourError ? "#cc0000" : "#0094FD"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={gatewayFourError ? "#cc0000" : ""}
          borderColor={gatewayFourError ? "#cc0000" : ""}
          value={gatewayFour}
          inputRef={inputForGatewayIpv4Ref}
          inputProps={{
            onKeyPress: (event) => {
              const { key } = event;
              if (
                key === "Enter" &&
                gatewayFour.length !== 0 &&
                gatewayFourError === false
              ) {
                inputForIpv6Ref.current.focus();
              }
            },
          }}
        />
        <Styled.StyledErrorDivComponent>
          {attemptError && gatewayFourHelperText}
        </Styled.StyledErrorDivComponent>
      </Styled.StyledFormDivComponent>

      <Styled.StyledFormDivComponent class="mb-3 commonfeild">
        <GlobalTextField
          variant="outlined"
          margin="normal"
          fullWidth
          label={t(
            `page.gatewayServer.services.trustedInterface.form.ipv6p.label`,
          )}
          id={`${gatewayServices}-configure-ipv6`}
          onChange={(e) => handleChangeIpvSix(e, "/0")}
          onBlur={(e) => handleIpvSixBlur(e, "/0")}
          onFocus={(e) => handleSixIpvFour(e)}
          backgroundOnBlur={ipvSixError ? "#cc0000" : "#0094FD"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={ipvSixError ? "#cc0000" : ""}
          borderColor={ipvSixError ? "#cc0000" : ""}
          aria-describedby="emailHelp"
          type="text"
          color="secondary"
          disabled={!isAttemptOnGoing ? "" : "true"}
          value={ipvSix}
          inputRef={inputForIpv6Ref}
          inputProps={{
            onKeyPress: (event) => {
              const { key } = event;

              if (
                key === "Enter" &&
                ipvSix.length !== 0 &&
                ipvSixError === false
              ) {
                inputForGatewayIpv6Ref.current.focus();
              }
            },
          }}
        />
        <Styled.StyledErrorDivComponent>
          {attemptError && ipvSixHelperText}
        </Styled.StyledErrorDivComponent>
      </Styled.StyledFormDivComponent>

      <Styled.StyledFormDivComponent class="mb-3 commonfeild">
        <GlobalTextField
          variant="outlined"
          margin="normal"
          color="secondary"
          fullWidth
          label={t(
            `page.gatewayServer.services.trustedInterface.form.ipv6.label`,
          )}
          type="text"
          id={`${gatewayServices}-configure-gateway-ipv6`}
          aria-describedby="emailHelp"
          onChange={(e) => handleChangeGatewaySix(e, "/0")}
          onBlur={(e) => handleGatewaySixBlur(e, "/0")}
          onFocus={(e) => handleGatewaySixIpvFour(e)}
          backgroundOnBlur={gatewaySixError ? "#cc0000" : "#0094FD"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={gatewaySixError ? "#cc0000" : ""}
          borderColor={gatewaySixError ? "#cc0000" : ""}
          disabled={!isAttemptOnGoing ? "" : "true"}
          value={gatewaySix}
          inputRef={inputForGatewayIpv6Ref}
          inputProps={{
            onKeyPress: (event) => {
              const { key } = event;
              if (
                key === "Enter" &&
                gatewaySix.length !== 0 &&
                gatewaySixError === false
              ) {
                inputForLanRef.current.focus();
              }
            },
          }}
        />

        <Styled.StyledErrorDivComponent>
          {attemptError && gatewaySixHelperText}
        </Styled.StyledErrorDivComponent>
      </Styled.StyledFormDivComponent>

      <Styled.StyledFormDivComponent class="mb-3 commonfeild">
        <GlobalTextField
          variant="outlined"
          margin="normal"
          fullWidth
          color="secondary"
          label={t(
            `page.gatewayServer.services.trustedInterface.form.vLanId.label`,
          )}
          type="text"
          disabled={!isAttemptOnGoing ? "" : "true"}
          id={`${gatewayServices}-configure-vlanid`}
          aria-describedby="emailHelp"
          onChange={handleLan}
          onBlur={handleLanOnBlur}
          onFocus={handleVlanFocus}
          backgroundOnBlur={lanError ? "#cc0000" : "#0094FD"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={lanError ? "#cc0000" : ""}
          borderColor={lanError ? "#cc0000" : ""}
          value={lan}
          inputRef={inputForLanRef}
          inputProps={{
            onKeyPress: (event) => {
              const { key } = event;
              if (key === "Enter" && lan.length !== 0 && lanError === false) {
                buttonForSaveRef.current.focus();
              }
            },
          }}
        />
        <Styled.StyledErrorDivComponent>
          {attemptError && lanHelperText}
        </Styled.StyledErrorDivComponent>
      </Styled.StyledFormDivComponent>

      <Styled.StyledFooterdivComponent class="d-grid gap-2 mt-4 d-md-block">
        <GenericButton
          id={`${
            gatewayServices - props.trusted
              ? "untrusted-cancel-btn"
              : "trusted-cancel-btn"
          }`}
          backgroundColor="secondary"
          buttonName={t(`commons.cancelText`)}
          disabled={!isAttemptOnGoing ? "" : "true"}
          onClick={() =>
            props?.handleTrustedClose(
              setIpvFourHelperText(""),
              setGatewayFourHelperText(""),
              setIpvSixHelperText(""),
              setGatewaySixHelperText(""),
              setLanHelperText(""),
            )
          }
        />
        <GenericButton
          id={`${
            gatewayServices - props.trusted
              ? "untrusted-save-btn"
              : "trusted-save-btn"
          }`}
          backgroundColor="primary"
          buttonName={t(`commons.saveText`)}
          disabled={false}
          buttonRef={buttonForSaveRef}
          onClick={handleSubmited}
        />
      </Styled.StyledFooterdivComponent>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        divider={false}
        contentTitle={alertDialogTitle}
        contentText={statusText}
        agreeTitle={t(`commons.okayText`)}
        handleAgree={() => {
          setRunEffect("afterEffects");
          setDialogOpen(false);
        }}
        handleDisagree={() => {
          setRunEffect("afterEffects");
          setDialogOpen(true);
        }}
      />
    </Styled.StyledFormComponent>
  );
}
