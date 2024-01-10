import { Box, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../../apis/callAPI";
import { getEPCFRTemplateResponder } from "../../../../../apis/responders/FirmwareResponder";
import { EPCFilterRuleStageResponder } from "../../../../../apis/responders/EPCFilterRulesStage-api-responder";
import { GetTaskStatusResponder } from "../../../../../apis/responders/GetTaskStatusResponder";
import { GetAllTaskStatusResponder } from "../../../../../apis/responders/GetAllTaskStatusResponder";
import Utility from "../../../../../redux/actions/Utility";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../../../../General/WidthFillerSkeleton";
import ViewFilterStageTable from "./ViewFilterStageTable";
import { Trans, useTranslation } from "react-i18next";

const ParentBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  flex-grow: 1;
  width: 1400px;
  height: 420px;
  margin: 0 auto;
  padding-bottom: 0.75em;
`;
export const ViewFilterStagePopup = (props) => {
  const AppOverlayContext = useContext(OverlayContext);

  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(true);
  const [newData, setnewData] = useState([]);
  const [newDataLoading, setNewLoading] = useState(true);
  const [message, setMessage] = useState();
  const [ApiFlag, setApiFlag] = useState({ getEPCFilterRules: "neutral" });

  const { t } = useTranslation();

  const endPointId = props.viewFilterRuleConfig.selectedRows[0].endpoint_ID;

  const onCompleteEPCFilterRules = (response) => {
    let data = [];

    if (response.state === "EPCFILTERSTAGE_SUCCESS") {
      data = response.data;

      setApiFlag((oldState) => ({ ...oldState, getEPCFilterRules: "success" }));

      if (data.length === 0) {
        setMessage(
          t("page.Endpoint.Configure.viewFilterRulesModal.emptyMesagge"),
        );
        setFlag(true);
      } else {
        setData(data);
      }
    } else {
      setFlag(true);

      setMessage(() => {
        return (
          <div style={{ color: "crimson" }}>
            {/* Failed to fetch staged filter rules. Please try again.
            <br />
            <br />
            Details:
            <br /> */}
            <Trans
              i18nKey={
                "page.Endpoint.Configure.viewFilterRulesModal.stagedFilterRules"
              }
              components={[<br />]}
            >
              Failed to fetch staged filter rules. Please try again.
              <br />
              <br />
              Details:
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </div>
        );
      });
    }

    setDataLoading(false);
  };

  const onCompletegetEPCFRTemplate = (response) => {
    if (response.state === "EPCFRTEMPLATE_SUCCESS") {
      let data = [];

      data = response.data;

      setnewData(data);
    } else {
      setFlag(true);

      setMessage(() => {
        return (
          <div style={{ color: "crimson" }}>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.viewFilterRulesModal.templateStaged"
              }
              components={[<br />]}
            >
              Failed to fetch staged filter rule templates. Please try again.
              <br />
              <br />
              Details:
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </div>
        );
      });
    }

    setNewLoading(false);
  };

  const onCompletegetEPCFRTemplateStatus = (response) => {
    let data = [];
    if (response.state === "GET_ALL_TASK_STATUS_SUCCESS") {
      if (response.data.length > 0) {
        data = response.data[0];
        const statusBox = data.task_status;
        setStatus(statusBox);
      }
    } else {
      setFlag(true);

      setMessage(() => {
        return (
          <div style={{ color: "crimson" }}>
            {/* Failed to fetch staged filter rule tasks. Please try again.
            <br />
            <br />
            Error Details:
            <br /> */}
            <Trans
              i18nKey={
                "page.Endpoint.Configure.viewFilterRulesModal.stagesTask"
              }
              components={[<br />]}
            >
              Failed to fetch staged filter rule tasks. Please try again.
              <br />
              <br />
              Error Details:
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </div>
        );
      });
    }

    setStatusLoading(false);
  };

  const markAsLoading = () => {
    setLoading(true);
    setDataLoading(true);
    setStatusLoading(true);
    setNewLoading(true);
  };

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      dataLoading === true &&
      newDataLoading === true &&
      loading === true &&
      statusLoading === true
    ) {
      callAPI({
        path: "EPCFilterRulesStage",
        params: {
          gatewayIP: gatewayAddress,
          endpointId: endPointId,
        },
        data: {},
        responder: EPCFilterRuleStageResponder,
        onComplete: onCompleteEPCFilterRules,
      });

      callAPI({
        path: "getEPCFRTemplate",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: getEPCFRTemplateResponder,
        onComplete: onCompletegetEPCFRTemplate,
      });

      callAPI({
        path: "getAllTaskStatus",
        params: {
          gatewayIP: gatewayAddress,
          taskId: "6",
          endpointId: endPointId,
        },
        data: {},
        responder: GetAllTaskStatusResponder,
        onComplete: onCompletegetEPCFRTemplateStatus,
      });
    }
  }, [
    gatewayAddress,
    loading,
    newDataLoading,
    statusLoading,
    dataLoading,
    endPointId,
  ]);

  useEffect(() => {
    if (!newDataLoading && !statusLoading && !dataLoading) {
      // if (status === "Not Started") {
      //   setStatus("Not Configured");
      // }

      setLoading(false);
    }
  }, [loading, newDataLoading, statusLoading, dataLoading, status]);

  return (
    <React.Fragment>
      {loading ? (
        <WidthFillerSkeleton height="450" />
      ) : data.length === 0 ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "10em",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              textAlign: "center",
              color: "crimson",
            }}
          >
            <Typography
              style={{
                color: "#DC143C",
                /* fontFamily: "", */
                fontWeight: 500,
              }}
            >
              <br />
              <br />
              {message}
            </Typography>
          </div>
        </Box>
      ) : (
        <>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              flexGrow: "1",
              width: "500px",
            }}
          >
            <ParentBox>
              <ViewFilterStageTable
                newData={newData}
                loadData={data}
                message={message}
                flag={flag}
              />
            </ParentBox>
          </Box>
          <Box
            style={{
              display: loading ? "none" : "flex",
              paddingLeft: "1em",
              width: "100%",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "0.4rem",
                width: "1390px",
                background: "#EBF7FF",
                borderLeft: "0.2em solid #0094fd",
                borderRadius: "0.25em",
                marginTop: "0.5em",
                padding: "0.5em 1em",
              }}
            >
              <Box>
                <Typography style={{ /* fontFamily: "", */ fontSize: "0.9em" }}>
                  <b>
                    {t("page.Endpoint.Configure.viewFilterRulesModal.status")}
                  </b>{" "}
                  {status}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </React.Fragment>
  );
};
