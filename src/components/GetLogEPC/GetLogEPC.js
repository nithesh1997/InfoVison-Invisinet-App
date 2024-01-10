import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import callAPI from "../../apis/callAPI";
import {
  deletefetchlogResponder,
  EndpointsConfigAPIResponder,
  FetchLogAPIResponder,
  DownloadLogAPIResponder,
} from "../../apis/responders/endpoints-config-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { Styled } from "./MaterialComponents/getLogEpcStyle";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const asDateTime = (param) => {
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

const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const DataGridGetLogEPC = (props) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [gridRows, setGridRows] = useState([]);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const [endpointsData, setEndpointsData] = useState([]);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const EndpointsConfigOnCompleteHandler = (response) => {
    const payload = response.data;

    if (response.state === "ENDPOINTS_SUCESS") {
      setEndpointsData(payload);

      callAPI({
        path: "fetch-log",
        params: { gatewayIP, endpointId: 0 },
        data: {},
        responder: FetchLogAPIResponder,
        onComplete: GetLogOnCompleteHandler,
      });
    } else {
      // setAlertDialog({
      //   open: true,
      //   contentTitle: "Error Fetching Endpoint IDs",
      //   contentText: Utility.getErrorsFromResponse(response),
      // });
    }
  };

  const GetLogOnCompleteHandler = (response, row) => {
    let data = [];
    if (response.state === "FETCH_LOG_SUCCESS") {
      data = response.data;
      let logFiles = data.map((row) => {
        row.id = row.l_ID;

        row.name =
          row.fileName !== ""
            ? row.fileName.split("_")[0] + row.fileName.split("_")[1]
            : "";

        row.startLog =
          row.fileName !== "" ? asDateTime(row.fileName.split("_")[2]) : "";

        row.endLog =
          row.fileName !== "" ? asDateTime(row.fileName.split("_")[3]) : "";

        row.delDate = row.delDate !== "" ? asUTC(row.delDate) : "";
        return row;
      });
      setGetLogData(logFiles);
      setLogLoading(false);
    }
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };
    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "deleteFetch",
      params: { gatewayIP },
      data: { l_ID: newRow.l_ID },
      responder: deletefetchlogResponder,
      onComplete: DeleteLogFileOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteLogFileOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_LOG_SUCCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.Endpoint.Log Files.Action Options.Prompt.Delete Status Prompt.Success",
          { fileName: row.fileName },
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
                "page.Endpoint.Log Files.Action Options.Prompt.Delete Status Prompt.Error"
              }
              components={[<br />]}
              values={{ fileName: row.fileName }}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  const handleDownloadLog = (row, setTaskStatus) => {
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
            setAlertDialog({
              open: true,
              contentTitle: "Error",
              contentText: (
                <>
                  <Trans
                    i18nKey={
                      "page.Endpoint.Log Files.Action Options.Prompt.Download Status Prompt.Errors.Invalid Response"
                    }
                    components={[<p />, <br />]}
                  ></Trans>
                </>
              ),
            });
          }
        } else {
          setAlertDialog({
            open: true,
            contentTitle: "Error",
            contentText: (
              <>
                <Trans
                  i18nKey={
                    "page.Endpoint.Log Files.Action Options.Prompt.Download Status Prompt.Errors.Error Details"
                  }
                  components={[<p />, <br />]}
                ></Trans>
                {Utility.getErrorsFromResponse(response, true)}
              </>
            ),
          });
        }
        setTimeout(() => {
          setTaskStatus({
            inProgress: false,
            error: false,
            payload: { ...row },
            message: ``,
          });
          setIsDownloading(false);
        }, 500);
      },
      onCompleteArguments: [row.fileName],
    });
  };

  let logconfig = {
    editMode: "inline",
  };

  const logColumns = [
    {
      headerName: t(
        "commons.Component.Table Content.Endpoint Name Field.Header Name",
        { ENDPOINT: common.ENDPOINT },
      ),
      dataKey: "client_ID",
      minWidth: 250,
      flexWidth: 1.5,
      type: "text",
      sortable: true,
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Log File Name Field.Header Name",
      ),
      dataKey: "name",
      minWidth: 150,
      flexWidth: 1,
      type: "text",
      sortable: true,
      // sortComparator: (valA, valB, rowA, rowB) => {
      //     if (valA.toLowerCase() > valB.toLowerCase()) return 1;
      //     if (valA.toLowerCase() < valB.toLowerCase()) return -1;
      //     return 0;
      // },
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Log Start Date Field.Header Name",
      ),
      dataKey: "startLog",
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
        return true;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Log End Date Field.Header Name",
      ),
      dataKey: "endLog",
      minWidth: 150,
      flexWidth: 1,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valB.toLowerCase() > valA.toLowerCase()) return 1;
        if (valB.toLowerCase() < valA.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Log Delete Date Field.Header Name",
      ),
      dataKey: "delDate",
      minWidth: 150,
      flexWidth: 1,
      type: "date",
      sortable: true,
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t("page.Endpoint.Log Files.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      // minWidth: 80,
      // flexWidth: 0.8,
      minWidth: 240 * 0.6,
      flexWidth: 0.5,
      headerAlignment: "center",
      actions: [
        {
          prompt: {
            contentTitle: t(
              "page.Endpoint.Log Files.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.Endpoint.Log Files.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this log file.
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t("page.Endpoint.Log Files.Action Options.Tool Tip.Delete"),
          handleDelete: handleDelete,
        },
        {
          type: "__view",
          colorState: "#018ff6",
          icon: <DownloadForOfflineRoundedIcon />,
          name: t("page.Endpoint.Log Files.Action Options.Tool Tip.Download"),
          handleView: handleDownloadLog,
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-logFiles-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
    sort: {
      column: "name", // Can be a string, a valid dataKey of one of the defined columns; Default: dataKey of first column
      inverse: false, // Boolean, determines
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
      const endpointId = endpointsData.id;
      callAPI({
        path: "fetch-log",
        params: { gatewayIP, endpointId: 0, page },
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
                "page.Endpoint.Log Files.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  <Trans
                    i18nKey={
                      "page.Endpoint.Log Files.Fetch Status.Error.Content"
                    }
                    components={[<p />]}
                  ></Trans>
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
              record.name =
                record.fileName !== ""
                  ? record.fileName.split("_")[0] +
                    record.fileName.split("_")[1]
                  : "";

              record.startLog =
                record.fileName !== ""
                  ? asDateTime(record.fileName.split("_")[2])
                  : "";

              record.endLog =
                record.fileName !== ""
                  ? asDateTime(record.fileName.split("_")[3])
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
  ); // A key needs to be passed mandatorily to the grid
  let [gridConfig, setGridConfig] = useState(logconfig);
  let [gridCols, setGridCols] = useState(logColumns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [logloading, setLogLoading] = useState(true);
  let [getLogData, setGetLogData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const markAsLoading = () => {
    setLogLoading(true);
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
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    callAPI({
      path: "endpoints",
      params: { gatewayIP },
      data: {},
      responder: EndpointsConfigAPIResponder,
      onComplete: EndpointsConfigOnCompleteHandler,
    });
  }, []);

  useEffect(() => {
    if (!logloading) {
      setGridRows(getLogData);
      setLogLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [logloading]);

  return (
    <>
      <Styled.StyledContainer component={"section"}>
        {/* <StyledContentContainer component={"section"}> */}
        <AppInContentHeader
          title={AppConfig.pages.lgf.title}
          breadcrumb={AppConfig.pages.lgf.breadcrumb}
        />

        <Styled.StyledDataGridBox>
          <Suspense
            fallback={
              <Styled.StyledSkeletonHolder>
                <WidthFillerSkeleton height="100%" />
              </Styled.StyledSkeletonHolder>
            }
          >
            <AsyncIFVDataGrid
              ref={dataGridRef}
              key={dataGridKey}
              name={subconscious.name}
              loadingData={[logloading, setLogLoading]}
              config={[gridConfig, setGridConfig]}
              cols={[gridCols, setGridCols]}
              subconscious={[gridSubconscious, setGridSubconscious]}
              data={[gridRows, setGridRows]}
            />
          </Suspense>
        </Styled.StyledDataGridBox>

        <AlertDialog
          open={alertDialog.open}
          contentTitle={alertDialog.contentTitle}
          contentText={alertDialog.contentText}
          agreeTitle={t("commons.okayText")}
          handleAgree={handleAlertDialogClose}
          handleDisagree={handleAlertDialogClose}
          divider={false}
        />
      </Styled.StyledContainer>
    </>
  );
};

export default withRouter(withCookies(DataGridGetLogEPC));
