import { Box, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import callAPI from "../../../apis/callAPI";
import { modifyServiceResponder } from "../../../apis/responders/gateway-services-api-responder";
import { SyslogGetResponder } from "../../../apis/responders/SyslogGetResponder";
import Portal from "../../../Portal";
import { usePortalState } from "../../../Portal/hooks/usePortalState";
import Utility from "../../../redux/actions/Utility";
import { AntSwitch, Styled } from "../ComponentsGatewayServices/AntSwitch";
import SyslogPopup from "./SyslogPopup";
import { StyledSys } from "../GatewayserviceStyling/Syslog/syslog.style";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import { GlobalModal } from "../../../style/Card/Modal";
import Style from "../../../style";
import DisplaySettingsRounded from "@mui/icons-material/DisplaySettingsRounded";
import { useTranslation } from "react-i18next";

function Syslog({
  selectedValue,
  syslogChecked,
  setSysLogChecked,
  syslog,
  setAlertContent,
  setOpenAlertDialog,
  setRunEffect1,
  openModel,
  context,
}) {
  const { t, i18n } = useTranslation();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const { gatewayConfig } = useSelector((state) => state);

  const [loading, setLoading] = useState(false);
  const [portalState, setPortalState] = usePortalState();
  const [sysData, setSysData] = useState([]);
  const [isSyslogApiChecked, setIsSyslogApiChecked] = useState(false);
  const [display, setDisplay] = useState(false);

  const tac =
    gatewayConfig.chassis_model === "XXXX" ||
    gatewayConfig.chassis_model === "5010";

  const handleConfigure = () => {
    setLoading(true);
    setDisplay(true);
    callAPI({
      path: "getSyslogServer",
      params: { gatewayIP, context },
      data: {},
      responder: SyslogGetResponder,
      onComplete: (response) => {
        let payload = response.data;
        let result = payload.map((e) => ({
          ...e,
          priority:
            e.priority === "all"
              ? "* (ALL)"
              : e.priority === "emerg"
              ? "0 (Emerg)"
              : e.priority === "alert"
              ? "1 (Alert)"
              : e.priority === "crit"
              ? "2 (Crit)"
              : e.priority === "err"
              ? "3 (Err)"
              : e.priority === "warning"
              ? "4 (Warning)"
              : e.priority === "notice"
              ? "5 (Notice)"
              : e.priority === "info"
              ? "6 (Info)"
              : e.priority === "debug"
              ? "7 (Debug)"
              : null,
        }));

        if (response.state === "SYSLOG_GET_SUCESS") {
          setSysData(result);
          setLoading(false);
        } else {
          setAlertContent({
            contentTitle: t("commons.errorAlertTitle"),
            contentText: (
              <>
                {t("commons.errorMessages.errorInSyslog")}
                <br />
                <br />
                {t("commons.errorMessages.errorDetails")}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </>
            ),
            contentInfo: "",
          });
          setOpenAlertDialog(true);
          setTimeout(() => {
            setLoading(false);
          }, 100);
        }
      },
    });
  };

  const handleToggle = (event) => {
    setSysLogChecked((oldState) => !oldState);
    setIsSyslogApiChecked((oldState) => !oldState);

    setTimeout(() => {
      callAPI({
        path: "set-radio-state",
        params: { gatewayIP, context: tac ? "mgt" : context },
        data: {
          ctx_name: tac ? "mgt" : context,
          ui_name: syslog.ui_name,
          svc_name: syslog.svc_name,
          ns_code: syslog.ns_code,
          enable: syslogChecked ? 0 : 1,
          state: syslog.state,
          svc_type: syslog.svc_type,
          config_chg: syslog.config_chg,
          service: syslog.service,
          id: syslog.id,
        },
        responder: modifyServiceResponder,
        onCompleteArguments: [syslogChecked ? "Disabling" : "Enabling"],
        onComplete: (response, text) => {
          if (response.state === "GATEWAY_SERVICES_SUCCESS") {
            setIsSyslogApiChecked((oldState) => !oldState);
            setOpenAlertDialog(true);
            setAlertContent({
              contentTitle: t(`commons.successText`),
              contentText: `Syslog successfully ${text.slice(
                0,
                text.length - 3,
              )}ed`,
              contentInfo: "",
            });
          } else {
            setSysLogChecked((oldState) => !oldState);
            setIsSyslogApiChecked((oldState) => !oldState);
            setOpenAlertDialog(true);
            setAlertContent({
              contentTitle: t("commons.errorAlertTitle"),
              contentText: (
                <>
                  {t("commons.errorMessages.errorTextSyslog", { text: text })}
                  <br />
                  <br />
                  {t("commons.errorMessages.errorDetails")}
                  <br />
                  {Utility.getErrorsFromResponse(response)}
                </>
              ),
              contentInfo: "",
            });
          }
        },
      });
    }, 0);
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
        <Typography
          style={{
            fontWeight: "600",
          }}
        >
          {t("page.gatewayServer.services.context.remoteSysLog.text")}
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
              visibility: isSyslogApiChecked ? "visible" : "hidden",
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
            {syslogChecked
              ? isSyslogApiChecked
                ? `${t("commons.enablingText")}...`
                : `${t("commons.enabledText")}`
              : isSyslogApiChecked
              ? `${t("commons.disablingText")}...`
              : `${t("commons.disabledText")}`}
          </Typography>

          <AntSwitch
            id={`${gatewayServices}-syslog-toggle-switch`}
            disabled={loading}
            checked={syslogChecked}
            onChange={handleToggle}
            //style={{ cursor: "not-allowed" }}
          />
        </div>

        <div style={{ width: "20%" }}>
          <Style.GenericButton
            id={`${gatewayServices}-syslog-btn`}
            style={{ margin: "auto" }}
            onClick={handleConfigure}
            Icon={
              <DisplaySettingsRounded
                style={{ width: "0.8em", height: "0.8em" }}
              />
            }
            buttonName={t("commons.configureText")}
            backgroundColor="primary"
            disabled={false}
          />
        </div>
      </div>

      <GlobalModal
        open={display}
        Content={
          <SyslogPopup
            handleClosePortalnoBackdrop={() => setDisplay(false)}
            sysData={sysData}
            Loading={[loading, setLoading]}
            setAlertContent={setAlertContent}
            setOpenAlertDialog={setOpenAlertDialog}
            context={context}
          />
        }
      />
    </div>
  );
}

export default Syslog;
