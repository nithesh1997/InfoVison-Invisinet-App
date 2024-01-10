import { Box, Button, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";
import OverlayContext from "../../AppContent/AppOverlayContext";
import { CloseButton } from "../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../IFVDataGrid/styled-materials/PopupHeader";
import { Spinner } from "../../IFVDataGrid/styled-materials/Spinner";
import { sign } from "../../IFVDataGrid/TableComponents/InputField/styled-materials";
import { Input } from "../../IFVDataGrid/TableComponents/InputField/styled-materials/Input";

const payloadAction = {
  isLoading: false,
  payload: [
    {
      endpoint: 23,
      task_id: 1,
      startDateTime: "07/27/1997 02:30:01",
      endDateTime: "07/27/1997 22:59:31",
    },
  ],
  error: "",
};

const asUTC = (param) => {
  const _ = (d) => (d.toString().length === 1 ? "0" + d : d);
  const date = _(param.getDate());
  const month = _(param.getMonth() + 1);
  const year = _(param.getFullYear());
  const hour = _(param.getUTCHours());
  const minutes = _(param.getUTCMinutes());
  const seconds = _(param.getUTCSeconds());

  return new Date(`${year}-${month}-${date} ${hour}:${minutes}:${seconds}`);
};

const formatForRequest = (param) => {
  const _ = (d) => (d.toString().length === 1 ? "0" + d : d);
  const date = _(param.getDate());
  const month = _(param.getMonth() + 1);
  const year = _(param.getFullYear());
  const hour = _(param.getHours());
  const minutes = _(param.getMinutes());
  const seconds = _(param.getSeconds());

  return `${month}/${date}/${year} ${hour}:${minutes}:${seconds}`;
  // return `${year}/${month}/${date} ${hour}:${minutes}:${seconds}`;
};

const timestamp = new Date();

const getInitialDateState = () =>
  timestamp.getUTCFullYear() +
  "-" +
  ("00" + timestamp.getUTCMonth()).slice(-2) +
  "-" +
  ("00" + timestamp.getUTCDate()).slice(-2);

const getInitialStartTimeState = () =>
  ("00" + (timestamp.getUTCHours() - 1)).slice(-2) +
  ":" +
  ("00" + timestamp.getUTCMinutes()).slice(-2) +
  ":00";

const getInitialEndTimeState = () =>
  ("00" + timestamp.getUTCHours()).slice(-2) +
  ":" +
  ("00" + timestamp.getUTCMinutes()).slice(-2) +
  ":00";

export const DownloadLogs = ({ handleClose }) => {
  const { componentsShown } = React.useContext(OverlayContext);
  const { setComponentsShown } = React.useContext(OverlayContext);
  const { downloadLogsState } = React.useContext(OverlayContext);
  const { setDownloadLogsState } = React.useContext(OverlayContext);
  const [endTimeHelperText, setEndTimeHelperText] = React.useState(` `);
  // let ts = new Date();
  const [dateState, setDateState] = React.useState(() => getInitialDateState());
  const [startTimeState, setStartTimeState] = React.useState(() =>
    getInitialStartTimeState(),
  );
  const [endTimeState, setEndTimeState] = React.useState(() =>
    getInitialEndTimeState(),
  );
  // const [dateState, setDateState] = React.useState(
  //   ts.getUTCFullYear() +
  //     "-" +
  //     ("00" + ts.getUTCMonth()).slice(-2) +
  //     "-" +
  //     ("00" + ts.getUTCDate()).slice(-2)
  // );
  // const [startTimeState, setStartTimeState] = React.useState(
  //   ("00" + (ts.getUTCHours() - 1)).slice(-2) +
  //     ":" +
  //     ("00" + ts.getUTCMinutes()).slice(-2) +
  //     ":00"
  // );
  // const [endTimeState, setEndTimeState] = React.useState(
  //   ("00" + ts.getUTCHours()).slice(-2) +
  //     ":" +
  //     ("00" + ts.getUTCMinutes()).slice(-2) +
  //     ":00"
  // );
  const [startDateTimeState, setStartDateTimeState] = React.useState(
    new Date(),
  );
  const [endDateTimeState, setEndDateTimeState] = React.useState(new Date());
  const [formattedDateTime, setFormattedDateTime] = React.useState();
  const [UTCDateTimeState, setUTCDateTimeState] = React.useState(() =>
    asUTC(startDateTimeState),
  );

  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isAsyncDone, setIsAsyncDone] = React.useState(false);
  const [borderColorState, setBorderColorState] = React.useState(sign.pristine);
  const [payload, setPayload] = React.useState(payloadAction);

  React.useEffect(() => {
    setStartDateTimeState(
      new Date(formatForRequest(new Date(`${dateState} ${startTimeState}`))),
    );
  }, [dateState, startTimeState]);

  React.useEffect(() => {
    setEndDateTimeState(
      new Date(formatForRequest(new Date(`${dateState} ${endTimeState}`))),
    );
  }, [dateState, endTimeState]);

  /* For HelperTexts */
  React.useEffect(() => {
    if (Date.parse(startDateTimeState) >= Date.parse(endDateTimeState)) {
      setEndTimeHelperText(`End time should be greater than ${startTimeState}`);
    } else {
      setEndTimeHelperText(` `);
    }
  }, [endDateTimeState, startDateTimeState, startTimeState]);

  const closePopup = React.useCallback(() => {
    setComponentsShown(
      componentsShown
        .replace(/(,download-logs-portal,)|(,download-logs-portal$)/, ",")
        .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
    );
  }, [componentsShown]);

  const submitHandler = (event, setPayloadState, setIsAsyncDone) => {
    setPayloadState((currPayload) => ({ ...currPayload, isLoading: true }));
    setIsDisabled(true);

    /* callAPI({
      path: "addToDoList",
      params: {},
      data: {
        endpointObj: [
          {
            endpoint_id: "somegatewayname_asd09as8dfas7dfa89sdf87asdf69a8sd7f",
            task_id: 1,
            startDateTime: formatForRequest(startDateTimeState),
            endDateTime: formatForRequest(startDateTimeState),
          },
        ],
      },
      responder: (res, onComplete, args) => {
        const responder = {
          state: "ADD_TODO_FAILURE",
          data: undefined,
          code: undefined,
        };
        if (res.state === "GOOD_RESPONSE") {
          responder.state = "ADD_TODO_SUCCESS";
          responder.code = res.response.code;
        }
        onComplete(responder, ...args);
      },
      onComplete: (responder, endpointObj) => {},
      onCompleteArguments: [],
    }); */

    setTimeout(() => {
      setPayloadState((currPayload) => ({ ...currPayload, isLoading: false }));
      setIsAsyncDone(true);
      setIsDisabled(true);
      downloadLogsState.setTaskStatus({
        inProgress: false,
        isError: false,
        message: `Your request has been submitted. The logs will be available for download shortly.`,
      });
    }, 3000);
  };

  const cancelHandler = (event) => {
    closePopup();
    setTimeout(() => {
      downloadLogsState.setTaskStatus({
        inProgress: false,
        isError: false,
        message: ``,
      });
    }, 0);
  };

  React.useEffect(() => {
    if (isAsyncDone === true) {
      closePopup();
      handleClose();
      setDateState(() => getInitialDateState());
      setStartTimeState(() => getInitialStartTimeState());
      setEndTimeState(() => getInitialEndTimeState());
      setIsDisabled(false);
    }
  }, [isAsyncDone]);

  return (
    <PopupWrapper>
      <PopupHeader>
        <PopupTitle>Download Endpoint Logs</PopupTitle>
        <CloseButton onClick={cancelHandler}>
          <CloseSharp fontSize="medium" />
        </CloseButton>
      </PopupHeader>
      <CustomPopupContent>
        <PopupInput
          borderColorState={borderColorState}
          type="text"
          label="Endpoint's Name"
          variant="outlined"
          value="BRGW-offshore.localdomain"
          helperText=" "
          disabled
        />
        <PopupInput
          borderColorState={borderColorState}
          type="text"
          label="Endpoint's Serial"
          variant="outlined"
          value="00C8C9F364F09E7ABBB191B0AA70FC9D67"
          helperText=" "
          disabled
        />
        <PopupInput
          borderColorState={borderColorState}
          value={dateState}
          disabled={isDisabled}
          helperText=" "
          label="Date"
          type="date"
          variant="outlined"
          onChange={(e) => {
            setDateState(e.target.value);
          }}
        />
        <PopupInput
          borderColorState={borderColorState}
          type="time"
          label="Start Time"
          variant="outlined"
          value={startTimeState}
          onChange={(e) => setStartTimeState(e.target.value)}
          disabled={isDisabled}
          helperText=" "
        />
        <PopupInput
          borderColorState={borderColorState}
          type="time"
          label="End Time"
          variant="outlined"
          value={endTimeState}
          onChange={(e) => setEndTimeState(e.target.value)}
          disabled={isDisabled}
          helperText={endTimeHelperText}
        />
        <div style={{ marginBottom: "0.75em", fontSize: "1em", color: "#777" }}>
          All date and time values above are in UTC.
        </div>
        <ButtonsWrapper>
          <SubmitButton
            variant="outlined"
            inProgress={payload.isLoading}
            onClick={(event) =>
              submitHandler(event, setPayload, setIsAsyncDone)
            }
            disabled={endTimeHelperText !== " "}
          >
            Submit
          </SubmitButton>
          <CancelButton
            variant="outlined"
            inProgress={payload.isLoading}
            onClick={cancelHandler}
          >
            Cancel
          </CancelButton>
          <SpinnerWrapper inProgress={payload.isLoading}>
            <Spinner size={32} />
          </SpinnerWrapper>
        </ButtonsWrapper>
      </CustomPopupContent>
    </PopupWrapper>
  );
};

const PopupWrapper = styled(Popup)`
  width: 45vw;
  min-width: 400px;
  max-width: 600px;
  /* height: 75vh; */
  height: auto;
`;

const CustomPopupContent = styled(Box)`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 2rem 3rem 0rem 3rem;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PopupTitle = styled(Typography)`
  & {
    /* font-family: "Montserrat", sans-serif; */
  }
  font-size: "1rem";
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 700;
  line-height: 1.5;
  color: "rgba(2, 147, 254, 1)";
`;

const PopupInput = styled(Input)`
  background: #f9f9f9;
  & .Mui-disabled > input {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

const ButtonsWrapper = styled(Box)`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 1rem 0;
`;

const SubmitButton = styled(Button)`
  display: ${({ inProgress }) => (!inProgress ? "flex" : "none")};
  margin: 0rem 1rem;
  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: rgba(2, 147, 254, 1);
  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }
`;

const CancelButton = styled(Button)`
  display: ${({ inProgress }) => (!inProgress ? "flex" : "none")};
  margin: 0rem 1rem;
  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(237, 20, 61, 1);
  color: rgba(237, 20, 61, 1);
  &:hover {
    background: rgba(237, 20, 61, 0.1);
  }
`;

const SpinnerWrapper = styled(Box)`
  position: absolute;
  width: calc(100% + 2em);
  height: 100%;
  display: flex;
  margin-top: 2em;
  align-items: center;
  justify-content: center;
  display: ${({ inProgress }) => (inProgress ? "flex" : "none")};
  background: transparent;
`;
