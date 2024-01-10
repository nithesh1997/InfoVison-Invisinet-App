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
import { ApplicationAPIResponder } from "../../apis/responders/applications-api-responder";
import {
  DelUnProResrcAPIResponder,
  SaveUnProResrcAPIResponder,
  UnProResourceAPIResponder,
} from "../../apis/responders/resources-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/ResourceManagement.style";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));
const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const DataGridUnProResource = (props) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  let [gridRows, setGridRows] = useState([]);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);

    // setTimeout(() => {
    //   callback();
    // }, 1000);
  };

  const UResourceOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "UnProResource_SUCESS" && response.data !== "") {
      data = response.data;
      setUResourceData(data);
      setuResourceLoading(false);
    }
  };

  const ApplicationsOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "Applications_SUCESS" && response.data !== "") {
      data = response.data;
      setAppsData(data);
      setAppsLoading(false);
    }
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    let newRow = {
      id: row["id"],
      name: row["name"],
      comment: row["comment"],
      app: row["app"],
      ip: row["ip"],
    };

    delete newRow["__isEditMode"];

    if (oldRow === undefined) {
      delete newRow["id"];
    }

    if (newRow["id"] === "_newRow") {
      delete newRow["id"];
    }

    callAPI({
      path: "save-uresource",
      params: { gatewayIP },
      data: newRow,
      responder: SaveUnProResrcAPIResponder,
      onComplete: SaveUnProResrcOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const SaveUnProResrcOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SaveUnProResrc_SUCESS") {
      /* For Gateway */
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row },
        message: t(
          "page.manage.Unprotected Resources.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            {/* Error saving resource with name "{row.name}". Please try again.
            <br />
            <br />
            Details:
            <br /> */}
            <Trans
              i18nKey={
                "page.manage.Unprotected Resources.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
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

  const handleEdit = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };
    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "delete-uresource",
      params: { gatewayIP },
      data: newRow,
      responder: DelUnProResrcAPIResponder,
      onComplete: DelUnProResrcOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DelUnProResrcOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DelUnProResrc_SUCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.manage.Unprotected Resources.Action Options.Prompt.Delete Status Prompt.Success",
          { rowName: row.name },
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
                "page.manage.Unprotected Resources.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
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

  const uRescolumns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      minWidth: 200,
      flexWidth: 2,
      type: "text",
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event.type === "blur") {
          let data = "";
          const value1 = row.name;
          const regex2 = new RegExp(/^[A-Za-z0-9/]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value1, regex2],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Alpha-Numeric Only",
              ),
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value1, 4],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Char Atleast Should Be",
              ),
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value1, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Charater Less Then Value",
              ),
            },
          ];

          data = ValidationHelper.batchValidator(tests1);

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
        "commons.Component.Table Content.IP Address/Prefix Field.Header Name",
      ),
      dataKey: "ip",
      minWidth: 150,
      flexWidth: 1.1,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        valA = valA.split(".");
        valB = valB.split(".");
        for (var i = 0; i < valA.length; i++) {
          if ((valA[i] = parseInt(valA[i])) < (valB[i] = parseInt(valB[i])))
            return -1;
          else if (valA[i] > valB[i]) return 1;
        }
        return 0;
      },
      // sortComparator: (valA, valB, rowA, rowB) => {
      //   const num1 = Number(valA.split('.').map((subString) => (`00${subString}`).slice(-3)).join(''));
      //   const num2 = Number(valB.split('.').map((subString) => (`00${subString}`).slice(-3)).join(''));
      //   return num1 - num2;
      // },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const value = event.target.value;
          let check = value.includes(":");
          const valid = { isValid: true, message: `` };

          const required = {
            isValid: false,
            message: t(
              "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Mandatory",
            ),
          };

          const inValidAddress = {
            isValid: false,
            message: t(
              "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Incorrect",
            ),
          };

          const inValidPrefix = {
            isValid: false,
            message: check
              ? t(
                  "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Invalid Prefix 48 and 128",
                )
              : t(
                  "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Invalid Prefix 8 through 32",
                ),
          };

          const inValidSlashes = {
            isValid: false,
            message: t(
              "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Ip Address Incorrect",
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
              (isNaN(prefix) || parseInt(prefix) > 32 || parseInt(prefix) < 8);
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
              // if (lastIncludes) {
              //   return inValidAddress;
              // }
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
      headerName: t("commons.Component.Table Content.App Field.Header Name"),
      dataKey: "app",
      minWidth: 200,
      flexWidth: 1,
      type: "select-single",
      sortable: true,
      options: [],
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          let data = "";
          const tests1 = [];

          data = ValidationHelper.batchValidator(tests1);

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
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      minWidth: 200,
      flexWidth: 1.4,
      type: "multiline",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
          const value = row.comment;

          const tests = [
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Comment Field.Validation.Errors.Comment allow 63 or less Char",
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
        "page.manage.Unprotected Resources.Action Options.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      // minWidth: 80,
      // flexWidth: 0.8,
      minWidth: 240 * 0.6,
      flexWidth: 0.6,
      headerAlignment: "center",
      actions: [
        {
          type: "__edit",
          name: "Edit Resource",
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
        {
          prompt: {
            contentTitle: t(
              "page.manage.Unprotected Resources.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <>
                <Trans
                  i18nKey={
                    "page.manage.Unprotected Resources.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                  }
                  components={[<br />, <b />]}
                >
                  You have initiated the process of deleting this unprotected
                  resource.
                  <br />
                  <br />
                  Click <b>Confirm</b> to delete, otherwise click
                  <b>Cancel</b>.
                </Trans>
              </>
            ),
          },
          type: "__delete",
          name: t(
            "page.manage.Unprotected Resources.Action Options.Tool Tip.Delete",
          ),
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-uresource-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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
        path: "uresources",
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
                "page.manage.Unprotected Resources.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  {/* <p>Unable to fetch or load more records from server</p>
                  <p>Error Info:</p> */}
                  <Trans
                    i18nKey={
                      "page.manage.Unprotected Resources.Fetch Status.Error.Content"
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
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(uRescolumns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [loading, setLoading] = useState(true);
  let [appsloading, setAppsLoading] = useState(true);
  let [appsData, setAppsData] = useState([]);
  let [uResourceloading, setuResourceLoading] = useState(true);
  let [uResourceData, setUResourceData] = useState([]);
  const markAsLoading = () => {
    setuResourceLoading(true);
    setAppsLoading(true);
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
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      appsloading === true &&
      uResourceloading === true
    ) {
      callAPI({
        path: "getApps",
        params: { gatewayIP },
        data: {},
        responder: ApplicationAPIResponder,
        onComplete: ApplicationsOnCompleteHandler,
      });

      callAPI({
        path: "uresources",
        params: { gatewayIP },
        data: {},
        responder: UnProResourceAPIResponder,
        onComplete: UResourceOnCompleteHandler,
      });
    }
  }, [gatewayAddress, appsloading, uResourceloading]);

  useEffect(() => {
    if (!appsloading && !uResourceloading) {
      let allApps = [...new Set([...appsData.map((app) => app.name)])];

      let dynamicOptionFilledColumns = uRescolumns.map((col) => {
        let newCol = { ...col };
        if (newCol.dataKey === "app") {
          newCol.options = allApps;
        }
        return newCol;
      });

      setGridCols(dynamicOptionFilledColumns);
      setGridRows(uResourceData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [appsloading, uResourceloading]);

  return (
    <Styled.StyledContainer component={"section"}>
      <Styled.Header>
        <AppInContentHeader
          title={AppConfig.pages.urs.title}
          breadcrumb={AppConfig.pages.urs.breadcrumb}
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
            key={dataGridKey}
            name={subconscious.name}
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

export default withRouter(withCookies(DataGridUnProResource));
