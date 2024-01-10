import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import callAPI from "../../../apis/callAPI";
import { modifyServiceResponder } from "../../../apis/responders/gateway-services-api-responder";
import { pubsubAPIResponder } from "../../../apis/responders/pubsubAPIResponder";
import Utility from "../../../redux/actions/Utility";
import { AntSwitch, Styled } from "./AntSwitch";
import { StyledPub } from "../GatewayserviceStyling/Pubsub/pub.style";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import Tooltip from "../../../utils/Tooltip/Tooltip";
import Style from "../../../style";
import DisplaySettingsRounded from "@mui/icons-material/DisplaySettingsRounded";
import { useTranslation } from "react-i18next";

function Pub(props) {
  const { t, i18n } = useTranslation();
  const {
    setAlertContent,
    setOpenAlertDialog,
    setpubSub,
    pubsub,
    gatewayIP,
    pubsubData,
    selectedValue,
    setRunEffect1,
    openModel,
    setLoading,
    context,
  } = props;

  const [isSetpubsub, setIspubsub] = useState(false);

  const GatewayServicesSysylogOnCompleteHandler = (response, state) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setAlertContent({
        contentTitle: t(
          `page.gatewayServer.services.context.pubSub.prompt.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.pubSub.toggle.prompt.success`,
        ),
        contentInfo: "",
      });

      setIspubsub(false);
      setOpenAlertDialog(true);
    } else {
      setpubSub((prev) => !prev);
      setIspubsub(false);

      setAlertContent({
        contentTitle: `${t(`commons.errorText`)}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.pubSub.toggle.prompt.error.0`,
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.pubSub.toggle.prompt.error.1`,
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

  const toggleSwitch = (e, value) => {
    if (value === "PubSub") {
      setpubSub((prev) => !prev);
      setIspubsub(true);
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP },
        data: {
          ctx_name: selectedValue,
          ui_name: pubsubData.ui_name,
          svc_name: pubsubData.svc_name,
          ns_code: pubsubData.ns_code,
          enable: pubsub ? 0 : 1,
          state: pubsubData.state,
          svc_type: pubsubData.svc_type,
          config_chg: pubsubData.config_chg,
          service: pubsubData.service,
          id: pubsubData.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [
          pubsub ? t(`commons.enablingText`) : t(`commons.enablingText`),
        ],
        onComplete: GatewayServicesSysylogOnCompleteHandler,
      });
    }
  };

  const PubsubOnCompleteHandlerConfig = (response) => {
    if (response.state === "PUBSUB_ADDRESS_SUCESS") {
      props.setPubSubApiData(response.data);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      props.setAlertContent({
        contentTitle: `${t(`commons.errorText`)}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.pubSub.toggle.prompt.error1.0`,
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.pubSub.toggle.prompt.error1.1`,
            )}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
        contentInfo: "",
      });
      props.setOpenAlertDialog(true);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  return (
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
        <StyledPub.Typo>
          {t(`page.gatewayServer.services.context.pubSub.text`)}
        </StyledPub.Typo>
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
              visibility: isSetpubsub ? "visible" : "hidden",
              width: "20px",
              height: "20px",
            }}
          />

          <Typography
            style={{
              fontWeight: 600,
              fontSize: "0.8rem",
              color:
                !!!props.pubSubApiData.publisherip ||
                props.pubSubApiData.publisherip.toUpperCase() ===
                  ("NOT CONFIGURED" || "") ||
                isSetpubsub
                  ? "#6c757d"
                  : "black",
            }}
          >
            {pubsub
              ? isSetpubsub
                ? t(`commons.enablingText`)
                : t(`commons.enabledText`)
              : isSetpubsub
              ? t(`commons.disablingText`)
              : t(`commons.disabledText`)}
          </Typography>

          <Tooltip
            label={
              !!!props.pubSubApiData.publisherip ||
              props.pubSubApiData.publisherip.toUpperCase() ===
                ("NOT CONFIGURED" || "")
                ? t(`page.gatewayServer.services.context.pubSub.tooltip`)
                : ""
            }
          >
            <span>
              <AntSwitch
                id={`${gatewayServices}-pubsub-toggle-switch`}
                style={{
                  cursor:
                    !!!props.pubSubApiData.publisherip ||
                    props.pubSubApiData.publisherip.toUpperCase() ===
                      "NOT CONFIGURED"
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={
                  !!!props.pubSubApiData.publisherip ||
                  props.pubSubApiData.publisherip.toUpperCase() ===
                    "NOT CONFIGURED" ||
                  isSetpubsub
                }
                checked={props.pubsub}
                onChange={(e) => toggleSwitch(e, "PubSub")}
              />
            </span>
          </Tooltip>
        </div>

        <div style={{ width: "20%" }}>
          <Style.GenericButton
            id={`${gatewayServices}-pubsub-btn`}
            buttonName={t(`commons.configureText`)}
            Icon={
              <DisplaySettingsRounded
                style={{ width: "0.8em", height: "0.8em" }}
              />
            }
            backgroundColor="primary"
            style={{ margin: "auto" }}
            onClick={() => {
              setLoading(true);
              setRunEffect1("pubSub");
              openModel();

              callAPI({
                path: "pubsubApi",
                params: { gatewayIP, context },
                data: {},
                responder: pubsubAPIResponder,
                onComplete: PubsubOnCompleteHandlerConfig,
              });
            }}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}

export default Pub;
