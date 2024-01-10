import React, { useCallback, useState } from "react";
import callAPI from "../../apis/callAPI";
import Config from "../../Config";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import Styled from "./MaterialComponents/Settings.style";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import OverlayContext from "../AppContent/AppOverlayContext";
import {
  configListResponder,
  deleteConfigResponder,
  exportConfigResponder,
  restoreConfigResponder,
} from "../../apis/responders/config-managment-api-responder";
import Utility from "../../redux/actions/Utility";
import LoadingMate from "./LoadingMate";
import { Fade, Typography } from "@mui/material";
import BackupConfiguration from "./BackUpConfigurationModal";
import RestoreConfiguration from "./RestoreConfigurationModal";
import HeaderInfo from "./HeaderInfo";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import backup from "../../images/backup.svg";
import exportIcon from "../../images/Export.svg";
import deleteIcon from "../../images/delete.svg";
import { ClipLoader } from "react-spinners";
import { batcherDeleteConfig } from "./api/batcherDeleteConfig";
import { BulkActionModal } from "./api/Portal/BulkActionModal/BulkActionModal";
import { batcherExportConfig } from "./api/batcherExportConfig";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import Auth from "../../redux/actions/Auth";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const sortComparator = (valA, valB, rowA, rowB) => {
  if (valA.toLowerCase() > valB.toLowerCase()) return 1;
  if (valA.toLowerCase() < valB.toLowerCase()) return -1;
  return 0;
};

const asUTC = (_date) => {
  if (_date) {
    const _date_ = new Date(_date);
    const utcDate = _date_.getUTCDate();
    const _utcMonth = _date_.getUTCMonth();
    const utcMonth = _utcMonth <= 11 ? _utcMonth + 1 : _utcMonth;
    const utcYear = _date_.getUTCFullYear();
    const utcHour = _date_.getUTCHours();
    const utcMinutes = _date_.getUTCMinutes();
    const utcSeconds = _date_.getUTCSeconds();

    const $utcDate = `${utcDate}`.length === 1 ? `0${utcDate}` : utcDate;
    const $utcMonth = `${utcMonth}`.length === 1 ? `0${utcMonth}` : utcMonth;
    const $utcYear = `${utcYear}`.length === 1 ? `0${utcYear}` : utcYear;
    const $utcHour = `${utcHour}`.length === 1 ? `0${utcHour}` : utcHour;
    const $utcMinutes =
      `${utcMinutes}`.length === 1 ? `0${utcMinutes}` : utcMinutes;
    const $utcSeconds =
      `${utcSeconds}`.length === 1 ? `0${utcSeconds}` : utcSeconds;

    return `${$utcMonth}/${$utcDate}/${$utcYear} ${$utcHour}:${$utcMinutes}:${$utcSeconds}`;
  } else {
    return _date;
  }
};

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
const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const initModalSpinner = { status: "neutral", text: "" };
function Settings() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  const AppConfig = React.useContext(Config);
  const AppOverlayContext = React.useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = React.useState(null);
  const [gridRows, setGridRows] = React.useState([]);
  const [alertDialog, setAlertDialog] = React.useState(initialAlertDialog);
  const [viewConfigData, setViewConfigData] = React.useState([]);
  const [prompt, setPrompt] = React.useState(false);
  const [modalSpinner, setModalSpinner] = useState(initModalSpinner);
  const [modalState, setModalState] = useState(() => initModalState());
  const [isLogOutTrigger, setIsLogOutTrigger] = useState(false);

  const { t } = useTranslation();

  const exportConfigOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "EXPORT_CONFIG_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: (
          <>
            {/* <p>
              {gatewayConfig.chassis_model === "5010"
                ? "Controller"
                : "Invisigate"}{" "}
              configuration <b>"{row.fileName}"</b> exported successfully.
              Download will be completed shortly.
            </p> */}
            <p>
              <Trans
                i18nKey={
                  "page.configure.Configuration.Action Options.Prompt.Export Status Prompt.Success"
                }
                components={[<b />]}
                values={{
                  gateWay:
                    gatewayConfig.chassis_model === "5010"
                      ? "Controller"
                      : "Invisigate",
                  fileName: row.fileName,
                }}
              >
                {gatewayConfig.chassis_model === "5010"
                  ? "Controller"
                  : "Invisigate"}{" "}
                configuration <b>"{row.fileName}"</b> exported successfully.
                Download will be completed shortly.
              </Trans>
            </p>
          </>
        ),
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.configure.Configuration.Action Options.Prompt.Export Status Prompt.Error"
              }
              components={[<br />]}
              values={{
                gateWay:
                  gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate",
                fileName: row.fileName,
              }}
            >
              Error while exporting{" "}
              {gatewayConfig.chassis_model === "5010"
                ? "Controller"
                : "Invisigate"}{" "}
              configuration "{row.fileName}". Please try again.
              <br />
              <br />
              {t("commons.errorMessages.errorDetails")}
              <br />
            </Trans>

            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };

      setTaskStatus(status);
    }
  };

  const handleExport = (row, setTaskStatus) => {
    let requestPayload = { ...row };

    delete requestPayload["__isEditMode"];
    delete requestPayload["isChecked"];

    callAPI({
      path: "export-config",
      params: { gatewayIP, fileName: requestPayload.fileName },
      data: {},
      responder: exportConfigResponder,
      onComplete: exportConfigOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const restoreConfigOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "RESTORE_CONFIG_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: (
          <>
            {/* <p>
            {gatewayConfig.chassis_model === "5010"
              ? "Controller"
              : "Invisigate"}{" "}
            configuration "{row.fileName}" restored successfully.
          </p>

            <p style={{ color: "crimson" }}>
              <b>
                User will be logged out and{" "}
                {gatewayConfig.chassis_model === "5010"
                  ? "Controller"
                  : "Invisigate"}{" "}
                will be restarted.
              </b>
            </p> */}
            <p>
              {t(
                "page.configure.Configuration.Action Options.Prompt.Restored Status Prompt.Success.0",
                {
                  fileName: row.fileName,
                  gateWay:
                    gatewayConfig.chassis_model === "5010"
                      ? "Controller"
                      : "Invisigate",
                },
              )}
            </p>

            <p style={{ color: "crimson" }}>
              <b>
                {t(
                  "page.configure.Configuration.Action Options.Prompt.Restored Status Prompt.Success.1",
                  {
                    gateWay:
                      gatewayConfig.chassis_model === "5010"
                        ? "Controller"
                        : "Invisigate",
                  },
                )}
              </b>
            </p>
          </>
        ),
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.configure.Configuration.Action Options.Prompt.Restoring Status Prompt.Error"
              }
              components={[<br />]}
              values={{
                gateWay:
                  gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate",
                fileName: row.fileName,
              }}
            ></Trans>
            Error restoring{" "}
            {gatewayConfig.chassis_model === "5010"
              ? "Controller"
              : "Invisigate"}{" "}
            configuration "{row.fileName}". Please try again.
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

  const handleRestore = (row, setTaskStatus, setGridAllRows) => {
    let requestPayload = { ...row };
    const passphrase = requestPayload.passphraseState;

    delete requestPayload["__isEditMode"];
    delete requestPayload["isChecked"];
    delete requestPayload["passphraseState"];

    callAPI({
      path: "restore-config",
      params: { gatewayIP },
      data: {
        isRescue: 0,
        fileName: requestPayload.fileName,
        comments: requestPayload.comments,
        passPhrase: btoa(passphrase),
      },
      responder: restoreConfigResponder,
      onComplete: restoreConfigOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const deleteConfigOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_CONFIG_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        // message: `Gateway configuration "${row.fileName}" deleted successfully.`,
        message: t(
          "page.configure.Configuration.Action Options.Prompt.Delete Status Prompt.Success",
          { fileName: row.fileName, GATEWAY: common.GATEWAY },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.configure.Configuration.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ fileName: row.fileName }}
              components={[<br />]}
            >
              Error deleting gateway configuration "{row.fileName}". Please try
              again.
              <br />
              <br />
              Details:
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "delete-config",
      params: { gatewayIP },
      data: { id: newRow.id, fileName: newRow.fileName, removeAll: 0 },
      responder: deleteConfigResponder,
      onComplete: deleteConfigOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
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

  const deleteBulkAction = React.useMemo(
    () => ({
      name: t("page.configure.Configuration.BulkAction.Delete"),
      icon: <img src={deleteIcon} alt={"delete"} width={"18px"} />,
      handleSetModal,
      handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
        setModalSpinner({
          status: "open",
          text: `Deleting ${selectedRows.length} configurations...`,
        });

        const unSelectedTableRows = tableRows.filter((row) => {
          return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const selectedTableRows = tableRows.filter((row) => {
          return Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const path = "delete-config";
        const params = { gatewayIP };
        const responder = deleteConfigResponder;

        batcherDeleteConfig(
          path,
          params,
          responder,
          unSelectedTableRows,
          selectedTableRows,
          setTaskStatus,
        );
      },
    }),
    [gatewayIP, handleSetModal],
  );

  const exportBulkAction = React.useMemo(
    () => ({
      name: t("page.configure.Configuration.BulkAction.Export"),
      icon: <img src={exportIcon} alt={"export"} width={"18px"} />,
      handleSetModal,
      handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
        setModalSpinner({
          status: "open",
          text: `Exporting ${selectedRows.length} configurations...`,
        });

        const unSelectedTableRows = tableRows.filter((row) => {
          return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const selectedTableRows = tableRows.filter((row) => {
          return Boolean(selectedRows.filter((r) => r.id === row.id).length);
        });

        const path = "export-config";
        const params = { gatewayIP };
        const responder = exportConfigResponder;

        batcherExportConfig(
          path,
          params,
          responder,
          unSelectedTableRows,
          selectedTableRows,
          setTaskStatus,
          AppOverlayContext,
        );
      },
    }),
    [AppOverlayContext, gatewayIP, handleSetModal],
  );

  let config = {
    editMode: "popup",
    allowMultipleRowSelection: true,
    // globalSearch: true,
    bulkActions: [exportBulkAction, deleteBulkAction],
  };

  const columns = [
    {
      headerName: t(
        "commons.Component.Table Content.Configuration Field.Header Name",
      ),
      dataKey: "fileName",
      minWidth: 250,
      flexWidth: 1.5,
      type: "text",
      sortable: true,
      sortComparator,
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Software Version Field.Header Name",
      ),
      dataKey: "fwVersion",
      minWidth: 150,
      flexWidth: 1,
      type: "text",
      sortable: true,
      sortComparator,
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Created Date Field.Header Name",
      ),
      dataKey: "createdDate",
      minWidth: 150,
      flexWidth: 1,
      type: "text",
      sortable: true,
      sortComparator,
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comments",
      minWidth: 200,
      flexWidth: 1.5,
      type: "multiline",
      sortable: true,
      sortComparator,
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Action Option.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      minWidth: 240 * 0.6,
      flexWidth: 0.5,
      headerAlignment: "center",
      actions: [
        {
          type: "__export",
          name: t("page.configure.Configuration.TableActionTooltip.Export"),
          handleExport,
        },
        {
          type: "__restore",
          name: t("page.configure.Configuration.TableActionTooltip.Restore"),
          handleRestore,
          //   prompt: {
          //     contentTitle: "Restore Confirmation",
          //     contentText: (
          //       <>
          //         <p>
          //           You have initiated the process of restoring this configuration.
          //           <br />
          //           <br />
          //           Click <b>Confirm</b> to restore, otherwise click <b>Cancel</b> action.
          //         </p>
          //       </>
          //     ),
          //   },
        },
        {
          type: "__delete",
          name: t("page.configure.Configuration.TableActionTooltip.Delete"),
          handleDelete,
          prompt: {
            contentTitle: t(
              "page.configure.Configuration.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.configure.Configuration.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this configuration
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-settings-configuration",
    sort: {
      column: "createdDate",
      inverse: true,
    },
    pageSize: 10,
    page: 1,
    chunk: 0,
    handleLoadMoreData: (TableRows, Subconscious, LastButton) => {
      const successCode = "SUCCESS";
      const failureCode = "FAILURE";

      const [tableRows, setTableRows] = TableRows;
      const [gridSubconscious, setGridSubconscious] = Subconscious;
      const [gotoLastButton, setGotoLastButton] = LastButton;

      const page = gridSubconscious.chunk + 1;

      callAPI({
        path: "config-list",
        params: { gatewayIP, page },
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
              contentTitle: t(
                "page.configure.Configuration.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  <Trans
                    i18nKey={
                      "page.configure.Configuration.Fetch Status.Error.Content"
                    }
                    components={[<p />]}
                  >
                    <p>Unable to fetch or load more records from server</p>
                    <p>Error Info:</p>
                  </Trans>
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

            const result = payload.map((record) => {
              record.createdDate =
                record.createdDate !== "" ? asUTC(record.createdDate) : "";
              return record;
            });

            setTableRows((oldState) => {
              const newState = [...oldState, ...result];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let dataGridRef = React.useRef();
  const initDataGridKey = subconscious.name + "-" + new Date().getTime();
  const [dataGridKey, setDataGridKey] = React.useState(initDataGridKey);
  const [gridConfig, setGridConfig] = React.useState(config);
  const [gridCols, setGridCols] = React.useState(columns);
  const [gridSubconscious, setGridSubconscious] = React.useState(subconscious);
  const [loading, setLoading] = React.useState(true);
  const [runEffect1, setRunEffect1] = React.useState("");
  const [display, setDisplay] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isReloadComponent, setIsReloadComponent] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModel = () => {
    setDisplay(true);
  };

  const markAsLoading = () => {
    setLoading(true);
  };

  React.useEffect(() => {
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

  const configListOnCompleteHandler = (response) => {
    let payload = [];

    if (response.state === "CONFIG_LIST_SUCCESS") {
      payload = response.data.map((record) => ({
        ...record,
        createdDate: record.createdDate ? asUTC(record.createdDate) : "",
      }));

      setViewConfigData(payload);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    callAPI({
      path: "config-list",
      params: { gatewayIP },
      data: {},
      responder: configListResponder,
      onComplete: configListOnCompleteHandler,
    });
  }, [gatewayIP]);

  React.useEffect(() => {
    if (isReloadComponent) {
      setLoading(true);
      callAPI({
        path: "config-list",
        params: { gatewayIP },
        data: {},
        responder: configListResponder,
        onComplete: configListOnCompleteHandler,
      });
      setIsReloadComponent(false);
    }
  }, [gatewayIP, isReloadComponent]);

  React.useEffect(() => {
    if (!loading) {
      setGridRows(viewConfigData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [loading, subconscious.name, viewConfigData]);

  React.useEffect(() => {
    if (runEffect1 === "logout-user") {
      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: (responder) => {
          setTimeout(() => {
            Auth.forcelogOut(
              { location, history },
              AppConfig,
              AppOverlayContext,
              () => dispatch(setRecentGateway({ address: gatewayIP })),
            );
          }, AppConfig.app.signOutDelay);
        },
      });

      setRunEffect1("");
    }
  }, [
    AppConfig,
    AppOverlayContext,
    dispatch,
    gatewayIP,
    history,
    isLogOutTrigger,
    location,
    runEffect1,
  ]);

  return (
    <>
      <Styled.Wrapper component={"section"}>
        <Styled.Header>
          <AppInContentHeader
            title={AppConfig.pages.set.title}
            breadcrumb={AppConfig.pages.set.breadcrumb}
          />
        </Styled.Header>

        {loading ? (
          <Styled.ActionLoading>
            <Styled.LoadingWrapper>
              <WidthFillerSkeleton height="100%" />
            </Styled.LoadingWrapper>
          </Styled.ActionLoading>
        ) : (
          <HeaderInfo moreButton disabled={loading} handleClick={handleClick} />
        )}
        <Styled.TableDivider />

        <Styled.DataGridBox>
          <Styled.TableTitleWrapper>
            <Styled.TableTitle>
              {t("page.configure.Configuration.Table Title")}
            </Styled.TableTitle>
          </Styled.TableTitleWrapper>
          <React.Suspense
            fallback={
              <Styled.SkeletonHolder>
                <WidthFillerSkeleton height="100%" />
              </Styled.SkeletonHolder>
            }
          >
            <AsyncIFVDataGrid
              ref={dataGridRef}
              key={dataGridKey}
              name={subconscious.name}
              loadingData={[loading, setLoading]}
              config={[gridConfig, setGridConfig]}
              cols={[gridCols, setGridCols]}
              subconscious={[gridSubconscious, setGridSubconscious]}
              data={[gridRows, setGridRows]}
            />
          </React.Suspense>
        </Styled.DataGridBox>
      </Styled.Wrapper>

      {prompt ? (
        <LoadingMate
          open={prompt}
          setOpen={setPrompt}
          contentText={t(
            "page.configure.Configuration.Action Options.Prompt.Delete Status Prompt.Deleted Gatway",
          )}
        />
      ) : null}

      <Styled.Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ "aria-labelledby": "fade-button" }}
        theme={{ display: true }}
        onClose={handleClose}
        onClick={handleClose}
      >
        <Styled.MenuButtonWrapper>
          <Styled.MenuButton
            id={"test"}
            onClick={() => {
              openModel();
              setRunEffect1("backupConfig");
            }}
            disabled={false}
            startIcon={<img src={backup} alt={"backup"} width={"18px"} />}
          >
            {t("page.configure.Configuration.Banner.Menu Buttons.Backup")}
          </Styled.MenuButton>
        </Styled.MenuButtonWrapper>

        <Styled.MenuButtonWrapper>
          <Styled.MenuButton
            id={"test"}
            onClick={() => {
              openModel();
              setRunEffect1("restoreConfig");
            }}
            disabled={false}
            // startIcon={<img src={restore} alt={"restore"} width={"18px"} />}
            startIcon={
              <SettingsBackupRestoreOutlinedIcon
                style={{ color: true ? "#0094fd" : "#0094fd60" }}
              />
            }
          >
            {t("page.configure.Configuration.Banner.Menu Buttons.Restore")}
          </Styled.MenuButton>
        </Styled.MenuButtonWrapper>
      </Styled.Menu>

      {runEffect1 === "backupConfig" ? (
        <BackupConfiguration
          open={display}
          setOpen={setDisplay}
          IsReloadComponentState={{ isReloadComponent, setIsReloadComponent }}
          agreeTitle={"Apply"}
          handleAgree={() => {
            setRunEffect1("");
            setDisplay(false);
          }}
          disagreeTitle={t(
            "page.configure.Configuration.BackUp Configuration Modal.Cancel Button",
          )}
          handleDisagree={() => {
            setRunEffect1("");
            setDisplay(false);
          }}
        />
      ) : null}

      {runEffect1 === "restoreConfig" ? (
        <RestoreConfiguration
          open={display}
          setOpen={setDisplay}
          disagreeTitle={t(
            "page.configure.Configuration.BackUp Configuration Modal.Cancel Button",
          )}
          agreeTitle={"Apply"}
          handleAgree={() => {
            setRunEffect1("logout-user");
            setDisplay(false);
          }}
          handleDisagree={() => {
            setRunEffect1("");
            setDisplay(false);
          }}
        />
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
    </>
  );
}

export default withRouter(withCookies(Settings));
