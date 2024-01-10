import { Typography } from "@material-ui/core";
import * as MatIcons from "@material-ui/icons";
import BrowserNotSupportedOutlinedIcon from "@mui/icons-material/BrowserNotSupportedOutlined";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";
import callAPI from "../../../../apis/callAPI";
import Utility from "../../../../redux/actions/Utility";
import PreProcessValidation from "../PreProcessValidation/PreProcessValidation";
import { AlertDialog } from "./AlertDialog";
import { StyledMat } from "./StyledMat";
import Prompt from "../../../DeletePrompt/Prompt";
import { Trans, useTranslation } from "react-i18next";
import loadingText from "../../../../images/right.svg";

const getTaskStatusEndpoint = "get-task-status";
const deleteEPCFilterRules = "deleteEPCFilterRules";

const initPayload = () => ({ isLoading: false, payload: [], error: "" });

const getTaskStatusEndpointResponder = (
  { error, response, state },
  responseHandler,
  responseHandlerArguments,
) => {
  const isGoodResponse = state === "GOOD_RESPONSE";
  const is200 = response.code === 200;

  const condition = isGoodResponse && is200;

  const status = condition ? "SUCCESS" : "FAILURE";
  const data = condition ? response.body : undefined;
  const err = !condition ? error : undefined;
  const catchError = !condition ? response.error : undefined;
  const errorFromJSON = !condition ? response.errorFromJSON : undefined;

  responseHandler(
    { state: status, data, error: err, catchError, errorFromJSON },
    ...responseHandlerArguments,
  );
};

const deleteEPCFilterRulesResponder = (
  { error, response, state },
  responseHandler,
  responseHandlerArguments,
) => {
  const isGoodResponse = state === "GOOD_RESPONSE";
  const is204 = response.code === 204;

  const condition = isGoodResponse && is204;

  const status = condition ? "SUCCESS" : "FAILURE";
  const data = condition ? response.body : undefined;
  const err = !condition ? error : undefined;
  const catchError = !condition ? response.error : undefined;
  const errorFromJSON = !condition ? response.errorFromJSON : undefined;

  responseHandler(
    { state: status, data, error: err, catchError, errorFromJSON },
    ...responseHandlerArguments,
  );
};

export const ClearFilterRule = forwardRef(
  (
    {
      portalState,
      setPortalState,
      clearFilterRuleConfig,
      setClearFilterRuleConfig,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState("fetching");
    const [jsxState, setJsxState] = useState("spinner");

    const [isAsyncDone, setIsAsyncDone] = useState(false);
    const [payloadState, setPayloadState] = useState(initPayload);
    const [qualifiedRecords, setQualifiedRecords] = useState([]);
    const [unQualifiedRecords, setUnQualifiedRecords] = useState([]);
    const [errorResponse, setErrorResponse] = useState({ state: "", data: {} });
    const [unQualifiedCount, setUnQualifiedCount] = useState(0);
    const [alertDialog, setAlertDialog] = useState(false);
    const [alertDialogTitle, setAlertDialogTitle] = useState("");
    const [alertDialogContent, setAlertDialogContent] = useState("");
    const [prompt, setPrompt] = useState(false);

    const [validateEffect, setValidateEffect] = useState("");
    const [payload, setPayload] = useState([]);

    const gatewayIP = useSelector((state) => state.activeGateway.address);

    const isBulkAction = clearFilterRuleConfig.isBulkAction;

    const closePopup = useCallback(() => {
      setPortalState({ type: "", isPortal: false });

      setClearFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [],
        setTaskStatus: () => {},
      });
    }, [setClearFilterRuleConfig, setPortalState]);

    const handleClose = (event) => {
      if (clearFilterRuleConfig.tableRows === undefined) {
        clearFilterRuleConfig.setTaskStatus({
          inProgress: false,
          error: false,
          message: ``,
        });
        if (isBulkAction === false) {
          clearFilterRuleConfig.setDontClosePopup(true);
        }
      } else {
        const payload = clearFilterRuleConfig.tableRows.map((row) => ({
          ...row,
          isChecked: false,
        }));

        clearFilterRuleConfig.setTaskStatus({
          loading: false,
          payload,
          error: false,
          message: ``,
        });
        if (isBulkAction === false) {
          clearFilterRuleConfig.setDontClosePopup(true);
        }
      }
      closePopup();
      setPrompt(false);
    };

    const onConfirm = () => {
      setJsxState("spinner");
      setLoading("clearing");

      callAPI({
        path: deleteEPCFilterRules,
        params: { gatewayIP },
        data: {
          endpointIds: qualifiedRecords.map((record) => record.endpoint_ID),
        },
        responder: deleteEPCFilterRulesResponder,
        onComplete: (response) => {
          setLoading("complete");

          if (response.state === "SUCCESS") {
            setJsxState("");
            setAlertDialog(true);
            setAlertDialogTitle(
              t(
                "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.title",
              ),
            );
            setAlertDialogContent(
              t(
                "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.message",
              ),
            );
          } else {
            setJsxState("error");
            setAlertDialog(true);
            setErrorResponse(response);
          }
        },
        onCompleteArguments: [],
      });
    };

    const onCompleteGetTaskStatus = (response) => {
      const payload = response.data;

      setPayload(payload);

      if (response.state === "SUCCESS") {
        setLoading("validating");

        setValidateEffect("qualified-check");
      } else {
        setJsxState("error");
        setAlertDialog(true);
        setErrorResponse(response);
      }
    };

    useEffect(() => {
      if (validateEffect === "qualified-check") {
        setQualifiedRecords(() => {
          const newState = clearFilterRuleConfig.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                taskStatus,
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                taskStatus,
              }),
            )
            .filter(({ id }) => {
              return !!!payload
                .map(({ endpointId }) => endpointId)
                .includes(id);
            })
            .filter(
              ({ enabled, taskStatus, roles }) =>
                enabled === "True" &&
                taskStatus !== "In Progress" &&
                roles !== "Remote Keying",
            );

          setTimeout(() => {
            setValidateEffect("unqualified-check");
          }, 500);

          return newState;
        });
      }
    }, [clearFilterRuleConfig.selectedRows, payload, validateEffect]);

    useEffect(() => {
      if (validateEffect === "unqualified-check") {
        setUnQualifiedRecords(() => {
          const firstCheck = clearFilterRuleConfig.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!payload.map(({ endpointId }) => endpointId).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [
                {
                  icon: <HourglassBottomRoundedIcon />,
                  tooltip: t(
                    "page.Endpoint.Configure.clearFilterrules.taskInProgress",
                  ),
                },
              ],
            }));

          const firstUncheck = clearFilterRuleConfig.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!!payload
                .map(({ endpointId }) => endpointId)
                .includes(id);
            });

          const lastCheck = [...firstCheck, ...firstUncheck]
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(
              ({ enabled, roles }) =>
                enabled === "False" || roles === "Remote Keying",
            )
            .map((row) => {
              const icons = [
                ...row.icons, //,
                // {
                //  icon: <MatIcons.SyncDisabledRounded />,
                //   tooltip: "Endpoint is Disabled",
                // },
              ];

              if (row.enabled === "False") {
                icons.push({
                  icon: <MatIcons.SyncDisabledRounded />,
                  tooltip: t(
                    "page.Endpoint.Configure.bulkTable.epcDisableTooltip",
                  ),
                });
              }

              if (row.roles === "Remote Keying") {
                icons.push({
                  icon: <BrowserNotSupportedOutlinedIcon />,
                  tooltip: t("page.Endpoint.Configure.bulkTable.remoteTooltip"),
                });
              }

              return { ...row, icons };
            });

          const newState = [
            ...firstCheck.filter(
              (_1) => !!!lastCheck.filter((_2) => _1.id === _2.id).length,
            ),
            ...lastCheck,
          ];

          setUnQualifiedCount(newState.length);

          setTimeout(() => {
            setValidateEffect("finalize");
          }, 500);

          return newState;
        });
      }
    }, [clearFilterRuleConfig.selectedRows, payload, validateEffect]);

    useEffect(() => {
      if (validateEffect === "finalize") {
        setTimeout(() => {
          if (isBulkAction) {
            unQualifiedRecords.length
              ? setJsxState("preProcessMultiple")
              : onConfirm();
          } else {
            qualifiedRecords.length
              ? onConfirm()
              : setJsxState("preProcessSingle");
            setPrompt(true);
          }

          //   isBulkAction ? setJsxState("preProcessMultiple") : onConfirm();
        }, 500);
        setValidateEffect("");
      }
    }, [
      isBulkAction,
      onConfirm,
      qualifiedRecords.length,
      unQualifiedRecords.length,
      validateEffect,
    ]);

    useEffect(() => {
      isAsyncDone === true && closePopup();
    }, [closePopup, isAsyncDone]);

    useEffect(() => {
      setPortalState((oldState) => ({
        ...oldState,
        isProgressPending: payloadState.isLoading,
      }));
    }, [payloadState.isLoading, setPortalState]);

    useEffect(() => {
      callAPI({
        path: getTaskStatusEndpoint,
        params: { gatewayIP, taskId: 6 },
        data: {},
        responder: getTaskStatusEndpointResponder,
        onComplete: onCompleteGetTaskStatus,
        onCompleteArguments: [],
      });

      // Runs on initial render
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      closePortal: handleClose,
    }));

    return (
      <StyledMat.Wrapper
        display={prompt === true ? "none" : ""}
        isSpinner={jsxState !== "preProcessMultiple"}
        isTransparent={!jsxState}
      >
        {jsxState === "spinner" ? (
          <>
            <StyledMat.LoadingText src={loadingText} />

            <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
              {loading === "validating"
                ? t("page.Endpoint.Configure.clearFilterrules.validation", {
                    isBulkAction: isBulkAction ? "s" : "",
                  })
                : loading === "fetching"
                ? t("page.Endpoint.Configure.clearFilterrules.fetching")
                : loading === "clearing"
                ? t("page.Endpoint.Configure.clearFilterrules.clearing")
                : t("page.Endpoint.Configure.clearFilterrules.loading")}
            </Typography>
          </>
        ) : null}

        {jsxState === "preProcessSingle" ? (
          <Prompt
            open={prompt}
            setOpen={setPrompt}
            contentText={
              <>
                <Trans
                  i18nKey={
                    "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.taskInProgress"
                  }
                  components={[<p />, <br />]}
                >
                  <p>
                    The selected endpoint already has a policy update task.
                    <br />
                    <br />
                    Please wait for it to complete before trying to
                    configure/clear filter rule(s) for this endpoint again.
                  </p>
                </Trans>
              </>
            }
            contentInfo={``}
            agreeTitle={t(
              "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.closeButton",
            )}
            handleAgree={handleClose}
          />
        ) : // <StyledMat.SingleEndpointWrapper>
        //   <StyledMat.SingleEndpointText>
        //     The selected endpoint already has a policy update task.
        //     <br />
        //     Please wait for it to complete before trying to
        //     configure/clear filter rule(s) for this endpoint again.
        //   </StyledMat.SingleEndpointText>

        //   <StyledMat.SingleEndpointAlertCloseButton
        //     children={"close"}
        //   onClick={handleClose}
        //   />
        // </StyledMat.SingleEndpointWrapper>
        null}

        {jsxState === "preProcessMultiple" ? (
          <>
            <StyledMat.HeaderWrapper>
              <StyledMat.HeaderTitle>
                {t("page.Endpoint.Configure.clearFilterrules.title")}
              </StyledMat.HeaderTitle>

              <StyledMat.CloseButton onClick={handleClose}>
                <MatIcons.CloseSharp fontSize="medium" />
              </StyledMat.CloseButton>
            </StyledMat.HeaderWrapper>

            <StyledMat.ContentContainer>
              <PreProcessValidation
                disabled={!!!qualifiedRecords.length}
                title={t("page.Endpoint.Configure.clearFilterrules.title")}
                loading={loading}
                qualifiedRecords={qualifiedRecords}
                unQualifiedRecords={unQualifiedRecords}
                footerActions={{
                  onAbort: handleClose,
                  onConfirm,
                }}
              />
            </StyledMat.ContentContainer>
          </>
        ) : null}

        <AlertDialog
          open={alertDialog}
          setOpen={setAlertDialog}
          contentTitle={alertDialogTitle || `Error!`}
          contentText={
            alertDialogContent || (
              <>
                {t(
                  "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.errorFetching",
                )}
                <br />
                <br />
                {t(
                  "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.details",
                )}
                <br />
                {Utility.getErrorsFromResponse(errorResponse)}
              </>
            )
          }
          handleAgree={() => {
            setAlertDialog(false);
            handleClose();
          }}
          handleDisagree={() => {
            setAlertDialog(false);
            handleClose();
          }}
          agreeTitle={t("commons.okayText")}
          divider={false}
        />
      </StyledMat.Wrapper>
    );
  },
);
