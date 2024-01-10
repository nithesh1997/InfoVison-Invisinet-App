import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import callAPI from "../../apis/callAPI";
import { AddGatewayAPIResponder } from "../../apis/responders/add-gateway-api-responder";
import { setActiveGateway } from "../../Gateway/activeGatewaySlice";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import { gateway } from "../../utils/GeneralComponentNames";
import { AddGatewayForm } from "./AddGatewayForm";
import { InfoCircle } from "react-bootstrap-icons";
import ToolTip from "../../utils/Tooltip/Tooltip";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import AlertDialog from "./MaterialComponents/AlertDialog";
import { ProjectName } from "../../utils/ProjectName/Index";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const validateIpAddress = (value, t, i18n) => {
  const errElement = () => {
    return (
      <p style={{ height: "0.2rem", marginTop: 0, color: "#EF4444" }}>
        {t("commons.gateway.manage.add.prompt.validation.ipStandard.message")}
        <ToolTip
          title={
            <>
              {t(
                "commons.gateway.manage.add.prompt.validation.ipStandard.tooltip.0",
                {
                  Gateway: common.GATEWAY,
                },
              )}
              <br />
              <br />
              <li>
                <Trans
                  i18nKey={
                    "commons.gateway.manage.add.prompt.validation.ipStandard.tooltip.2"
                  }
                >
                  Valid <b>IPv4 Address</b> with octet sections like{" "}
                  <code>1.2.3.4</code>
                </Trans>
              </li>
              <br />
              <li>
                <Trans
                  i18nKey={
                    "commons.gateway.manage.add.prompt.validation.ipStandard.tooltip.2"
                  }
                >
                  Valid <b>IPv6 Address</b> with hextet sections like
                  <code>2001:db8:3333:4444:5555:6666:7777:8888</code>
                </Trans>
              </li>
              <br />
              <li>
                <Trans
                  i18nKey={
                    "commons.gateway.manage.add.prompt.validation.ipStandard.tooltip.3"
                  }
                >
                  Valid <b>FQDN (Fully Qualified Domain Name)</b> like
                </Trans>{" "}
                <code>{ProjectName.toLowerCase()}.client-name.com</code>.
              </li>
            </>
          }
        >
          <Styled.IconButton>
            <InfoCircle size={"0.50em"} />
          </Styled.IconButton>
        </ToolTip>
      </p>
    );
  };

  const alphabetPattern = new RegExp(/^[a-zA-Z]$/);
  const FQDNPattern = new RegExp(
    /^(?=.{1,254}$)((?=[a-zA-Z0-9-]{1,63}\.)(xn--+)?[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}$/,
  );
  const IPv4Pattern = new RegExp(
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
  );
  const IPv6Pattern = new RegExp(
    /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
  );

  const isDomainName = (value || "")
    .split("")
    .filter((character) => alphabetPattern.test(character)).length;
  const isIPv4 = value.includes(".") && !isDomainName;
  const isIPv6 = value.includes(":");

  if (isIPv4) {
    const regexResult = IPv4Pattern.test(value);

    if (regexResult) {
      const IpSections = value.split(".");
      const isLastSectionZero = !!!Number(IpSections[IpSections.length - 1]);

      if (!(value === "0.0.0.0" || isLastSectionZero)) {
        return { isError: false, message: " " };
      }
    }
  }

  if (isIPv6) {
    const regexResult = IPv6Pattern.test(value);

    if (regexResult) {
      return { isError: false, message: " " };
    }
  }

  if (isDomainName) {
    const regexResult = FQDNPattern.test(value);

    if (regexResult) {
      return { isError: false, message: " " };
    }
  }

  return { isError: true, message: errElement() };
};

const AddGateway = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const inputForAddressRef = useRef(null);
  const buttonForSaveRef = useRef(null);

  const AppOverlayContext = useContext(OverlayContext);

  const [address, setAddress] = useState("");
  const [sucessText, setSucessText] = useState(" ");
  const [attemptErrorText, setAttemptErrorText] = useState(" ");
  const [addressHelperText, setAddressHelperText] = useState(" ");

  const [attemptError, setAttemptError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [gatewayNameError, setGatewayNameError] = useState(false);

  const [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);
  const [isDisableAdding, setIsDisableAdding] = useState({ flag: true });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [alertDialogTitle, setalertDialogTitle] = useState(
    `${t("commons.errorText")}!`,
  );

  const validateIP = (ip) => {
    let isValid = false;

    ip = ip.toString();
    ip = ip.split(".");

    if (ip.length !== 4) {
      return isValid;
    }

    var pattern = new RegExp(/^\d{1,3}$/);
    var badVal = false;

    ip.forEach((val, ind, arr) => {
      if (!pattern.test(val)) {
        badVal = true;
      } else {
        val = parseInt(val);
        arr[ind] = val;
        if (val < 0 || val > 255) {
          badVal = true;
        }
      }
    });
    if (badVal) {
      return isValid;
    }

    isValid = true;
    return isValid;
  };

  const validateAddress = (value) => {
    var pattern = new RegExp(
      /^(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.)|([a-zA-Z0-9]\.))+[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]$/,
    );

    if (value.length < 1) {
      return {
        isError: true,
        message: t("commons.gateway.manage.add.prompt.mandatory"),
      };
    } else if (!(pattern.test(value) || validateIP(value))) {
      return {
        isError: true,
        message: () => (
          <>
            {t("commons.gateway.manage.add.prompt.validation.address.0")}
            <ul>
              <li>
                {t("commons.gateway.manage.add.prompt.validation.address.1")}
              </li>

              <li>
                {t("commons.gateway.manage.add.prompt.validation.address.2")}{" "}
                <code>ec2-13.amazon.com</code>.
              </li>
            </ul>
          </>
        ),
      };
    } else {
      return {
        isError: false,
        message: " ",
      };
    }
  };

  const resetFields = () => {
    setAddress("");
    setAddressError(false);
    setAddressHelperText(" ");

    setAttemptError(false);
    setAttemptErrorText(" ");

    setSucessText(" ");
  };

  const handleAddressBlur = (event) => {
    let validState = validateIpAddress(event.target.value, t, i18n);
    setAddressHelperText(validState.message);
    setAddressError(validState.isError);
  };

  const handleAddressFocus = (event) => {
    setAddressError(false);
    setAddressHelperText(" ");
  };

  const handleChangeAddress = (props) => {
    setAddress(props.target.value);
  };

  const handleSubmit = (e) => {
    let address = inputForAddressRef.current.value;
    let validStateAddress = validateIpAddress(address, t, i18n);

    if (validStateAddress.isError === false) {
      setIsAttemptOnGoing(true);
      setAttemptError(false);
      setAttemptErrorText("");
      setSucessText("");
      callAPI({
        path: "add-gateway",
        data: { address },
        responder: AddGatewayAPIResponder,
        onComplete: addGatewayOnCompleteHandler,
        onCompleteArguments: [address],
      });
    } else {
      setIsAttemptOnGoing(false);
      setAddressError(validStateAddress.isError);
      setAddressHelperText(validStateAddress.message);
    }
  };

  const addGatewayOnCompleteHandler = (response, address) => {
    if (response.state === "ADD_GATEWAY_SUCESS") {
      const txt = `${t(`commons.gateway.manage.add.prompt.addSuccess`, {
        GATEWAY: common.GATEWAY,
        SERVER: common.TAC_SERVER,
      })}`;

      const payload = response?.data || { name: "", address };

      setAttemptError(false);
      setAttemptErrorText("");
      setStatusText(txt);
      setDialogOpen(true);
      setalertDialogTitle(t("commons.successText"));
      let newGW = {
        ...payload,
        id: new Date().getTime(),
        offline: false, // Add gateway API will be successful only if it is online.
        checked: true,
      };
      AppOverlayContext.setGatewayList((latest) => {
        let newList = [...latest];
        newList.push(newGW);
        return newList;
      });

      props.setGatewayListData((latest) => {
        let newList = [...latest];
        newList.push(newGW);

        window.gatewayListData = newList;
        return newList;
      });
      props.setSelectedGateway(newGW);
      props.setHelpText(
        t("commons.gateway.manage.add.prompt.selectActive", {
          GATEWAY: common.GATEWAY,
          TAC_SERVER: common.TAC_SERVER,
        })?.toLowerCase(),
      );

      let location = JSON.parse(JSON.stringify(props.location));
      let search = new URLSearchParams(location.search);
      if (
        search.get("gatewaySelection") === "switch" &&
        search.get("forceAdd") === "true"
      ) {
        let defGW = {
          name: newGW.name,
          address: newGW.address,
          checked: true,
        };
        window.sessionStorage.setItem(
          "ba-selected-gateway",
          JSON.stringify(defGW),
        );
        AppOverlayContext.setSelectedGateway(defGW);
        dispatch(setActiveGateway({ ...defGW }));

        search.delete("forceAdd");
        location.search = search.toString();
        if (location.key) {
          delete location.key;
        }

        props.history.push(location);
      }

      setAddress("");

      setIsAttemptOnGoing(false);

      setTimeout(() => {
        props.handleClose("close");
        setSucessText("");
        setAttemptErrorText("");
        setAttemptError(false);
      }, 2222);
    } else {
      setAttemptError(true);
      setDialogOpen(true);
      setalertDialogTitle(`${t("commons.errorText")}!`);
      setStatusText(
        <>
          {t("commons.gateway.manage.add.prompt.error.addError.0", {
            GATEWAY: common.GATEWAY.toLowerCase(),
          })}

          <br />
          <br />
          {t("commons.gateway.manage.add.prompt.error.addError.1")}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );

      setIsAttemptOnGoing(false);
    }
  };

  useEffect(() => {
    if (isDisableAdding && props.disableAdding) {
      // props.handleClose("close");
      setIsDisableAdding(false);
    }
  }, [isDisableAdding, props]);

  useEffect(() => {
    if (!props.isCardOpen) {
      resetFields();
    }
  }, [props.isCardOpen]);

  return (
    <>
      <AddGatewayForm
        address={address}
        handleChangeAddress={handleChangeAddress}
        isAttemptOnGoing={isAttemptOnGoing}
        inputForAddressRef={inputForAddressRef}
        handleAddressBlur={handleAddressBlur}
        handleAddressFocus={handleAddressFocus}
        gateway={gateway}
        resetFields={resetFields}
        handleSubmit={handleSubmit}
        handleClose={props.handleClose}
        buttonForSaveRef={buttonForSaveRef}
        gatewayNameError={gatewayNameError}
        addressError={addressError}
        addressHelperText={addressHelperText}
      />

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={alertDialogTitle}
        contentText={statusText}
        contentInfo=""
        handleAgree={() => setDialogOpen(false)}
        handleDisagree={() => setDialogOpen(false)}
        agreeTitle={t("commons.okayText")}
      />
    </>
  );
};

export default withRouter(AddGateway);
const Styled = {
  IconButton: styled(IconButton)`
    padding: 0 0.2em;

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};
