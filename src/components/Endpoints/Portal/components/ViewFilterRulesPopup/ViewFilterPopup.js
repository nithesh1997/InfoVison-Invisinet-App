import { Box, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../../apis/callAPI";
import { EPCFilterResponder } from "../../../../../apis/responders/EPCFilterResponder";
import { getEPCFRTemplateResponder } from "../../../../../apis/responders/FirmwareResponder";
import { GetAllTaskStatusResponder } from "../../../../../apis/responders/GetAllTaskStatusResponder";
import Utility from "../../../../../redux/actions/Utility";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../../../../General/WidthFillerSkeleton";
import ViewFilterTable from "./ViewFilterTable";
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

export const ViewFilterPopup = (props) => {
  const AppOverlayContext = useContext(OverlayContext);

  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [newData, setnewData] = useState([]);
  const [newDataLoading, setNewLoading] = useState(true);
  const [message, setMessage] = useState();
  const [ApiFlag, setApiFlag] = useState({ getEPCFilterRules: "neutral" });
  const [status, setStatus] = useState("");

  const { t } = useTranslation();

  const endPointId = props.viewFilterRuleConfig.selectedRows[0].endpoint_ID;

  const onCompleteEPCFilterRules = (response) => {
    let data = [];

    if (response.state === "EPCFILtERS_SUCCESS") {
      data = response.data;

      setApiFlag((oldState) => ({ ...oldState, getEPCFilterRules: "success" }));

      if (data.length === 0) {
        setMessage(t("page.Endpoint.Configure.viewFilterRulesModal.noRecords"));
        setFlag(true);
      } else {
        setData(data);
      }
    } else {
      setFlag(true);

      setMessage(() => {
        return (
          <div style={{ color: "crimson" }}>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.viewFilterRulesModal.errorFetch"
              }
              components={[<br />]}
            >
              Failed to fetch filter rules. Please try again.
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
                "page.Endpoint.Configure.viewFilterRulesModal.errorTemplate"
              }
              components={[<br />]}
            >
              Failed to fetch filter rules. Please try again.
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
    } else if (status === "") setStatus("-");
    else {
      setFlag(true);

      setMessage(() => {
        return (
          <div style={{ color: "crimson" }}>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.viewFilterRulesModal.errorStaged"
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
      loading === true
    ) {
      callAPI({
        path: "EPCFilterRules",
        params: {
          gatewayIP: gatewayAddress,
          endpointId: endPointId,
        },
        data: {},
        responder: EPCFilterResponder,
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
  }, [gatewayAddress, loading, newDataLoading, dataLoading, endPointId]);

  useEffect(() => {
    if (!newDataLoading && !dataLoading) {
      setLoading(false);
    }
  }, [loading, newDataLoading, statusLoading, dataLoading]);

  return (
    <React.Fragment>
      {loading ? (
        <WidthFillerSkeleton height="450" />
      ) : (
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
            <ViewFilterTable
              newData={newData}
              loadData={data}
              message={message}
              flag={flag}
            />
          </ParentBox>
        </Box>
      )}
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
              <b>{t("page.Endpoint.Configure.viewFilterRulesModal.status")}</b>{" "}
              {status}
            </Typography>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};
