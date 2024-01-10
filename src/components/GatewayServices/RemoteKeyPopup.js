import React, { useContext, useEffect, useRef, useState } from "react";
import callAPI from "../../apis/callAPI";
import { SetRemoteKeyAddressAPIResponder } from "../../apis/responders/set-remote-key-service-api-responder";
import Utility from "../../redux/actions/Utility";
import { gatewayServices } from "../../utils/GeneralComponentNames";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { Styled } from "./GatewayserviceStyling/RemoteKeyPopup.style";
import { GlobalTextField } from "../../style/TextField/TextField";
import { useTranslation } from "react-i18next";

export default function RemoteKeyPopup({ context, ...props }) {
  const { t } = useTranslation();

  const { setOpenAlertDialog, setAlertContent, loading } = props;

  const inputForAddressRef = useRef(null);
  const buttonForSaveRef = useRef(null);

  const AppOverlayContext = useContext(OverlayContext);

  const [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHelperText, setAddressHelperText] = useState("");
  const [oldAddress, setOldAddress] = useState({ address: null });
  const [runEffectRk, setRunEffectRk] = useState("");

  const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

  useEffect(() => {
    if (loading === false) {
      setRunEffectRk("run");
    }
  }, [loading]);

  useEffect(() => {
    const remoteKeyService = props?.rksAddressData?.rkservice ?? "";

    if (runEffectRk === "run") {
      remoteKeyService?.toLocaleLowerCase() === "not configured"
        ? setAddress("")
        : setAddress(remoteKeyService);

      setOldAddress((prev) => ({ ...prev, address: remoteKeyService }));
    }

    setRunEffectRk("");
  }, [props?.rksAddressData?.rkservice, runEffectRk]);

  const handleAddressKeyPress = (event) => {
    const { key } = event;

    if (
      (key === "Enter" || key === "Tab") &&
      address.length !== 0 &&
      addressError === false
    ) {
      buttonForSaveRef.current.click();
    }
  };

  const handleAddressBlur = (event) => {
    validateAddress(event);
    handleChangeAddress(event);
  };

  const handleChangeAddress = (props) => {
    let value = props.target.value;
    setAddress(value);
  };

  const validateAddress = (props) => {
    let value = props.target.value;

    const required = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.context.remoteKeyAgent.field.validation.0`,
      ),
    };

    const inValidAddress = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
      ),
    };

    const inValidDomain = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.context.remoteKeyAgent.field.validation.2`,
      ),
    };

    const inValidPrefix = {
      isValid: false,
      message: (
        <>
          <li>
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
            )}
          </li>
          <li>
            {t(
              `page.gatewayServer.services.context.remoteKeyAgent.field.validation.3`,
            )}
          </li>
        </>
      ),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(
        `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
      ),
    };

    const alphabetPattern = new RegExp(/^[a-zA-Z]$/);

    const FQDNPattern = new RegExp(
      /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--+)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/,
    );

    const isDomainName = (value || "")
      .split("")
      .filter((character) => alphabetPattern.test(character)).length;

    if (isDomainName) {
      const regexResult = FQDNPattern.test(value);

      if (!regexResult) {
        setAddressHelperText(inValidDomain.message);
        setAddressError(true);

        return false;
      } else {
        setAddressHelperText("");
        setAddressError(false);

        return true;
      }
    } else if (value.includes(":")) {
      const IPv6Pattern = new RegExp(
        /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
      );
      const inValidAddress = {
        isValid: false,
        message: t(
          `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
        ),
      };

      const inValidPrefix = {
        isValid: false,
        message: (
          <>
            <li>
              {t(
                `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
              )}
            </li>
            <li>
              {t(
                `page.gatewayServer.services.context.remoteKeyAgent.field.validation.3`,
              )}
            </li>
          </>
        ),
      };

      const inValidSlashes = {
        isValid: false,
        message: t(
          `page.gatewayServer.services.context.remoteKeyAgent.field.validation.1`,
        ),
      };

      const ip = value.split("/")[0];
      const prefix = value.split("/")[1];
      const ipRegexTest = !Boolean(IPv6Pattern.test(ip));
      const isPrefix = prefix && isNaN(prefix);
      const isSlashes = !Boolean(value.split("/").length === 2);
      const isEndsWithSlash = value.endsWith("/");

      if (!Boolean(value.length)) {
        setAddressHelperText(required.message);
        setAddressError(false);

        return true;
      } else if (ipRegexTest) {
        setAddressHelperText(inValidAddress.message);
        setAddressError(true);

        return false;
      } else if (prefix === undefined || null || "") {
        setAddressHelperText("");
        setAddressError(false);

        return true;
      } else if (!isPrefix) {
        setAddressHelperText(inValidPrefix.message);
        setAddressError(true);

        return false;
      } else if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
        setAddressHelperText(inValidSlashes.message);
        setAddressError(true);

        return false;
      } else {
        setAddressHelperText("");
        setAddressError(false);

        return true;
      }
    } else {
      const ipRegex = new RegExp(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
      );
      const ip = value.split("/")[0];
      const prefix = value.split("/")[1];
      const ipRegexTest = !Boolean(ipRegex.test(ip));
      const isPrefix = prefix && isNaN(prefix);
      const isSlashes = !Boolean(value.split("/").length === 2);
      const isEndsWithSlash = value.endsWith("/");
      const ipSection = value.split(".");
      let lastSection = !!!Number(ipSection[ipSection.length - 1]);
      let lastIncludes = ipSection[ipSection.length - 1].includes("/")
        ? !!!Number(ipSection[ipSection.length - 1].split("/")[0])
        : lastSection;

      if (!Boolean(value.length)) {
        setAddressHelperText(required.message);
        setAddressError(false);

        return true;
      } else if (ipRegexTest) {
        setAddressHelperText(inValidAddress.message);
        setAddressError(true);

        return false;
      } else if (value === "0.0.0.0" || lastIncludes) {
        setAddressHelperText(inValidAddress.message);
        setAddressError(true);

        return false;
      } else if (prefix === undefined || null || "") {
        setAddressHelperText("");
        setAddressError(false);

        return true;
      } else if (!isPrefix) {
        setAddressHelperText(inValidPrefix.message);
        setAddressError(true);

        return false;
      } else if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
        setAddressHelperText(inValidSlashes.message);
        setAddressError(true);

        return false;
      } else {
        setAddressHelperText("");
        setAddressError(false);

        return true;
      }
    }
  };

  const handleSubmit = () => {
    if (!Boolean(address?.length)) {
      setAddressHelperText(
        t(
          `page.gatewayServer.services.context.remoteKeyAgent.field.validation.0`,
        ),
      );
      setAddressError(true);
    } else if (address === oldAddress.address) {
      props.setOpenAlertDialog(true);
      props.setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.alert.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.alert.message`,
        ),
        contentInfo: "",
      });

      validateAddress({ target: { value: address } });
    } else {
      if (validateAddress({ target: { value: address } })) {
        setIsAttemptOnGoing(true);

        callAPI({
          path: "set-remote-key-address",
          params: { gatewayIP: currentGatewayAddress, context },
          data: address,
          responder: SetRemoteKeyAddressAPIResponder,
          onComplete: SetRemoteKeyAddressOnCompleteHandler,
        });
      } else {
        setIsAttemptOnGoing(false);
      }
    }
  };

  const SetRemoteKeyAddressOnCompleteHandler = (response) => {
    if (response.state === "SET_REMOTE_KEY_ADDRESS_SUCESS") {
      setOpenAlertDialog(true);
      setIsAttemptOnGoing(false);
      setAddress("");

      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.success.message`,
        ),
        contentInfo: "",
      });

      AppOverlayContext.setSucessRksText(
        "Remote Key Service Configured sucessfully.",
      );

      props.setRksAddressDataData((oldState) => ({
        ...oldState,
        rkservice: address,
      }));

      setTimeout(() => {
        props.handleDistributedClosePortal();
      }, 1000);
    } else {
      setIsAttemptOnGoing(false);
      setOpenAlertDialog(true);
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
      AppOverlayContext.setAttemptErrorRksText(
        t(
          `page.gatewayServer.services.context.remoteKeyAgent.prompt.error.message.2`,
        ),
      );
    }
  };

  const onKeyPress = ({ key }) => {
    if (key === "Enter" && address.length !== 0 && addressError === false) {
      buttonForSaveRef.current.focus();
    }
  };

  return (
    <Styled.StyledContainer
      tabindex="-1"
      id="addgateway"
      not
      aria-labelledby="addgatewayLabel"
    >
      <Styled.HeaderDivComponent
        style={{
          opacity: "0.95",
          paddingTop: "18px",
          paddingInlineEnd: "1rem",
          paddingBottom: "14px",
        }}
      >
        <Styled.StyledH6Component id="addgatewayLabel">
          {t(`page.gatewayServer.services.context.remoteKeyAgent.popup.title`)}
        </Styled.StyledH6Component>

        <Styled.StyledCloseIconComponent
          id={`${gatewayServices}-remotekey-agent-close-icon-btn`}
          onClick={() => {
            props.handleDistributedClosePortal();
            setAddressHelperText(" ");
          }}
        />
      </Styled.HeaderDivComponent>

      {props.loading ? (
        <div style={{ padding: "2em" }}>
          <WidthFillerSkeleton width="400" height="200" />
        </div>
      ) : (
        <Styled.BodyDivComponent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <Styled.StyledSubDivContainer>
              {t(
                `page.gatewayServer.services.context.remoteKeyAgent.field.description`,
              )}
            </Styled.StyledSubDivContainer>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "345px",
            }}
          >
            <GlobalTextField
              fullWidth
              aria-describedby="emailHelp"
              id={`${gatewayServices}-remotekey-address-input`}
              name="address"
              label={t(
                `page.gatewayServer.services.context.remoteKeyAgent.field.label`,
              )}
              type="text"
              variant="outlined"
              margin="normal"
              value={address}
              ref={inputForAddressRef}
              disabled={!isAttemptOnGoing ? "" : "true"}
              inputProps={{ onKeyPress }}
              onChange={handleChangeAddress}
              onKeyUp={handleAddressKeyPress}
              onBlur={handleAddressBlur}
              backgroundOnBlur={addressError ? "#cc0000" : "#0094FD"}
              borderColorOnFocus={"#0094FD"}
              labelColorOnFocus={"#0094FD"}
              labelColor={addressError ? "#cc0000" : ""}
              borderColor={addressError ? "#cc0000" : ""}
              style={{ width: "345px" }}
              placeholder={t(`commons.notConfiguredText`)}
              InputLabelProps={{ shrink: true }}
            />

            <Styled.StyledFormDivComponent>
              <div
                style={{
                  color: "#ef4444",
                  margin: "0.2em -4em 0 0",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  width: "100%",
                }}
              >
                {addressError && addressHelperText}
              </div>
            </Styled.StyledFormDivComponent>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
                width: "345px",
                gap: "10px",
              }}
            >
              <GenericButton
                id={`${gatewayServices}-remotekey-agent-cancel-btn`}
                backgroundColor="secondary"
                buttonName={t(`commons.cancelText`)}
                disabled={!isAttemptOnGoing ? "" : "true"}
                onClick={() => props.handleDistributedClosePortal()}
              />

              <GenericButton
                id={`${gatewayServices}-remotekey-agent-save-btn`}
                backgroundColor="primary"
                buttonName={t(`commons.saveText`)}
                disabled={false}
                onClick={handleSubmit}
                buttonRef={buttonForSaveRef}
              />
            </div>
          </div>
        </Styled.BodyDivComponent>
      )}
    </Styled.StyledContainer>
  );
}
