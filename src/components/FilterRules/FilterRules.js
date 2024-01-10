import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DoNotDisturbOnRoundedIcon from "@mui/icons-material/DoNotDisturbOnRounded";
import { Typography } from "@mui/material";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

import callAPI from "../../apis/callAPI";
import {
  addFilterRuleResponder,
  deleteFilterRuleResponder,
  filterProtocolResponder,
  fromTrustedFilterResponder,
  toggleRulesResponder,
  toTrustedFilterResponder,
} from "../../apis/responders/filterProtocolResponder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Prompt from "../../components/DeletePrompt/Prompt";
import { batcher } from "./API/FilterRules.api";
import { DialogBox } from "./DialogBox";
import {
  AsyncStyledBox,
  StyledBox,
  StyledBoxContext,
  StyledBoxTrusted,
  StyledSkeletonHolder,
} from "./FilterRules.style";
import { BulkActionModal } from "./Portal/BulkActionModal/BulkActionModal";
import { Styled } from "./Portal/BulkActionModal/BulkActionModal.style";
import { taskStatus } from "../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const initModalState = () => {
  return {
    display: false,
    title: "MODAL TITLE",
    error: false,
    message: "MODAL MESSAGE",
    messageBody: {},
    accept: false,
    acceptText: "Okay",
    onAcceptArgs: [],
    onAccept: () => {},
    reject: false,
    rejectText: "Nope",
    onRejectArgs: [],
    onReject: () => {},
    close: true,
    closeText: "Close",
    onCloseArgs: [],
    onClose: () => {},
  };
};

const initialModel = {
  toggleOpen: false,
  dialog: true,
  confirmHandler: null,
  confirmHandlerArgs: [],
  cancelHandler: null,
  cancelHandlerArgs: [],
};

const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const initModalSpinner = { status: "neutral", text: "" };

const FilterRules = () => {
  const dataGridRef = useRef();

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const gatewayIP = AppOverlayContext.selectedGateway.address;
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  const [loading1, setLoading1] = useState(false);
  const [context, setContext] = useState(() => {
    if (gatewayConfig.chassis_model !== "5010") {
      return "bump0";
    } else {
      return "mgt";
    }
  });
  const [trusted, setTrusted] = useState("From Trusted");
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [filterData, setFilterdata] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [dataContext, setDataContext] = useState([]);
  const [dataContextLoading, setDataContextLoading] = useState(true);
  const [model, setModel] = useState(initialModel);
  const [loading, setLoading] = useState(true);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const [gridRows, setGridRows] = useState([]);
  const [modalState, setModalState] = useState(() => initModalState());
  const [modalSpinner, setModalSpinner] = useState(initModalSpinner);
  const [addFilterData, setAddFilterdata] = useState([]);
  const [prompt, setPrompt] = useState(false);
  const [data, setData] = useState({ row: null, setStatus: null });
  const [editPrompt, setEditPrompt] = useState(false);
  const [editData, setEditData] = useState({ row: null, setStatus: null });

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);

    // setTimeout(() => {
    //   callback();
    // }, 1000);
  };

  const markAsLoading = (resetProtocols = true) => {
    setLoading(true);
    setFilterDataLoading(true);
    setLoading1(false);
    if (resetProtocols) {
      setDataContextLoading(true);
    }
  };

  const handleSetModal = useCallback((keyName, payload) => {
    setModalState({
      display: !!Object.keys(payload.message ?? {}).length,
      title: "Task Results",
      error: payload.error,
      message: "Following are the processed items while performing the task.",
      messageBody: payload.message,
      accept: false,
      acceptText: "Okay",
      onAcceptArgs: [],
      onAccept: () => {},
      reject: false,
      rejectText: "Nope",
      onRejectArgs: [],
      onReject: () => {},
      close: true,
      closeText: "Close",
      onCloseArgs: [keyName],
      onClose: () => {
        setModalState(() => initModalState());
      },
    });
  }, []);

  const ContextHandler = (e) => {
    /* setLoading(true);
    setDataContextLoading(true); */
    setContext(e.target.value);
    markAsLoading(false);
    setGridSubconscious((oldState) => {
      return { ...oldState, searchText: "" };
    });
  };

  const TrustedHandler = (e) => {
    /* setLoading(true);
    setDataContextLoading(true); */
    setTrusted(e.target.value);
    markAsLoading(false);
    setGridSubconscious((oldState) => {
      return { ...oldState, searchText: "" };
    });
    // Protocols don't need to be reset on trusted change.

    // A change in filter protocols triggers setGridCols which triggers reinitialization of functions like handleSave, handleDelete that use state variables like context and trusted.
    // Without reinitialization, those functions use the old values which was the state value when those functions were reinitialized.
    // If you comment below line, you can change trusted dropdown value but it won't reflect in the API call made in those functions.
    setDataContext((old) => [...old]);
  };

  const onCompleteToTrustedFilter = (response) => {
    let data = [];
    if (
      (response.state === "TO_TRUSTED_SUCCESS" ||
        response.state === "FROM_TRUSTED_SUCCESS") &&
      response.data !== ""
    ) {
      data = response.data;
      data = data.map((row) => {
        row.enabled = row.enabled === 0 ? "False" : "True";
        row.srcPort = `${row.srcPort}` || "ANY";
        row.destPort = `${row.destPort}` || "ANY";
        row.action =
          row.action === "drop"
            ? "Drop"
            : row.action === "forward"
            ? "Forward"
            : null;
        row.protocol = row.protocol.toString().concat(` (${row.protoStr}) `);
        return row;
      });
    }

    setFilterdata(data);
    setFilterDataLoading(false);
  };

  const onCompleteFilterProtocols = (response) => {
    let data = [];
    let res = "ANY";
    let dataCombined;
    data = response.data;
    data = data.map((value) => {
      let val = value.num.toString().concat(` (${value.keyword}) `);
      // let val = `${value.num}(${value.keyword})`;
      return val;
    });

    dataCombined = [...data, res];
    setDataContext(dataCombined);
    setDataContextLoading(false);
    // setLoading(true);
  };

  let subconscious = {
    name: "ba-Filter-Rules",
    sort: { column: "ruleNum", inverse: false },
    pageSize: 10,
    page: 1,
    handleLoadMoreData: (TableRows, Subconscious, LastButton) => {
      const successCode = "TO_TRUSTED_SUCCESS" || "FROM_TRUSTED_SUCCESS";
      const failureCode = "FROM_TRUSTED_FAILURE" || "TO_TRUSTED_FAILURE";
      const gatewayIP = AppOverlayContext.selectedGateway.address;

      const [tableRows, setTableRows] = TableRows;
      const [gridSubconscious, setGridSubconscious] = Subconscious;
      const [gotoLastButton, setGotoLastButton] = LastButton;

      const page = gridSubconscious.chunk + 1;

      callAPI({
        path:
          (trusted === "From Trusted" ? "fromTrusted" : "toTrusted") + "filter",
        params: { gatewayIP, page, context },
        data: {},
        responder: (res, onComplete, onCompleteArgs = []) => {
          const isGoodResponse = res.state === "GOOD_RESPONSE";
          const is200 = res.response.code === 200;

          const state = isGoodResponse && is200 ? successCode : failureCode;
          const data =
            isGoodResponse && is200
              ? res.response.body
              : {
                  catchError: res?.error ?? undefined,
                  error: res?.response?.error ?? undefined,
                  errorFromJSON: res?.response?.errorFromJSON ?? undefined,
                };

          onComplete({ state, data }, ...onCompleteArgs);
        },
        onCompleteArguments: [TableRows, Subconscious, LastButton],
        onComplete: (response, TableRows, Subconscious, LastButton) => {
          const isSuccess = response.state === successCode;
          const payload = response.data ?? [];

          const [tableRows, setTableRows] = TableRows;
          const [gridSubconscious, setGridSubconscious] = Subconscious;
          const [gotoLastButton, setGotoLastButton] = LastButton;

          const disabled = !!!payload.length;

          if (!isSuccess) {
            setAlertDialog({
              open: true,
              contentTitle: "Error Happened",
              contentText: (
                <>
                  <p>Unable to fetch or load more records from server</p>
                  <p>Error Info:</p>
                  {Utility.getErrorsFromResponse(response)}
                </>
              ),
            });
          }

          setGridSubconscious((oldState) => ({
            ...oldState,
            page: oldState.totalPages,
            chunk:
              isSuccess && !!payload.length
                ? oldState.chunk + 1
                : oldState.chunk,
          }));

          // Not mandatory, But usefull with big payload
          setTimeout(() => {
            setGotoLastButton((oldState) => {
              const newState = { ...oldState, loading: false, disabled };
              return isSuccess
                ? newState
                : { ...oldState, loading: false, disabled };
            });

            setTableRows((oldState) => {
              let filterRules = payload.map((record, index) => {
                let row = { ...record };
                row.enabled = row.enabled === 0 ? "False" : "True";
                row.srcPort = row.srcPort === 0 ? "ANY" : "";
                row.destPort = row.destPort === 0 ? "ANY" : "";
                row.action =
                  row.action === "drop"
                    ? "Drop"
                    : row.action === "forward"
                    ? "Forward"
                    : null;
                row.protocol = row.protocol
                  .toString()
                  .concat(` (${row.protoStr}) `);
                return row;
              });

              filterRules = filterRules.filter((row) => row.trust_level !== -1); // Removing duplicate / erroneous records

              const newState = [...oldState, ...filterRules];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  );

  const handleDiscard = useCallback((newRow, setTaskStatus) => {
    let reset = false;

    if (reset) {
      markAsLoading(false);
      return;
    }

    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };
    setTaskStatus(status);
  }, []);

  const handleSave = useCallback(
    (row, setTaskStatus) => {
      let rowSip = row.sip.includes("/") ? row.sip.split("/")[0] : row.sip;
      let rowDip = row.dip.includes("/") ? row.dip.split("/")[0] : row.dip;
      if (rowSip === rowDip) {
        //alert("IPS can not be the same")
        setPrompt(true);
        setData((p) => ({ ...p, row: row, setStatus: setTaskStatus }));
      } else {
        const tempRow = { ...row };
        const sourcePort = !isNaN(row.srcPort) ? row.srcPort || 0 : 0;
        const destinationPort = !isNaN(row.destPort) ? row.destPort || 0 : 0;

        delete tempRow.__isEditMode;
        delete tempRow.id;
        delete tempRow.isChecked;
        delete tempRow.protoStr;

        let newRow = {
          ...tempRow,
          enabled: Number(row.enabled.trim().toLowerCase() === "true"),
          ruleNum: parseInt(row.ruleNum),
          sip: row.sip === "ANY" ? null : row.sip,
          srcPort: Number(sourcePort),
          dip: row.dip === "ANY" ? null : row.dip,
          destPort: Number(destinationPort),
          action: row.action.toLowerCase(),
          desc: row.desc,
          protocol: row.protocol === "ANY" ? -1 : row.protocol,
        };

        if (newRow.protocol !== -1) {
          let vals = newRow.protocol.match(/^(\d+) \((\S+)\)/);

          if (newRow.protocol !== "6 (TCP)" || newRow.protocol !== "17 (UDP)") {
            newRow.srcPort = !!!newRow.srcPort ? 0 : newRow.srcPort;
            newRow.destPort = !!!newRow.destPort ? 0 : newRow.destPort;
          }

          newRow.protocol = parseInt(vals[1]);
          newRow.protoStr = vals[2];
        }

        delete newRow.actionId;
        delete newRow.flags;
        delete newRow.nwSip;
        delete newRow.nwSipNetmask;
        delete newRow.nwDip;
        delete newRow.nwDipNetmask;
        delete newRow.protoStr;
        delete newRow.toTrusted;

        callAPI({
          path: "saveFilterRule",
          params: { gatewayIP, context, trusted },
          data: newRow,
          responder: addFilterRuleResponder,
          onComplete: onCompleteAddFilterHandler,
          onCompleteArguments: [row, setTaskStatus],
        });
      }
    },
    [context, gatewayIP, trusted],
  );
  const handleClose = (row, setTaskStatus) => {
    setTaskStatus({
      inProgress: false,
      error: true,
      message: "",
    });
    setPrompt(false);
  };
  const onCompleteAddFilterHandler = (response, row, setTaskStatus) => {
    if (response.state === "ADD_FILTER_SUCCESS") {
      // Protocols don't need to be reset on rule add.
      // markAsLoading(false);
      // return;

      const id = row.id === "_newRow" ? response.data.id : row.id;
      const srcPort = response.data.srcPort || "ANY";
      const destPort = response.data.destPort || "ANY";

      const payload = { ...row, id, srcPort, destPort };

      let status = {
        inProgress: false,
        error: false,
        payload,
        message: `Filter rule with number "${row.ruleNum}" added successfully.`,
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            Error adding filter rule with number "{row.ruleNum}". Please try
            again.
            <br />
            <br />
            Details:
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };

      setTaskStatus(status);
    }
  };

  const enableRowRule = useMemo(
    () => ({
      name: t("page.gatewayServer.Filter Rules.BulkAction.Enable"),
      icon: <CheckCircleRoundedIcon />,
      handleSetModal,
      handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
        setModalSpinner({
          status: "open",
          text:
            "Enabling selected filter rule" +
            (selectedRows.length === 1 ? "" : "s") +
            " ...",
        });

        const unSelectedTableRows = tableRows.filter((row) => {
          return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const selectedTableRows = tableRows.filter((row) => {
          return Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const path = "enableFilterRule";
        const params = {
          gatewayIP,
          context,
          trusted,
        };
        const responder = toggleRulesResponder;

        batcher(
          path,
          params,
          responder,
          unSelectedTableRows,
          selectedTableRows,
          setTaskStatus,
          "enable",
        );
      },
    }),
    [context, gatewayIP, handleSetModal, trusted],
  );

  const disableRowRule = useMemo(
    () => ({
      name: t("page.gatewayServer.Filter Rules.BulkAction.Disable"),
      icon: <DoNotDisturbOnRoundedIcon />,
      handleSetModal,
      handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
        setModalSpinner({
          status: "open",
          text:
            "Disabling selected filter rule" +
            (selectedRows.length === 1 ? "" : "s") +
            " ...",
        });

        const unSelectedTableRows = tableRows.filter((row) => {
          return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const selectedTableRows = tableRows.filter((row) => {
          return Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const path = "disableFilterRule";
        const params = {
          gatewayIP,
          context,
          trusted,
        };
        const responder = toggleRulesResponder;

        batcher(
          path,
          params,
          responder,
          unSelectedTableRows,
          selectedTableRows,
          setTaskStatus,
          "disable",
        );
      },
    }),
    [context, gatewayIP, handleSetModal, trusted],
  );

  const handleDelete = useCallback(
    (row, setTaskStatus) => {
      let newRow = { ...row };

      callAPI({
        path: "deleteFilter",
        params: { gatewayIP, context, trusted },
        data: `${newRow.ruleNum}`,
        responder: deleteFilterRuleResponder,
        onComplete: onCompleteFilterHandler,
        onCompleteArguments: [row, setTaskStatus],
      });
    },
    [context, gatewayIP, trusted],
  );

  const onCompleteFilterHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_FILTER_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: `Filter rules with name "${row.ruleNum}" deleted successfully.`,
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            Error deleting filter with name "{row.ruleNum}".
            <br />
            <br />
            Details:
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };
  const [resetEdit, setResetEdit] = useState(false);

  const handleEdit = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: "",
    };

    //if (resetEdit)  status.error = true;

    setResetEdit(true);
    setEditPrompt(false);
    setTaskStatus(status);
  };

  const handleDeleteSave = useCallback(
    (row, setTaskStatus, orgRow) => {
      let rowSip = row.sip;
      let rowDip = row.dip;
      if (rowSip === rowDip) {
        setEditPrompt(true);
        setEditData((p) => ({ ...p, row: row, setStatus: setTaskStatus }));
      } else {
        callAPI({
          path: "deleteFilter",
          params: { gatewayIP, context, trusted },
          data: `${orgRow.ruleNum}`,
          responder: deleteFilterRuleResponder,
          onCompleteArguments: [row, setTaskStatus, orgRow],
          onComplete: (response, row, setTaskStatus, orgRow) => {
            const sourcePort = !isNaN(row.srcPort) ? row.srcPort || 0 : 0;
            const destinationPort = !isNaN(row.destPort)
              ? row.destPort || 0
              : 0;
            let newRow = {
              ...row,
              ruleNum: row.ruleNum,
              sip: row.sip === "ANY" ? null : row.sip,
              srcPort: Number(sourcePort),
              dip: row.dip === "ANY" ? null : row.dip,
              destPort: Number(destinationPort),
              action: row.action.toLowerCase(),
              desc: row.desc,
              protocol: row.protocol === "ANY" ? -1 : row.protocol,
            };

            if (newRow.protocol !== -1) {
              let vals = newRow.protocol.match(/^(\d+) \((\S+)\)/);

              newRow.protocol = parseInt(vals[1]);
              newRow.protoStr = vals[2];
            }

            delete newRow.enabled;
            delete newRow.__isEditMode;
            delete newRow.id;
            delete newRow.isChecked;
            delete newRow.protoStr;
            delete newRow.actionId;
            delete newRow.flags;
            delete newRow.nwSip;
            delete newRow.nwSipNetmask;
            delete newRow.nwDip;
            delete newRow.nwDipNetmask;
            delete newRow.protoStr;
            delete newRow.toTrusted;

            let oldRow = {
              ...orgRow,
              ruleNum: orgRow.ruleNum,
              action: orgRow.action.toLowerCase(),
              desc: orgRow.desc,
              dip: orgRow.dip === "ANY" ? null : orgRow.dip,
              destPort: orgRow.destPort === "ANY" ? null : orgRow.destPort,
              sip: orgRow.sip === "ANY" ? null : orgRow.sip,
              srcPort: orgRow.srcPort === "ANY" ? null : orgRow.srcPort,
              protocol: orgRow.protocol === "ANY" ? -1 : orgRow.protocol,
            };

            if (oldRow.protocol !== -1) {
              let vals = oldRow.protocol.match(/^(\d+) \((\S+)\)/);

              oldRow.protocol = parseInt(vals[1]);
              oldRow.protoStr = vals[2];
            }

            delete oldRow.enabled;
            delete oldRow.__isEditMode;
            delete oldRow.id;
            delete oldRow.isChecked;
            delete oldRow.protoStr;
            delete oldRow.actionId;
            delete oldRow.flags;
            delete oldRow.nwSip;
            delete oldRow.nwSipNetmask;
            delete oldRow.nwDip;
            delete oldRow.nwDipNetmask;
            delete oldRow.protoStr;
            delete oldRow.toTrusted;

            if (response.state === "DELETE_FILTER_SUCCESS") {
              callAPI({
                path: "saveFilterRule",
                params: { gatewayIP, context, trusted },
                data: { ...newRow },
                responder: addFilterRuleResponder,
                onCompleteArguments: [row, setTaskStatus, orgRow],
                onComplete: (response, row, setTaskStatus, orgRow) => {
                  const srcPort = row.srcPort || "ANY";
                  const destPort = row.destPort || "ANY";
                  const payload = { ...row, srcPort, destPort };

                  if (response.state === "ADD_FILTER_SUCCESS") {
                    let status = {
                      inProgress: false,
                      error: false,
                      payload,
                      message: `Filter rule with number "${row.ruleNum}" added successfully.`,
                    };

                    setTaskStatus(status);
                  } else {
                    /* Restoring Old Row */
                    let data = {
                      ...row,
                      ruleNum: orgRow.ruleNum,
                      action: orgRow.action.toLowerCase(),
                      desc: orgRow.desc,
                      dip: orgRow.dip === "ANY" ? null : orgRow.dip,
                      destPort:
                        orgRow.destPort === "ANY" ? null : orgRow.destPort,
                      sip: orgRow.sip === "ANY" ? null : orgRow.sip,
                      srcPort: orgRow.srcPort === "ANY" ? null : orgRow.srcPort,
                      protocol:
                        orgRow.protocol === "ANY" ? -1 : orgRow.protocol,
                    };

                    if (data.protocol !== -1) {
                      let vals = data.protocol.match(/^(\d+) \((\S+)\)/);

                      data.protocol = parseInt(vals[1]);
                      data.protoStr = vals[2];
                    }

                    delete data.enabled;
                    delete data.__isEditMode;
                    delete data.id;
                    delete data.isChecked;
                    delete data.protoStr;
                    delete data.actionId;
                    delete data.flags;
                    delete data.nwSip;
                    delete data.nwSipNetmask;
                    delete data.nwDip;
                    delete data.nwDipNetmask;
                    delete data.protoStr;
                    delete data.toTrusted;

                    callAPI({
                      path: "saveFilterRule",
                      params: { gatewayIP, context, trusted },
                      data,
                      responder: addFilterRuleResponder,
                      onCompleteArguments: [row, setTaskStatus, response],
                      onComplete: (
                        response,
                        row,
                        setTaskStatus,
                        prevResponse,
                      ) => {
                        if (response.state === "ADD_FILTER_SUCCESS") {
                          if (row.id === "_newRow") {
                            row.id = response.data.id;
                          }

                          let status = {
                            inProgress: false,
                            error: false,
                            payload: { ...orgRow },
                            message: (
                              <>
                                {t(
                                  "commons.errorMessages.erroraddingFilterRule",
                                  { ruleNum: row.ruleNum },
                                )}
                                <br />
                                <br />
                                {t("commons.errorMessages.errorDetails")}
                                <br />
                                {Utility.getErrorsFromResponse(prevResponse)}
                              </>
                            ),
                            resetForm: true,
                          };
                          setTaskStatus(status);
                        } else {
                          setTaskStatus({
                            inProgress: false,
                            error: true,
                            message: (
                              <>
                                Unable to save or retrive the record as it's
                                removed.
                                <br />
                                <br />
                                Error Details:
                                <br />
                                {Utility.getErrorsFromResponse(response)}
                              </>
                            ),
                          });
                        }
                      },
                    });
                  }
                },
              });
            } else {
              setTaskStatus({
                inProgress: false,
                error: true,
                message: (
                  <>
                    {t("commons.errorMessages.errorDetails", {
                      ruleNum: row.ruleNum,
                    })}
                    <br />
                    <br />
                    {t("commons.errorMessages.errorDetails")}
                    <br />
                    {Utility.getErrorsFromResponse(response)}
                  </>
                ),
              });
            }
          },
        });
      }
    },
    [context, gatewayIP, trusted],
  );

  let config = useMemo(
    () => ({
      editMode: "inline",
      noDataMessage: "Add rows to the table...",
      globalSearch: true,
      allowMultipleRowSelection: true,
      fallbackRow: { enabled: "True" },
      bulkActions: [enableRowRule, disableRowRule],
      addHandler: { handleSave, handleDiscard },
    }),
    [disableRowRule, enableRowRule, handleDiscard, handleSave],
  );

  let columns = useMemo(
    () => [
      {
        headerName: t(
          "commons.Component.Table Content.Enabled Field.Header Name",
        ),
        dataKey: "enabled",
        type: "select-single",
        options: ["True", "False"],
        minWidth: 160,
        flexWidth: 1.6,
        sortable: true,
        isDisableEdit: true,
        isDisableAdd: true,
      },
      {
        headerName: t(
          "commons.Component.Table Content.Number Field.Header Name",
        ),
        dataKey: "ruleNum",
        type: "text",
        minWidth: 160,
        flexWidth: 1.6,
        headerAlignment: "left",
        contentAlignment: "left",
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA > valB) return 1;
          if (valA < valB) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          if (event.type === "blur") {
            let data = "";
            const value = row.ruleNum;
            const regex = new RegExp(/^[0-9]+$/);
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [`${value ?? ""}`],
                success: "",
                error: t(
                  "commons.Component.Table Content.Number Field.Validation.Errors.Mandatory",
                ),
              },
              {
                runner: ValidationHelper.testRegex,
                args: [value, regex],
                success: "",
                error: t(
                  "commons.Component.Table Content.Number Field.Validation.Errors.Only Number",
                ),
              },
              {
                runner: ValidationHelper.isLimit,
                args: [value, 0, 1020],
                success: "",
                error: t(
                  "commons.Component.Table Content.Number Field.Validation.Errors.Range",
                ),
              },
            ];
            data = ValidationHelper.batchValidator(tests);
            if (data === "") {
              return { isValid: true, message: "" };
            } else {
              return { isValid: false, message: data };
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Protocol Field.Header Name",
        ),
        dataKey: "protocol",
        type: "select-single",
        options: [],
        minWidth: 160,
        flexWidth: 1.6,
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row, resetValidation) => {
          resetValidation({ key: "", value: "" });

          if (event.type === "blur") {
            const protocol = `${row.protocol}`.trim();
            const isNotTCP = !protocol.includes("TCP");
            const isNotUDP = !protocol.includes("UDP");

            if (isNotTCP && isNotUDP) {
              resetValidation({ key: "srcPort", value: "", resetField: true });

              setTimeout(() => {
                resetValidation({
                  key: "destPort",
                  value: "",
                  resetField: true,
                });
              }, 80);
            }
          }

          if (event.type === "blur") {
            let data = "";
            const value = row.protocol;
            const regex = new RegExp(/(^(\d+) \((\S+)\))|(ANY)/);
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [value],
                success: "",
                error: t(
                  "commons.Component.Table Content.Protocol Field.Validation.Errors.Mandatory",
                ),
              },
              {
                runner: ValidationHelper.testRegex,
                args: [value, regex],
                success: "",
                error: t(
                  "commons.Component.Table Content.Protocol Field.Validation.Errors.Invalid",
                ),
              },
            ];

            data = ValidationHelper.batchValidator(tests);

            if (data) {
              return { isValid: false, message: data };
            }

            return { isValid: true, message: "" };
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Source IP Field.Header Name",
        ),
        dataKey: "sip",
        type: "text",
        options: [],
        minWidth: 160,
        flexWidth: 1.6,
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row, $) => {
          if (event._reactName === "onBlur") {
            const value = event.target.value;
            let check = value.includes(":");
            const valid = { isValid: true, message: `` };

            if (value.toUpperCase() === "ANY") {
              return valid;
            }

            const required = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Source IP Field.Validation.Errors.Mandatory",
              ),
            };

            const inValidAddress = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Source IP Field.Validation.Errors.Invalid",
              ),
            };

            const inValidPrefix = {
              isValid: false,
              message: check
                ? t(
                    "commons.Component.Table Content.Source IP Field.Validation.Errors.Invalid Prefix 48 and 128",
                  )
                : t(
                    "commons.Component.Table Content.Source IP Field.Validation.Errors.Invalid Prefix 8 through 32",
                  ),
            };

            const inValidSlashes = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Source IP Field.Validation.Errors.Invalid",
              ),
            };

            if (value.includes(":")) {
              const IPv6Pattern = new RegExp(
                /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
              );
              const valid = { isValid: true, message: `` };

              const ip = value.split("/")[0];
              const prefix = value.split("/")[1];

              const ipRegexTest = !Boolean(IPv6Pattern.test(ip));
              const isPrefix =
                prefix &&
                (isNaN(prefix) ||
                  parseInt(prefix) > 128 ||
                  parseInt(prefix) < 48);
              const isSlashes = !Boolean(value.split("/").length === 2);
              const isEndsWithSlash = value.endsWith("/");

              if (!Boolean(value.length)) {
                return required;
              }

              if (ipRegexTest) {
                return inValidAddress;
              }

              if (isPrefix) {
                return inValidPrefix;
              }

              if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
                return inValidSlashes;
              }

              return valid;
            } else {
              const ipRegex = new RegExp(
                /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
              );

              const ipSection = value.split(".");
              let lastSection = !!!Number(ipSection[ipSection.length - 1]);
              let lastIncludes = ipSection[ipSection.length - 1].includes("/")
                ? !!!Number(ipSection[ipSection.length - 1].split("/")[0])
                : lastSection;

              const ip = value.split("/")[0];
              const prefix = value.split("/")[1];
              const ipRegexTest = !Boolean(ipRegex.test(ip));

              const isPrefix =
                prefix &&
                (isNaN(prefix) ||
                  parseInt(prefix) > 32 ||
                  parseInt(prefix) < 8);
              const isSlashes = !Boolean(value.split("/").length === 2);
              const isEndsWithSlash = value.endsWith("/");

              if (event._reactName === "onBlur") {
                if (!Boolean(value.length)) {
                  return required;
                }

                if (ipRegexTest) {
                  return inValidAddress;
                }
                if (value === "0.0.0.0" || lastIncludes) {
                  return inValidAddress;
                }

                if (isPrefix) {
                  return inValidPrefix;
                }

                if (value.includes("/")) {
                  if (isSlashes || isEndsWithSlash) {
                    return inValidSlashes;
                  }
                }

                return valid;
              }
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Source Port Field.Header Name",
        ),
        dataKey: "srcPort",
        type: "text",
        minWidth: 160,
        flexWidth: 1.6,
        sortable: true,
        disableField: (row) => {
          const isTCP = row?.protocol?.trim() === "6 (TCP)" ?? false;
          const isUDP = row?.protocol?.trim() === "17 (UDP)" ?? false;

          return !(isTCP || isUDP);
        },
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          let data = "";
          if (event.type === "blur") {
            const value = row.srcPort;
            const regex = new RegExp(/^([0-9]+|ANY|any|Any)$/);
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [value],
                success: "",
                error: "",
              },
              {
                runner: ValidationHelper.testRegex,
                args: [value, regex],
                success: "",
                error: t(
                  "commons.Component.Table Content.Source Port Field.Validation.Errors.Invalid",
                ),
              },
              {
                runner: ValidationHelper.isLimit,
                args: [value, 1, 65535],
                success: "",
                error: t(
                  "commons.Component.Table Content.Source Port Field.Validation.Errors.Range",
                ),
              },
            ];

            data = ValidationHelper.batchValidator(tests);

            if (data === "") {
              return { isValid: true, message: "" };
            } else {
              return { isValid: false, message: data };
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Destination IP Field.Header Name",
        ),
        dataKey: "dip",
        type: "text",
        options: [],
        minWidth: 190,
        flexWidth: 1.9,
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          if (event._reactName === "onBlur") {
            const value = event.target.value;
            let check = value.includes(":");
            const valid = { isValid: true, message: `` };

            if (value.toUpperCase() === "ANY") {
              return valid;
            }

            const required = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Destination IP Field.Validation.Errors.Mandatory",
              ),
            };

            const inValidAddress = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Destination IP Field.Validation.Errors.Invalid",
              ),
            };

            const inValidPrefix = {
              isValid: false,
              message: check
                ? t(
                    "commons.Component.Table Content.Destination IP Field.Validation.Errors.Valid Prefix 48 through 128",
                  )
                : t(
                    "commons.Component.Table Content.Destination IP Field.Validation.Errors.Valid Prefix 8 through 32",
                  ),
            };

            const inValidSlashes = {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Destination IP Field.Validation.Errors.Invalid",
              ),
            };

            if (value.includes(":")) {
              const IPv6Pattern = new RegExp(
                /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
              );
              const valid = { isValid: true, message: `` };

              const ip = value.split("/")[0];
              const prefix = value.split("/")[1];

              const ipRegexTest = !Boolean(IPv6Pattern.test(ip));
              const isPrefix =
                prefix &&
                (isNaN(prefix) ||
                  parseInt(prefix) > 128 ||
                  parseInt(prefix) < 48);
              const isSlashes = !Boolean(value.split("/").length === 2);
              const isEndsWithSlash = value.endsWith("/");
              if (!Boolean(value.length)) {
                return required;
              }
              if (ipRegexTest) {
                return inValidAddress;
              }

              if (isPrefix) {
                return inValidPrefix;
              }
              if (value.includes("/") && (isSlashes || isEndsWithSlash)) {
                return inValidSlashes;
              }
              return valid;
            } else {
              const ipRegex = new RegExp(
                /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
              );

              const ipSection = value.split(".");
              let lastSection = !!!Number(ipSection[ipSection.length - 1]);
              let lastIncludes = ipSection[ipSection.length - 1].includes("/")
                ? !!!Number(ipSection[ipSection.length - 1].split("/")[0])
                : lastSection;

              const ip = value.split("/")[0];
              const prefix = value.split("/")[1];
              const ipRegexTest = !Boolean(ipRegex.test(ip));

              const isPrefix =
                prefix &&
                (isNaN(prefix) ||
                  parseInt(prefix) > 32 ||
                  parseInt(prefix) < 8);
              const isSlashes = !Boolean(value.split("/").length === 2);
              const isEndsWithSlash = value.endsWith("/");

              if (event._reactName === "onBlur") {
                if (!Boolean(value.length)) {
                  return required;
                }

                if (ipRegexTest) {
                  return inValidAddress;
                }
                if (value === "0.0.0.0" || lastIncludes) {
                  return inValidAddress;
                }

                if (isPrefix) {
                  return inValidPrefix;
                }

                if (value.includes("/")) {
                  if (isSlashes || isEndsWithSlash) {
                    return inValidSlashes;
                  }
                }

                return valid;
              }
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Destination Port Field.Header Name",
        ),
        dataKey: "destPort",
        type: "text",
        minWidth: 190,
        flexWidth: 1.9,
        sortable: true,
        disableField: (row) => {
          const isTCP = row?.protocol?.trim() === "6 (TCP)" ?? false;
          const isUDP = row?.protocol?.trim() === "17 (UDP)" ?? false;

          return !(isTCP || isUDP);
        },
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          let data = "";
          if (event.type === "blur") {
            const value = row.destPort;
            const regex = new RegExp(/^([0-9]+|ANY|any|Any)$/);
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [value],
                success: "",
                error: "",
              },
              {
                runner: ValidationHelper.testRegex,
                args: [value, regex],
                success: "",
                error: t(
                  "commons.Component.Table Content.Destination Port Field.Validation.Errors.Invalid",
                ),
              },
              {
                runner: ValidationHelper.isLimit,
                args: [value, 1, 65535],
                success: "",
                error: t(
                  "commons.Component.Table Content.Destination Port Field.Validation.Errors.Range",
                ),
              },
            ];
            data = ValidationHelper.batchValidator(tests);
            if (data === "") {
              return { isValid: true, message: "" };
            } else {
              return { isValid: false, message: data };
            }
          } else {
            return { isValid: true, message: data };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Rule Action Field.Header Name",
        ),
        dataKey: "action",
        type: "select-single",
        options: ["Drop", "Forward"],
        minWidth: 160,
        flexWidth: 1.6,
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          if (event.type === "blur") {
            let data = "";
            const value = row.action;
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [value],
                success: "",
                error: t(
                  "commons.Component.Table Content.Rule Action Field.Validation.Errors.Mandatory",
                ),
              },
            ];
            data = ValidationHelper.batchValidator(tests);
            if (data === "") {
              return { isValid: true, message: "" };
            } else {
              return { isValid: false, message: data };
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Description Field.Header Name",
        ),
        dataKey: "desc",
        type: "multiline",
        options: [],
        minWidth: 200,
        flexWidth: 2,
        sortable: true,
        sortComparator: (valA, valB, rowA, rowB) => {
          if (valA.toLowerCase() > valB.toLowerCase()) return 1;
          if (valA.toLowerCase() < valB.toLowerCase()) return -1;
          return 0;
        },
        inputValidator: (event, row) => {
          if (event.type === "blur") {
            let data = "";
            const value = row.desc;
            const tests = [
              {
                runner: ValidationHelper.isNotEmpty,
                args: [value],
                success: "",
                error: "",
              },
            ];
            data = ValidationHelper.batchValidator(tests);
            if (data === "") {
              return { isValid: true, message: "" };
            } else {
              return { isValid: false, message: data };
            }
          } else {
            return { isValid: true, message: "" };
          }
        },
      },
      {
        headerName: t(
          "commons.Component.Table Content.Action Option.Header Name",
        ),
        dataKey: "__action",
        type: "actions",
        sortable: false,
        minWidth: 120,
        flexWidth: 1.2,
        headerAlignment: "center",
        actions: [
          {
            type: "__edit",
            name: t("page.gatewayServer.Filter Rules.TableActionTooltip.Edit"),
            hideEditInRow: false,
            isEnabled: (row) => {
              return (
                parseInt(row.ruleNum) !== 1021 &&
                parseInt(row.ruleNum) !== 1022 &&
                parseInt(row.ruleNum) !== 1023
              );
            },
            handleEdit,
            handleSave: handleDeleteSave,
            handleDiscard,
          },
          {
            type: "__delete",
            name: t(
              "page.gatewayServer.Filter Rules.TableActionTooltip.Delete",
            ),
            handleDelete,
            isEnabled: (row) => {
              return (
                parseInt(row.ruleNum) !== 1021 &&
                parseInt(row.ruleNum) !== 1022 &&
                parseInt(row.ruleNum) !== 1023
              );
            },
            prompt: {
              contentTitle: t(
                "commons.Component.Table Content.Action Option.Prompt.Delete Confirm Prompt.Delete Confirm Title",
              ),
              contentText: (
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Action Option.Prompt.Delete Confirm Prompt.Delete Confirm Content"
                  }
                  values={{ actionComponent: "filter rule." }}
                  components={[<br />, <b />]}
                >
                  You have initiated the process of deleting this filter rule.
                  <br />
                  <br />
                  Click <b>Confirm</b> to delete, otherwise click
                  <b>Cancel</b>.
                </Trans>
              ),
            },
          },
          {
            type: "toggle-enable",
            name: "Toggle Enable",
            isEnabled: (row) => {
              return true;
              //return (
              //  parseInt(row.ruleNum) !== 1022 && parseInt(row.ruleNum) !== 1023
              //);
            },
            icon: 0,
            icons: [
              <DoNotDisturbOnRoundedIcon
                style={{
                  width: "0.85em",
                  height: "0.85em",
                  color: "rgb(2, 147, 254)",
                }}
              />,
              <CheckCircleRoundedIcon
                style={{
                  width: "0.85em",
                  height: "0.85em",
                  color: "rgb(2, 147, 254)",
                }}
              />,
            ],
            handleToggle: (row, setTaskStatus) => {
              const text =
                row.enabled === "True"
                  ? "Disabling filter rule ..."
                  : "Enabling filter rule ...";

              setModalSpinner({ status: "open", text });

              const enabled = row.enabled === "True" ? "False" : "True";
              const type = row.enabled === "True" ? "disabled" : "enabled";
              const statusType =
                row.enabled === "True" ? "disabling" : "enabling";

              callAPI({
                path:
                  row.enabled === "True"
                    ? "disableFilterRule"
                    : "enableFilterRule",
                params: { gatewayIP, context, trusted },
                data: `${row.ruleNum}`,
                responder: toggleRulesResponder,
                onCompleteArguments: [row, setTaskStatus],
                onComplete: (response, row, setTaskStatus) => {
                  setModalSpinner({ status: "close", text: "" });

                  if (response.state === "TOGGLE_FILTER_SUCCESS") {
                    setTaskStatus({
                      inProgress: false,
                      error: false,
                      message: `Filter rule with number "${row.ruleNum}" ${type} successfully.`,
                      payload: { ...row, enabled },
                    });
                  } else {
                    setTaskStatus({
                      inProgress: false,
                      error: true,
                      message: (
                        <>
                          {t("commons.errorMessages.errorStatus", {
                            statusType: statusType,
                            ruleNum: row.ruleNum,
                          })}
                          <br />
                          <br />
                          {t("commons.errorMessages.errorDetails")}
                          <br />
                          {Utility.getErrorsFromResponse(response)}
                        </>
                      ),
                    });
                  }
                },
              });
            },
          },
        ],
      },
    ],
    [
      context,
      gatewayIP,
      handleDelete,
      handleDeleteSave,
      handleDiscard,
      trusted,
    ],
  );

  const [gridConfig, setGridConfig] = useState(config);
  const [gridCols, setGridCols] = useState(columns);
  const [gridSubconscious, setGridSubconscious] = useState(subconscious);
  const { isCollapsed } = useSelector(($) => $.navigationMenu);

  useEffect(() => {
    setGridConfig({
      editMode: "inline",
      noDataMessage: "Add rows to the table...",
      globalSearch: true,
      allowMultipleRowSelection: true,
      fallbackRow: { enabled: "True" },
      bulkActions: [enableRowRule, disableRowRule],
      addHandler: { handleSave, handleDiscard },
    });
  }, [
    context,
    disableRowRule,
    enableRowRule,
    handleDiscard,
    handleSave,
    trusted,
  ]);

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
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway, gatewayAddress]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      loading === true &&
      filterDataLoading === true
    ) {
      let responder = fromTrustedFilterResponder;
      let onComplete = onCompleteToTrustedFilter;

      if (trusted === "To Trusted") {
        responder = toTrustedFilterResponder;
      }

      const path = `${
        trusted === "From Trusted" ? "fromTrusted" : "toTrusted"
      }filter`;

      callAPI({
        path,
        params: { gatewayIP, context, page: 0 },
        data: {},
        responder,
        onComplete,
      });

      if (dataContextLoading === true) {
        callAPI({
          path: "filterProtocols",
          params: { gatewayIP, context, page: 0 },
          data: {},
          responder: filterProtocolResponder,
          onComplete: onCompleteFilterProtocols,
        });
      }
    }
  }, [
    gatewayAddress,
    context,
    trusted,
    loading,
    filterDataLoading,
    dataContextLoading,
    gatewayIP,
  ]);

  useEffect(() => {
    if (filterDataLoading === false && dataContextLoading === false) {
      setLoading1(true);
      setLoading(false);
    }
  }, [filterDataLoading, dataContextLoading]);

  useEffect(() => {
    if (dataContextLoading === false) {
      let siuu = columns.map((col) => {
        let newCol = { ...col };

        if (newCol.dataKey === "protocol") {
          newCol.options = dataContext;
        }

        return newCol;
      });

      setGridCols(siuu);
    }
  }, [dataContextLoading, dataContext, columns, config]);

  useEffect(() => {
    if (!filterDataLoading) {
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
      setGridRows(filterData);
    }
  }, [filterData, filterDataLoading, subconscious.name]);

  useEffect(() => {
    if (gatewayConfig.chassis_model === "5010") {
      setContext("mgt");
    }
  }, [gatewayConfig.chassis_model]);

  return (
    <>
      <div style={{ height: "64px" }}>
        <AppInContentHeader
          title={AppConfig.pages.flr.title}
          breadcrumb={AppConfig.pages.flr.breadcrumb}
        />
      </div>

      <StyledBox isCollapsed={isCollapsed}>
        <StyledBoxContext>
          <FormControl variant="outlined" margin="2em">
            <InputLabel
              id="Trusted-outlined-label"
              style={{ fontSize: "0.9rem" }}
            >
              {/* Choose a Context */}
              {t(
                "page.gatewayServer.Filter Rules.Select Option.Choose a Context Field.Title",
              )}
            </InputLabel>
            <Select
              labelId="Context-outlined-label"
              id="Context-outlined"
              onChange={ContextHandler}
              defaultValue={
                gatewayConfig.chassis_model !== "5010" ? "bump0" : "mgt"
              }
              variant="outlined"
              displayEmpty
              style={{ width: "250px", height: "39px", fontSize: "0.9rem" }}
              disabled={!loading1 || gatewayConfig.chassis_model === "5010"}
              label={t(
                "page.gatewayServer.Filter Rules.Select Option.Choose a Context Field.Title",
              )}
            >
              <MenuItem value={"bump0"}>bump0</MenuItem>
              <MenuItem value={"mgt"}>mget</MenuItem>
            </Select>
          </FormControl>
        </StyledBoxContext>

        <StyledBoxTrusted>
          <FormControl variant="outlined">
            <InputLabel
              id="Trusted-outlined-label"
              style={{ fontSize: "0.9rem" }}
            >
              {t(
                "page.gatewayServer.Filter Rules.Select Option.From/To Trusted Field.Title",
              )}{" "}
            </InputLabel>
            <Select
              labelId="Trusted-outlined-label"
              id="Trusted-outlined"
              defaultValue={"From Trusted"}
              onChange={TrustedHandler}
              displayEmpty
              variant="outlined"
              style={{ width: "250px", height: "39px", fontSize: "0.9rem" }}
              disabled={!loading1}
              label={t(
                "page.gatewayServer.Filter Rules.Select Option.From/To Trusted Field.Title",
              )}
            >
              <MenuItem value={"From Trusted"}>From Trusted</MenuItem>
              <MenuItem value={"To Trusted"}>To Trusted</MenuItem>
            </Select>
          </FormControl>
        </StyledBoxTrusted>
      </StyledBox>

      <AsyncStyledBox key={`${context} ${trusted}`}>
        <Suspense
          fallback={
            <StyledSkeletonHolder>
              <WidthFillerSkeleton height="100%" />
            </StyledSkeletonHolder>
          }
        >
          <AsyncIFVDataGrid
            ref={dataGridRef}
            name={subconscious.name}
            key={dataGridKey}
            loadingData={[loading, setLoading]}
            config={[gridConfig, setGridConfig]}
            cols={[gridCols, setGridCols]}
            subconscious={[gridSubconscious, setGridSubconscious]}
            data={[gridRows, setGridRows]}
          />
        </Suspense>
      </AsyncStyledBox>

      {model.toggleOpen ? (
        <DialogBox model={model} setModel={setModel} />
      ) : null}

      {modalSpinner.status === "open" ? (
        <Styled.Modal
          open={true}
          aria-labelledby="bulk-action-modal-spinner"
          aria-describedby="bulk-action-modal-spinner-message"
        >
          <Styled.Content
            style={{
              width: "400px",
              minHeight: "240px",
              maxHeight: "240px",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ClipLoader size="10em" color="#0094FD" />

            <Typography style={{ /* fontFamily: "", */ margin: "1em 0" }}>
              {modalSpinner.text}
            </Typography>
          </Styled.Content>
        </Styled.Modal>
      ) : null}

      {modalState.display ? (
        <BulkActionModal {...modalState} setModalSpinner={setModalSpinner} />
      ) : null}

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
      <Prompt
        open={prompt || editPrompt}
        setOpen={setPrompt || setEditPrompt}
        contentTitle={"Error!"}
        contentText={
          <>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.configureFilterRulesModal.sameMessage"
              }
              components={[<p />, <br />]}
            >
              <p>
                Source IP and Destination IP can not be the same.
                <br />
                Please, enter a different IP address!
              </p>
            </Trans>
          </>
        }
        disagreeTitle={"OK"}
        handleDisagree={() => {
          resetEdit
            ? handleEdit(editData.row, editData.setStatus)
            : handleClose(data.row, data.setStatus);
        }}
      />
    </>
  );
};

export default FilterRules;
