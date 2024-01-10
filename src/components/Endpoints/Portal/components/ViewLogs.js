import { Box, IconButton, Link, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import {
  deletefetchlogResponder,
  DownloadLogAPIResponder,
  FetchLogAPIResponder,
} from "../../../../apis/responders/endpoints-config-api-responder";
import Utility from "../../../../redux/actions/Utility";
import OverlayContext from "../../../AppContent/AppOverlayContext";
import Prompt from "../../../DeletePrompt/Prompt";
import AlertDialog from "../../../IFVDataGrid/GridPortal/AlertDialog";
import { CloseButton } from "../../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../../IFVDataGrid/styled-materials/PopupHeader";
import { Spinner } from "../../../IFVDataGrid/styled-materials/Spinner";
import ToolTip from "../../../../utils/Tooltip/Tooltip";
import { endpoint } from "../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";
import { t } from "i18next";

const initialState = {
  logStartDateTime: "",
  logEndDateTime: "",
  logDeleteDateTime: "",
  fileUrl: "",
};

const taskStatus = {
  0: { status: "Submitted", color: "#D97706" },
  1: { status: "In Progress", color: "#1E90FF" },
  2: { status: "Done", color: "#34D399" },
  3: { status: "Cancelled", color: "#F87171" },
};

const payloadAction = {
  isLoading: true,
  payload: [],
  error: "",
};

const asLog = (_) => _;
const asName = (_) => _;
const asSerial = (_) => _;

const asDateTimeold = (param) => {
  /* const _ = param.split("_");
  const day = _[0].slice(4, 6);
  const month = _[0].slice(6, 8);
  const year = _[0].slice(0, 4);
  const hour = _[1].slice(0, 2);
  const minutes = _[1].slice(2, 4);
  const seconds = _[1].slice(4, 6);

  const date = `${year}/${month}/${day}`;
  const time = `${hour}:${minutes}:${seconds}`; */

  var d = new Date(param);

  const date = `${d.getUTCFullYear()}/${("00" + (d.getUTCMonth() + 1)).slice(
    -2,
  )}/${("00" + d.getUTCDate()).slice(-2)}`;
  const time = `${("00" + d.getUTCHours()).slice(-2)}:${(
    "00" + d.getUTCMinutes()
  ).slice(-2)}:${("00" + d.getUTCSeconds()).slice(-2)}`;

  return `${date} ${time}`;
};

const asDateTime = (param) => {
  //ddMMyyHHmmss

  /*const _ = param; //param.split("_");
  const day = _[0].slice(4, 6);
  const month = _[0].slice(6, 8);
  const year = _[0].slice(0, 4);
  const hour = _[1].slice(0, 2);
  const minutes = _[1].slice(2, 4);
  const seconds = _[1].slice(4, 6);*/
  let date = "NA";
  let time = "NA";

  if (param) {
    const newVal = param.toString();
    const day = newVal.slice(0, 2);
    const month = newVal.slice(2, 4);
    const year = newVal.slice(4, 6);
    const hour = newVal.slice(6, 8);
    const minutes = newVal.slice(8, 10);
    const seconds = newVal.slice(10, 12);

    date = `${month}/${day}/${year}`;
    time = `${hour}:${minutes}:${seconds}`;
  }
  return `${date} ${time}`;
};

const asUTC = (param) => {
  if (param) {
    const cdate = new Date(Number(`${param}000`));
    const date = cdate.getUTCDate();
    const month =
      cdate.getUTCMonth() <= 11 ? cdate.getUTCMonth() + 1 : cdate.getUTCMonth();
    const year = cdate.getUTCFullYear();

    return `${month}/${date}/${year}`;
  } else return param;
};

const parseFilename = (filename) => {
  const _ = filename.split("_");
  const log = asLog(_[0]);
  const name = asName(_[1]);
  const serial = asSerial(_[2]);
  const startDateTime = asDateTime(`${_[3]}_${_[4]}`);
  const endDateTime = asDateTime(`${_[5]}_${_[6]}`);

  return {
    log,
    name,
    serial,
    startDateTime,
    endDateTime,
  };
};

const DownloadLog = ({
  isDownloadingFromParent,
  row,
  rowIndex,
  AppOverlayContext,
  isDownloading,
  setIsDownloading,
}) => {
  const [alertDialog, setAlertDialog] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);

  const handleDownloadLog = () => {
    setIsDownloading(true);

    callAPI({
      path: "download-log",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        fileName: row.fileName,
      },
      data: {},
      responder: DownloadLogAPIResponder,
      onComplete: (response, fileName) => {
        if (response.state === "DOWNLOAD_LOG_SUCCESS") {
          if (typeof response.data === "string") {
            window.open(
              `/skylightweb/downloadLogs?gatewayIP=${AppOverlayContext.selectedGateway.address}&fileName=${row.fileName}`,
            );
            // saveAs(
            //   "data:text/plain;base64," + response.data,
            //   fileName + ".log"
            // );
          } else {
            setErrorPrompt(true);
            setAlertDialog(
              <>
                <p>
                  {t(
                    "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.message",
                  )}
                </p>
                <br />
                {t(
                  "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.errorDetails",
                )}
                <br />
                <p>
                  {t(
                    "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.invalidResponse",
                  )}
                </p>
              </>,
            );
          }
        } else {
          setErrorPrompt(true);
          setAlertDialog(
            <>
              <p>
                {t(
                  "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.message",
                )}
              </p>
              <p>
                {t(
                  "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.errorDetails",
                )}
              </p>
              {Utility.getErrorsFromResponse(response, true)}
            </>,
          );
        }
        setIsDownloading(false);
      },
      onCompleteArguments: [row.fileName],
    });
  };

  return (
    <>
      <ToolTip
        title={t("page.Endpoint.Configure.downloadLogsModal.tooltipDownload")}
      >
        <Styled.ActionIconButtonDownload
          onClick={handleDownloadLog}
          //href={`/skylightweb/downloadLogs?gatewayIP=${AppOverlayContext.selectedGateway.address}&fileName=${row.fileName}`}
          //target={"_blank"}
          style={{
            display: isDownloading ? "none" : "flex",
          }}
        >
          <DownloadForOfflineRoundedIcon
            isDownloadLoading={isDownloading}
            disabled={row.task_status}
            style={{
              color: "#018ff6",
              display: isDownloading ? "none" : "flex",
            }}
          />
        </Styled.ActionIconButtonDownload>
      </ToolTip>
      <Prompt
        open={errorPrompt}
        setOpen={setErrorPrompt}
        contentTitle={t(
          "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.title",
        )}
        contentText={alertDialog}
        contentInfo={``}
        agreeTitle={"Ok"}
        handleAgree={() => setErrorPrompt(false)}
      />
      {/* <DOWNLOAD_LOG
        variant="outlined"
        onClick={handleDownloadLog}
        isDownloadLoading={isDownloading}
        disabled={row.task_status}
        underline="none"
        // href={`/skylightweb/downloadLog/${row.fileName}`}
        // target={"_blank"}
      > */}

      {/* </DOWNLOAD_LOG> */}
      {/* <SpinnerLoader size={20} isDownloadLoading={isDownloading} /> */}
    </>
  );
};

const TableRows = ({
  row,
  rowIndex,
  gatewayIP,
  viewLogsState,
  portalState,
  setPortalState,
  AppOverlayContext,
  payloadState,
  setPayloadState,
  setMessage,
  setDialogOpen,
  setError,
  setPrompt,
  setParam,
}) => {
  const [state, setState] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  useEffect(() => {
    setPortalState((oldState) => ({
      ...oldState,
      isProgressPending: state,
    }));
  }, [state, setPortalState]);

  const continueHandler = () => {
    setPrompt(true);
    setParam(row);
  };

  return (
    <Styled.TableRow>
      {/* <TableCell>{parseFilename(row.fileName).startDateTime}</TableCell>
      <TableCell>{parseFilename(row.fileName).endDateTime}</TableCell> */}
      <Styled.TableCell>
        {asDateTime(row.fileName.split("_")[2])}
      </Styled.TableCell>
      <Styled.TableCell>
        {asDateTime(row.fileName.split("_")[3])}
      </Styled.TableCell>
      <Styled.TableCell>
        {asUTC(row.delDate) /* .split("-").join("/") */}
      </Styled.TableCell>
      <Styled.TableCell className="ActionButtonGroup">
        <DownloadLog
          row={row}
          rowIndex={rowIndex}
          AppOverlayContext={AppOverlayContext}
          isDownloading={isDownloading}
          setIsDownloading={setIsDownloading}
        />
        <ToolTip
          title={t("page.Endpoint.Configure.downloadLogsModal.tooltipDelete")}
        >
          <Styled.ActionIconButton
            id={`${endpoint}-downLoad-logs-modal-download-button`}
            onClick={continueHandler}
            style={{ display: isDownloading ? "none" : "flex" }}
          >
            <DeleteIcon
              id={`${endpoint}-downLoad-logs-modal-delete-button`}
              style={{
                color: "#ed143d",
                display: isDownloading ? "none" : "flex",
              }}
            />
          </Styled.ActionIconButton>
        </ToolTip>
        <Styled.SpinnerLoader size={20} isDownloadLoading={isDownloading} />
      </Styled.TableCell>
    </Styled.TableRow>
  );
};

export const ViewLogs = ({
  row,
  rowIndex,
  portalState,
  setPortalState,
  viewLogsState,
  setViewLogsState,
}) => {
  const AppOverlayContext = useContext(OverlayContext);
  const [isAsyncDone, setIsAsyncDone] = useState(false);
  const [payloadState, setPayloadState] = useState(payloadAction);
  const [isDownloading, setIsDownloading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [param, setParam] = useState({});

  const { t } = useTranslation();

  const endpoint = "192.194.23.3";

  const closePopup = () => {
    setPortalState({ type: "", isPortal: false });
  };

  // const handleClose = () => {
  //   setPortalState({ type: "", isPortal: false });
  // };

  const onCompleteDeleteHandeler = (
    response,
    row,
    payloadState,
    setPayloadState,
    setIsDownloading,
    setMessage,
    setDialogOpen,
  ) => {
    if (response.state === "DELETE_LOG_SUCCESS") {
      const data = payloadState.payload.filter((e) => e.l_ID !== param.l_ID);
      setPayloadState({ isLoading: false, payload: data, error: "" });
      setMessage(
        t(
          "page.Endpoint.Configure.downloadLogsModal.Action Options.Prompt.Deleting File Status.Success",
          { fileName: param.fileName },
        ),
      );
      setDialogOpen(true);
    } else {
      setError(true);
      setMessage(
        t(
          "page.Endpoint.Configure.downloadLogsModal.Action Options.Prompt.Deleting File Status.Error",
        ),
      );
      setDialogOpen(true);
    }
    setTimeout(() => setIsDownloading(false), 800);
  };

  const handleDelete = (event, row) => {
    setIsDownloading(true);
    callAPI({
      path: "deleteFetch",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: { l_ID: param.l_ID },
      responder: deletefetchlogResponder,
      onComplete: onCompleteDeleteHandeler,
      onCompleteArguments: [
        row,
        payloadState,
        setPayloadState,
        setIsDownloading,
        setMessage,
        setDialogOpen,
      ],
    });
    setPrompt(false);
  };

  const handleDialogClose = () => setDialogOpen(false);

  const cancelHandler = (event) => {
    closePopup();
    setTimeout(() => {
      viewLogsState.setDontClosePopup(true);
      viewLogsState.setTaskStatus({
        inProgress: false,
        error: false,
        message: ``,
      });
    }, 0);
  };

  useEffect(() => {
    if (isAsyncDone === true) {
      // handleClose();
      closePopup();
    }
  }, [isAsyncDone]);

  useEffect(() => {
    callAPI({
      path: "fetch-log",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        endpointId: viewLogsState.row.endpoint_ID,
      },
      data: {},
      responder: FetchLogAPIResponder,
      onComplete: (response) => {
        let data = [];
        data = response.data;
        let sortedActivities;
        sortedActivities = data
          .slice()
          .sort(
            (a, b) =>
              new Date(asDateTime(b.fileName.split("_")[2])) -
              new Date(asDateTime(a.fileName.split("_")[2])),
          );

        if (response.state === "FETCH_LOG_SUCCESS") {
          if (!!payloadState.payload.length) {
            setPayloadState({
              isLoading: false,
              payload: "",
              error: t("page.Endpoint.Configure.downloadLogsModal.records"),
            });
          } else {
            setPayloadState({
              isLoading: false,
              payload: sortedActivities,
              error: "",
            });
          }
        } else {
          setPayloadState({
            isLoading: false,
            payload: [],
            error: (
              <>
                {t(
                  "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.errorFetch",
                )}
                <br />
                <br />
                {t(
                  "page.Endpoint.Configure.downloadLogsModal.downloadLogsAlert.errorDetails",
                )}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </>
            ),
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    setPortalState((oldState) => ({
      ...oldState,
      isProgressPending: payloadState.isLoading,
    }));
  }, [payloadState.isLoading, setPortalState]);

  return (
    <Styled.PopupWrapper id={`${endpoint}-downLoad-logs-modal`}>
      <Styled.PopUpHeader>
        <Styled.PopupTitle>
          {t("page.Endpoint.Configure.downloadLogsModal.title")}
        </Styled.PopupTitle>

        <CloseButton
          id={`${endpoint}-downLoad-logs-modal-close-button`}
          onClick={cancelHandler}
        >
          <CloseSharp fontSize="medium" />
        </CloseButton>
      </Styled.PopUpHeader>

      <Styled.CustomPopupContent>
        <Styled.TitleWrraper>
          <Styled.NameBox>
            <Styled.NameText>
              <b>
                {t("page.Endpoint.Configure.downloadLogsModal.endpointName")}
              </b>{" "}
              {viewLogsState.row.name}
            </Styled.NameText>
          </Styled.NameBox>
          <Styled.NameBox>
            <Styled.NameText>
              <b>
                {t("page.Endpoint.Configure.downloadLogsModal.endpointSerial")}
              </b>{" "}
              {viewLogsState.row.client_ID}
            </Styled.NameText>
          </Styled.NameBox>
        </Styled.TitleWrraper>

        <Styled.Table>
          <Styled.TableHead>
            <Styled.TableRow>
              <Styled.TableCell>
                {t("page.Endpoint.Configure.downloadLogsModal.logStart")}
              </Styled.TableCell>
              <Styled.TableCell>
                {t("page.Endpoint.Configure.downloadLogsModal.logEnd")}
              </Styled.TableCell>
              <Styled.TableCell>
                {t("page.Endpoint.Configure.downloadLogsModal.logDelete")}
              </Styled.TableCell>
              <Styled.TableCell style={{ justifyContent: "center" }}>
                {t("page.Endpoint.Configure.downloadLogsModal.action")}
              </Styled.TableCell>
            </Styled.TableRow>
          </Styled.TableHead>

          <Styled.TableBody
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            theme={{ isHovered }}
          >
            {payloadState.isLoading ? (
              <Styled.LoadingBox>
                <Styled.LoadingText>
                  {t("page.Endpoint.Configure.downloadLogsModal.loadingText")}
                </Styled.LoadingText>
              </Styled.LoadingBox>
            ) : payloadState.error ? (
              <Styled.WrapperError>
                <Styled.ErrorDiv>{payloadState.error}</Styled.ErrorDiv>
              </Styled.WrapperError>
            ) : !!payloadState.payload.length ? (
              payloadState.payload.map((row, rowIndex) => (
                <TableRows
                  row={row}
                  rowIndex={rowIndex}
                  gatewayIP={AppOverlayContext.selectedGateway.address}
                  viewLogsState={viewLogsState}
                  portalState={portalState}
                  setPortalState={setPortalState}
                  AppOverlayContext={AppOverlayContext}
                  payloadState={payloadState}
                  setPayloadState={setPayloadState}
                  // isDownloading={isDownloading}
                  // setIsDownloading={setIsDownloading}
                  setError={setError}
                  setDialogOpen={setDialogOpen}
                  setMessage={setMessage}
                  setPrompt={setPrompt}
                  setParam={setParam}
                />
              ))
            ) : (
              <Styled.WrapperDiv>
                <Styled.NoRecordsDiv>
                  {t("page.Endpoint.Configure.downloadLogsModal.emptyMessag")}
                </Styled.NoRecordsDiv>
              </Styled.WrapperDiv>
            )}
          </Styled.TableBody>
        </Styled.Table>

        <Styled.BottomText>
          {t("page.Endpoint.Configure.downloadLogsModal.utc")}
        </Styled.BottomText>
      </Styled.CustomPopupContent>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={
          error
            ? t(
                "page.Endpoint.Configure.downloadLogsModal.Action Options.Alert.Error Text",
              )
            : t(
                "page.Endpoint.Configure.downloadLogsModal.Action Options.Alert.Task Completed Text",
              )
        }
        contentText={message}
        handleAgree={handleDialogClose}
        agreeTitle={t("commons.okayText")}
        // handleDisagree={() => setDialogOpen(false)}
        // disagreeTitle={"Close"}
      />
      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={t(
          "page.Endpoint.Configure.downloadLogsModal.deleteConfirmation.deleteConfirmText",
        )}
        contentText={
          <>
            <p>
              <Trans
                i18nKey={
                  "page.Endpoint.Configure.downloadLogsModal.deleteConfirmation.message1"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this log file.
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click <b>Cancel</b>.
              </Trans>
            </p>
          </>
        }
        contentInfo={``}
        agreeTitle={t("page.Endpoint.Configure.downloadLogsModal.confirm")}
        disagreeTitle={t("page.Endpoint.Configure.downloadLogsModal.cancel")}
        handleAgree={(event) => handleDelete(event, param)}
        handleDisagree={() => setPrompt(false)}
      />
    </Styled.PopupWrapper>
  );
};

const Styled = {
  TitleWrraper: styled(Box)`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    justify-content: center;
    align-items: flex-start;
    gap: 0.4rem;
    width: 100%;
    background: #ebf7ff;
    border-left: 0.2em solid #0094fd;
    border-radius: 0.25em;
    padding: 0.5em 1em;
  `,
  NameBox: styled(Box)``,
  NameText: styled(Typography)`
    font-size: 0.9rem;
  `,

  LoadingBox: styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  LoadingText: styled(Typography)`
    font-weight: 500;
    font-size: 1.1rem;
  `,

  ActionIconButton: styled(IconButton)`
    &:hover {
      background-color: rgba(237, 20, 61, 0.15);
    }
  `,

  ActionIconButtonDownload: styled(IconButton)`
    &:hover {
      background-color: rgba(2, 147, 254, 0.2);
    }
  `,

  PopUpHeader: styled(PopupHeader)``,

  PopupWrapper: styled(Popup)`
    /* width: 64vw;
  height: 62vh; */
    width: 95vw;
    height: 80vh;

    overflow: hidden;
    margin-top: 0em;
  `,

  CustomPopupContent: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    // gap: 2rem;
  `,

  PopupTitle: styled(Typography)`
    font-size: "1rem";
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 700;
    line-height: 1.5;
    color: "rgba(2, 147, 254, 1)";
  `,

  BottomText: styled(Typography)`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    margin: 1em 0;
    font-size: 0.8rem;
    color: #333;
    width: 100%;
    text-align: center;
    border-radius: 4px;
    padding: 0.25em 1em;
    opacity: 0;
  `,

  WrapperDiv: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,

  NoRecordsDiv: styled.div`
    text-align: left;
    color: crimson;
  `,

  WrapperError: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,

  ErrorDiv: styled.div`
    text-align: left;
    color: crimson;
  `,

  Table: styled.table`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    margin: 1em 0em;
    padding: 0em;
    border-collapse: collapse;
    border: 0.1em solid #eee;
    border: 0.1em solid #dee2e6;
    border-radius: 0.5em;
    overflow: hidden;
    font-size: 1em;

    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
  `,

  TableHead: styled.thead`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
    /* padding: 0.5rem 0.5rem; */
    line-height: 1.5;
    font-size: 0.9rem;

    font-weight: 600;
  `,

  TableBody: styled.tbody`
    font-weight: 500;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 320px;
    overflow-y: scroll;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.7em;
      height: 0.7em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 73, 122, 0);
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track:hover {
      background: rgba(0, 73, 122, 0);
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */

    /*
  &::-webkit-scrollbar {
    display: none;
  }


  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
  `,

  TableRow: styled.tr`
    display: flex;
    flex-direction: row;
    /* cursor: pointer; */
    /* &:hover {
    background: #f1fdfc;
  } */
    &:hover .selecthide {
      opacity: 1;
      color: #fff;
      background-color: #eff2f7;
      font-size: 0.75rem;
      &:hover {
        cursor: pointer;
        opacity: 1;
        color: #fff;
        background-color: #eff2f7;
        font-size: 0.75rem;
      }

      &input:checked[type="checkbox"] {
        background-image: url(../images/tickicon.png);
        background-size: 10px auto;
        border: 1px solid rgb(143 220 106);
      }
    }

    & .selected {
      opacity: 1;
      color: #fff;
      background-color: #eff2f7;
      font-size: 0.75rem;
      cursor: default;
      pointer-events: none;
    }
  `,

  TableCell: styled.td`
    border-bottom: 0.1em solid #dee2e6;
    text-align: left;
    padding: 1em;
    display: flex;
    width: 25%;
    justify-content: flex-start;
    align-items: center;
    text-align: left;

    &.ActionButtonGroup {
      justify-content: center;
    }
  `,

  SpinnerLoader: styled(Spinner)`
    display: ${(props) => (props.isDownloadLoading ? "flex" : "none")};
    margin: 0.5rem;
  `,

  DeleteIcon: styled(DeleteIcon)``,

  DOWNLOAD_LOG: styled(Link)`
    display: ${(props) => (props.isDownloadLoading ? "none" : "flex")};
    cursor: pointer;

    color: #fff;
    background: #018ff6;
    border-color: #018ff6;
    border: 1px solid transparent;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 0.25rem;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    padding: 0.4em 1em;

    &:hover {
      background: #1e6ee4;
      color: #fff;
    }

    &[disabled] {
      opacity: 0.6;
      color: white;
      pointer-events: none;
    }
  `,
};
