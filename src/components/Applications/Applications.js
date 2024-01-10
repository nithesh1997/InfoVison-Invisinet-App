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
  ApplicationAPIResponder,
  DeleteAppAPIResponder,
  PortsAPIResponder,
  SaveAppAPIResponder,
} from "../../apis/responders/applications-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/Applications.style";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const DataGridApps = (props) => {
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [gatewayAddress, setGatewayAddress] = useState(null);

  const [portsData, setPortsData] = useState([]);
  const [appsData, setAppsData] = useState([]);

  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const [allowPortsCall, setAllowPortsCall] = useState(true);

  const { t } = useTranslation();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const handleAlertDialogClose = () => {
    setAlertDialog(initialAlertDialog);
  };

  const PortsOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "PORTS_SUCESS" && response.data !== "") {
      data = response.data;
      setPortsData(data);
      setPortsLoading(false);
    }
  };

  const ApplicationsOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "Applications_SUCESS" && response.data !== "") {
      data = response.data;
      setAppsData(data);
      setAppsLoading(false);
      !allowPortsCall && setPortsLoading(false);
    }
  };

  const handleDiscard = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    let newRow = {
      name: row["name"],
      comment: row["comment"],
      ports: row["ports"],
    };

    if (row.ports !== null && typeof row.ports !== "object") {
      newRow.ports = row.ports.split(", ");
    }

    delete newRow["__isEditMode"];

    if (oldRow === undefined) {
      delete newRow["id"];
    }

    callAPI({
      path: "save-app",
      params: { gatewayIP },
      data: newRow,
      responder: SaveAppAPIResponder,
      onComplete: SaveAppOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const SaveAppOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SAVE_APP_SUCESS") {
      setAllowPortsCall(false);
      const triggerReRenderFunction =
        row.id === "_newRow"
          ? () => {
              markAsLoading();
              return;
            }
          : undefined;

      /* For Gateway */
      //   if (row.id === "_newRow") {
      //     markAsLoading();
      //     return;
      //   }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      setTaskStatus({
        inProgress: false,
        error: false,
        payload: { ...row },
        // message: `Application with name "${row.name}" saved successfully.`,
        message: t(
          "page.configure.Applications.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
        triggerReRenderFunction,
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.configure.Applications.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            >
              {t("commons.errorMessages.appError", { rowName: row.name })}
              <br />
              <br />
              {t("commons.errorMessages.errorDetails")}
              <br />
            </Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];
    delete newRow["comment"];
    delete newRow["ports"];

    callAPI({
      path: "delete-app",
      params: { gatewayIP },
      data: { ...newRow },
      responder: DeleteAppAPIResponder,
      onComplete: DeleteAppOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteAppOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_APP_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        // message: `Application with name "${row.name}" deleted successfully.`,
        message: t(
          "page.configure.Applications.Action Options.Prompt.Delete Status Prompt.Success",
          { rowName: row.name },
        ),
      });
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.configure.Applications.Action Options.Delete Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            >
              Error deleting application with name "{row.name}". Please try
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

  let config = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    addHandler: { handleSave, handleDiscard },
  };

  const columns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      minWidth: 180,
      flexWidth: 1.8,
      type: "text",
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^[A-Za-z0-9]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [_, pattern],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Alpha-Numeric Only",
              ),
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [_, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Charater Less Then Value",
              ),
            },
          ];
          const result = ValidationHelper.batchValidator(tests);

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Port Name Field.Header Name",
      ),
      dataKey: "ports",
      minWidth: 300,
      flexWidth: 3,
      type: "select-multiple",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["any"],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Port Name Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: (ports) => {
                const portsCount = ports.split(",").length;

                return !!(portsCount < 17);
              },
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Port Name Field.Validation.Errors.Limit",
              ),
            },
          ];

          const result = ValidationHelper.batchValidator(tests);

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      type: "multiline",
      minWidth: 240,
      flexWidth: 2.4,
      headerAlignment: "left",
      contentAlignment: "left",
      sortable: false,
      isDisableEdit: true,
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/[a-zA-Z]+/);
          const tests = [
            {
              runner: ValidationHelper.testMaxSize,
              args: [_, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Comment Field.Validation.Errors.Comment allow 63 or less Char",
              ),
            },
          ];
          const result = ValidationHelper.batchValidator(tests);

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t("page.configure.Applications.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      minWidth: 80,
      flexWidth: 0.8,
      headerAlignment: "center",
      actions: [
        {
          type: "__edit",
          name: "Edit Ports",
          handleEdit: (row, setTaskStatus) => {
            setTimeout(() => {
              setTaskStatus({
                inProgress: false,
                error: false,
                message: ``,
              });
            }, 500);
          },
          handleSave: (row, setTaskStatus, oldRow) => {
            const oldPorts = `${oldRow.ports}`.split(", ");
            const newPorts = `${row.ports}`.split(", ");

            const unlinkPorts = oldPorts
              .filter((oldPort) => !newPorts.includes(oldPort))
              .map((portName) => ({ portName, status: "unlinkApp" }));

            const linkPorts = newPorts
              .map((newPort) => {
                return !oldPorts.includes(newPort)
                  ? { portName: newPort, status: "linkApp" }
                  : false;
              })
              .filter((i) => i);

            const requestPayload = [...linkPorts, ...unlinkPorts];
            const result = { success: [], failure: [] };

            requestPayload.forEach(
              ({ portName: port, status: path }, index, _array) => {
                callAPI({
                  path,
                  params: { gatewayIP },
                  data: {
                    id: row.id,
                    name: row.name,
                    comment: row.comment,
                    port,
                  },
                  responder: (res, onComplete, onCompleteArgs = []) => {
                    const isGoodResponse = res.state === "GOOD_RESPONSE";
                    const is204 = res.response.code === 204;

                    const errorPayload = {
                      catchError: res?.error ?? undefined,
                      error: res?.response?.error ?? undefined,
                      errorFromJSON: res?.response?.errorFromJSON ?? undefined,
                    };

                    const state =
                      isGoodResponse && is204 ? "SUCCESS" : "FAILURE";
                    const data =
                      isGoodResponse && is204
                        ? res.response.body
                        : errorPayload;

                    onComplete({ state, data }, ...onCompleteArgs);
                  },
                  onCompleteArguments: [],
                  onComplete: (response) => {
                    if (index === _array.length - 1) {
                      if (!result.failure.length) {
                        setTaskStatus({
                          inProgress: false,
                          error: false,
                          payload: { ...row },
                          message: t(
                            "page.configure.Applications.Action Options.Prompt.Edit Prompt.Success",
                            { rowName: row.name },
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
                                  "page.configure.Applications.Action Options.Prompt.Edit Prompt.Error"
                                }
                                values={{ rowName: row.name }}
                                components={[<br />]}
                              >
                                {t("commons.errorMessages.appError", {
                                  rowName: row.name,
                                })}
                                <br />
                                <br />
                                {t("commons.errorMessages.errorDetails")}
                                <br />
                              </Trans>
                              {result.failure.map(({ port, response }) => {
                                return Utility.getErrorsFromResponse(response);
                              })}
                            </>
                          ),
                        });
                      }
                    } else {
                      response.state === "SUCCESS"
                        ? result.success.push({
                            port,
                            response,
                          })
                        : result.failure.push({
                            port,
                            response,
                          });
                    }
                  },
                });
              },
            );
          },
          handleDiscard: (newRow, setTaskStatus) => {
            setTaskStatus({
              inProgress: false,
              error: false,
              message: "",
            });
          },
        },
        {
          prompt: {
            contentTitle: t(
              "page.configure.Applications.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.configure.Applications.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this application
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t("page.configure.Applications.Action Options.Tool Tip.Delete"),
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-apps-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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
        path: "getApps",
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
                "page.configure.Applications.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  {/* <p>Unable to fetch or load more records from server</p>
                  <p>Error Info:</p> */}
                  <Trans
                    i18nKey={
                      "page.configure.Applications.Fetch Status.Error.Content"
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

            const result = Object.values(
              payload.reduce((r, a) => {
                r[a.name] = r[a.name] || {
                  id: a.id,
                  name: a.name,
                  ports: "",
                  comment: a.comment,
                };
                r[a.name].ports =
                  r[a.name].ports === ""
                    ? a.portDef.name
                    : r[a.name].ports + ", " + a.portDef.name;
                return r;
              }, {}),
            );

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
  let [portsloading, setPortsLoading] = useState(true);
  let [appsloading, setAppsLoading] = useState(true);
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [gridRows, setGridRows] = useState([]);
  let [loading, setLoading] = useState(true);

  const markAsLoading = () => {
    setLoading(true);
    setAppsLoading(true);
    setPortsLoading(true);
    // setPortsData([]);
    setAppsData([]);
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
      markAsLoading();
      setGatewayAddress(null);
      return;
    }
    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;
    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      appsloading === true &&
      portsloading === true &&
      loading === true
    ) {
      if (allowPortsCall) {
        callAPI({
          path: "getPorts",
          params: {
            gatewayIP: gatewayAddress,
            offset: 0,
            limit: 1000,
          },
          data: {},
          responder: PortsAPIResponder,
          onComplete: PortsOnCompleteHandler,
        });
      }

      callAPI({
        path: "getApps",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ApplicationAPIResponder,
        onComplete: ApplicationsOnCompleteHandler,
      });
    }
  }, [gatewayAddress, appsloading, portsloading, loading, allowPortsCall]);

  useEffect(() => {
    if (!portsloading && !appsloading) {
      let aggApps = Object.values(
        appsData.reduce((r, a) => {
          r[a.name] = r[a.name] || {
            id: a.id,
            name: a.name,
            ports: "",
            comment: a.comment,
          };
          // todo:
          // r[a.name].ports = [...r[a.name].ports, a.portDef.name];
          r[a.name].ports =
            r[a.name].ports === ""
              ? a.portDef.name
              : r[a.name].ports + ", " + a.portDef.name;
          return r;
        }, {}),
      );

      let allPorts = [...new Set([...portsData.map((app) => app.name)])];

      let dynamicOptionFilledColumns = columns.map((col) => {
        let newCol = { ...col };
        if (newCol.dataKey === "ports") {
          newCol.options = allPorts;
        }
        return newCol;
      });

      setGridCols(dynamicOptionFilledColumns);
      setGridRows(aggApps);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [portsloading, appsloading]);

  return (
    <Styled.StyledContainer component={"section"}>
      <Styled.Header>
        <AppInContentHeader
          title={AppConfig.pages.apm.title}
          breadcrumb={AppConfig.pages.apm.breadcrumb}
        />
      </Styled.Header>
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
            name={subconscious.name}
            key={dataGridKey}
            loadingData={[loading, setLoading]}
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

export default withRouter(withCookies(DataGridApps));
