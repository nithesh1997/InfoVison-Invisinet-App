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
  DelProResrcAPIResponder,
  ProResourceAPIResponder,
  SaveProResrcAPIResponder,
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

const DataGridProResource = (props) => {
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = useState(null);

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const [prgridRows, prsetGridRows] = useState([]);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const ProResourceOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "ProResource_SUCESS" && response.data !== "") {
      data = response.data;

      data.forEach(($) => {
        if (!!!$.ip.includes("/")) {
          const isIPv4 = $.ip.includes(".");
          const isIPv6 = $.ip.includes(":");

          $.ip = `${$.ip}${isIPv4 ? "/32" : isIPv6 ? "/128" : null}`;

          return $;
        } else {
          return $;
        }
      });

      setProResourceData(data);
      prRessetLoading(false);
    }
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    let prefix = row["ip"] != null ? row["ip"].split("/") : "";
    // let prefix = row["ip"].split("/") || "";

    let newRow = {
      id: row["id"],
      name: row["name"],
      ip: row["ip"],
      //prefix: prefix[1],
      comment: row["comment"],
    };

    if (prefix[1] === undefined) delete newRow["prefix"];
    // if (!!!prefix[1]) delete newRow["prefix"];

    delete newRow["__isEditMode"];

    if (row["id"] === "_newRow") {
      delete newRow["id"];
    }

    callAPI({
      path: "save-resource",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
      },
      data: newRow,
      responder: SaveProResrcAPIResponder,
      onComplete: SaveProResrcOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const SaveProResrcOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SaveProResrc_SUCESS") {
      /* For Gateway */
      //  if (isAddOperation) {
      //    markAsLoading();
      //    return;
      //  }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      if (!!!row.ip.includes("/")) {
        const isIPv4 = row.ip.includes(".");
        const isIPv6 = row.ip.includes(":");
        row.ip = `${row.ip}${isIPv4 ? "/32" : isIPv6 ? "/128" : null}`;
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row },
        message: t(
          "page.manage.Protected Resourses.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        payload: {},
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Protected Resourses.Action Options.Prompt.Saved Status Prompt.Error"
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
      path: "delete-resource",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
      },
      data: newRow,
      responder: DelProResrcAPIResponder,
      onComplete: DelProResrcOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DelProResrcOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DelProResrc_SUCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.manage.Protected Resourses.Action Options.Prompt.Delete Status Prompt.Success",
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
                "page.manage.Protected Resourses.Action Options.Prompt.Delete Status Prompt.Error"
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

  let prconfig = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    addHandler: { handleSave, handleDiscard },
  };

  const proRescolumns = [
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
        "commons.Component.Table Content.IP Address/Prefix Field.Header Name",
      ),
      dataKey: "ip",
      minWidth: 200,
      flexWidth: 1.8,
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
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      minWidth: 200,
      flexWidth: 1.6,
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
        "page.manage.Protected Resourses.Action Options.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      filterable: false,
      // minWidth: 80,
      // flexWidth: 0.8,
      minWidth: 240 * 0.6,
      flexWidth: 0.6,
      headerAlignment: "center",
      actions: [
        {
          type: "__edit",
          name: t(
            "page.manage.Protected Resourses.Action Options.Tool Tip.Edit",
          ),
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
        {
          prompt: {
            contentTitle: t(
              "page.manage.Protected Resourses.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.manage.Protected Resourses.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this resource
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t(
            "page.manage.Protected Resourses.Action Options.Tool Tip.Delete",
          ),
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  let prsubconscious = {
    name: "ba-proresource-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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
        path: "resources",
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

            setTableRows((oldState) => {
              const newState = [...oldState, ...payload];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let prdataGridRef = useRef();
  let [prdataGridKey, prsetDataGridKey] = useState(
    prsubconscious.name + "-" + new Date().getTime(),
  ); // A key needs to be passed mandatorily to the grid
  let [prgridConfig, prsetGridConfig] = useState(prconfig);
  let [prgridCols, prsetGridCols] = useState(proRescolumns);
  let [prgridSubconscious, prsetGridSubconscious] = useState(prsubconscious);
  let [prloading, prsetLoading] = useState(true);
  let [prResloading, prRessetLoading] = useState(true);
  let [proResourceData, setProResourceData] = useState([]);

  const markAsLoading = () => {
    prsetLoading(true);
    prRessetLoading(true);
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
    if (typeof gatewayAddress === "string" && prResloading === true) {
      callAPI({
        path: "resources",
        params: { gatewayIP: gatewayAddress },
        data: {},
        responder: ProResourceAPIResponder,
        onComplete: ProResourceOnCompleteHandler,
      });
    }
  }, [gatewayAddress, prResloading]);

  useEffect(() => {
    if (!prResloading) {
      prsetGridRows(proResourceData);
      prsetLoading(false);
      prsetDataGridKey(prsubconscious.name + "-" + new Date().getTime());
    }
  }, [prResloading, proResourceData, prsubconscious.name]);

  return (
    <Styled.StyledContainer component={"section"}>
      <Styled.Header>
        <AppInContentHeader
          title={AppConfig.pages.prs.title}
          breadcrumb={AppConfig.pages.prs.breadcrumb}
        />
      </Styled.Header>

      <Styled.StyledDataGridBox>
        <Suspense
          fallback={
            <Styled.StyledSkeletonHolder>
              <WidthFillerSkeleton height={"100%"} />
            </Styled.StyledSkeletonHolder>
          }
        >
          <AsyncIFVDataGrid
            ref={prdataGridRef}
            key={prdataGridKey}
            name={prsubconscious.name}
            loadingData={[prloading, prsetLoading]}
            config={[prgridConfig, prsetGridConfig]}
            cols={[prgridCols, prsetGridCols]}
            subconscious={[prgridSubconscious, prsetGridSubconscious]}
            data={[prgridRows, prsetGridRows]}
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

export default withRouter(withCookies(DataGridProResource));
