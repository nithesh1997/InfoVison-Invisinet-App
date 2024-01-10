import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import callAPI from "../../apis/callAPI";
import {
  deleteApiLayer3NatResponder,
  getApiLayer3NatResponder,
  saveApiLayer3NatResponder,
} from "../../apis/responders/getApiLayer3NatResponder";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/Layer3NatManagement.style";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));
const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const Layer3NatManagement = ({ loading, setLoading }) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const [gridRows, setGridRows] = useState([]);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    let newRow = {
      id: row["id"],
      trIp: row["trIp"],
      trVlanId: row["trVlanId"] === "" ? "0" : row["trVlanId"],
      utIp: row["utIp"],
      utVlanId: row["utVlanId"] === "" ? "0" : row["utVlanId"],
    };

    delete newRow["__isEditMode"];

    if (newRow["id"] === "_newRow" || oldRow === undefined) {
      delete newRow["id"];
    }

    callAPI({
      path: "saveNats",
      params: { gatewayIP },
      data: newRow,
      responder: saveApiLayer3NatResponder,
      onComplete: onCompletesaveApiLayer3NatResponder,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };
  const onCompletesaveApiLayer3NatResponder = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SAVE_LAYER3_SUCESS") {
      /* For Gateway */
      //  if (isAddOperation) {
      //    markAsLoading();
      //    return;
      //  }
      /* For Gateway */

      let status = {
        inProgress: false,
        error: false,
        payload: {
          ...row,
          id: row.id === "_newRow" ? response.data.id : row.id,
        },
        message: `NAT with trusted IP "${row.trIp}" and untrusted IP "${row.utIp}" added successfully.`,
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
                "page.configure.Layer3.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowTrIp: row.trIp, rowUtIp: row.utIp }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };
  let columns = [
    {
      headerName: (
        <>
          {t(
            "commons.Component.Table Content.IP Address/Prefix Field.Header Name",
          )}
          <br />({t("commons.Component.Table Content.Thead Text.Trusted Text")})
        </>
      ),
      dataKey: "trIp",
      type: "text",
      minWidth: 225,
      flexWidth: 2.25,
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
      headerName: (
        <>
          {t("commons.Component.Table Content.vLan ID Field.Header Name")}
          <br />({t("commons.Component.Table Content.Thead Text.Trusted Text")})
        </>
      ),
      dataKey: "trVlanId",
      type: "text",
      minWidth: 150,
      flexWidth: 1.5,
      sortable: true,
      inputValidator: (event, row) => {
        if (event.type === "blur") {
          const value = row.trVlanId;
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
      headerName: (
        <>
          {t(
            "commons.Component.Table Content.IP Address/Prefix Field.Header Name",
          )}
          <br />(
          {t("commons.Component.Table Content.Thead Text.Un-Trusted Text")})
        </>
      ),
      dataKey: "utIp",
      type: "text",
      minWidth: 225,
      flexWidth: 2.25,
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
    },
    {
      headerName: (
        <>
          {t("commons.Component.Table Content.vLan ID Field.Header Name")}
          <br />(
          {t("commons.Component.Table Content.Thead Text.Un-Trusted Text")})
        </>
      ),
      dataKey: "utVlanId",
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
      options: [],
      minWidth: 80,
      flexWidth: 0.8,
      headerAlignment: "center",
      contentAlignment: "left",
      sortable: false,
      actions: [
        {
          type: "__delete",
          name: t("page.configure.Layer3.Action Options.Tool Tip.Delete Nat"),
          handleDelete: handleDelete,
          prompt: {
            contentTitle: t(
              "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this NAT
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
    name: "ba-layer3-natmanagement",
    sort: {
      column: "trIp",
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
        path: "getNats",
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
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };
    setTaskStatus(status);
  };

  const config = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    addHandler: { handleSave, handleDiscard },
    fallbackRow: {
      trVlanId: "0",
      utVlanId: "0",
    },
  };

  const dataGridRef = useRef();
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  );
  let [gridConfig, setGridConfig] = useState(config);
  let AppOverlayContext = useContext(OverlayContext);

  const markAsLoading = () => {
    setLoading(true);
    setGridRows([]);
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
        path: "getNats",
        params: {
          gatewayIP: AppOverlayContext.selectedGateway.address,
        },
        data: {},
        responder: getApiLayer3NatResponder,
        onComplete: getNat3LayerOnComplete,
      });
    }
  }, [gatewayAddress, loading]);

  const getNat3LayerOnComplete = (response) => {
    if (response.state === "GET_API_LAYER_SUCESS") {
      let data = [];
      data = response.data;
      setGridRows(data);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  };
  function handleDelete(row, setTaskStatus) {
    callAPI({
      path: "deleteNats",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        ip: row.trIp.split("/")[0],
      },
      data: "",
      responder: deleteApiLayer3NatResponder,
      onComplete: onCompleteDeleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  }
  const onCompleteDeleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_LAYER3_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        message: `NAT with trusted IP "${row.trIp}" and untrusted IP "${row.utIp}" deleted successfully.`,
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: (
          <>
            {/* Error deleting NAT with trusted IP "{row.trIp}" and untrusted IP "
            {row.utIp}". Please try again.
            <br />
            <br />
            Details:
            <br /> */}
            <Trans
              i18nKey={
                "page.configure.Layer3.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ rowTrIp: row.trIp, rowUtIp: row.utIp }}
              components={[<br />]}
            >
              Error deleting NAT with trusted IP "{row.trIp}" and untrusted IP "
              {row.utIp}". Please try again.
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
          config={[gridConfig, setGridConfig]}
          ref={dataGridRef}
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

export default Layer3NatManagement;
