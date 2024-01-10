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
import { DeleteTaskAPIResponder } from "../../apis/responders/detele-task-status-api-responder";
import { TodoTasksAPIResponder } from "../../apis/responders/todotasks-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { Styled } from "./MaterialComponents/TodotaskStyle";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const asUTC = (param) => {
  if (param) {
    const cdate = new Date(param);
    const hours = cdate.getHours();
    const minutes = cdate.getMinutes();
    const seconds = cdate.getSeconds();
    const day = cdate.getDate();
    const month =
      cdate.getMonth() <= 11 ? cdate.getMonth() + 1 : cdate.getMonth();
    const year = cdate.getFullYear();

    const fullTime = `${`${hours}`.length > 1 ? `${hours}` : `0${hours}`}:${
      `${minutes}`.length > 1 ? `${minutes}` : `0${minutes}`
    }:${`${seconds}`.length > 1 ? `${seconds}` : `0${seconds}`}`;

    const fullDate = `${`${month}`.length > 1 ? `${month}` : `0${month}`}/${
      `${day}`.length > 1 ? `${day}` : `0${day}`
    }/${`${year}`.length > 1 ? `${year}` : `0${year}`}`;

    return `${fullDate} ${fullTime}`;
  } else return param;
};

const DataGridTaskStatusList = (props) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [gridRows, setGridRows] = useState([]);
  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const TaskListOnCompleteHandler = (response, row) => {
    let data = [];
    if (response.state === "TaskList_SUCCESS" && response.data !== "") {
      data = response.data;
      let taskStatus = data.map((row) => {
        row.task_creation_date =
          row.task_creation_date !== "" ? asUTC(row.task_creation_date) : "";
        row.task_comments = row.task_comments ?? "";
        return row;
      });

      setTasksData(taskStatus);
      tssetLoading(false);
    } else {
      // setAlertDialog({
      //   open: true,
      //   contentTitle: "Error Fetching Task Status",
      //   contentText: Utility.getErrorsFromResponse(response),
      // });
    }
  };

  const handleDelete = (row, setTaskStatus, id) => {
    let newRow = { ...row };

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "deletetask",
      params: { gatewayIP },
      data: { ids: [newRow.id] },
      responder: DeleteTaskAPIResponder,
      onComplete: DeleteTaskStatusOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteTaskStatusOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DeleteTask_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        message: t(
          "page.Endpoint.Task Status.Action Options.Prompt.Delete Status Prompt.Success",
          { taskStatus: row.task_status, ENDPOINT: common.ENDPOINT },
        ),
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.Endpoint.Task Status.Action Options.Prompt.Delete Status Prompt.Error"
              }
              components={[<br />, <b />]}
              values={{
                taskStatus: row.task_status,
                ENDPOINT: common.ENDPOINT,
              }}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  let tsconfig = { editMode: "inline" };

  const tsColumns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "endpoint_name",
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
        return true;
      },
    },
    /* {
      headerName: "Serial",
      dataKey: "endpoint_name",
      minWidth: 200,
      flexWidth: 1.6,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        return (valA, valB) => valA > valB;
      },
      inputValidator: (event, row) => {
        return true;
      },
      renderViewState: (columns, row, value) => {
        return row.endpoint_name !== "" ? row.endpoint_name.split("_")[1] : "";
      },
    },*/
    {
      headerName: t(
        "commons.Component.Table Content.Task Type Field.Header Name",
      ),
      dataKey: "task_name",
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
      headerName: t("commons.Component.Table Content.Status Field.Header Name"),
      dataKey: "task_status",
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
        "commons.Component.Table Content.Created Date Field.Header Name",
      ),
      dataKey: "task_creation_date",
      minWidth: 180,
      flexWidth: 1,
      type: "date",
      sortable: true,
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "task_comments",
      minWidth: 150,
      flexWidth: 1,
      type: "multiline",
      sortable: true,
      inputValidator: (event, row) => {
        return true;
      },
    },
    {
      headerName: t("page.Endpoint.Task Status.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      // minWidth: 80,
      // flexWidth: 0.8,
      minWidth: 200 * 0.6,
      flexWidth: 0.6,
      headerAlignment: "center",
      actions: [
        {
          prompt: {
            contentTitle: t(
              "page.Endpoint.Task Status.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.Endpoint.Task Status.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this task
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t("page.Endpoint.Task Status.Action Options.Tool Tip.Delete"),
          isEnabled: (row) => {
            const createdOn = new Date(row.task_creation_date).getTime();
            const now = new Date();
            const UtcNow = new Date(
              `${now.getUTCFullYear()}-${
                now.getUTCMonth() + 1
              }-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`,
            );
            const difference = !!(UtcNow - createdOn)
              ? ((UtcNow - createdOn) / (1000 * 60)).toFixed()
              : 0;

            return row.task_status.toLowerCase() === "completed"
              ? false
              : row.task_status.toLowerCase() === "in progress" &&
                difference >= 30
              ? false
              : true;
          },
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-taskList-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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

      callAPI({
        path: "getAllTaskStatus",
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
                "page.Endpoint.Task Status.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  <Trans
                    i18nKey={
                      "page.Endpoint.Task Status.Fetch Status.Error.Content"
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

            setTableRows((oldState) => {
              const newState = [...oldState, ...payload];
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
  let [gridConfig, setGridConfig] = useState(tsconfig);
  let [gridCols, setGridCols] = useState(tsColumns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [tsloading, tssetLoading] = useState(true);
  let [tasksData, setTasksData] = useState([]);

  const markAsLoading = () => {
    tssetLoading(true);
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
    if (typeof gatewayAddress === "string" && tsloading === true) {
      callAPI({
        path: "getAllTaskStatus",
        params: { gatewayIP },
        data: {},
        responder: TodoTasksAPIResponder,
        onComplete: TaskListOnCompleteHandler,
      });
    }
  }, [gatewayAddress, tsloading]);

  useEffect(() => {
    if (!tsloading) {
      setGridRows(tasksData);
      tssetLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [tsloading]);

  return (
    <Styled.StyledContainer component={"section"}>
      <AppInContentHeader
        title={AppConfig.pages.tsk.title}
        breadcrumb={AppConfig.pages.tsk.breadcrumb}
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
            loadingData={[tsloading, tssetLoading]}
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
  );
};

export default withRouter(withCookies(DataGridTaskStatusList));
