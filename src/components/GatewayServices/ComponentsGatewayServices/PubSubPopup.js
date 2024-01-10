import { Box, Typography } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import callAPI from "../../../apis/callAPI";
import { pubsubSaveResponder } from "../../../apis/responders/pubsubSaveResponder";
import Utility from "../../../redux/actions/Utility";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import PubSubCurrentState from "./PubSubCurrentState";
import { Styled } from "../GatewayserviceStyling/Pubsub/pubsubpopup.style";
import { GenericButton } from "../../../style/GenericButton/GenericButton";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import { GlobalTextField } from "../../../style/TextField/TextField";
import { useTranslation } from "react-i18next";

const initPublisherIP = (props) => {
  const publisherIP = props?.pubSubApiData?.publisherip?.toLocaleLowerCase();
  const isNotNotConfigured = publisherIP === "not configured";

  return isNotNotConfigured ? "" : props.pubSubApiData.publisherip;
};

function PubSubPopup({ context, ...props }) {
  const { t, i18n } = useTranslation();

  const inputRef = useRef(null);

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const [publisher, setPublisher] = useState(() => initPublisherIP(props));
  const [publisherError, setPublisherError] = useState(false);
  const [publisherHelperText, setPublisherHelperText] = useState("");
  const [oldStateIp, setOldStateIp] = useState({
    publisher: "",
    checkChangePub: false,
    checkChangeSub: false,
  });
  const [isSpinner, setIsSpinner] = useState(false);

  const handlePublisher = (event) => {
    const value = event.target.value;
    setPublisher(value);
    validatePublisher(value);
  };

  const handlePublisherBlur = (event) => {
    const value = event.target.value;
    setPublisher(value);
    validatePublisher(value);
  };

  function ipsixValidate(value) {
    const IPv6Pattern = new RegExp(
      /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
    );

    const required = {
      isValid: false,
      message: t(`page.gatewayServer.services.context.pubSub.validation.0`),
    };

    const inValidAddress = {
      isValid: false,
      message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
    };

    const inValidPrefix = {
      isValid: false,
      message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
    };

    const inValidSlashes = {
      isValid: false,
      message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
    };

    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(IPv6Pattern.test(ip));

    const isPrefix =
      prefix &&
      (isNaN(prefix) || parseInt(prefix) > 128 || parseInt(prefix) < 1);

    if (!Boolean(value.length)) {
      setPublisherHelperText(required.message);
      setPublisherError(required.isValid);
    } else if (ipRegexTest) {
      setPublisherHelperText(inValidAddress.message);
      setPublisherError(true);
    } else if (isPrefix) {
      setPublisherHelperText(inValidPrefix.message);
      setPublisherError(true);
    } else if (value.includes("/")) {
      setPublisherHelperText(inValidSlashes.message);
      setPublisherError(true);
    } else {
      setPublisherHelperText("");
      setPublisherError(false);
    }
  }

  const validatePublisher = useCallback((value) => {
    if (value.includes(":")) {
      ipsixValidate(value);
    } else {
      const required = {
        isValid: false,
        message: t(`page.gatewayServer.services.context.pubSub.validation.0`),
      };

      const inValidAddress = {
        isValid: false,
        message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
      };

      const inValidPrefix = {
        isValid: false,
        message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
      };

      const inValidSlashes = {
        isValid: false,
        message: t(`page.gatewayServer.services.context.pubSub.validation.1`),
      };

      const ipRegex = new RegExp(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
      );

      const ip = value.split("/")[0];
      const prefix = value.split("/")[1];

      const ipRegexTest = !Boolean(ipRegex.test(ip));

      const isPrefix =
        prefix &&
        (isNaN(prefix) || parseInt(prefix) > 32 || parseInt(prefix) < 0);
      const isSlashes = !Boolean(value.split("/").length === 2);
      const isEndsWithSlash = value.endsWith("/");
      const ipSection = value.split(".");
      let lastSection = !!!Number(ipSection[ipSection.length - 1]);

      if (!Boolean(value.length)) {
        setPublisherHelperText(required.message);
        setPublisherError(true);
      } else if (ipRegexTest) {
        setPublisherHelperText(inValidAddress.message);
        setPublisherError(true);
      } else if (value === "0.0.0.0" || lastSection) {
        setPublisherHelperText(inValidAddress.message);
        setPublisherError(true);
      } else if (prefix === undefined || null || "") {
        setPublisherHelperText("");
        setPublisherError(false);
      } else if (isPrefix) {
        setPublisherHelperText(inValidPrefix.message);
        setPublisherError(true);
      } else if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
        setPublisherHelperText(inValidSlashes.message);
        setPublisherError(true);
      } else {
        setPublisherHelperText("");
        setPublisherError(false);
      }
    }
  }, []);

  const onCompletePubSubResponder = (response) => {
    if (response.state === "PUBSUB_SAVE_SUCCESS") {
      props.setPubSubApiData((oldState) => ({
        ...oldState,
        publisherip: publisher,
      }));

      props.setAlertContent({
        contentTitle: `${t(`commons.successText`)}`,
        contentText: t(
          `page.gatewayServer.services.context.pubSub.prompt.success.text`,
        ),
        contentInfo: "",
      });

      props.setOpenAlertDialog(true);

      setTimeout(() => {
        props.handleClosePortalnoBackdrop();
      }, 1000);
    } else {
      props.setAlertContent({
        contentTitle: `${t(`commons.errorText`)}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.pubSub.prompt.error.save.0`,
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.pubSub.prompt.error.save.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      props.setOpenAlertDialog(true);
    }

    setIsSpinner(false);
  };
  const handleCancel = (event) => {
    props.handleClosePortalnoBackdrop();
  };

  const handleSave = (event) => {
    if (!!!publisher) {
      setPublisherHelperText(
        t(`page.gatewayServer.services.context.pubSub.validation.0`),
      );
    } else if (publisher === oldStateIp.publisher) {
      props.setOpenAlertDialog(true);

      props.setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.pubSub.prompt.alert.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.pubSub.prompt.alert.info`,
        ),
        contentInfo: "",
      });
    } else if (!publisherHelperText && !publisherError) {
      setIsSpinner(true);

      callAPI({
        path: "savePubSub",
        params: { gatewayIP, context },
        data: {
          id: props.pubSubApiData.id,
          enable: Number(props.isPubSubServiceEnabled),
          subscriberRunning: props.pubSubApiData.subscriberRunning,
          publisherRunning: props.pubSubApiData.publisherRunning,
          publisherip: publisher,
        },
        responder: pubsubSaveResponder,
        onComplete: onCompletePubSubResponder,
      });
    }
  };

  useEffect(() => {
    const publisherIP = props?.pubSubApiData?.publisherip?.toLocaleLowerCase();
    const isNotNotConfigured = publisherIP === "not configured";

    setOldStateIp((oldState) => {
      return {
        publisher: isNotNotConfigured ? "" : props.pubSubApiData.publisherip,
        checkChangePub: !!props.pubSubApiData.subscriberRunning,
        checkChangeSub: !!props.pubSubApiData.publisherRunning,
      };
    });
  }, []);

  return (
    <Styled.ComponentContainer key={props.currRunEffect}>
      <Styled.HeaderWrapper>
        <Styled.HeaderText>
          {t(`page.gatewayServer.services.context.pubSub.text`)}
        </Styled.HeaderText>

        <Styled.ClosePopupButton
          id={`${gatewayServices}-pubsub-close-icon-btn`}
          onClick={props.handleClosePortal}
          children={<CloseRounded />}
        />
      </Styled.HeaderWrapper>

      <Styled.SkeletonWrapper>
        {props.loading ? (
          <WidthFillerSkeleton width="400" height="200" />
        ) : (
          <>
            <Styled.CheckBoxesWrapper>
              <Box style={{ width: "45%" }}>
                <Typography>
                  <b>
                    {t(
                      `page.gatewayServer.services.context.pubSub.radio.label1`,
                    )}
                  </b>
                  <PubSubCurrentState
                    currentState={
                      props.pubSubApiData.publisherRunning === 0
                        ? t(
                            `page.gatewayServer.services.context.pubSub.stoppedText`,
                          )
                        : props.pubSubApiData.publisherRunning === 1
                        ? t(
                            `page.gatewayServer.services.context.pubSub.runningText`,
                          )
                        : t(`commons.errorText`)
                    }
                  />
                </Typography>
              </Box>
              <Box style={{ width: "55%" }}>
                <Typography
                  style={{
                    marginLeft: "2em",
                  }}
                >
                  <b>
                    {t(
                      `page.gatewayServer.services.context.pubSub.radio.label2`,
                    )}
                  </b>
                  <PubSubCurrentState
                    currentState={
                      props.pubSubApiData.subscriberRunning === 0
                        ? t(
                            `page.gatewayServer.services.context.pubSub.stoppedText`,
                          )
                        : props.pubSubApiData.subscriberRunning === 1
                        ? t(
                            `page.gatewayServer.services.context.pubSub.runningText`,
                          )
                        : t(`commons.errorText`)
                    }
                  />
                </Typography>
              </Box>
            </Styled.CheckBoxesWrapper>

            <Styled.PublisherIpFieldWrapper>
              <GlobalTextField
                variant="outlined"
                margin="normal"
                fullWidth
                label={t(`page.gatewayServer.services.context.pubSub.label`)}
                placeholder={t(`commons.notConfiguredText`)}
                InputLabelProps={{ shrink: true }}
                id={`${gatewayServices}-services-pubsub-publisher-field`}
                name="publish"
                autoComplete="identity"
                onChange={handlePublisher}
                onBlur={handlePublisherBlur}
                aria-describedby="emailHelp"
                value={publisher}
                ref={inputRef}
              />
            </Styled.PublisherIpFieldWrapper>

            <Styled.PublisherIpHelperTextWrapper>
              <Styled.PublisherIpHelperText>
                {publisherHelperText}
              </Styled.PublisherIpHelperText>
            </Styled.PublisherIpHelperTextWrapper>

            <Styled.ActionWrapper>
              <GenericButton
                id={`${gatewayServices}-pubsub-cancel-btn`}
                buttonName={t(`commons.cancelText`)}
                backgroundColor="secondary"
                disabled={false}
                onClick={handleCancel}
              />

              <GenericButton
                id={`${gatewayServices}-pubsub-save-btn`}
                backgroundColor="primary"
                buttonName={
                  isSpinner ? <Styled.Spinner /> : t(`commons.saveText`)
                }
                disabled={false}
                onClick={handleSave}
              />
            </Styled.ActionWrapper>
          </>
        )}
      </Styled.SkeletonWrapper>
    </Styled.ComponentContainer>
  );
}

export default PubSubPopup;
