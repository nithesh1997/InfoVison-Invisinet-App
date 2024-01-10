import DateFnsUtils from "@date-io/date-fns";
import {
  Box,
  Button,
  Input,
  TextField,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import {
  CalendarViewDayRounded,
  CloseSharp,
  SyncDisabledRounded,
} from "@material-ui/icons";
import {
  DatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BrowserNotSupportedOutlinedIcon from "@mui/icons-material/BrowserNotSupportedOutlined";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import { AddTodoAPIResponder } from "../../../../apis/responders/endpoints-config-api-responder";
import { GetTaskStatusResponder } from "../../../../apis/responders/GetTaskStatusResponder";
import Utility from "../../../../redux/actions/Utility";
import { CloseButton } from "../../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../../IFVDataGrid/styled-materials/PopupHeader";
import { Spinner } from "../../../IFVDataGrid/styled-materials/Spinner";
import { sign } from "../../../IFVDataGrid/TableComponents/InputField/styled-materials";
import { StyledMat } from "../ClearFilterRuleAction/StyledMat";
import PreProcessValidation from "../PreProcessValidation/PreProcessValidation";
import AlertPopup from "./AlertPopup";
import { GenericButton } from "../../../../style/GenericButton/GenericButton";
import { endpoint } from "../../../../utils/GeneralComponentNames";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Starttime from "../../../../images/Starttime.svg";
import EndTime from "../../../../images/EndTime.svg";
import { Icon } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import loadingText from "../../../../images/right.svg";
const $0 = (d) => (d.toString().length === 1 ? "0" + d : d);

const timestamp = new Date();

const toLocaleDate = (_ = new Date()) => {
  const day = $0(_.getDate());
  const month = $0(_.getMonth() + 1);
  const year = $0(_.getFullYear());

  return `${month}/${day}/${year}`;
};

const toLocaleTime = (_ = new Date(), increaseHours) => {
  const hours = $0(_.getHours());
  const end = $0(_.getHours() + increaseHours);
  const minutes = $0(_.getMinutes());
  const seconds = $0(_.getSeconds());

  return `${end || hours}:${minutes}:${seconds}`;
};

const toUTCLocaleDate = (_ = new Date()) => {
  const day = $0(_.getUTCDate());
  const month = $0(_.getUTCMonth() + 1);
  const year = $0(_.getUTCFullYear());

  return `${month}/${day}/${year}`;
};

const toUTCLocaleTime = (_ = new Date(), decreaseHours) => {
  const hours = $0(_.getUTCHours());
  // If hours is 0 and decreaseHours is 1, below line will set end to -1. It should be set to 23 instead.
  // const end = $0(_.getUTCHours() - decreaseHours); // Old code
  let end = _.getUTCHours() - decreaseHours;
  end = end < 0 ? (end % 24) + 24 : end;
  // This will add 24 to end if end is negative and handle nagtive end values.
  // "% 24" is to also handle value of decreaseHours larger than 24.
  const minutes = $0(_.getUTCMinutes());
  const seconds = $0(_.getUTCSeconds());

  return `${end || hours}:${minutes}:${seconds}`;
};

const initialDateTimeState = {
  date: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
  // We need start time to be 1 hour before current time.
  // startTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`),
  // Below logic ensures that the "second" value in default start time is 0.
  startTime: new Date(
    new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`)
      .toString()
      .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
  ),
  // We need end time to be current time.
  // endTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
  // Below logic ensures that the "second" value in default end time is 0.
  endTime: new Date(
    new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`)
      .toString()
      .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
  ),

  dateLocaleString: toUTCLocaleDate(),
  startTimeLocaleString: toUTCLocaleTime(new Date(), 1),
  endTimeLocaleString: toUTCLocaleTime(new Date()),
  error: false,
  helperText: " ",
};

const initialEndTimeCheck = {
  error: false,
  helperText: " ",
};

const initialState = {
  date: new Date(),
  startTime: "",
  endTime: "",
};

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

  return new Date(`${month}/${date}/${year} ${hour}:${minutes}:${seconds}`);
};

const idiomaticUTC = (param) => {
  const _ = (d) => (d.toString().length === 1 ? "0" + d : d);
  const date = _(param.getDate());
  const month = _(param.getMonth() + 1);
  const year = _(param.getFullYear());
  const hour = _(param.getUTCHours());
  const minutes = _(param.getUTCMinutes());
  const seconds = _(param.getUTCSeconds());

  return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
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
};

const getInitialDateState = () => {
  return (
    timestamp.getUTCFullYear() +
    "-" +
    ("00" + (timestamp.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + timestamp.getUTCDate()).slice(-2)
  );
};

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

const initEpcCheck = { state: "init", message: "" };

export function DownloadLogs({
  portalState,
  setPortalState,
  downloadLogsState,
  setDownloadLogsState,
  AppOverlayContext,
}) {
  const genKey = () => Math.random().toString(16).slice(2);
  const maxDate = new Date();
  const hideTable = downloadLogsState.selectedRows;
  const isBulkAction = downloadLogsState.isBulkAction;

  const [modalError, setModalError] = useState({ state: false, message: "" });
  const [endTimeHelperText, setEndTimeHelperText] = useState(` `);

  const [dateState, setDateState] = useState(() => getInitialDateState());
  const [startTimeState, setStartTimeState] = useState(() =>
    getInitialStartTimeState(),
  );
  const [endTimeState, setEndTimeState] = useState(() =>
    getInitialEndTimeState(),
  );
  const [startDateTimeState, setStartDateTimeState] = useState(new Date());
  const [endDateTimeState, setEndDateTimeState] = useState(new Date());
  const [jsxState, setJsxState] = useState("spinner");

  const [isDisabled, setIsDisabled] = useState(false);
  const [isAsyncDone, setIsAsyncDone] = useState(false);
  const [payload, setPayload] = useState(payloadAction);
  const [epCheckState, setEPCheckState] = useState(initEpcCheck);
  const [state, setState] = useState(initialState);
  const [dateTimeState, setDateTimeState] = useState(initialDateTimeState);
  const [endTimeCheck, setEndTimeCheck] = useState(initialEndTimeCheck);
  const [loading, setLoading] = useState({ loaded: false });
  const [isBlocker, setIsBlocker] = useState(true);

  const [notEligibles, setNotEligibles] = useState([]);
  const [eligibles, setEligibles] = useState([]);
  const [eligibleRows, setEligibleRows] = useState([]);
  const [inEligibleRows, setInEligibleRows] = useState([]);
  const [inEligibleIndics, setinEligibleIndics] = useState({});
  const [logsLoading, setLogsLoading] = useState("fetching");
  const [errorMessage, setErrorMessage] = useState(null);
  const [portalKey, setPortalKey] = useState(() => genKey());

  const { t } = useTranslation();

  const onCompleteGetTaskStatus = (response, endpoints) => {
    setLogsLoading("validating");

    if (response.state === "GET_TASK_STATUS_SUCCESS") {
      setTimeout(() => {
        setLogsLoading("");
      }, 500);
      let data = response.data;
      let inEligibleCount = 0;
      let totalEPs = Object.keys(endpoints).length;

      setNotEligibles(() => {
        return downloadLogsState.selectedRows
          .map(({ endpoint_ID }) => endpoint_ID)
          .filter((id) => {
            return !!data.map(({ endpointId }) => endpointId).includes(id);
          });
      });

      setInEligibleRows(() => {
        const firstCheck = downloadLogsState.selectedRows
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
            return !!data.map(({ endpointId }) => endpointId).includes(id);
          })
          .map((row) => ({
            ...row,
            icons: [
              {
                icon: <HourglassBottomRoundedIcon />,
                tooltip: t(
                  "page.Endpoint.Configure.requestLogFileModal.taskInProgress",
                ),
              },
            ],
          }));

        const firstUncheck = downloadLogsState.selectedRows
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
            return !!!data.map(({ endpointId }) => endpointId).includes(id);
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
          //   .filter(({ id }) => !!!firstCheck.map(({ id }) => id).includes(id))
          .map((row) => {
            const icons = [
              ...row.icons, //,
              // {
              //  icon: <SyncDisabledRounded />,
              //   tooltip: "Endpoint is Disabled",
              // },
            ];

            if (row.enabled === "False") {
              icons.push({
                icon: <SyncDisabledRounded />,
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

            return {
              ...row,
              icons,
            };
          });

        const newState = [
          ...firstCheck.filter(
            (_1) => !!!lastCheck.filter((_2) => _1.id === _2.id).length,
          ),
          ...lastCheck,
        ];

        setIsBlocker(!![...firstCheck, ...lastCheck].length);

        return newState;
      });

      setEligibles(() => {
        return downloadLogsState.selectedRows
          .map(({ endpoint_ID }) => endpoint_ID)
          .filter((id) => {
            return !!!data.map(({ endpointId }) => endpointId).includes(id);
          });
      });

      setEligibleRows(() => {
        const newState = downloadLogsState.selectedRows
          .map(({ id, name, endpoint_ID, epcclient_ID, enabled, roles }) => ({
            id,
            name,
            endpoint_ID,
            epcclient_ID,
            enabled,
            roles,
          }))
          .filter(({ id }) => {
            return !!!data.map(({ endpointId }) => endpointId).includes(id);
          })
          .filter(
            ({ enabled, roles }) =>
              enabled === "True" && roles !== "Remote Keying",
          );

        return newState;
      });

      data.forEach((task) => {
        if (endpoints[task.endpointId]) {
          inEligibleCount += 1;
          endpoints[task.endpointId].taskStatus = task.status;
        }
      });

      if (inEligibleCount === 0) {
        setEPCheckState({
          state: "check-complete-all-eligible",
          eligibileCount: totalEPs - inEligibleCount,
          inEligibleCount,
          endpoints,
        });
      } else if (inEligibleCount < totalEPs) {
        setEPCheckState({
          state: "check-complete-partially-eligible",
          eligibileCount: totalEPs - inEligibleCount,
          inEligibleCount,
          endpoints,
        });
      } else {
        setEPCheckState({
          state: "check-complete-not-eligible",
          eligibileCount: totalEPs - inEligibleCount,
          inEligibleCount,
          endpoints,
        });
      }
    } else {
      setJsxState("error");
      setEPCheckState({
        state: "check-error",
        message: (
          <>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.requestLogFileModal.Action Options.Prompt.Download Status Prompt.Error"
              }
              components={[<br />]}
            >
              Error downloading logs. Please try again.
              <br />
              <br />
              Details:
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  const closePopup = useCallback(() => {
    setPortalState({ type: "", isPortal: false });
  }, [setPortalState]);

  const handleClose = ({
    inProgress = false,
    error = false,
    message = "",
    payload = {},
  }) => {
    if (downloadLogsState.tableRows === undefined) {
      downloadLogsState.setTaskStatus({ inProgress, error, message });
    } else {
      const payload = downloadLogsState.tableRows.map((row) => ({
        ...row,
        isChecked: false,
      }));

      downloadLogsState.setTaskStatus({
        inProgress,
        payload,
        error,
        message,
      });
    }

    closePopup();
    setIsAsyncDone(true);
  };

  const resetFields = () => {
    setDateState();
    setStartTimeState();
    setEndTimeState();
  };

  const submitHandler = (event, setPayloadState, setIsAsyncDone) => {
    if (window.hideRequestLogModalErrorTimeout) {
      window.clearTimeout(window.hideRequestLogModalErrorTimeout);
    }

    setPayloadState((currPayload) => ({ ...currPayload, isLoading: true }));
    setModalError({ error: false, message: "" });
    setIsDisabled(true);

    const startDateTime = `${toLocaleDate(dateTimeState.date)} ${toLocaleTime(
      dateTimeState.startTime,
    )}`;

    const endDateTime = `${toLocaleDate(dateTimeState.date)} ${toLocaleTime(
      dateTimeState.endTime,
    )}`;

    callAPI({
      path: "addToDoList",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: {
        endpoint_IDs: eligibleRows.map(({ endpoint_ID }) => endpoint_ID),
        task_ID: 4,
        startDateTime,
        endDateTime,
      },
      responder: AddTodoAPIResponder,
      onComplete: (response) => {
        let message = "";
        if (response.state === "ADD_TODO_SUCCESS") {
          message = t(
            "page.Endpoint.Configure.requestLogFileModal.requestLogAlert.message",
          );

          // Currently, if non-empty message is used in setTaskStatus, error is thrown because MoreishActions in IFVDataGrid and BulkActionModal in FilterRules have been linked for some reason.
          // So, temporary solution is to show message in alert and use empty string in setTaskStatus for message.
          // alert(message); // To be replaced with a message modal later.
          setModalError({ success: message });
        } else {
          message = (
            <>
              {/* Request to download logs failed.
              <br />
              <br />
              Error Details:
              <br /> */}
              <Trans
                i18nKey={
                  "page.Endpoint.Configure.requestLogFileModal.Action Options.Prompt.Download Status Prompt.Download Failed"
                }
                components={[<br />]}
              >
                Request to download logs failed.
                <br />
                <br />
                Error Details:
                <br />
              </Trans>
              {Utility.getErrorsFromResponse(response)}
            </>
          );
          setPayloadState((currPayload) => ({
            ...currPayload,
            isLoading: false,
          }));
          setIsDisabled(false);
          setModalError({ error: true, message });
          window.hideRequestLogModalErrorTimeout = setTimeout(() => {
            setModalError({ error: false, message: "" });
          }, 10000);

          // Can't call handleClose with non-empty message string. For reason, you may refer to comments in if block.
          // handleClose({ error: true, message }); // Needs to be replaced with in-popup error message.
        }
      },
      onCompleteArguments: [],
    });
    resetFields();
  };

  const cancelHandler = (event) => {
    /* setTimeout(() => {
      downloadLogsState.setTaskStatus({
        inProgress: false,
        isError: false,
        message: ``,
      });

      // setTimeout(() => {
      //   closePopup();
      // }, 0);
    }, 0); */
    handleClose({});
    setPortalKey(genKey());
  };

  const handleDatePickerChange = (raw) => {
    const date = raw;

    setDateTimeState((oldState) => {
      return {
        ...oldState,
        date,
        startTime: new Date(
          `${toLocaleDate(date)} ${toLocaleTime(oldState.startTime)}`,
        ),
        startTimeLocaleString: toLocaleTime(oldState.startTime),
        endTime: new Date(
          `${toLocaleDate(date)} ${toLocaleTime(oldState.endTime)}`,
        ),
        endTimeLocaleString: toLocaleTime(oldState.endTime),
      };
    });
  };

  const handleStartTimePickerChange = (raw) => {
    // const $ = new Date(
    //   new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`)
    //     .toString()
    //     .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00")
    // );
    const _ = new Date(`${toUTCLocaleDate(dateTimeState.date)} 00:00:00`);

    const startTime = new Date(
      `${toLocaleDate(dateTimeState.date)} ${toLocaleTime(raw ?? _)}`,
    );

    // if start time hour 23 automatically hour , minutes and secound turn "00:00:00"
    if (raw.getHours() >= 23) {
      startTime.setHours(0);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      setDateTimeState((oldState) => {
        return {
          ...oldState,
          startTimeLocaleString: "00:00:00",
        };
      });
    }

    if (isNaN(startTime)) {
      setDateTimeState((oldState) => {
        return {
          ...oldState,
          error: true,
          helperText: t(
            "page.Endpoint.Configure.requestLogFileModal.invalidStart",
          ),
        };
      });
    } else {
      setDateTimeState((oldState) => {
        return {
          ...oldState,
          error: false,
          helperText: "",
        };
      });
    }
    setDateTimeState((oldState) => {
      return { ...oldState, startTime };
    });
  };

  const handleEndTimePickerChange = (raw) => {
    // const $ = new Date(
    //   new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`)
    //     .toString()
    //     .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00")
    // );
    const _ = new Date(`${toUTCLocaleDate(dateTimeState.date)} 00:00:00`);

    const endTime = new Date(
      `${toLocaleDate(dateTimeState.date)} ${toLocaleTime(raw ?? _)}`,
    );
    // if (isNaN(endTime)) {
    //   setEndTimeCheck((oldState) => {
    //     return {
    //       ...oldState,
    //       error: true,
    //       helperText: "Invalid End time",
    //     };
    //   });
    // } else {
    //   setEndTimeCheck((oldState) => {
    //     return {
    //       ...oldState,
    //       error: false,
    //       helperText: "",
    //     };
    //   });
    // }

    // const valid = (endTime.search(/(\d{2}):(\d{2}):(\d{2})/) != -1) &&
    // (endTime.substr(0,2) >= 0 && endTime.substr(0,2) <= 24) &&
    // (endTime.substr(3,2) >= 0 && endTime.substr(3,2) <= 59) &&
    // (endTime.substr(6,2) >= 0 && endTime.substr(6,2) <= 59);

    setDateTimeState((oldState) => {
      return { ...oldState, endTime }; //valid
    });
  };

  const HandleCloseTable = () => {
    setIsBlocker(false);
    handleClose({});
  };

  const HandleOpenTable = () => {
    setIsBlocker(false);
    // setLogsLoading("clearing")
  };

  const closeModalHandler = () => {
    modalError.success && handleClose({});
    setModalError({ error: false, message: "" });
  };

  useEffect(() => {
    setStartDateTimeState(
      new Date(
        formatForRequest(new Date(`${dateState} ${startTimeState} UTC`)),
      ),
    );
  }, [dateState, startTimeState]);

  useEffect(() => {
    setEndDateTimeState(
      new Date(formatForRequest(new Date(`${dateState} ${endTimeState} UTC`))),
    );
  }, [dateState, endTimeState]);

  /* For HelperTexts */
  useEffect(() => {
    if (Date.parse(startDateTimeState) >= Date.parse(endDateTimeState)) {
      setEndTimeHelperText(
        t("page.Endpoint.Configure.requestLogFileModal.timeRange", {
          startTimeState: startTimeState,
        }),
      );
    } else {
      setEndTimeHelperText(` `);
    }
  }, [endDateTimeState, startDateTimeState, startTimeState]);

  useEffect(() => {
    if (isAsyncDone === true) {
      // closePopup();
      setPayload((currPayload) => ({ ...currPayload, isLoading: false }));
      setDateState(() => getInitialDateState());
      setStartTimeState(() => getInitialStartTimeState());
      setEndTimeState(() => getInitialEndTimeState());
      setIsDisabled(false);
    }
  }, [isAsyncDone, setPortalState]);

  useEffect(() => {
    setPortalState((oldState) => ({
      ...oldState,
      isProgressPending: payload.isLoading,
    }));
  }, [payload.isLoading, setPortalState]);

  /* Date Picker State and useEffects */
  // Validation for endTime
  useEffect(() => {
    // Check if end time is greater than the start time

    if (isNaN(dateTimeState.endTime)) {
      setEndTimeCheck({
        error: true,
        helperText: t("page.Endpoint.Configure.requestLogFileModal.invalidEnd"),
      });
      return;
    }

    if (dateTimeState.startTime.getTime() >= dateTimeState.endTime.getTime()) {
      setEndTimeCheck({
        error: true,
        // helperText: `End time should be greater than ${dateTimeState.startTime.toLocaleTimeString()}`,
        helperText: t("page.Endpoint.Configure.requestLogFileModal.endGreater"), // No need to show the user selected time.
      });
      return;
    }

    let curr = new Date();
    // Check if end time is smaller than the current time
    if (
      dateTimeState.endTime.getTime() >
      new Date(
        new Date(
          curr.toUTCString() + curr.toString().match(/GMT((-|\+)\d{4})/)[1],
        )
          .toString()
          .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
      ).getTime()
    ) {
      setEndTimeCheck({
        error: true,
        // helperText: `End time should be greater than ${dateTimeState.startTime.toLocaleTimeString()}`,
        helperText: t("page.Endpoint.Configure.requestLogFileModal.endCurrent"), // No need to show the user selected time.
      });
      return;
    }
    setEndTimeCheck(initialEndTimeCheck);
  }, [dateTimeState]);

  useEffect(() => {
    setLoading({ loaded: false });
    setEPCheckState({ state: "checking", message: "" });

    // Generate list of endpoints
    let endpoints = {};
    downloadLogsState.selectedRows.forEach((ep) => {
      endpoints[ep.endpoint_ID] = {
        id: ep.id,
        endpoint_ID: ep.endpoint_ID,
        name: ep.name,
        epcclient_ID: ep.epcclient_ID,
        taskStatus: "Not Running",
      };
    });

    // Fetch active tasks
    callAPI({
      path: "get-task-status",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        taskId: 4,
      },
      data: {},
      responder: GetTaskStatusResponder,
      onComplete: onCompleteGetTaskStatus,
      onCompleteArguments: [endpoints],
    });
  }, []);

  useEffect(() => {
    if (!isBulkAction) {
      setErrorMessage(() => {
        return inEligibleRows.length ? (
          <p>
            {t("page.Endpoint.Configure.requestLogFileModal.inTaskMessage1")}
            <br />
            <br />
            {t("page.Endpoint.Configure.requestLogFileModal.inTaskMessage2")}
          </p>
        ) : !!!eligibleRows.length ? (
          <p>
            {t(
              "page.Endpoint.Configure.requestLogFileModal.requestDownload.message1",
              { epCheckState: epCheckState.inEligibleCount },
            )}
            <br />
            <br />
            {t(
              "page.Endpoint.Configure.requestLogFileModal.requestDownload.message2",
            )}
            <br />
          </p>
        ) : null;
      });
    }
  }, [
    eligibleRows,
    epCheckState.inEligibleCount,
    inEligibleRows.length,
    isBulkAction,
  ]);

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      // endpointID: downloadLogsState.row.endpoint_ID,
      // endpointName: downloadLogsState.row.name,
      // endpointSerial: downloadLogsState.row.client_ID,
      date: dateState,
      startTime: asUTC(new Date(dateState + " " + startTimeState + " UTC")),
      endTime: asUTC(new Date(dateState + " " + endTimeState + " UTC")),
    }));
  }, [dateState, downloadLogsState, endTimeState, startTimeState]);

  useEffect(() => {
    const _endTime = new Date(
      new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`)
        .toString()
        .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
    );

    console.log(
      _endTime.getHours(),
      _endTime.getMinutes(),
      _endTime.getSeconds(),
    );

    if (
      _endTime.getHours() === 0 &&
      _endTime.getMinutes() <= 59 &&
      _endTime.getSeconds() <= 59
    ) {
      setDateTimeState({
        date: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
        // We need start time to be 1 hour before current time.
        // startTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`),
        // Below logic ensures that the "second" value in default start time is 0.
        startTime: new Date(
          new Date(`${toUTCLocaleDate()} 00:00:00`)
            .toString()
            .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
        ),
        // We need end time to be current time.
        // endTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
        // Below logic ensures that the "second" value in default end time is 0.
        endTime: new Date(
          new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`)
            .toString()
            .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
        ),

        dateLocaleString: toUTCLocaleDate(),
        startTimeLocaleString: `00:00:00`,
        endTimeLocaleString: toUTCLocaleTime(new Date()),
        error: false,
        helperText: " ",
      });
    } else {
      setDateTimeState({
        date: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
        // We need start time to be 1 hour before current time.
        // startTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`),
        // Below logic ensures that the "second" value in default start time is 0.
        startTime: new Date(
          new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime(new Date(), 1)}`)
            .toString()
            .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
        ),
        // We need end time to be current time.
        // endTime: new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`),
        // Below logic ensures that the "second" value in default end time is 0.
        endTime: new Date(
          new Date(`${toUTCLocaleDate()} ${toUTCLocaleTime()}`)
            .toString()
            .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1:$2:00"),
        ),

        dateLocaleString: toUTCLocaleDate(),
        startTimeLocaleString: toUTCLocaleTime(new Date(), 1),
        endTimeLocaleString: toUTCLocaleTime(new Date()),
        error: false,
        helperText: " ",
      });
    }
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        {isBlocker && hideTable.length > 1 ? (
          <StyledMat.Wrapper isSpinner={logsLoading}>
            {logsLoading === "fetching" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Styled.FetchingText>
                  {t("page.Endpoint.Configure.requestLogFileModal.loadin")}
                </Styled.FetchingText>
              </>
            ) : logsLoading === "validating" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Styled.FetchingText>
                  {t(
                    "page.Endpoint.Configure.requestLogFileModal.loadingValidating",
                  )}
                </Styled.FetchingText>
              </>
            ) : (
              <PreProcessValidation
                id={`${endpoint}-preProcess-validation-modal-requestLogFile`}
                disabled={!!!eligibleRows.length}
                title="Request Log Files"
                onClose={cancelHandler}
                loading={logsLoading}
                qualifiedRecords={eligibleRows}
                unQualifiedRecords={inEligibleRows}
                footerActions={{
                  onAbort: HandleCloseTable,
                  onConfirm: HandleOpenTable,
                }}
              />
            )}
          </StyledMat.Wrapper>
        ) : (
          <Styled.PopupWrapper
            id={`${endpoint}-modal-request-log-file`}
            isSpinner={logsLoading || errorMessage}
          >
            {logsLoading === "fetching" ? (
              <Styled.Loading>
                <StyledMat.LoadingText src={loadingText} />
                <Typography>
                  {" "}
                  {t("page.Endpoint.Configure.requestLogFileModal.loadin")}
                </Typography>
              </Styled.Loading>
            ) : logsLoading === "validating" ? (
              <Styled.Loading>
                <StyledMat.LoadingText src={loadingText} />
                <Styled.FetchingText>
                  {t(
                    "page.Endpoint.Configure.requestLogFileModal.loadingValidating",
                  )}
                </Styled.FetchingText>
              </Styled.Loading>
            ) : (
              <>
                {errorMessage ? (
                  <CloseButton onClick={cancelHandler}>
                    <CloseSharp fontSize="medium" />
                  </CloseButton>
                ) : (
                  <Styled.PopUpHeader>
                    <Styled.PopupTitle>
                      {t("page.Endpoint.Configure.requestLogFileModal.title")}{" "}
                    </Styled.PopupTitle>

                    <CloseButton
                      id={`${endpoint}-requestLogFile-modal-close-button`}
                      onClick={cancelHandler}
                    >
                      <CloseSharp fontSize="medium" />
                    </CloseButton>
                  </Styled.PopUpHeader>
                )}
                {errorMessage ? (
                  <Styled.ErrorBox>
                    <Styled.ErrorText>{errorMessage}</Styled.ErrorText>
                  </Styled.ErrorBox>
                ) : (
                  <Styled.CustomPopupContent>
                    <Styled.DATEPICKER
                      id={`${endpoint}-requestLogFile-date`}
                      key={portalKey}
                      value={dateTimeState.date}
                      onChange={(rawValue) => handleDatePickerChange(rawValue)}
                      inputVariant="outlined"
                      label="Date"
                      error={false}
                      helperText={" "}
                      disableFuture
                      animateYearScrolling
                      minDate={maxDate.setDate(maxDate.getDate() - 7)}
                      maxDate={new Date()}
                      format={`MM/dd/yyyy`}
                      views={["year", "month", "date"]}
                      TextFieldComponent={(params) => {
                        return (
                          <TextField
                            {...params}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CalendarMonthRoundedIcon
                                    style={{
                                      color: "rgba(0, 0, 0, 0.54)",
                                      marginLeft: "-1.4em",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        );
                      }}
                      // keyboardIcon={<CalendarMonthRoundedIcon />}
                    />
                    <Styled.TIMEPICKER
                      id={`${endpoint}-requestLogFile-start-time`}
                      key={portalKey}
                      label={t(
                        "page.Endpoint.Configure.requestLogFileModal.start",
                      )}
                      inputVariant="outlined"
                      value={dateTimeState.startTime}
                      onChange={handleStartTimePickerChange}
                      ampm={false}
                      error={dateTimeState.error}
                      helperText={dateTimeState.helperText}
                      keyboardIcon={
                        <Icon>
                          <img
                            src={Starttime}
                            alt="starttime"
                            style={{ color: "#fff" }}
                            height="20px"
                            width={"18px"}
                          />
                        </Icon>
                      }
                    />

                    <Styled.TIMEPICKER
                      id={`${endpoint}-requestLogFile-end-time`}
                      key={portalKey}
                      label={t(
                        "page.Endpoint.Configure.requestLogFileModal.end",
                      )}
                      inputVariant="outlined"
                      value={dateTimeState.endTime}
                      onChange={handleEndTimePickerChange}
                      ampm={false}
                      error={endTimeCheck.error}
                      helperText={endTimeCheck.helperText}
                      keyboardIcon={
                        <Icon>
                          <img
                            src={EndTime}
                            alt="endtime"
                            style={{ color: "#fff" }}
                            height="20px"
                            width={"18px"}
                          />
                        </Icon>
                      }
                    />

                    <Styled.BottomText>
                      {t("page.Endpoint.Configure.requestLogFileModal.message")}
                      .
                    </Styled.BottomText>

                    <Styled.BottomBox>
                      <Styled.ButtonsWrapper>
                        <GenericButton
                          id={`${endpoint}-requestLogFile-submit-button`}
                          key={portalKey}
                          style={{ margin: "0em 1em 0em 0em" }}
                          buttonName={
                            payload.isLoading ? (
                              <Spinner size={20} />
                            ) : (
                              t(
                                "page.Endpoint.Configure.requestLogFileModal.submitButton",
                              )
                            )
                          }
                          backgroundColor="primary"
                          inProgress={payload.isLoading}
                          disabled={
                            endTimeCheck.error ||
                            dateTimeState.error ||
                            payload.isLoading
                          }
                          onClick={(event) => {
                            submitHandler(event, setPayload, setIsAsyncDone);
                          }}
                        />

                        <GenericButton
                          id={`${endpoint}-requestLogFile-cancel-button`}
                          key={portalKey}
                          style={{
                            margin: "0em 0em 0em 1em",
                            // background: "#e83b46",
                            // border: "2px solid #e83b46",
                          }}
                          backgroundColor="secondary"
                          buttonName={t(
                            "page.Endpoint.Configure.requestLogFileModal.cancelButton",
                          )}
                          disabled={payload.isLoading}
                          inProgress={payload.isLoading}
                          onClick={cancelHandler}
                        />

                        {/* <Styled.SpinnerWrapper inProgress={payload.isLoading}>
                          <Spinner size={20} />
                        </Styled.SpinnerWrapper> */}
                      </Styled.ButtonsWrapper>
                    </Styled.BottomBox>

                    <AlertPopup
                      divider={false}
                      open={modalError.error || modalError.success}
                      contentTitle={
                        modalError.success
                          ? t(
                              "page.Endpoint.Configure.requestLogFileModal.requestLogAlert.title",
                            )
                          : t(
                              "page.Endpoint.Configure.requestLogFileModal.errorText",
                            )
                      }
                      contentText={modalError.success || modalError.message}
                      agreeTitle={t("commons.okayText")}
                      handleAgree={closeModalHandler}
                      handleDisagree={closeModalHandler}
                    />
                  </Styled.CustomPopupContent>
                )}
              </>
            )}
          </Styled.PopupWrapper>
        )}
      </>
    </MuiPickersUtilsProvider>
  );
}

const Styled = {
  FetchingText: styled(Typography)`
    font-weight: 500;
  `,

  BottomText: styled(Typography)`
    margin: 0.5em 0 1em 0;
    font-size: 0.8rem;
    color: #333;
    width: 100%;
    text-align: center;
    border-radius: 4px;
    padding: 0.25em 1em;
  `,
  BottomBox: styled(Box)`
    width: 100%;
    display: grid;
    place-items: center;
  `,

  ErrorBox: styled(Box)`
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 1em;
  `,

  ErrorText: styled(Typography)`
    color: #dc143c;

    font-weight: 500;
  `,

  Loading: styled(Box)`
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 1em;
  `,

  PopupWrapper: styled(Popup)`
    margin: 3.5rem 0 0 0;
    height: ${({ isSpinner }) => (isSpinner ? "300px" : "440px")};
    width: ${({ isSpinner }) => (isSpinner ? "500px" : "500px")};
    margin-top: 0em;
    /* padding: 0 0 2em 0; */
    position: relative;
    display: ${({ isSpinner }) => (isSpinner ? "grid" : "auto")};
    place-items: ${({ isSpinner }) => (isSpinner ? "center" : "auto")};
  `,

  PopUpHeader: styled(PopupHeader)``,

  CustomPopupContent: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    padding: 1rem 3rem 0rem 3rem;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `,

  PopupTitle: styled(Typography)`
    font-size: "1rem";
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 700;
    line-height: 1.5;
    color: "rgba(2, 147, 254, 1)";
  `,

  ButtonsWrapper: styled(Box)`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  `,

  SubmitButton: styled(Button)`
    display: ${({ inProgress }) => (!inProgress ? "flex" : "none")};
    margin: 0rem 1rem;

    border: 0.1em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }
  `,

  CancelButton: styled(Button)`
    display: ${({ inProgress }) => (!inProgress ? "flex" : "none")};
    margin: 0rem 1rem;
    border: 0.1em solid rgba(237, 20, 61, 1);
    color: rgba(237, 20, 61, 1);

    &:hover {
      background: rgba(237, 20, 61, 0.1);
    }
  `,

  SpinnerWrapper: styled(Box)`
    position: absolute;
    width: calc(100% + 2em);
    height: 100%;
    display: flex;
    margin-top: 2.5em;
    align-items: center;
    justify-content: center;
    display: ${({ inProgress }) => (inProgress ? "flex" : "none")};
    background: transparent;
  `,

  TIMEPICKER: styled(KeyboardTimePicker)`
    margin: 0.6rem;
    &.MuiFormControl-root {
      width: 100%;
    }

    & .MuiOutlinedInput-input {
      padding: 0.8rem;
    }

    & .Mui-disabled > input {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    & .MuiInputLabel-outlined {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #333;
      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: #058fe7;

      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #058fe7;
      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
      border-color: #ed143d;
      /* border-width: 1px; */
    }

    & .MuiInputLabel-outlined.MuiInputLabel-shrink {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      color: black;
    }

    & .MuiFormLabel-root.Mui-error {
      color: #ed143d;
    }
  `,

  DATEPICKER: styled(DatePicker)`
    margin: 0.6rem;

    &.MuiFormControl-root {
      width: 100%;
    }

    & .MuiOutlinedInput-input {
      padding: 0.8rem;
    }

    & .Mui-disabled > input {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    & .MuiInputLabel-outlined {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #333;
      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: #058fe7;
      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #058fe7;
      /* border-width: 1px; */
    }

    & .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
      border-color: #ed143d;
      /* border-width: 1px; */
    }

    & .MuiInputLabel-outlined.MuiInputLabel-shrink {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      color: black;
    }

    & .MuiFormLabel-root.Mui-error {
      color: #ed143d;
    }
  `,
};
