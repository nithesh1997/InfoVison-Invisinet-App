import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { InfoCircle } from "react-bootstrap-icons";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import callAPI from "../../apis/callAPI";
import {
  DeleteIdentityAPIResponder,
  IdentitiesAPIResponder,
  SaveIdentityAPIResponder,
} from "../../apis/responders/identities-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ToolTip from "../../utils/Tooltip/Tooltip";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import CircularProgressWithLabel from "../PageLoader/CircularProgressWithLabel";
import Styled from "./MaterialComponents/Identities.style";
import { Trans, useTranslation } from "react-i18next";
// import { FamilyRestroomTwoTone } from "@mui/icons-material";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const TrustLevel = (props) => {
  const minLevel = 0;
  const maxLevel = 7;

  return (
    <Styled.TrustLevelHolder>
      <CircularProgressWithLabel
        size={24}
        value={
          (100 * (props.level == multiGrpTrustLevel ? maxLevel : props.level)) /
          (maxLevel - minLevel)
        }
        displayValue={props.level}
      />
    </Styled.TrustLevelHolder>
  );
};

const multiGrpTrustLevel = 128;

const tcpTag = [
  { id: 1, value: "SEQ" },
  { id: 2, value: "SID" },
];

const errElement = (t) => {
  return (
    <p style={{ height: "0.1rem", marginTop: 0, color: "#EF4444" }}>
      {t(
        "commons.Component.Table Content.Ip Address Field.Validation.Errors.Tooltip Prefix Text",
      )}
      <ToolTip
        title={
          <>
            <p>
              {t(
                "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ip Address Description",
              )}
            </p>

            <ul style={{ paddingLeft: "1rem" }}>
              <li style={{ margin: "0.2rem 0" }}>
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Octet Section"
                  }
                  components={[<strong />, <code />]}
                >
                  Valid <strong>IPv4 Address</strong> such as
                  <code>1.2.3.4</code> with just octet sections.
                </Trans>
              </li>
              <li style={{ margin: "0.2rem 0" }}>
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Prefix Range"
                  }
                  components={[<strong />, <code />]}
                >
                  Valid <strong>IPv4 Address</strong> with Prefix range between
                  8-32 such as <code>1.2.3.4/24</code>
                </Trans>
              </li>
              <li style={{ margin: "0.2rem 0" }}>
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Hextet Section"
                  }
                  components={[<strong />, <code />]}
                >
                  Valid <strong>IPv6 Address</strong> such as
                  <code>2001:db8:3333::0:00FF:08</code> with just hextet
                  sections.
                </Trans>
              </li>
              <li style={{ margin: "0.2rem 0" }}>
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Prefix Range"
                  }
                  components={[<strong />, <code />]}
                >
                  Valid <strong>IPv6 Address</strong> with prefix range between
                  48-128 such as <code>ff00::12ee/56</code>
                </Trans>
              </li>
            </ul>
          </>
        }
      >
        <Styled.IconButton>
          <InfoCircle size={"0.65em"} />
        </Styled.IconButton>
      </ToolTip>
    </p>
  );
};
const DataGridIdentityConfig = (props) => {
  const { gatewayConfig, activeProtocols, activeGateway } = useSelector(
    (state) => state,
  );
  let dataGridRef = useRef();
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const { address: gatewayIP } = activeGateway;
  const isUDP = activeProtocols.includes("UDP");
  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t, i18n } = useTranslation();

  const TrustLevelOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "IDENTITIES_SUCESS" && response.data !== "") {
      data = response.data;
      setTrustLevel(data);
      setTrustLevelDataLoading(false);
    }
  };

  const idOnCompleteHandler = (response) => {
    let data = [];
    const alloweds = [0, 1, 2, 3, 4, 5, 6, 7, 128];

    if (response.state === "IDENTITIES_SUCESS" && response.data !== "") {
      data = response.data.filter(({ trust_level }) =>
        alloweds.includes(trust_level),
      );

      let identities = data.map((row, index) => {
        let newRow = {
          ...row,
          id: !!row.ident_type ? `A${row.id}` : row.id,
        };

        if (!!!newRow.ip1 && !!newRow.ip2) {
          newRow.ip1 = newRow.ip2;
        }

        newRow.tcp_ident_tag =
          newRow.tcp_ident_tag != null
            ? tcpTag.filter((tag) => tag.id === newRow.tcp_ident_tag)[0].value
            : "";
        newRow.enable_flag = newRow.enable_flag === 0 ? "False" : "True";
        newRow.rmtkey = newRow.rmtkey === 0 ? "False" : "True";

        if (newRow.group) {
          newRow.group = `${newRow.group}`
            .split(",")
            .map((group) => group.trim())
            .join(", ");
        }

        if (activeProtocols.includes("UDP")) {
          newRow.udp_enable = newRow?.udp_enable ? "Enabled" : "Disabled";
        }

        if (newRow.mac.includes(":") === false) {
          newRow.mac = newRow.mac.replace(
            /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            "$1:$2:$3:$4:$5:$6",
          );
        }

        if (newRow.mac.includes("-")) {
          newRow.mac = newRow.mac.split("-").join(":");
        }

        return newRow;
      });

      identities = identities.filter((row) => row.trust_level !== -1);

      setidentityData(identities);
      setidentityDataLoading(false);
    }
  };

  const handleEdit = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTimeout(() => {
      setTaskStatus(status);
    }, 500);
  };

  const SaveIdentityOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SAVE_IDENTITY_SUCESS") {
      // if condition changed
      /* For Gateway */
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }
      /* For Gateway */

      const rmtkey = !!response.data.rmtkey ? "True" : "False";

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      if (row.mac.includes("-")) {
        row.mac = row.mac.split("-").join(":");
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row, rmtkey },
        message: t(
          "page.manage.identities.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
        callback: (prevRows) => {
          return prevRows.map((r) => {
            if (r.name === row.name) {
              if (typeof r.id === "string" && r.id.includes("A")) {
                return { ...r, enable_flag: row.enable_flag };
              } else {
                const rowPayload = { ...row };
                rowPayload.__isEditMode = !rowPayload.__isEditMode;

                return rowPayload;
              }
            } else {
              return r;
            }
          });
        },
      };

      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <p>
            <Trans
              i18nKey={
                "page.manage.identities.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </p>
        ),
      };
      setTaskStatus(status);
    }
  };

  const SaveRow = (row, setTaskStatus, oldRow) => {
    let newRow = {};

    const tests = [
      {
        runner: ValidationHelper.isIPv6WithPrefix,
        args: [row.ip1, true],
        success: "",
        error: "Not IPv6",
      },
    ];

    let ipv6 = ValidationHelper.batchValidator(tests) === "";

    // If the address is an ipv4 address, make sure to send an ip1 variable.
    // If the address is an ipv6 address, make sure to send an ip2 variable.
    if (ipv6) {
      newRow = {
        id: row.id,
        name: row.name,
        group: row.group,
        enable_flag: row.enable_flag === "True" ? 1 : 0,
        rmtkey: row.rmtkey === "True" ? 1 : 0,
        mac: row.mac,
        trust_level: Number(row.trust_level),
        tcp_ident_tag:
          row.tcp_ident_tag === "SEQ"
            ? 1
            : row.tcp_ident_tag === "SID"
            ? 2
            : null,
        ip2: row.ip1,
        comment: row.comment,
      };
    } else {
      newRow = {
        id: row.id,
        name: row.name,
        group: row.group,
        enable_flag: row.enable_flag === "True" ? 1 : 0,
        rmtkey: row.rmtkey === "True" ? 1 : 0,
        mac: row.mac,
        trust_level: Number(row.trust_level),
        tcp_ident_tag:
          row.tcp_ident_tag === "SEQ"
            ? 1
            : row.tcp_ident_tag === "SID"
            ? 2
            : null,
        ip1: row.ip1,
        comment: row.comment,
      };
    }

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];
    newRow["id"] === "_newRow" && delete newRow["id"];

    if (activeProtocols.includes("UDP")) {
      const udp_enable = row?.udp_enable?.toLowerCase() ?? "disabled";

      newRow.udp_enable = Number(udp_enable === "enabled");
    }

    if (newRow.mac.includes("-")) {
      newRow.mac = newRow.mac.split("-").join(":");
    }

    callAPI({
      path: "save-identity",
      params: { gatewayIP },
      data: { ...newRow },
      responder: SaveIdentityAPIResponder,
      onComplete: SaveIdentityOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    const mac = row.mac;
    const ip = row.ip1;

    if (mac !== "" || ip !== "") {
      SaveRow(row, setTaskStatus, oldRow);
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: t("page.manage.identities.Error Message.Mac Or IP Mandatory"),
      });
    }
  };

  const handleDiscard = (newRow, setTaskStatus) => {
    setTaskStatus({
      inProgress: false,
      error: false,
      message: "",
    });
  };

  const handleDelete = (row, setTaskStatus, setTableRows) => {
    callAPI({
      path: "delete-identity",
      params: { gatewayIP },
      data: row.name,
      responder: DeleteIdentityAPIResponder,
      onComplete: DeleteIdentityOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, setTableRows],
    });
  };

  const DeleteIdentityOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    setTableRows,
  ) => {
    if (response.state === "DELETE_IDENTITY_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        message: t(
          "page.manage.identities.Action Options.Prompt.Delete Status Prompt.Success",
          { rowName: row.name },
        ),
        callback: (oldState) => oldState.filter((r) => r.name !== row.name),
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.identities.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  // const errorMessage = (value) => (
  //   <p style={{ height: "0.1rem", marginTop: 0 }}>
  //     Provided address <b>{value}</b> is not valid
  //     <ToolTip
  //       title={
  //         <>
  //           <p>Gateway address must be any one of the following:</p>

  //           <ul style={{ paddingLeft: "1rem" }}>
  //             <li style={{ margin: "0.2rem 0" }}>
  //               Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code> with just
  //               octet sections.
  //             </li>
  //             <li style={{ margin: "0.2rem 0" }}>
  //               Valid <b>IPv4 Address</b> with Prefix range between 8-32 such as{" "}
  //               <code>1.2.3.4/24</code>
  //             </li>

  //             <li style={{ margin: "0.2rem 0" }}>
  //               Valid <b>IPv6 Address</b> such as{" "}
  //               <code>2001:db8:3333::0:00FF:08</code> with just hextet sections.
  //             </li>
  //             <li style={{ margin: "0.2rem 0" }}>
  //               Valid <b>IPv6 Address</b> with prefix range between 48-128 such
  //               as <code>1.2.3.4/56</code>
  //             </li>

  //             <li style={{ margin: "0.2rem 0" }}>
  //               Valid Fully Qualified Domain Name <b>(FQDN)</b> such as{" "}
  //               <code>bluearmor.client-name.com</code>.
  //             </li>
  //           </ul>
  //         </>
  //       }
  //     >
  //       <Styled.IconButton>
  //         <InfoCircle size={"0.65em"} />
  //       </Styled.IconButton>
  //     </ToolTip>
  //   </p>
  // );

  let config = {
    editMode: "inline",
    addHandler: { handleSave, handleDiscard },
    fallbackRow: {
      trust_level: 5,
      tcp_ident_tag: "SEQ",
      rmtkey: "False",
      udp_enable: "Disabled",
      enable_flag: "True",
    },
  };

  let columns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      isDisableEdit: true,
      dataKey: "name",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
          const value = row.name;
          const regex = new RegExp(/^[A-Za-z0-9]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regex],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Alpha-Numeric Only",
              ),
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 4],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Char Atleast Should Be",
              ),
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Charater Less Then Value",
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
      headerName: t("commons.Component.Table Content.Group Field.Header Name"),
      isDisableEdit: true,
      dataKey: "group",
      type: "select-multiple",
      options: [],
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Group Field.Validation.Errors.Mandatory",
              ),
            },
          ];

          const isInLimit =
            _.split(", ").length <= 8
              ? ""
              : "Groups can not exceed more than 8 protected resources";
          const result = ValidationHelper.batchValidator(tests) || isInLimit;

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
        "commons.Component.Table Content.Trust Level Field.Header Name",
      ),
      isDisableEdit: true,
      dataKey: "trust_level",
      type: "select-single",
      options: [0, 1, 2, 3, 4, 5, 6, 7],
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 2.5 : 1.5,
      headerAlignment: "left",
      contentAlignment: "center",
      sortable: true,
      renderViewState: (columns, row, value) => {
        return value != multiGrpTrustLevel ? <TrustLevel level={value} /> : "";
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value = parseInt(row.trust_level);

          if (value !== null && value !== "") {
            const tests = [
              /* {
                runner: ValidationHelper.isNotEmpty,
                args: [toString(value)],
                success: "",
                error: t(
                "commons.Component.Table Content.Trust Level Field.Validation.Errors.Mandatory",
                ),
            }, */
              {
                runner: ValidationHelper.isNan,
                args: [value],
                success: t(
                  "commons.Component.Table Content.Trust Level Field.Validation.Errors.Numbers Only",
                ),
                error: "",
              },
              {
                runner: ValidationHelper.isWithinRange,
                args: [value, 0, 7],
                success: "",
                error: t(
                  "commons.Component.Table Content.Trust Level Field.Validation.Errors.Trust Level values range",
                ),
              },
            ];

            data = ValidationHelper.batchValidator(tests);
          }

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
        "commons.Component.Table Content.Ip Address Field.Header Name",
      ),
      isDisableEdit: true,
      dataKey: "ip1",
      type: "text",
      minWidth: 175,
      flexWidth: 1.75,
      headerAlignment: "left",
      contentAlignment: "left",
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
      inputValidator: (event, row, resetValidation) => {
        resetValidation({ key: "", value: "" });

        if (event.type === "blur") {
          let value = row.ip1;
          let reg = new RegExp(/[a-z,A-Z]/);
          let tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: t(
                "commons.Component.Table Content.Ip Address Field.Validation.Errors.Mandatory",
              ), // Not actually shown to the user.
            },
          ];

          let result = ValidationHelper.batchValidator(tests);
          if (result !== "") {
            if (row.mac === "") {
              return {
                isValid: false,
                message: (
                  <p style={{ color: "#EF4444", margin: "0", padding: "0" }}>
                    {t(
                      "commons.Component.Table Content.Ip Address Field.Validation.Errors.Enter Ip or Mac Address",
                    )}
                  </p>
                ),
              };
            } else {
              return { isValid: true, message: "" };
            }
          }

          // tests = [
          //   {
          //     runner: ValidationHelper.isIPv4WithPrefix,
          //     args: [value, true],
          //     success: "",
          //     error:
          //       "Invalid IPv4 prefix value. Prefix should be an integer from 8 through 32.",
          //   },
          // ];
          if (value.includes(".") && value.includes(":")) {
            return {
              isValid: true,
              message: errElement(t),
            };
          } else if (value.includes(".")) {
            if (reg.test(value)) {
              return {
                isValid: true,
                message: (
                  <p style={{ height: "0.1rem", marginTop: 0, color: "red" }}>
                    {t(
                      "commons.Component.Table Content.Ip Address Field.Validation.Errors.Tooltip Prefix Text",
                    )}
                    <ToolTip
                      title={
                        <>
                          <p>
                            {t(
                              "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ip Address Description",
                            )}
                          </p>
                          <ul style={{ paddingLeft: "1rem" }}>
                            <li style={{ margin: "0.2rem 0" }}>
                              <Trans
                                i18nKey={
                                  "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Octet Section"
                                }
                                components={[<strong />, <code />]}
                              >
                                Valid <strong>IPv4 Address</strong> such as
                                <code>1.2.3.4</code> with just octet sections.
                              </Trans>
                            </li>
                            <li style={{ margin: "0.2rem 0" }}>
                              <Trans
                                i18nKey={
                                  "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Prefix Range"
                                }
                                components={[<strong />, <code />]}
                              >
                                Valid <strong>IPv4 Address</strong> with Prefix
                                range between 8-32 such as{" "}
                                <code>1.2.3.4/24</code>
                              </Trans>
                            </li>
                            <li style={{ margin: "0.2rem 0" }}>
                              <Trans
                                i18nKey={
                                  "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Hextet Section"
                                }
                                components={[<strong />, <code />]}
                              >
                                Valid <strong>IPv6 Address</strong> such as
                                <code>2001:db8:3333::0:00FF:08</code> with just
                                hextet sections.
                              </Trans>
                            </li>
                            <li style={{ margin: "0.2rem 0" }}>
                              <Trans
                                i18nKey={
                                  "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Prefix Range"
                                }
                                components={[<strong />, <code />]}
                              >
                                Valid <strong>IPv6 Address</strong> with prefix
                                range between 48-128 such as{" "}
                                <code>ff00::12ee/56</code>
                              </Trans>
                            </li>
                          </ul>
                        </>
                      }
                    >
                      <Styled.IconButton>
                        <InfoCircle size={"0.65em"} />
                      </Styled.IconButton>
                    </ToolTip>
                  </p>
                ),
              };
            } else {
              tests = [
                {
                  runner: ValidationHelper.isIPv4WithPrefix,
                  args: [value, true],
                  success: "",
                  error: t(
                    "commons.Component.Table Content.Ip Address Field.Validation.Errors.Invalid Prefix 8 through 32",
                  ),
                },
              ];
              result = ValidationHelper.batchValidator(tests);
            }
          } else if (value.includes(":")) {
            tests = [
              {
                runner: ValidationHelper.isIPv6WithPrefix,
                args: [value, true],
                success: "",
                error: t(
                  "commons.Component.Table Content.Ip Address Field.Validation.Errors.Invalid Prefix 48 through 128",
                ),
              },
            ];
            result = ValidationHelper.batchValidator(tests);
          } else {
            return {
              isValid: true,
              message: (
                <p style={{ height: "0.1rem", marginTop: 0, color: "#EF4444" }}>
                  {t(
                    "commons.Component.Table Content.Ip Address Field.Validation.Errors.Tooltip Prefix Text",
                  )}
                  <ToolTip
                    title={
                      <>
                        <p>
                          {t(
                            "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ip Address Description",
                          )}
                        </p>
                        <ul style={{ paddingLeft: "1rem" }}>
                          <li style={{ margin: "0.2rem 0" }}>
                            <Trans
                              i18nKey={
                                "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Octet Section"
                              }
                              components={[<strong />, <code />]}
                            >
                              Valid <strong>IPv4 Address</strong> such as
                              <code>1.2.3.4</code> with just octet sections.
                            </Trans>
                          </li>
                          <li style={{ margin: "0.2rem 0" }}>
                            <Trans
                              i18nKey={
                                "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv4 Prefix Range"
                              }
                              components={[<strong />, <code />]}
                            >
                              Valid <strong>IPv4 Address</strong> with Prefix
                              range between 8-32 such as <code>1.2.3.4/24</code>
                            </Trans>
                          </li>
                          <li style={{ margin: "0.2rem 0" }}>
                            <Trans
                              i18nKey={
                                "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Hextet Section"
                              }
                              components={[<strong />, <code />]}
                            >
                              Valid <strong>IPv6 Address</strong> such as
                              <code>2001:db8:3333::0:00FF:08</code> with just
                              hextet sections.
                            </Trans>
                          </li>
                          <li style={{ margin: "0.2rem 0" }}>
                            <Trans
                              i18nKey={
                                "commons.Component.Table Content.Ip Address Field.Validation.Tool Tip.Message.Ipv6 Prefix Range"
                              }
                              components={[<strong />, <code />]}
                            >
                              Valid <strong>IPv6 Address</strong> with prefix
                              range between 48-128 such as{" "}
                              <code>ff00::12ee/56</code>
                            </Trans>
                          </li>
                        </ul>
                      </>
                    }
                  >
                    <Styled.IconButton>
                      <InfoCircle size={"0.65em"} />
                    </Styled.IconButton>
                  </ToolTip>
                </p>
              ),
            };
          }

          result = ValidationHelper.batchValidator(tests);
          if (result !== "") {
            if (value.includes(".")) {
              tests = [
                {
                  runner: ValidationHelper.isIPv4WithPrefix,
                  args: [value, true],
                  success: "",
                  error: value.includes("/")
                    ? "Invalid IPv4 prefix value. Prefix should be an integer from 8 through 32."
                    : errElement(t),
                },
              ];
              result = ValidationHelper.batchValidator(tests);
            } else if (value.includes(":")) {
              tests = [
                {
                  runner: ValidationHelper.isIPv6WithPrefix,
                  args: [value, true],
                  success: "",
                  error: value.includes("/")
                    ? "Invalid IPv6 prefix value. Prefix should be an integer from 48 through 128."
                    : errElement(t),
                },
              ];
              result = ValidationHelper.batchValidator(tests);
            }

            result = ValidationHelper.batchValidator(tests);
            if (result !== "") {
              return { isValid: false, message: result };
            } else {
              return { isValid: true, message: "" };
            }
          }

          resetValidation({ key: "mac", value: "" });
          return { isValid: true, message: "" };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t("commons.Component.Table Content.MAC Field.Header Name"),
      isDisableEdit: true,
      dataKey: "mac",
      type: "text",
      minWidth: 175,
      flexWidth: 1.75,
      headerAlignment: "left",
      contentAlignment: "left",
      sortable: false,
      inputValidator: (event, row, resetValidation) => {
        resetValidation({ key: "", value: "" });

        if (event.type === "blur") {
          let value = row.mac;
          let tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: t(
                "commons.Component.Table Content.MAC Field.Validation.Errors.Mandatory",
              ),
            },
          ];

          let result = ValidationHelper.batchValidator(tests);

          if (result !== "") {
            if (row.ip1 === "") {
              return {
                isValid: false,
                message: (
                  <p style={{ color: "#EF4444", margin: "0", padding: "0" }}>
                    {t(
                      "commons.Component.Table Content.MAC Field.Validation.Errors.Enter Ip or Mac Address",
                    )}
                  </p>
                ),
              };
            } else {
              return { isValid: true, message: "" };
            }
          }

          let error = t(
            "commons.Component.Table Content.MAC Field.Validation.Errors.Mac Incorrect",
          );

          tests = [
            {
              runner: ValidationHelper.testRegex,
              args: [
                value,
                new RegExp(
                  /^[0-9a-fA-F]{1,2}([.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/,
                ),
              ],
              success: "",
              error,
            },
          ];

          result = ValidationHelper.batchValidator(tests);

          if (result !== "") {
            return { isValid: false, message: result };
          }

          resetValidation({ key: "ip1", value: "" });
          return { isValid: true, message: "" };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.TCP Tagging Field.Header Name",
      ),
      isDisableEdit: true,
      dataKey: "tcp_ident_tag",
      minWidth: 160,
      flexWidth: i18n.language === "es" ? 2.5 : 1.6,
      type: "select-single",
      sortable: true,
      options: ["SEQ", "SID"],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const value = row.tcp_ident_tag;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: t(
                "commons.Component.Table Content.TCP Tagging Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          const result = ValidationHelper.batchValidator(tests);

          if (result !== "") {
            return { isValid: false, message: result };
          }

          return { isValid: true, message: "" };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Remote Key Field.Header Name",
      ),
      dataKey: "rmtkey",
      type: "select-single",
      minWidth: 160,
      flexWidth: 1.6,
      headerAlignment: "left",
      contentAlignment: "left",
      isDisableEdit: true,
      hideInViewState: true,
      hideColumn: gatewayConfig.chassis_model === "5010" ?? false,
      sortable: true,
      options: ["True", "False"],
      inputValidator: (event, row) => {
        if (event.type === "blur") {
          let data = "";
          const value1 = row.rmtkey;
          const tests2 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Remote Key Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests2);
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
        "commons.Component.Table Content.Enabled Field.Header Name",
      ),
      dataKey: "enable_flag",
      type: "select-single",
      options: ["True", "False"],
      minWidth: 160,
      flexWidth: 1.6,
      headerAlignment: "left",
      contentAlignment: "left",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.enable_flag;
          const tests2 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Enabled Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests2);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        }
      },
    },
    {
      headerName: t("commons.Component.Table Content.UDP Field.Header Name"),
      dataKey: "udp_enable",
      type: "select-single",
      options: ["Enabled", "Disabled"],
      minWidth: 160,
      flexWidth: 1.6,
      headerAlignment: "left",
      contentAlignment: "left",
      hideColumn: !isUDP,
      isDisableEdit: true,
      isDisableAdd: !isUDP,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.udp_enable;
          const tests2 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.UDP Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests2);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      isDisableEdit: true,
      dataKey: "comment",
      type: "multiline",
      options: [],
      minWidth: 250,
      flexWidth: 2.5,
      headerAlignment: "left",
      contentAlignment: "left",
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
          //https://bluearmor.atlassian.net/browse/GW-2768
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
      headerName: t("page.manage.identities.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      minWidth: 100,
      flexWidth: AppConfig.gatewayVariant === "tac-server" ? 2 : 1,
      headerAlignment: "center",
      contentAlignment: "left",
      sortable: false,
      maxActionsLimit: 2,
      actions: [
        {
          type: "__edit",
          name: t("page.manage.identities.Action Options.Tool Tip.Edit"),
          isEnabled: (row) => row.ident_type !== 1,
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
        {
          prompt: {
            contentTitle: t(
              "page.manage.identities.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <p>
                <Trans
                  i18nKey={
                    "page.manage.identities.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                  }
                  components={[<br />, <b />]}
                ></Trans>
              </p>
            ),
          },
          type: "__delete",
          name: t("page.manage.identities.Action Options.Tool Tip.Delete"),
          isEnabled: (row) => row.ident_type !== 1,
          handleDelete: handleDelete,
        },
        // {
        //   icon: (
        //     <Fragment>
        //       <DownloadDoneSharp />
        //     </Fragment>
        //   ),
        //   name: "Action 1",
        //   isEnabled: (row) => row.ident_type === 1,
        //   override: {
        //     attributes: {
        //       id: "",
        //       name: "",
        //       label: "",
        //       style: { fontFamily: "Montserrat" },
        //     },
        //   },
        //   tooltip: {
        //     message: "Tooltip for this action...",
        //     style: { color: "green" },
        //   },
        //   prompt: {
        //     contentTitle: "Are you sure about this?",
        //     contentText: (
        //       <>
        //         <p>
        //           You have initiated the process of deleting this identity.
        //           <br />
        //           <br />
        //           Click <b>Confirm</b> to delete, otherwise click <b>Cancel</b>.
        //         </p>
        //       </>
        //     ),
        //   },
        //   resultPopup: {
        //     title: "",
        //     agreeActionTitle: "",
        //     disagreeActionTitle: "",
        //     agreeActionHandler: () => {},
        //     disagreeActionHandler: () => {},
        //   },
        //   href: (row) => ({ address: "" }),
        //   handlerArgs: ["Testing Arguments"],
        //   handler: (currentRow, setJobState, { setTableRows }) => {
        //     setTimeout(() => {
        //       setJobState({
        //         loading: false,
        //         asyncStatus: "completed",
        //         payload: { ...currentRow },
        //         message: (
        //           <>
        //             <Typography>Operation Success..!</Typography>
        //           </>
        //         ),
        //       });
        //     }, 3000);
        //   },
        // },
      ],
    },
  ];

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  let subconscious = {
    name: "ba-identity-config",
    sort: { column: "name", inverse: false },
    pageSize: 10,
    page: 1,
    chunk: 0,
    handleLoadMoreData: (TableRows, Subconscious, LastButton) => {
      const successCode = "IDENTITIES_SUCCESS";
      const failureCode = "IDENTITIES_FAILURE";
      const gatewayIP = AppOverlayContext.selectedGateway.address;

      const [tableRows, setTableRows] = TableRows;
      const [gridSubconscious, setGridSubconscious] = Subconscious;
      const [gotoLastButton, setGotoLastButton] = LastButton;

      const page = gridSubconscious.chunk + 1;

      callAPI({
        path: "getIdentitiesv2",
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
              let identities = payload.map((row, index) => {
                let newRow = {
                  ...row,
                  // id: `${index}${index + 1}${row.id}`,
                  //   id: `${Math.random().toString(16).slice(2)}${row.id}`,
                  id: !!row.ident_type ? `A${row.id}` : row.id,
                };

                newRow.tcp_ident_tag =
                  newRow.tcp_ident_tag != null
                    ? tcpTag.filter((tag) => tag.id === newRow.tcp_ident_tag)[0]
                        .value
                    : "";
                newRow.enable_flag =
                  newRow.enable_flag === 0 ? "False" : "True";
                newRow.rmtkey = newRow.rmtkey === 0 ? "False" : "True";

                if (activeProtocols.includes("UDP")) {
                  newRow.udp_enable = newRow?.udp_enable
                    ? "Enabled"
                    : "Disabled";
                }

                if (newRow.mac.includes(":") === false) {
                  newRow.mac = newRow.mac.replace(
                    /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                    "$1:$2:$3:$4:$5:$6",
                  );
                }
                return newRow;
              });

              identities = identities.filter((row) => row.trust_level !== -1); // Removing duplicate / erroneous records

              const newState = [...oldState, ...identities];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  // A key needs to be passed mandatorily to the grid
  let [dataGridKey, setDataGridKey] = useState(
    () => subconscious.name + "-" + new Date().getTime(),
  );
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [gridRows, setGridRows] = useState([]);
  let [loading, setLoading] = useState(true);
  let [identityDataLoading, setidentityDataLoading] = useState(true);
  let [identityData, setidentityData] = useState([]);
  let [trustLevel, setTrustLevel] = useState([]);
  let [trustLevelDataLoading, setTrustLevelDataLoading] = useState(true);

  const markAsLoading = () => {
    setLoading(true);
    setidentityDataLoading(true);
    setTrustLevelDataLoading(true);
    setidentityData([]);
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
      loading === true &&
      trustLevelDataLoading === true
    ) {
      callAPI({
        path: "getIdentitiesv2",
        params: { gatewayIP: gatewayAddress },
        data: {},
        responder: IdentitiesAPIResponder,
        onComplete: idOnCompleteHandler,
      });

      callAPI({
        path: "trust-groups",
        params: { gatewayIP: gatewayAddress },
        data: {},
        responder: IdentitiesAPIResponder,
        onComplete: TrustLevelOnCompleteHandler,
      });
    }
  }, [gatewayAddress, loading, trustLevelDataLoading]);

  useEffect(() => {
    if (!identityDataLoading && !trustLevelDataLoading) {
      let allRes = [...new Set([...trustLevel.map((res) => res.name)])];
      let dynamicOptionFilledColumns = columns.map((col) => {
        let newCol = { ...col };

        if (newCol.dataKey === "group") {
          newCol.options = allRes;
        }

        return newCol;
      });

      setGridCols(dynamicOptionFilledColumns);
      setGridRows(identityData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [identityDataLoading, trustLevelDataLoading]);

  return (
    <>
      <Styled.Container
        component={"section"}
        item
        xs={12}
        sm={6}
        md={8}
        lg={12}
      >
        <Styled.Header>
          {" "}
          <AppInContentHeader
            title={AppConfig.pages.idm.title}
            breadcrumb={AppConfig.pages.idm.breadcrumb}
          />
        </Styled.Header>
        <Styled.DataGridBox>
          <Suspense
            fallback={
              <Styled.SkeletonHolder>
                <WidthFillerSkeleton height="100%" />
              </Styled.SkeletonHolder>
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
        </Styled.DataGridBox>
      </Styled.Container>

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </>
  );
};

export default withRouter(withCookies(DataGridIdentityConfig));
