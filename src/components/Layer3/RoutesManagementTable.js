import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import callAPI from "../../apis/callAPI";
import { AddRouteAPIResponder } from "../../apis/responders/addRoute-api-responder";
import { DeleteRouteAPIResponder } from "../../apis/responders/deleteRoute-api-responder";
import { ROUTESAPIResponder } from "../../apis/responders/getRouters-api-responder";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/RoutesManagementTable.style";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));
const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const RoutesManagementTable = ({ loading, setLoading }) => {
  const dataGridRef = useRef();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  let AppOverlayContext = useContext(OverlayContext);

  const [gridRows, setGridRows] = useState([]);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  let columns = [
    {
      headerName: t(
        "commons.Component.Table Content.IP Address/Prefix Field.Header Name",
      ),
      dataKey: "ip",
      type: "text",
      minWidth: 300,
      flexWidth: 3,
      sortable: true,
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
              "commons.Component.Table Content.IP Address/Prefix Field.Validation.Errors.Incorrect",
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
            const prefixRegex = new RegExp(/^\d{1,2}$/);

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
      // inputValidator: (event, row) => {
      //   if (event.type === "blur") {
      //     let value = row.ip;
      //     let tests = [
      //       {
      //         runner: ValidationHelper.isNotEmpty,
      //         args: [value],
      //         success: "",
      //         error: "IP Address/Prefix is a mandatory field.",
      //       },
      //       // {
      //       //   runner: ValidationHelper.testRegex,
      //       //   args: [check[0], IPv4Pattern],
      //       //   success: "",
      //       //   error: "Provided IP address is incorrect.",
      //       // },
      //     ];
      //     let valid = {
      //       isValid: false,
      //       message: "Provided IP address is incorrect.",
      //     };
      //     let check = value.split("/");

      //     const IPv4Pattern = new RegExp(
      //       /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
      //     );
      //     // const IPv6Pattern = new RegExp(
      //     //   /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/
      //     // );
      //     const prefix = value.split("/")[1];
      //     const isPrefix =
      //       prefix &&
      //       (isNaN(prefix) || parseInt(prefix) > 32 || parseInt(prefix) < 0);

      //     const ipSection = value.split(".");
      //     let lastSection = Number(ipSection[ipSection.length - 1]);

      //     let lastIncludes = ipSection[ipSection.length - 1].includes("/")
      //       ? !!!Number(ipSection[ipSection.length - 1].split("/")[0])
      //       : !!!lastSection;
      //     let res = IPv4Pattern.test(check[0]);
      //     // if (value.includes(".")) {
      //     if (value.includes(":")) {
      //     } else {
      //       if (!!!value) {
      //         return {
      //           isValid: false,
      //           message: "IP Address/Prefix is a mandatory field",
      //         };
      //       } else if (!res) {
      //         return valid;
      //       } else if (value === "0.0.0.0" || lastIncludes) {
      //         return {
      //           isValid: false,
      //           message: "Provided IP address is incorrect.",
      //         };
      //       } else if (prefix === undefined || null || "") {
      //         return valid;
      //       } else if (isPrefix) {
      //         return {
      //           isValid: false,
      //           message: "Provided IP address is incorrect.",
      //         };
      //       } else {
      //         return { isValid: true, message: "" };
      //       }
      //     }
      //   } else {
      //     return { isValid: true, message: "" };
      //   }
      // },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Trusted Flag Field.Header Name",
      ),
      dataKey: "trustedFlag",
      type: "select-single",
      options: ["True", "False"],
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const value = event.target.value;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: t(
                "commons.Component.Table Content.Trusted Flag Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.vLan ID Field.Header Name",
      ),
      dataKey: "vlanId",
      type: "text",
      minWidth: 150,
      flexWidth: 1.5,
      sortable: true,
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const value = event.target.value;
          let tests = [
            {
              runner: ValidationHelper.testRegex,
              args: [value, new RegExp("^(\\d+)?$")],
              success: "",
              error: t(
                "commons.Component.Table Content.vLan ID Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          let result = ValidationHelper.batchValidator(tests);

          if (result === "" && value !== "") {
            tests = [
              {
                runner: ValidationHelper.isWithinRange,
                args: [parseInt(value), 0, 4095],
                success: "",
                error: t(
                  "commons.Component.Table Content.vLan ID Field.Validation.Errors.Vaild Number Between",
                ),
              },
            ];
            result = ValidationHelper.batchValidator(tests);
          }
          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: "" };
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
      minWidth: 80,
      flexWidth: 0.8,
      headerAlignment: "center",
      sortable: false,
      actions: [
        {
          type: "__delete",
          name: t("page.configure.Layer3.Action Options.Tool Tip.Delete Route"),
          handleDelete: (row, setTaskStatus) => {
            let newRow = { ...row };
            delete newRow["__isEditMode"];
            delete newRow["id"];
            delete newRow["isChecked"];

            if (newRow.trustedFlag === "True" || newRow.trustedFlag == true) {
              newRow.trustedFlag = "true";
            }

            if (newRow.trustedFlag === "False" || newRow.trustedFlag == false) {
              newRow.trustedFlag = "false";
            }

            callAPI({
              path: "deleteRoutes",
              params: {
                gatewayIP: AppOverlayContext.selectedGateway.address,
                ip: row.ip.split("/")[0],
              },
              data: null,
              responder: DeleteRouteAPIResponder,
              onComplete: DeleteRouteAPICompeleter,
              onCompleteArguments: [row, setTaskStatus],
            });
          },
          prompt: {
            contentTitle: t(
              "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <>
                <p>
                  <Trans
                    i18nKey={
                      "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Delete Route Confirm"
                    }
                    components={[<br />, <b />]}
                  >
                    You have initiated the process of deleting this Route.
                    <br />
                    <br />
                    Click <b>Confirm</b> to delete, otherwise click{" "}
                    <b>Cancel</b>.
                  </Trans>
                </p>
              </>
            ),
          },
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-layer3-Routemanagement",
    sort: {
      column: "ip",
      inverse: false,
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
        path: "getRoutes",
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
              contentTitle: t("page.configure.Layer3.Fetch Status.Error.Title"),
              contentText: (
                <>
                  <Trans
                    i18nKey={"page.configure.Layer3.Fetch Status.Error.Content"}
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

  const handleDiscard = (newRow, setTaskStatus) => {
    setTaskStatus({ inProgress: false, error: false, message: `` });
  };

  let config = {
    editMode: "inline",
    addHandler: {
      handleSave: (row, setTaskStatus, oldRow) => {
        let newRow = {
          //...row
          ip: row["ip"],
          trustedFlag: row["trustedFlag"],
          vlanId: row["vlanId"] === "" ? "0" : row["vlanId"],
        };
        delete newRow["__isEditMode"];
        if (oldRow === undefined) {
          delete newRow["id"];
        }
        delete newRow["isChecked"];
        if (newRow.trustedFlag === "True" || newRow.trustedFlag == true) {
          newRow.trustedFlag = "true";
        } else if (
          newRow.trustedFlag === "False" ||
          newRow.trustedFlag == false
        ) {
          newRow.trustedFlag = "false";
        }

        callAPI({
          path: "addRoutes",
          params: { gatewayIP: AppOverlayContext.selectedGateway.address },
          data: { ...newRow },
          responder: AddRouteAPIResponder,
          onComplete: ADDRouteAPICompeleter,
          onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
        });
      },
      handleDiscard: handleDiscard,
    },
    fallbackRow: {
      vlanId: "0",
    },
  };

  const ADDRouteAPICompeleter = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "ROUTE_SERVICES_SUCESS") {
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row },
        message: t(
          "page.configure.Layer3.Action Options.Prompt.Saved Status Prompt.Route Success",
          { rowIp: row.ip },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            {/* Error saving route with IP "{row.ip}". Please try again.
            <br />
            <br />
            Details:
            <br /> */}
            <Trans
              i18nKey={
                "page.configure.Layer3.Action Options.Prompt.Saved Status Prompt.Route Error"
              }
              values={{ rowIp: row.ip }}
              components={[<br />]}
            >
              Error saving route with IP "{row.ip}". Please try again.
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

  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  );
  let [gridConfig, setGridConfig] = useState(config);
  const [gatewayAddress, setGatewayAddress] = useState(null);

  const markAsLoading = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }
    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }
    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;
    if (currentGatewayAddress !== gatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (typeof gatewayAddress === "string" && loading === true) {
      callAPI({
        path: "getRoutes",
        params: {
          gatewayIP: AppOverlayContext.selectedGateway.address,
        },
        data: {},
        responder: ROUTESAPIResponder,
        onComplete: getRoute3LayerOnComplete,
      });
    }
  }, [gatewayAddress, loading]);

  const getRoute3LayerOnComplete = (response) => {
    if (response.state === "ROUTES_SUCESS") {
      let data = [];
      data = response.data;
      data.forEach((d) => {
        if (d.trustedFlag === "true" || d.trustedFlag == true) {
          d.trustedFlag = "True";
        } else if (d.trustedFlag === "false" || d.trustedFlag == false) {
          d.trustedFlag = "False";
        }
      });
      setGridRows(data);
      setLoading(false);
    }
  };

  const DeleteRouteAPICompeleter = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_IDENTITY_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        // message: `Route with IP "${row.ip}" deleted successfully.`,
        message: t(
          "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Success Route",
          { rowIp: row.ip },
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
                "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Error Route"
              }
              values={{ rowIp: row.ip }}
              components={[<br />]}
            >
              Error deleting route with IP "{row.ip}". Please try again.
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

  return (
    <Styled.StyledBox>
      <Suspense
        fallback={
          <Styled.StyledSkeletonHolder>
            <WidthFillerSkeleton height={"100%"} />
          </Styled.StyledSkeletonHolder>
        }
      >
        <AsyncIFVDataGrid
          name={subconscious.name}
          key={dataGridKey}
          cols={[gridCols, setGridCols]}
          loadingData={[loading, setLoading]}
          subconscious={[gridSubconscious, setGridSubconscious]}
          data={[gridRows, setGridRows]}
          ref={dataGridRef}
          config={[gridConfig, setGridConfig]}
        />
      </Suspense>

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </Styled.StyledBox>
  );
};

export default RoutesManagementTable;
