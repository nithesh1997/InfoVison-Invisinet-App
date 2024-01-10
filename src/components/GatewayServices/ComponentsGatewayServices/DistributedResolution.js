import { Box, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import callAPI from "../../../apis/callAPI";
import { modifyServiceResponder } from "../../../apis/responders/gateway-services-api-responder";
import { AntSwitch, Styled } from "./AntSwitch";
import { StyledDir } from "../GatewayserviceStyling/DistributedRes/dir.style";
import { Toggle } from "../../../style/Toggle/Toggle";
import { Trans, useTranslation } from "react-i18next";

function DistributedResolution(props) {
  const {
    setAlertContent,
    setOpenAlertDialog,
    gatewayIP,
    distidentChecked,
    setDistidentChecked,
    context,
  } = props;
  const [isDir, setIsDir] = useState(false);
  const GatewayServicesSysylogOnCompleteHandler = (response) => {
    const { t } = useTranslation();
    if (response.state === "GATEWAY_SERVICES_SUCCESS") {
      // props.setDistidentChecked(false);
      setDistidentChecked(true);
      setIsDir((prev) => !prev);
      setAlertContent({
        contentTitle: "SUCCESS",
        contentText: `Successfully toggled the Syslog Switch.`,
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    } else {
      setDistidentChecked((prev) => !prev);
      // alert("failure");
      // setDistidentChecked((prev) => !prev);
      setIsDir((prev) => !prev);
      // setIsRestApiChecked((prev) => !prev);
      // setRadioIasChecked(false);

      setAlertContent({
        contentTitle: "ERROR..!",
        contentText: (
          <>
            {t("commons.errorMessages.syslogSwitch")}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {/* {Utility.getErrorsFromResponse(response)} */}
          </>
        ),
        contentInfo: "",
      });
      setOpenAlertDialog(true);
    }
  };

  const toggleSwitch = (e, value) => {
    setDistidentChecked((prev) => !prev);
    setIsDir((prev) => !prev);
    callAPI({
      path: "set-radio-state",
      params: { gatewayIP, context },
      data: {
        // ctx_name: syslog.ctx_name,
        // ui_name: props.syslog.ui_name,
        // svc_name: props.syslog.svc_name,
        // ns_code: props.syslog.ns_code,
        // enable: props.syslogChecked ? 0 : 1,
        // state: props.syslog.state,
        // svc_type: props.syslog.svc_type,
        // config_chg: props.syslog.config_chg,
        // service: props.syslog.service,
      },
      responder: modifyServiceResponder,
      onCompleteArguments: [isDir ? "Disabling" : "Enabling"],
      onComplete: GatewayServicesSysylogOnCompleteHandler,
    });
  };

  return (
    <StyledDir.DistWrapper>
      <div style={{ width: "70%" }}>
        <StyledDir.Typo1>Distributed Identity Resolution</StyledDir.Typo1>
      </div>
      <StyledDir.DistWrapperTwo>
        <Styled.Spinner
          style={{
            visibility: "hidden",
            width: "20px",
            height: "20px",
            // marginLeft: "0.5em",
          }}
        ></Styled.Spinner>
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "#6c757d",
          }}
        >
          {props.distidentChecked ? "Enabled" : "Disabled"}
        </Typography>
        <Box style={{ marginLeft: "2.5em" }}>
          <Toggle
            disabled={false}
            defaultChecked={true}
            checked={true}
            // onChange={(e) => toggleSwitch(e)}
          />
        </Box>
      </StyledDir.DistWrapperTwo>
    </StyledDir.DistWrapper>
  );
}

export default DistributedResolution;

const SaveButtonComponent = styled("button")`
  float: right;
  box-shadow: none !important;
  color: #fff;
  width: 6rem;
  height: 2rem;
  cursor: pointer;
  /* font-family: "Montserrat", sans-serif; */
  color: #fff;
  border: 1px solid transparent;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.25rem;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  margin-right: 8px;
  line-height: 32px;
  font-size: 14px;
  font-weight: bold;
  outline: none !important;
  box-shadow: none !important;
  background-color: #018ff6;
  border-color: #018ff6;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  float: right !important;
  &:hover {
    background: #1e6ee4;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
`;
