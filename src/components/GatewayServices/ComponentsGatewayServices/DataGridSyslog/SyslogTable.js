import { Box } from "@material-ui/core";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import {
  addSyslogResponder,
  deleteSyslogResponder,
  SyslogConfigGetResponder,
} from "../../../../apis/responders/SyslogGetResponder";
import Utility from "../../../../redux/actions/Utility";
import { gatewayServices } from "../../../../utils/GeneralComponentNames";
import ValidationHelper from "../../../../utils/validationHelper/ValidationHelper";
import WidthFillerSkeleton from "../../../General/WidthFillerSkeleton";
import { GenericButton } from "../../../../style/GenericButton/GenericButton";
import { subconscious } from "./subconscious";
import SyslogDropDown from "./SyslogDropDown";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() =>
  import("../../../IFVDataGrid/IFVDataGrid"),
);

function SyslogTable(props) {
  const { t, i18n } = useTranslation();

  const dataGridRef = useRef();

  const { context } = props;

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const { gatewayConfig } = useSelector((state) => state);

  const [init, setinit] = useState([]);
  const [init1, setinit2] = useState([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [loading, setLoading] = props.Loading;

  const handleSave = (row, setTaskStatus) => {
    let newRow = { ...row };
    const priority = newRow.priority.split(/[()]/)[1].toLowerCase();

    delete newRow["__isEditMode"];
    delete newRow["id"];

    callAPI({
      path: "addSyslog",
      params: { gatewayIP, context },
      data: { ...newRow, priority },
      responder: addSyslogResponder,
      onCompleteArguments: [row, setTaskStatus],
      onComplete: (response, row, setTaskStatus) => {
        const name = row.name;

        if (response.state === "SAVE_SUCCESS") {
          setTaskStatus({
            inProgress: false,
            error: false,
            payload: { ...row, ...response.data },
            message: t(
              "page.gatewayServer.services.context.remoteSysLog.action.success.0",
              {
                name,
              },
            ),
          });
        } else {
          setTaskStatus({
            inProgress: false,
            error: true,
            message: (
              <p>
                {t(
                  "page.gatewayServer.services.context.remoteSysLog.action.error.save.0",
                  {
                    name,
                  },
                )}
                <br />
                <br />
                {t(
                  "page.gatewayServer.services.context.remoteSysLog.action.error.save.1",
                )}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </p>
            ),
          });
        }
      },
    });
  };

  const handleDiscard = (newRow, setTaskStatus) => {
    setTaskStatus({ inProgress: false, error: false, message: "" });
  };

  const config = {
    editMode: "inline",
    addHandler: { handleSave, handleDiscard },
    fallbackRow: {
      // Ensure default values are either SEQ + False and SID + True.
      facility: "kern, local0",
      port: 514,
    },
  };

  const tac =
    gatewayConfig.chassis_model === "XXXX" ||
    gatewayConfig.chassis_model === "5010";

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };

    const ctxt = tac ? "mgt" : context;

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "deleteSyslog",
      params: { gatewayIP, context: ctxt },
      data: newRow,
      responder: deleteSyslogResponder,
      onCompleteArguments: [row, setTaskStatus],
      onComplete: (response, row, setTaskStatus) => {
        const name = row.name;

        if (response.state === "DELETE_SUCCESS") {
          setTaskStatus({
            inProgress: false,
            error: false,
            payload: { ...row },
            message: t(
              "page.gatewayServer.services.context.remoteSysLog.action.success.1",
              {
                name,
              },
            ),
          });
        } else {
          setTaskStatus({
            inProgress: false,
            error: true,
            message: (
              <p>
                {t(
                  "page.gatewayServer.services.context.remoteSysLog.action.error.delete.0",
                  {
                    name,
                  },
                )}
                <br />
                <br />
                {t(
                  "page.gatewayServer.services.context.remoteSysLog.action.error.delete.1",
                )}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </p>
            ),
          });
        }
      },
    });
  };

  const translationPath = "page.gatewayServer.services.context.remoteSysLog";
  const columns = [
    {
      headerName: t(`${translationPath}.table.columns.name.text`),
      isDisableEdit: true,
      dataKey: "name",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
          const value1 = row.name;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "page.gatewayServer.services.context.remoteSysLog.table.columns.name.validation.0",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value1, new RegExp(/^[A-Za-z0-9 - _]+$/)],
              success: "",
              error: t(
                "page.gatewayServer.services.context.remoteSysLog.table.columns.name.validation.1",
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
      headerName: t(`${translationPath}.table.columns.facility.text`),
      isDisableEdit: true,
      dataKey: "facility",
      type: "select-multiple",
      options: ["kern", "local0"],
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
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
      headerName: t(`${translationPath}.table.columns.priority.text`),
      isDisableEdit: true,
      dataKey: "priority",
      type: "select-single",
      minWidth: 180,
      flexWidth: 1.5,
      sortable: true,
      options: [
        "* (All)",
        "0 (Emerg)",
        "1 (Alert)",
        "2 (Crit)",
        "3 (Err)",
        "4 (Warning)",
        "5 (Notice)",
        "6 (Info)",
        "7 (Debug)",
      ],
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.priority;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                `${translationPath}.table.columns.priority.validation.0`,
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
      headerName: t(`${translationPath}.table.columns.server.text`),
      isDisableEdit: true,
      dataKey: "server",
      type: "text",
      minWidth: 150,
      flexWidth: 2,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const value = event.target.value;
          const valid = { isValid: true, message: `` };

          const required = {
            isValid: false,
            message: t(`${translationPath}.table.columns.server.validation.0`),
          };

          const inValidAddress = {
            isValid: false,
            message: t(`${translationPath}.table.columns.server.validation.1`),
          };

          if (value.includes(":")) {
            const IPv6Pattern = new RegExp(
              /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
            );
            const valid = { isValid: true, message: `` };
            const ipRegexTest = !Boolean(IPv6Pattern.test(value));

            if (!Boolean(value.length)) {
              return required;
            }
            if (ipRegexTest) {
              return inValidAddress;
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

            const ipRegexTest = !Boolean(ipRegex.test(value));

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
              return valid;
            }
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(`${translationPath}.table.columns.port.text`),
      isDisableEdit: true,
      dataKey: "port",
      type: "number",
      minWidth: 110,
      flexWidth: 1.5,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
          const value1 = row.port;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [`${value1}`],
              success: "",
              error: t(`${translationPath}.table.columns.port.validation.0`),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value1, new RegExp("^\\d+$")],
              success: "",
              error: t(`${translationPath}.table.columns.port.validation.1`),
            },
            {
              runner: ValidationHelper.isLimit,
              args: [value1, 1, 65535],
              success: "",
              error: t(`${translationPath}.table.columns.port.validation.2`),
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
      headerName: t(`${translationPath}.table.columns.action.text`),
      dataKey: "__action",
      type: "actions",
      minWidth: 100,
      headerAlignment: "center",
      contentAlignment: "left",
      sortable: false,
      actions: [
        {
          type: "__delete",
          name: t(
            `${translationPath}.table.columns.action.actions.delete.name`,
          ),
          handleDelete: handleDelete,
          prompt: {
            contentTitle: t(
              `${translationPath}.table.columns.action.actions.delete.confirmationText.0`,
            ),
            contentText: (
              <p>
                {t(
                  `${translationPath}.table.columns.action.actions.delete.confirmationText.1`,
                )}
                <br />
                <br />
                <Trans
                  i18nKey={`${translationPath}.table.columns.action.actions.delete.confirmationText.2`}
                >
                  Click <b>Confirm</b> to delete, otherwise click <b>Cancel</b>
                </Trans>
              </p>
            ),
          },
        },
      ],
    },
  ];

  const initDataGridKey = subconscious.name + "-" + new Date().getTime();

  const [dataGridKey, setDataGridKey] = useState(initDataGridKey);
  const [gridConfig, setGridConfig] = useState(config);
  const [gridCols, setGridCols] = useState(columns);
  const [gridSubconscious, setGridSubconscious] = useState(subconscious);
  const [gridRows, setGridRows] = useState([]);
  const [isTableSetup, setIsTableSetup] = useState(false);

  const handleTableSetup = (event) => {
    setIsTableSetup(true);
    props.setFlag(true);
    setConfigLoading(true);

    callAPI({
      path: "getSyslogConfig",
      params: { gatewayIP, context },
      data: {},
      responder: SyslogConfigGetResponder,
      onComplete: (response) => {
        const [payload] = response.data;

        if (response.state === "SYSLOGCONFIG_GET_SUCESS") {
          setinit(payload.syslog_fmt);
          setinit2(payload.syslog_debug);

          setTimeout(() => {
            setConfigLoading(false);
          }, 100);
        } else {
          props.setAlertContent({
            contentTitle: `${t(`commons.errorText`)}..!`,
            contentText: (
              <>
                {t(
                  `page.gatewayServer.services.context.remoteSysLog.action.error.fetch.0`,
                )}
                <br />
                <br />
                {t(
                  `page.gatewayServer.services.context.remoteSysLog.action.error.fetch.1`,
                )}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </>
            ),
            contentInfo: "",
          });

          props.setOpenAlertDialog(true);

          setConfigLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    if (loading === false) {
      setGridRows(props.sysData);
    }
  }, [loading, props.sysData]);

  return (
    <>
      <StyledBox style={{ display: props.flag ? "none" : "flex" }}>
        <Box
          style={{
            position: "absolute",
            zIndex: "1000",
            right: "0%",
            margin: "3.5px 180px",
          }}
        >
          <GenericButton
            id={`${gatewayServices}-syslog-setup-btn`}
            disabled={loading}
            onClick={handleTableSetup}
            buttonName={t(`commons.setupText`)}
            backgroundColor="primary"
          />
        </Box>

        <Suspense
          fallback={
            <Box>
              <WidthFillerSkeleton height="100%" />
            </Box>
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
      </StyledBox>

      {isTableSetup ? (
        <SyslogDropDown
          flag={props.flag}
          setFlag={props.setFlag}
          gatewayIP={gatewayIP}
          init={init}
          init1={init1}
          ConfigLoading={configLoading}
          setIsTableSetup={setIsTableSetup}
          context={context}
        />
      ) : null}
    </>
  );
}

export default SyslogTable;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1em;
  position: relative;
`;
