import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import callAPI from "../../../apis/callAPI";
import { modifyServiceResponder } from "../../../apis/responders/gateway-services-api-responder";
import Utility from "../../../redux/actions/Utility";
import { AntSwitch, Styled } from "./AntSwitch";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import Style from "../../../style";
import DisplaySettingsRoundedIcon from "@mui/icons-material/DisplaySettingsRounded";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function SecureShell(props) {
  const { t } = useTranslation();

  const {
    setAlertContent,
    setOpenAlertDialog,
    ssdChecked,
    setSSDChecked,
    gatewayIP,
    ssd,
    selectedValue,
  } = props;

  const [isSSD, setIsSSD] = useState(false);
  const { gatewayConfig } = useSelector((state) => state);

  const tac =
    gatewayConfig.chassis_model === "XXXX" ||
    gatewayConfig.chassis_model === "5010";

  const GatewayServicesSysylogOnCompleteHandler = (response, state) => {
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      setIsSSD(false);
      setAlertContent({
        contentTitle: t(`commons.successText`),
        contentText: t(
          `page.gatewayServer.services.context.secureShellDaemon.prompt.success.message`,
        ),
        contentInfo: "",
      });

      setOpenAlertDialog(true);
    } else {
      setSSDChecked((prev) => !prev);
      setIsSSD(false);

      setAlertContent({
        contentTitle: `${t(`commons.errorText`)}..!`,
        contentText: (
          <>
            {t(
              `page.gatewayServer.services.context.secureShellDaemon.prompt.error.message.0`,
              {
                state,
              },
            )}
            <br />
            <br />
            {t(
              `page.gatewayServer.services.context.secureShellDaemon.prompt.error.message.1`,
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
    setSSDChecked((prev) => !prev);
    setIsSSD(false);
    callAPI({
      path: "set-radio-state",
      params: { gatewayIP, context: tac ? "mgt" : selectedValue },
      data: {
        ctx_name: selectedValue,
        ui_name: ssd.ui_name,
        svc_name: ssd.svc_name,
        ns_code: ssd.ns_code,
        enable: ssdChecked ? 0 : 1,
        state: ssd.state,
        svc_type: ssd.svc_type,
        config_chg: ssd.config_chg,
        service: ssd.service,
        id: ssd.id,
      },
      responder: modifyServiceResponder,
      onCompleteArguments: [
        ssdChecked ? t(`commons.disablingText`) : t(`commons.enablingText`),
      ],
      onComplete: GatewayServicesSysylogOnCompleteHandler,
    });
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
          width: "35%",
          display: "flex",
          alignItems: "center",
          paddingLeft: "1em",
        }}
      >
        <Typography
          style={{
            fontWeight: "600",
            fontFamily: "Inter",
          }}
        >
          {t(`page.gatewayServer.services.context.secureShellDaemon.text`)}
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
              visibility: isSSD ? "visible" : "hidden",
              width: "20px",
              height: "20px",
            }}
          />

          <Typography
            style={{
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#6c757d",
              textAlign: "left",
            }}
          >
            {ssdChecked
              ? isSSD
                ? `${t(`commons.enablingText`)}...`
                : `${t(`commons.enabledText`)}`
              : isSSD
              ? `${t(`commons.disablingText`)}...`
              : `${t(`commons.disabledText`)}`}
          </Typography>

          <AntSwitch
            id={`${gatewayServices}-ssh-toggle-switch`}
            disabled={isSSD}
            checked={props.ssdChecked}
            onChange={(e) => toggleSwitch(e)}
          />
        </div>

        <div style={{ width: "20%", visibility: "hidden" }}>
          <Style.GenericButton
            id={`${gatewayServices}-trusted-btn`}
            style={{ visibility: "hidden" }}
            backgroundColor="primary"
            buttonName={t(`commons.configureText`)}
            Icon={
              <DisplaySettingsRoundedIcon
                style={{ width: "0.8em", height: "0.8em" }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

export default SecureShell;
