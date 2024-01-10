import React, { useEffect, useRef } from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import Styled from "./MaterialComponents/ConfirationLogs.style";
import { useContext } from "react";
import Config from "../../Config";
import { Suspense } from "react";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import {
  ViewConfigLogsAPIResponder,
  DeleteGatewayConfigLogsResponder,
} from "../../apis/responders/viewConfigurationLogs-api-responder";
import { useSelector } from "react-redux";
import OverlayContext from "../AppContent/AppOverlayContext";
import { useState } from "react";
import Utility from "../../redux/actions/Utility";
import callAPI from "../../apis/callAPI";
import HeaderInfo from "../Settings/HeaderInfo";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

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

const ConfigurationLogs = () => {
  const AppConfig = useContext(Config);
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const AppOverlayContext = useContext(OverlayContext);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [gridRows, setGridRows] = useState([]);
  const [alertDialog, setAlertDialog] = useState(false);
  const [viewConfigLogData, setViewConfigLogData] = useState([]);

  const { t } = useTranslation();
  const {
    name: gatewayName,
    firmwareVersion: firmVersion,
    fqdn: gatewayfqdn,
  } = useSelector((state) => state.gateway);

  const ViewConfigOnCompleteHandler = (response) => {
    let payload = [];

    if (response.state === "VIEW_CONFIG_LOGS_SUCCESS") {
      payload = response.data.map((record) => ({
        ...record,
        fileName: record.fileName === "" ? "-" : record.fileName,
        restoredDate: record.restoredDate ? asUTC(record.restoredDate) : "",
      }));

      setViewConfigLogData(payload);
      setLoading(false);
    }
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };
    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "deleteGatewayConfigLogs",
      params: { gatewayIP },
      data: { id: newRow.id },
      responder: DeleteGatewayConfigLogsResponder,
      onComplete: DeleteViewConfigLogsCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteViewConfigLogsCompleteHandler = (
    response,
    row,
    setTaskStatus,
  ) => {
    if (response.state === "DELETE_GATEWAY_CONFIG_LOGS_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: `${common.GATEWAY} configuration log "${row.fileName}" deleted successfully.`,
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            {t("commons.errorMessages.errorDeletingConfiguration", {
              fileName: row.fileName,
              GATEWAY: common.GATEWAY,
            })}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  let config = {
    editMode: "inline",
  };

  const columns = [
    {
      headerName: t("commons.Component.Table Content.Action Field.Header Name"),
      dataKey: "action",
      minWidth: 250,
      flexWidth: 1.5,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.File Name Field.Header Name",
      ),
      dataKey: "fileName",
      minWidth: 250,
      flexWidth: 1.5,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Date & Time Field.Header Name",
      ),
      dataKey: "restoredDate",
      minWidth: 150,
      flexWidth: 1,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comments",
      minWidth: 150,
      flexWidth: 2,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valB.toLowerCase() > valA.toLowerCase()) return 1;
        if (valB.toLowerCase() < valA.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return false;
      },
    },
    {
      hideColumn: true,
      headerName: t(
        "commons.Component.Table Content.Action Option.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      headerAlignment: "center",
      minWidth: 0,
      flexWidth: 0,
      actions: [],
    },
  ];

  let subconscious = {
    name: "ba-view-config-logs",
    sort: {
      column: "restoredDate",
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
        path: "config-logs",
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

            const result = payload.map((record) => {
              record.restoredDate = record.restoredDate
                ? asUTC(record.restoredDate)
                : "";

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

  let dataGridRef = useRef();
  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  );
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [loading, setLoading] = useState(true);
  let [viewConfig, setViewConfig] = useState([]);

  const markAsLoading = () => {
    setLoading(true);
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
    callAPI({
      path: "config-logs",
      params: { gatewayIP },
      data: {},
      responder: ViewConfigLogsAPIResponder,
      onComplete: ViewConfigOnCompleteHandler,
    });
  }, [gatewayIP]);

  useEffect(() => {
    if (!loading) {
      setGridRows(viewConfigLogData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [loading, subconscious.name, viewConfigLogData]);

  return (
    <Styled.Container component={"section"}>
      <Styled.Header>
        <AppInContentHeader
          title={AppConfig.pages.con.title}
          breadcrumb={AppConfig.pages.con.breadcrumb}
        />
      </Styled.Header>
      {loading ? (
        <Styled.ActionLoading>
          <Styled.LoadingWrapper>
            <WidthFillerSkeleton height="100%" />
          </Styled.LoadingWrapper>
        </Styled.ActionLoading>
      ) : (
        <HeaderInfo />
      )}
      <Styled.DataGridBox>
        <Suspense
          fallback={
            <Styled.SkeletonHolder>
              <WidthFillerSkeleton height="100%" />
            </Styled.SkeletonHolder>
          }
        >
          <Styled.TableTitleWrapper>
            <Styled.DataGridBoxTitle>
              {t("page.configure.ConfiguratioLogs.TableTitle")}
            </Styled.DataGridBoxTitle>
          </Styled.TableTitleWrapper>
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
        </Suspense>
      </Styled.DataGridBox>
    </Styled.Container>
  );
};

export default withRouter(withCookies(ConfigurationLogs));
