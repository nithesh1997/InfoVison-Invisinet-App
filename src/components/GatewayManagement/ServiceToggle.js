import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import NetworkRequest from "../../apis/callAPI";
import Utility from "../../redux/actions/Utility";
import Switch from "../General/Switch";
import AlertDialog from "./MaterialComponents/AlertDialog";
import { Trans, useTranslation } from "react-i18next";

const API_RESPONDER = (response, onCompleteHandler, onCompleteArguments) => {
  if (response.state === "GOOD_RESPONSE" && response.response.code === 204) {
    const payload = { state: "SUCCESS", data: response.response.body };

    onCompleteHandler(payload, ...onCompleteArguments);
  } else {
    const payload = {
      catchError: response.error,
      error: response.response.error,
      errorFromJSON: response.response.errorFromJSON,
    };

    onCompleteHandler(payload, ...onCompleteArguments);
  }
};

const initDialogState = { contentTitle: "Info", contentText: "" };

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
    "&$disabled": {
      "& + $track": {
        cursor: "not-allowed",
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

const ServiceToggle = ({
  gatewayAddress,
  toggleName,
  toggleStatus,
  isOffline,
  isDisabled,
}) => {
  const { t } = useTranslation();
  const [statusText, setStatusText] = useState("Disabled");
  const [status, setStatus] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [dialogState, setDialogState] = useState(initDialogState);
  const [dialogOpen, setDialogOpen] = useState(false);

  const gatewayIP = gatewayAddress;

  const handleToggle = () => {
    setDisabled(true);
    setStatus((oldState) => {
      setStatusText(oldState ? "Disabling..." : "Enabling...");
      return !oldState;
    });
  };

  const responseHandler = useCallback(
    (payload) => {
      const { state, data, ...args } = payload;
      const successStatus =
        statusText === "Enabling..." ? "Enabled" : "Disabled";
      const failureStatus =
        statusText === "Enabling..." ? "Disabled" : "Enabled";

      if (state === "SUCCESS") {
        if (toggleName === "udp") {
          setDisabled(false);
          setStatusText(successStatus);
        }

        if (toggleName === "data-gram") {
          setDisabled(false);
          setStatusText(successStatus);
        }
      } else {
        if (toggleName === "udp") {
          setDisabled(false);
          setStatus((oldState) => !oldState);
          setStatusText(failureStatus);
          setDialogOpen(true);
          setDialogState({
            contentTitle: "Error!",
            contentText: (
              <>
                Error {statusText.split("...").join("").toLocaleLowerCase()} UDP
                for <b>{gatewayAddress}</b>
                <br />
                <br />
                Details:
                <br />
                <ul>{Utility.getErrorsFromResponse(payload)}</ul>
              </>
            ),
          });
        }

        if (toggleName === "data-gram") {
          setDisabled(false);
          setStatus((oldState) => !oldState);
          setStatusText(failureStatus);
          setDialogOpen(true);
          setDialogState({
            contentTitle: "Error!",
            contentText: (
              <>
                Error {statusText.split("...").join("").toLocaleLowerCase()}{" "}
                datagram for <b>{gatewayAddress}</b>
                <br />
                <br />
                Details:
                <br />
                <ul>{Utility.getErrorsFromResponse(payload)}</ul>
              </>
            ),
          });
        }
      }
    },
    [gatewayAddress, statusText, toggleName],
  );

  const toggleUDP = useCallback(
    (requestPayload) => {
      const path = "enableudp";
      const params = { gatewayIP };
      const data = `${requestPayload}`;
      const headers = { "Content-Type": "application/json;" };
      const responder = API_RESPONDER;
      const onComplete = responseHandler;
      const onCompleteArguments = [];

      const networkRequestParam = {
        path,
        params,
        data,
        headers,
        responder,
        onComplete,
        onCompleteArguments,
      };

      NetworkRequest(networkRequestParam);
    },
    [gatewayIP, responseHandler],
  );

  const toggleDataGram = useCallback(
    (requestPayload) => {
      const path = "removedatagramtoken";
      const params = { gatewayIP };
      const data = `${requestPayload}`;
      const headers = { "Content-Type": "application/json;" };
      const responder = API_RESPONDER;
      const onComplete = responseHandler;
      const onCompleteArguments = [];

      const networkRequestParam = {
        path,
        params,
        data,
        headers,
        responder,
        onComplete,
        onCompleteArguments,
      };

      NetworkRequest(networkRequestParam);
    },
    [gatewayIP, responseHandler],
  );

  useEffect(() => {
    if (statusText === "Enabling...") {
      if (toggleName === "udp") {
        toggleUDP(true);
      }

      if (toggleName === "data-gram") {
        toggleDataGram(true);
      }
    }

    if (statusText === "Disabling...") {
      if (toggleName === "udp") {
        toggleUDP(false);
      }

      if (toggleName === "data-gram") {
        toggleDataGram(false);
      }
    }
  }, [statusText, toggleDataGram, toggleName, toggleUDP]);

  useEffect(() => {
    setStatus(toggleStatus);
    setStatusText(toggleStatus ? "Enabled" : "Disabled");
    setDisabled(isOffline || isDisabled);
  }, []);

  return (
    <Styled.Wrapper>
      {/* <Styled.ToggleStatus fontFamily={"Montserrat"} fontSize={"0.8rem"}>
        {statusText}
      </Styled.ToggleStatus> */}

      <Tooltip title={statusText} arrow>
        <Styled.ToggleSwitch
          disabled={disabled}
          checked={status}
          onChange={handleToggle}
        />
      </Tooltip>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={dialogState.contentTitle}
        contentText={dialogState.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setDialogOpen(false)}
        divider={true}
        isred={true}
      />
    </Styled.Wrapper>
  );
};

export default ServiceToggle;

const Styled = {
  Wrapper: styled(Box)`
    width: 75%;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: auto 0.4rem;
  `,
  ToggleStatus: styled(Typography)``,
  ToggleSwitch: styled(AntSwitch)``,
};
