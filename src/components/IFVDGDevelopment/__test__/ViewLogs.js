import { Box, Button, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import { encodeBase64, saveAs } from "@progress/kendo-file-saver";
import React from "react";
import styled from "styled-components";
import OverlayContext from "../../AppContent/AppOverlayContext";
import { CloseButton } from "../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../IFVDataGrid/styled-materials/PopupHeader";
import { Spinner } from "../../IFVDataGrid/styled-materials/Spinner";
import { sign } from "../../IFVDataGrid/TableComponents/InputField/styled-materials";
import staticLogFile from "./staticLogFile";

const taskStatus = {
  0: { status: "Submitted", color: "#D97706" },
  1: { status: "In Progress", color: "#1E90FF" },
  2: { status: "Done", color: "darkgreen" },
  3: { status: "Cancelled", color: "#F87171" },
};

const payloadAction = {
  isLoading: true,
  payload: [],
  error: "",
};

export const ViewLogs = ({ handleClose }) => {
  const { componentsShown } = React.useContext(OverlayContext);
  const { setComponentsShown } = React.useContext(OverlayContext);
  const { viewLogsState, setViewLogsState } = React.useContext(OverlayContext);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isAsyncDone, setIsAsyncDone] = React.useState(false);
  const [borderColorState, setBorderColorState] = React.useState(sign.pristine);
  const [payloadState, setPayloadState] = React.useState(payloadAction);
  const [isDownloadLoading, setisDownloadLoading] = React.useState(false);
  const endpoint = "192.194.23.3";

  const closePopup = () => {
    setComponentsShown(
      componentsShown
        .replace(/(,view-logs-portal,)|(,view-logs-portal$)/, ",")
        .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
    );
  };

  const cancelHandler = (event) => {
    closePopup();
    setTimeout(() => {
      viewLogsState.setTaskStatus({
        inProgress: false,
        error: false,
        message: ``,
      });
    }, 0);
  };

  const handleDownload = (filename) => {
    const dataURI = "data:text/plain;base64," + encodeBase64(staticLogFile());
    saveAs(dataURI, filename);
  };

  React.useEffect(() => {
    /* callAPI({
      path: "epcLogs",
      params: {},
      data: {},
      responder: (res, onComplete, args) => {
        const responder = {
          state: "GET_EPC_LOGS_FAILURE",
          data: undefined,
          code: undefined,
        };
        if (res.state === "GOOD_RESPONSE") {
          responder.state = "GET_EPC_LOGS_SUCCESS";
          responder.data = res.response.body;
          responder.code = res.response.code;
        }
        onComplete(responder, ...args);
      },
      onComplete: (responder) => {
        if (responder.state === "GET_EPC_LOGS_FAILURE") {
          setPayloadState({
            isLoading: false,
            payload: [],
            error: "GET_EPC_LOGS_FAILURE",
          });
        }
        if (responder.state === "GET_EPC_LOGS_SUCCESS") {
          setPayloadState({
            isLoading: false,
            payload: [...responder.data],
            error: "",
          });
        }
      },
      onCompleteArguments: [],
    }); */
    setPayloadState({
      isLoading: false,
      payload: [
        {
          endpoint_id: 23,
          filename: "E23-20212308_145541-20210823_145911.log",
          del_date: "2020-03-21",
          task_status: 0,
        },
        {
          endpoint_id: 12,
          filename: "E12-20212308_145541-20210823_145911.log",
          del_date: "2020-07-27",
          task_status: 1,
        },
        {
          endpoint_id: 33,
          filename: "E33-20212308_145541-20210823_145911.log",
          del_date: "2020-04-16",
          task_status: 2,
        },
        {
          endpoint_id: 44,
          filename: "E44-20212308_145541-20210823_145911.log",
          del_date: "2020-08-10",
          task_status: 3,
        },
      ],
      error: "",
    });
  }, []);

  React.useEffect(() => {
    if (isAsyncDone === true) {
      handleClose();
      closePopup();
    }
  }, [isAsyncDone]);

  return (
    <PopupWrapper>
      <PopupHeader>
        <PopupTitle>View Endpoint Logs</PopupTitle>
        <CloseButton onClick={cancelHandler}>
          <CloseSharp fontSize="medium" />
        </CloseButton>
      </PopupHeader>
      <CustomPopupContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            fontSize: "1em",
            lineHeight: "1.5em",
            borderLeft: "0.3em solid rgba(1, 143, 246, 1)",
            padding: "0.5em 0.75em",
            backgroundColor: "rgba(1, 143, 246,0.1)",
            borderRadius: "0.25em",
          }}
        >
          <div>
            <b style={{ color: "rgba(1, 143, 246, 1)" }}>Endpoint Name:</b>{" "}
            BRGW-offshore.localdomain
            <br />
            <b style={{ color: "rgba(1, 143, 246, 1)" }}>
              Endpoint Serial:
            </b>{" "}
            00C8C9F364F09E7ABBB191B0AA70FC9D67
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Log Start Date</TableCell>
              <TableCell>Log End Date</TableCell>
              <TableCell>Log Request Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payloadState.isLoading ? (
              <p>Loading</p>
            ) : payloadState.error ? (
              <p>{payloadState.error}</p>
            ) : (
              payloadState.payload.map((row) => (
                <TableRow>
                  {/* <TableCell>{row.filename}</TableCell> */}
                  <TableCell>
                    {row.filename
                      .split("-")[1]
                      .replace("_", " ")
                      .replace(
                        /^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})/,
                        "$3/$2/$1 $4:$5:$6",
                      )}
                  </TableCell>
                  <TableCell>
                    {row.filename
                      .split("-")[2]
                      .replace("_", " ")
                      .replace(".log", " ")
                      .replace(
                        /^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})/,
                        "$3/$2/$1 $4:$5:$6",
                      )}
                  </TableCell>
                  <TableCell
                    style={{
                      color: taskStatus[row.task_status].color,
                      fontWeight: 600,
                    }}
                  >
                    {taskStatus[row.task_status].status}
                  </TableCell>
                  <TableCell className="ActionButtonGroup">
                    <DownloadLog
                      variant="outlined"
                      onClick={(e) => handleDownload(row.filename)}
                      isDownloadLoading={isDownloadLoading}
                      disabled={row.task_status !== 2}
                    >
                      Download
                    </DownloadLog>
                    <SpinnerLoader
                      size={20}
                      isDownloadLoading={isDownloadLoading}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CustomPopupContent>
    </PopupWrapper>
  );
};

const PopupWrapper = styled(Popup)`
  width: 60vw;
  min-width: 550px;
  max-width: 800px;
  /* height: 75vh; */
  height: auto;
`;

const CustomPopupContent = styled(Box)`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  overflow-y: scroll;
`;

const PopupTitle = styled(Typography)`
  & {
    /* font-family: "Montserrat", sans-serif; */
  }
  /* font-family: "Montserrat", sans-serif; */
  font-size: "1rem";
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 700;
  line-height: 1.5;
  color: "rgba(2, 147, 254, 1)";
`;

const Table = styled.table`
  /* font-family: "Montserrat", sans-serif; */
  width: 100%;
  padding: 1rem;
  border-collapse: collapse;
  border: 0.1em solid #eee;
  border: 0.1em solid #dee2e6;
  border-radius: 0.5em;
  overflow: hidden;
  font-size: 1em;
  /* font-family: "Montserrat", sans-serif; */
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
`;

const TableHead = styled.thead`
  border-bottom: 1px solid #dee2e6;
  text-align: left;
  /* padding: 0.5rem 0.5rem; */
  line-height: 1.5;
  font-size: 0.9rem;
  /* font-family: "Montserrat", sans-serif; */
  font-weight: 600;
`;

const TableBody = styled.tbody`
  height: auto;
  font-weight: 500;
`;

const TableRow = styled.tr`
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
`;

const TableCell = styled.td`
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
`;

const DownloadLog = styled(Button)`
  display: ${(props) => (props.isDownloadLoading ? "none" : "flex")};
  cursor: pointer;
  /* font-family: "Montserrat", sans-serif; */
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
  &:hover {
    background: #1e6ee4;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.6;
    color: white;
    pointer-events: none;
  }
`;

const SpinnerLoader = styled(Spinner)`
  display: ${(props) => (props.isDownloadLoading ? "flex" : "none")};
`;
