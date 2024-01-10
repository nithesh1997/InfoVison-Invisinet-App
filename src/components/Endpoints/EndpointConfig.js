import { Typography } from "@material-ui/core";
import ToolTip from "../../utils/Tooltip/Tooltip";
import { DeleteRounded, EditRounded } from "@material-ui/icons";
import { InfoCircle } from "react-bootstrap-icons";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import PhonelinkSetupRoundedIcon from "@mui/icons-material/PhonelinkSetupRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import React, {
  createContext,
  lazy,
  Suspense,
  useCallback,
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
  AddEndPointAPIResponder,
  DeleteEndPointAPIResponder,
  EditEndPointAPIResponder,
  EndpointsConfigAPIResponder,
} from "../../apis/responders/endpoints-config-api-responder";
import { IdentitiesAPIResponder } from "../../apis/responders/identities-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import { Styled } from "./MaterialComponents/Endpoint.style";
import Portal from "./Portal";
import { ClearFilterRule } from "./Portal/ClearFilterRuleAction/ClearFilterRule";
import { DownloadLogs } from "./Portal/components/DownloadLogs";
import { FilterRuleConfig } from "./Portal/components/FilterRuleConfig";
import { UpgradeRemoteFirmware } from "./Portal/components/UpgradeRemoteFirmware";
import { ViewFilterRuleConfig } from "./Portal/components/ViewFilterRuleConfig";
import { ViewLogs } from "./Portal/components/ViewLogs";
import { GlobalPrompt } from "../../style/Card/Prompt";
import { ProjectName } from "../../utils/ProjectName/Index";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";

const AsyncIFVDataGrid = lazy(() => import("../IFVDataGrid/IFVDataGrid"));

export const EndpointContext = createContext();

const errorMessage = (value) => (
  <p style={{ height: "0.1rem", marginTop: 0 }}>
    Provided address <b>{value}</b> is not valid
    <ToolTip
      title={
        <>
          <p>${common.GATEWAY} address must be any one of the following:</p>

          <ul style={{ paddingLeft: "1rem" }}>
            <li style={{ margin: "0.2rem 0" }}>
              Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code> with just
              octet sections.
            </li>
            <li style={{ margin: "0.2rem 0" }}>
              Valid <b>IPv4 Address</b> with Prefix range between 8-32 such as{" "}
              <code>1.2.3.4/24</code>
            </li>

            <li style={{ margin: "0.2rem 0" }}>
              Valid <b>IPv6 Address</b> such as{" "}
              <code>2001:db8:3333::0:00FF:08</code> with just hextet sections.
            </li>
            <li style={{ margin: "0.2rem 0" }}>
              Valid <b>IPv6 Address</b> with prefix range between 48-128 such as{" "}
              <code>1.2.3.4/56</code>
            </li>

            <li style={{ margin: "0.2rem 0" }}>
              Valid Fully Qualified Domain Name <b>(FQDN)</b> such as{" "}
              <code>{ProjectName.toLowerCase()}.client-name.com</code>.
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

const validateIpAddress = (value) => {
  const alphabetPattern = new RegExp(/^[a-zA-Z]$/);
  const FQDNPattern = new RegExp(
    /^(?=.{1,254}$)((?=[a-zA-Z0-9-]{1,63}\.)(xn--+)?[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}$/,
  );
  const IPv4Pattern = new RegExp(
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
  );
  const IPv6Pattern = new RegExp(
    /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
  );

  const isDomainName = !!value
    .split("")
    .filter((character) => alphabetPattern.test(character)).length;
  const isIPv4 = value.includes(".") && !isDomainName;
  const isIPv6 = value.includes(":");
  const isPrefix = Boolean(value.split("/")[1]);

  if (isIPv4) {
    const prefix = isPrefix ? value.split("/")[1] : 0;
    const regexResult = IPv4Pattern.test(
      isPrefix ? value.split("/")[0] : value,
    );

    if (regexResult) {
      const IpSections = value.split(".");
      const isLastSectionZero = !!!Number(IpSections[IpSections.length - 1]);

      if (!(value === "0.0.0.0" || isLastSectionZero)) {
        return false;
      }

      if (isPrefix && prefix >= 8 && prefix <= 32) {
        return false;
      }
    }
  }

  if (isIPv6) {
    const prefix = isPrefix ? value.split("/")[1] : 0;
    const regexResult = IPv6Pattern.test(
      isPrefix ? value.split("/")[0] : value,
    );

    if (regexResult) {
      if (isPrefix) {
        if (prefix >= 48 && prefix <= 128) {
          return false;
        } else {
          return value;
        }
      } else {
        return false;
      }
    }
  }

  if (isDomainName) {
    const regexResult = FQDNPattern.test(value);

    if (regexResult) {
      return false;
    }
  }

  return value;
};

const endpointRoles = [
  { id: 2, value: "Invisipoint Client" },
  { id: 128, value: "Invisipoint Enforcer" },
  { id: 1, value: "Remote Keying" },
  { id: 16, value: "TAC-ID" },
];

const endpointTCPTag = [
  { id: 1, value: "SEQ" },
  { id: 2, value: "SID" },
];

const initPortalState = {
  isPortal: false,
  type: "",
  row: {},
  setTaskStatus: () => "",
  isProgressPending: false,
};

const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const DataGridEndpointConfig = (props) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const activeProtocols = useSelector((state) => state.activeProtocols);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [gridRows, setGridRows] = useState([]);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [portalState, setPortalState] = useState(initPortalState);
  const [downloadLogsState, setDownloadLogsState] = useState({});
  const [viewLogsState, setViewLogsState] = useState({});
  const [filterRuleConfig, setFilterRuleConfig] = useState({});
  const [upgradeRemoteFirmware, setUpgradeRemoteFirmware] = useState({});
  const [viewFilterRuleConfig, setViewFilterRuleConfig] = useState([]);
  const [viewFilterRuleStage, setViewFilterRuleStage] = useState([]);
  const [clearFilterRuleConfig, setClearFilterRuleConfig] = useState({});

  const [dirFQDNList, setDirFQDNList] = useState([]);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const [endpointsRolesCheck, setEndpointsRolesCheck] = useState("");
  const isUDP = activeProtocols.includes("UDP");

  const { t, i18n } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const TrustLevelOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "IDENTITIES_SUCESS" && response.data !== "") {
      data = response.data;

      setTrustLevel(data);
      setTrustLevelDataLoading(false);
    }
  };

  const EndpointsConfigOnCompleteHandler = useCallback(
    (response) => {
      let data = [];

      if (response.state === "ENDPOINTS_SUCESS" && response.data !== "") {
        data = response.data;

        let endpoints = data.map((row) => {
          row.name = row.client_ID !== "" ? row.client_ID.split("_")[0] : "";

          row.epcclient_ID =
            row.client_ID !== "" ? row.client_ID.split("_")[1] : "";

          row.enabled = row.enabled === 1 ? "True" : "False";

          row.tac_mutual_auth = row.tac_mutual_auth === true ? "True" : "False";

          row.roles =
            row.roles !== null
              ? endpointRoles.filter((role) => role.id === row.roles)[0]
                  ?.value ?? ""
              : "";
          setEndpointsRolesCheck(row.roles);
          row.tcp_tagging =
            row.tcp_tagging != null
              ? endpointTCPTag.filter((tag) => tag.id === row.tcp_tagging)[0]
                  .value
              : "";

          row.record_id = row.id;
          row.id = row.endpoint_ID;
          row.destination = row?.destination ?? "";
          row.dir_FQDN = row?.dir_FQDN ?? "";
          row.fwversion = row?.fwversion ?? "";
          row.sku = row?.sku ?? "";

          if (row.group) {
            row.group = `${row.group ?? ""}`
              .split(",")
              .map((group) => group.trim())
              .join(", ");
          }

          if (activeProtocols.includes("UDP")) {
            row.UDP_enable = row.UDP_enable ? "Enabled" : "Disabled";
          }

          return row;
        });

        setEndpointsData(endpoints);
        setenpointDataLoading(false);
      }
    },
    [activeProtocols],
  );

  const handleAdd = (row, setTaskStatus) => {
    let tcparr = endpointTCPTag.filter((tag) => tag.value === row.tcp_tagging);
    let tcp = tcparr.length > 0 ? tcparr[0].id : "";

    const roleID =
      endpointRoles.filter((roleObj) => {
        return (
          roleObj.value.toLocaleLowerCase() ===
          `${row.roles ?? ""}`.toLocaleLowerCase()
        );
      })[0]?.["id"] ?? "";

    let newRow = {
      ...row,
      enabled: row.enabled === "True" ? 1 : 0,
      tac_mutual_auth: row.tac_mutual_auth === "True" ? true : false,
      roles: roleID,
      tcp_tagging: row.tcp_tagging !== "" ? tcp : "",
      destination: row.roles === "TAC-ID" ? "" : row.destination,
      dir_FQDN: row.roles !== "Invisipoint Enforcer" ? "" : row.dir_FQDN,
    };

    if (isUDP) {
      const UDP_enable = row?.UDP_enable.toLowerCase() ?? "disabled";

      newRow.UDP_enable = Boolean(UDP_enable === "enabled");
    } else {
      delete newRow.UDP_enable;
    }

    delete newRow["name"];
    delete newRow["epcclient_ID"];
    delete newRow["__isEditMode"];
    delete newRow["isChecked"];
    delete newRow["id"];
    delete newRow["certificateExpiryDate"];
    delete newRow["certNotAfterInMs"];
    delete newRow["expiryDays"];

    callAPI({
      path: "add-endpoint",
      params: { gatewayIP },
      data: newRow,
      responder: AddEndPointAPIResponder,
      onComplete: AddEndPointOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, true],
    });
  };

  const AddEndPointOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    const payload = response.data;
    if (response.state === "ADD_ENDPOINT_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        payload: {
          ...row,
          id: payload.endpoint_ID,
          name: payload.client_ID.split("_")[0],
          epcclient_ID: payload.client_ID.split("_")[1],
          certNotAfterInMs: payload.certNotAfterInMs,
          client_ID: payload.client_ID,
          dir_service: payload.dir_service,
          endpoint_ID: payload.endpoint_ID,
          fwversion: payload.fwversion,
          record_id: payload.record_id,
          rmtkey: payload.rmtkey,
          sku: payload.sku,
          tac_ID: payload.tac_ID,
          certificateExpiryDate: payload.certificateExpiryDate,
          expiryDays: payload.expiryDays,
          UDP_enable: payload.UDP_enable ? "Enabled" : "Disabled",
        },
        message: `${common.ENDPOINT} with name "${row.name}" and serial "${row.epcclient_ID}" saved successfully.`,
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        payload: {},
        message: (
          <>
            {t("commons.errorMessages.epcError")}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  const EditEndPointOnCompleteHandler = useCallback(
    (response, row, setTaskStatus, isAddOperation) => {
      if (response.state === "EDIT_ENDPOINT_SUCESS") {
        if (isAddOperation) {
          markAsLoading();
          return;
        }

        let status = {
          inProgress: false,
          error: false,
          payload: {
            ...row,
            UDP_enable: response.data.UDP_enable ? "Enabled" : "Disabled",
            dir_FQDN: response.data.dir_FQDN,
          },
          message: `${common.ENDPOINT} with name "${row.name}" and serial "${row.epcclient_ID}" saved successfully.`,
        };
        setTaskStatus(status);
      }
    },
    [],
  );

  const handleEditSave = useCallback(
    (row, setTaskStatus, oldRow) => {
      let tcparr = endpointTCPTag.filter(
        (tag) => tag.value === row.tcp_tagging,
      );
      let tcp = tcparr.length > 0 ? tcparr[0].id : "";

      const roleID =
        endpointRoles.filter((roleObj) => {
          return (
            roleObj.value.toLocaleLowerCase() ===
            `${row.roles ?? ""}`.toLocaleLowerCase()
          );
        })[0]?.["id"] ?? "";

      let newRow = {
        ...row,
        enabled: row.enabled === "True" ? 1 : 0,
        tac_mutual_auth: row.tac_mutual_auth === "True" ? true : false,
        roles: roleID,
        tcp_tagging: row.tcp_tagging != "" ? tcp : "",
        destination: row.roles === "TAC-ID" ? "" : row.destination,
        dir_FQDN: row.roles !== "Invisipoint Enforcer" ? "" : row.dir_FQDN,
        id: row.endpoint_ID,
      };

      if (activeProtocols.includes("UDP")) {
        const UDP_enable = row?.UDP_enable.toLowerCase() ?? "disabled";

        newRow.UDP_enable = Boolean(UDP_enable === "enabled");
      } else {
        delete newRow.UDP_enable;
      }

      delete newRow["__isEditMode"];
      delete newRow["record_id"];
      delete newRow["isChecked"];
      delete newRow["rmtkey"];
      delete newRow["name"];
      delete newRow["epcclient_ID"];
      delete newRow["certificateExpiryDate"];
      delete newRow["certNotAfterInMs"];
      delete newRow["expiryDays"];

      callAPI({
        path: "edit-endpoint",
        params: { gatewayIP },
        data: newRow,
        responder: EditEndPointAPIResponder,
        onComplete: EditEndPointOnCompleteHandler,
        onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
      });
    },
    [EditEndPointOnCompleteHandler, activeProtocols, gatewayIP],
  );

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
    delete row["__isEditMode"];
    delete row["isChecked"];

    callAPI({
      path: "delete-endpoint",
      params: { gatewayIP },
      data: row.client_ID,
      responder: DeleteEndPointAPIResponder,
      onComplete: DeleteEndPointOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteEndPointOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_ENDPOINT_SUCESS") {
      setTaskStatus({
        inProgress: false,
        error: false,
        message: `${common.ENDPOINT} with name "${row.name}" and serial "${row.epcclient_ID}" deleted successfully.`,
      });
    } else {
      setTaskStatus({
        inProgress: false,
        error: true,
        message: (
          <>
            {t("commons.errorMessages.errorDeletingEpc", {
              name: row.name,
              epcclient_ID: row.epcclient_ID,
            })}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
  };

  let config = {
    editMode: "popup", // Can be "inline" | "popup"; Default: "inline"
    allowMultipleRowSelection: true,
    globalSearch: true,
    fallbackRow: {
      timeout: 3600,
      heartbeat_Interval: 0,
      certificateExpiryDate: "",
      UDP_enable: "Disabled",
      enabled: "True",
      tac_mutual_auth: "False",
      tcp_tagging: "SEQ",
    },
    bulkActions: [
      {
        name: t("page.Endpoint.Configure.ellipsisMenu.requestLogFile"),
        icon: <NoteAddRoundedIcon />,
        handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
          setDownloadLogsState({
            tableRows,
            selectedRows,
            setTaskStatus,
            isBulkAction: true,
          });
          setPortalState({ type: "__download", isPortal: true });
        },
      },
      {
        name: t("page.Endpoint.Configure.ellipsisMenu.configureFilterRles"),
        icon: (
          <Styled.StyledIconBadge
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={<SettingsRoundedIcon />}
          >
            <ShieldRoundedIcon />
          </Styled.StyledIconBadge>
        ),
        handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
          setFilterRuleConfig({ tableRows, selectedRows, setTaskStatus });
          setPortalState({
            type: "filter-rules-configuration",
            isPortal: true,
          });

          /*
          setTimeout(() => {
            setTaskStatus({
              loading: false,
              payload: [...tableRows],
              error: false,
              message: "",
            });
          }, 15000);
          */
        },
      },
      {
        name: t("page.Endpoint.Configure.ellipsisMenu.clearFilterRules"),
        icon: <ClearAllIcon />,
        handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
          setClearFilterRuleConfig({
            tableRows: tableRows,
            selectedRows: [...selectedRows],
            setTaskStatus,
            isBulkAction: true,
          });
          setPortalState({
            type: "delete-filter-rules",
            isPortal: true,
          });
        },
      },
      {
        name: t("page.Endpoint.Configure.ellipsisMenu.upgradeRemoteFirmware"),
        icon: <PhonelinkSetupRoundedIcon />,
        handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
          setPortalState({ type: "upgrade-remote-firmware", isPortal: true });
          setUpgradeRemoteFirmware({
            tableRows: tableRows,
            selectedRows: [...selectedRows],
            setTaskStatus,
            isBulkAction: true,
          });
        },
      },
    ],
    addHandler: {
      handleSave: (row, setTaskStatus) => {
        handleAdd(row, setTaskStatus);
      },
      handleDiscard: handleDiscard,
    },
  };

  /* Request Log File */
  const downloadAction = {
    type: "__download",
    isEnabled: ({ roles, enabled }) => {
      return enabled.toLowerCase() === "true" && roles !== "Remote Keying";
    },
    closePortal: () => {
      setPortalState(() => ({ type: "", isPortal: false }));
    },
    handleDownload: (row, setTaskStatus) => {
      setDownloadLogsState({
        tableRows: undefined,
        selectedRows: [row],
        setTaskStatus,
      });
      setPortalState({ type: "__download", isPortal: true });

      return [portalState, setPortalState];
    },
  };

  /* Download Logs */
  const viewAction = {
    type: "__view",
    isEnabled: ({ roles, enabled }) => {
      return enabled.toLowerCase() === "true" && roles !== "Remote Keying";
    },
    handleView: (row, setTaskStatus, setDontClosePopup) => {
      setViewLogsState({ row, setTaskStatus, setDontClosePopup });
      setPortalState({ type: "__view", isPortal: true });
    },
  };

  /* View Filter Rules */
  const viewFilterRulesConfigAction = {
    type: "view-filter-rules-configuration",
    isEnabled: ({ roles, enabled }) => {
      return enabled.toLowerCase() === "true" && roles !== "Remote Keying";
    },
    handleViewFilterRulesConfig: (row, setTaskStatus, setDontClosePopup) => {
      setViewFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [row],
        setTaskStatus,
        setDontClosePopup,
      });

      setPortalState({
        type: "view-filter-rules-configuration",
        isPortal: true,
      });
    },
  };

  /* Configure Filter Rules */
  const filterRulesConfigAction = {
    type: "filter-rules-configuration",
    isEnabled: ({ roles, enabled }) => {
      return enabled.toLowerCase() === "true" && roles !== "Remote Keying";
    },
    handleFilterRulesConfig: (row, setTaskStatus, setDontClosePopup) => {
      setFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [row],
        setTaskStatus,
        setDontClosePopup,
      });
      setPortalState({ type: "filter-rules-configuration", isPortal: true });
    },
  };

  /* Clear Filter Rules */
  const clearFilterRulesAction = {
    type: "clear-filter-rules",
    isEnabled: ({ roles, enabled }) => {
      return enabled.toLowerCase() === "true" && roles !== "Remote Keying";
    },
    handleClearFilterRules: (row, setTaskStatus, setDontClosePopup) => {
      setClearFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [row],
        setTaskStatus,
        setDontClosePopup,
      });

      setPortalState({ type: "delete-filter-rules", isPortal: true });
    },
  };

  /* Upgrade Remote Firmware */
  const upgradeRemoteFirmwareAction = {
    type: "upgrade-remote-firmware",
    isEnabled: ({ roles, enabled, status }) => {
      return (
        enabled.toLowerCase() === "true" &&
        roles !== "Remote Keying" &&
        roles === "TAC-ID" &&
        status !== "In Progress"
      );
    },
    handleUpgradeRemoteFirmware: (row, setTaskStatus, setDontClosePopup) => {
      setUpgradeRemoteFirmware({
        tableRows: undefined,
        selectedRows: [row],
        setTaskStatus,
        isBulkAction: false,
        setDontClosePopup,
      });
      setPortalState({ type: "upgrade-remote-firmware", isPortal: true });
    },
  };

  const columns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      minWidth: 175,
      flexWidth: 1.75,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      isDisableEdit: true,
      isDisableAdd: true,
    },
    {
      headerName: t("commons.Component.Table Content.Serial Field.Header Name"),
      dataKey: "epcclient_ID",
      minWidth: 250,
      flexWidth: 2.5,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      isDisableEdit: true,
      isDisableAdd: true,
    },
    {
      headerName: t("commons.Component.Table Content.Roles Field.Header Name"),
      dataKey: "roles",
      minWidth: 150,
      flexWidth: 1.5,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: [
        "Invisipoint Client",
        "Invisipoint Enforcer",
        "Remote Keying",
        /* "TAC-ID", ISPD-402 */
      ],
      inputValidator: (event, row, resetValidation) => {
        const e = event.type;
        const valid = (t) => ({ isValid: true, message: t ?? "" });
        const inValid = (t) => ({ isValid: false, message: t ?? "" });
        const value1 = row.roles;
        const tests1 = [
          {
            runner: ValidationHelper.isNotEmpty,
            args: [value1],
            success: "",
            error: t(
              "commons.Component.Table Content.Roles Field.Validation.Errors.Mandatory",
            ),
          },
        ];

        let data = "";
        data = ValidationHelper.batchValidator(tests1);

        if (
          value1 === "TAC-ID" &&
          event._trigger_reset_error_patch_ !== "ClickedSaveButton" &&
          e === "blur"
        ) {
          resetValidation({ key: "destination", value: "", resetField: true });
        }

        return e === "blur"
          ? data === ""
            ? valid()
            : inValid(data)
          : { isValid: true, message: "" };
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Certificate Field.Header Name",
      ),
      dataKey: "cert",
      minWidth: 0,
      flexWidth: 0,
      type: "multiline",
      hideInViewState: true,
      sortable: false,
      isDisableEdit: true,
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.cert;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Certificate Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Enabled Field.Header Name",
      ),
      dataKey: "enabled",
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 2 : 1.5,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["True", "False"],
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.enabled;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Enabled Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Group(s) Field.Header Name",
      ),
      dataKey: "group",
      minWidth: 200,
      flexWidth: 2,
      type: "select-multiple",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: [],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Group(s) Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Location Field.Header Name",
      ),
      dataKey: "location",
      minWidth: 175,
      flexWidth: 1.75,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.location;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Location Field.Validation.Errors.Mandatory",
              ),
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
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
        "commons.Component.Table Content.Algorithm Field.Header Name",
      ),
      dataKey: "alg",
      minWidth: 175,
      flexWidth: 1.75,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      //options: ["UMAC-AES", "HMAC-SHA-256", "UMAC-AES-64", "HMAC-SHA-256-64"],
      options: ["HMAC-SHA-256", "HMAC-SHA-256-64"],
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.alg;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Algorithm Field.Validation.Errors.Mandatory",
              ),
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
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
        "commons.Component.Table Content.Timeout Field.Header Name",
      ),
      dataKey: "timeout",
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 2.5 : 1.5,
      type: "number",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (Number(valA) > Number(valB)) return 1;
        if (Number(valA) < Number(valB)) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event.type === "blur") {
          let data = "";
          const value = row.timeout;

          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value.toString()],
              success: "",
              error: t(
                "commons.Component.Table Content.Timeout Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, new RegExp("^\\d+$")],
              success: "",
              error: t(
                "commons.Component.Table Content.Timeout Field.Validation.Errors.Invalid",
              ),
            },
            {
              runner: ValidationHelper.isWithinRange,
              args: [parseInt(value), 3600, 65534],
              success: "",
              error: t(
                "commons.Component.Table Content.Timeout Field.Validation.Errors.Range",
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
        "commons.Component.Table Content.Heartbeat Interval Field.Header Name",
      ),
      dataKey: "heartbeat_Interval",
      minWidth: 175,
      flexWidth: 1.75,
      type: "number",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (Number(valA) > Number(valB)) return 1;
        if (Number(valA) < Number(valB)) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event.type === "blur") {
          let data = "";
          const value = row.heartbeat_Interval;
          let timeout = parseInt(row.timeout / 2);
          if (isNaN(timeout)) {
            timeout = 0;
          } else {
            timeout -= 1;
          }

          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value.toString()],
              success: "",
              error: t(
                "commons.Component.Table Content.Heartbeat Interval Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, new RegExp("^\\d+$")],
              success: "",
              error: t(
                "commons.Component.Table Content.Heartbeat Interval Field.Validation.Errors.Invalid",
              ),
            },
            {
              runner: ValidationHelper.isWithinRange,
              args: [parseInt(value), 0, timeout],
              success: "",
              error: t(
                "commons.Component.Table Content.Heartbeat Interval Field.Validation.Errors.Range",
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
        "commons.Component.Table Content.DIR FQDN Field.Header Name",
      ),
      dataKey: "dir_FQDN",
      minWidth: 175,
      flexWidth: 1.75,
      type: "free-solo-single",
      options: [],
      sortable: true,
      disableField: (row) => {
        return row.roles !== "Invisipoint Enforcer";
      },
      sortComparator: (valA, valB, rowA, rowB) => {
        if (Number(valA) > Number(valB)) return 1;
        if (Number(valA) < Number(valB)) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        const value = event.target.value;

        if (event.type === "blur") {
          const FQDN_PATTERN = new RegExp(
            /^(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.)|([a-zA-Z0-9]\.))+[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]$/,
          );

          const IPv4_PATTERN = new RegExp(
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
          );

          if (!value) {
            return { isValid: true, message: "" };
          }

          if (!FQDN_PATTERN.test(value)) {
            if (!IPv4_PATTERN.test(value)) {
              return {
                isValid: false,
                message: (
                  <>
                    DIR FQDN address must be
                    <ul>
                      <li>
                        Either a valid <b>IP Address</b> like
                        <code> 14.234.212.23</code>
                      </li>

                      <li>
                        OR a valid <b>FQDN (Fully Qualified Domain Name)</b>{" "}
                        like
                        <code> ec2-13.amazon.com</code>
                      </li>
                    </ul>
                  </>
                ),
              };
            } else {
              return { isValid: true, message: "" };
            }
          } else {
            return { isValid: true, message: "" };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Destination Field.Header Name",
      ),
      dataKey: "destination",
      minWidth: 175,
      flexWidth: 1.75,
      type: "text",
      sortable: true,
      disableField: (row) => {
        return row.roles === "TAC-ID";
      },
      inputValidator: (event, row) => {
        const value =
          row.destination
            ?.split(",")
            ?.map(($) => $.trim())
            ?.filter(($) => $) ?? [];

        let d = row.destination.split(",");
        const tests1 = [
          {
            runner: ValidationHelper.isNotEmpty,
            args: [row.destination],
            success: "",
            error: t(
              "commons.Component.Table Content.Destination Field.Validation.Errors.Mandatory",
            ),
          },
        ];

        ValidationHelper.batchValidator(tests1);

        if (
          event.type === "blur" &&
          !!!row.destination.length &&
          row.roles !== "TAC-ID"
        ) {
          return {
            isValid: false,
            message: t(
              "commons.Component.Table Content.Destination Field.Validation.Errors.Mandatory",
            ),
          };
        } else if (event.type === "blur" && value.length) {
          if (d.length > 7) {
            return {
              isValid: false,
              message: t(
                "commons.Component.Table Content.Destination Field.Validation.Errors.Range",
              ),
            };
          } else {
            const results = value.map(($) => validateIpAddress($));
            const affected = results.filter(($) => typeof $ === "string")[0];

            return affected
              ? { isValid: false, message: errorMessage(affected) }
              : { isValid: true, message: "" };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.TCP Tagging Field.Header Name",
      ),
      dataKey: "tcp_tagging",
      minWidth: 150,
      flexWidth: 1.5,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["SEQ", "SID"],
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.tcp_tagging;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.TCP Tagging Field.Validation.Errors.Mandatory",
              ),
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
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
        "commons.Component.Table Content.TAC Mutual Auth Field.Header Name",
      ),
      dataKey: "tac_mutual_auth",
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 3.5 : 1.5,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["True", "False"],
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.tac_mutual_auth;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.TAC Mutual Auth Field.Validation.Errors.Mandatory",
              ),
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
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
      headerName: t("commons.Component.Table Content.UDP Field.Header Name"),
      dataKey: "UDP_enable",
      minWidth: 150,
      flexWidth: 1.5,
      type: "select-single",
      hideColumn: !isUDP,
      isDisableAdd: !isUDP,
      isDisableEdit: !isUDP,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["Enabled", "Disabled"],
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.UDP_enable;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              error: t(
                "commons.Component.Table Content.UDP Field.Validation.Errors.Mandatory",
              ),
            },
          ];

          data = ValidationHelper.batchValidator(tests1);

          if (!!!data) {
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
        "commons.Component.Table Content.Firmware Version Field.Header Name",
      ),
      dataKey: "fwversion",
      minWidth: 160,
      flexWidth: i18n.language === "es" ? 2.2 : 1.6,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      isDisableEdit: true,
      isDisableAdd: true,
    },
    {
      headerName: t("commons.Component.Table Content.SKU Field.Header Name"),
      dataKey: "sku",
      minWidth: 160,
      flexWidth: 1.6,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      isDisableEdit: true,
      isDisableAdd: true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Certificate Expiry Field.Header Name",
      ),
      dataKey: "certificateExpiryDate",
      minWidth: 150,
      flexWidth: 1.5,
      type: "date",
      sortable: false,
      isDisableEdit: true,
      isDisableAdd: true,
      renderViewState: (columns, row, value) => {
        const color =
          row.expiryDays <= 30
            ? "#ff0000"
            : row.expiryDays <= 60
            ? "#FF8C00"
            : row.expiryDays <= 90
            ? "#01b508"
            : "#000";

        const expirymsg =
          row.expiryDays <= 0 ? (
            t(
              "commons.Component.Table Content.Certificate Expiry Field.Validation.Errors.Expired",
              { GATEWAY: common.ENDPOINT },
            )
          ) : (
            <Trans
              i18nKey={
                "commons.Component.Table Content.Certificate Expiry Field.Validation.Errors.Expired In Days"
              }
              values={{ GATEWAY: common.ENDPOINT }}
            >
              Endpoint Certificate expires in {{ days: row.expiryDays }} days.
            </Trans>
          );

        const background = color.concat("00");

        const StatText = () => {
          return (
            <ToolTip title={expirymsg}>
              <Typography
                style={{
                  color,
                  background,
                  fontSize: "1em",
                }}
              >
                {row.certificateExpiryDate}
              </Typography>
            </ToolTip>
          );
        };

        return <StatText />;
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      minWidth: 300,
      flexWidth: 3,
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
              args: [value, 1024],
              success: "",
              error: t(
                "commons.Component.Table Content.Comment Field.Validation.Errors.Comment allow 1024 or less Char",
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
        "commons.Component.Table Content.Action Option.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      maxActionsLimit: 2,
      headerAlignment: "center",
      sortable: false,
      minWidth: 125,
      flexWidth: 1.25,
      actions: [
        {
          /*  */
          colorState: "#058FE7",
          icon: <EditRounded />,
          /*  */
          type: "__edit",
          name: t("page.Endpoint.Configure.TableActionTooltip.Edit"),
          hideEditInRow: false, // Edit won't be shown in row
          handleDiscard: handleDiscard,
          handleSave: handleEditSave,
          handleEdit: handleEdit,
        },
        {
          prompt: {
            contentTitle: t(
              "commons.Component.Table Content.Action Option.Prompt.Delete Confirm Prompt.Delete Confirm Title",
            ),
            contentTextGen: (row) => {
              return (
                <Trans
                  i18nKey={
                    "commons.Component.Table Content.Action Option.Prompt.Delete Confirm Prompt.Delete Confirm Content"
                  }
                  values={{ actionComponent: row.name }}
                  components={[<br />, <b />]}
                ></Trans>
              );
            },
          },
          colorState: "#EF4444",
          icon: <DeleteRounded />,
          type: "__delete",
          name: t("page.Endpoint.Configure.TableActionTooltip.Delete"),
          handleDelete: handleDelete,
        },
        downloadAction,
        viewAction,
        viewFilterRulesConfigAction,
        filterRulesConfigAction,
        clearFilterRulesAction,
        upgradeRemoteFirmwareAction,
      ],
    },
  ];

  let subconscious = {
    name: "ba-enpoints-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
    sort: {
      column: "epcclient_ID", // Can be a string, a valid dataKey of one of the defined columns; Default: dataKey of first column
      inverse: false, // Boolean, determines
    },
    pageSize: 10,
    page: 1,
    chunk: 0,
    handleLoadMoreData: (TableRows, Subconscious, LastButton) => {
      const successCode = "SUCCESS";
      const failureCode = "FAILURE";

      //  const [tableRows, setTableRows] = TableRows;
      //  const [gridSubconscious, setGridSubconscious] = Subconscious;
      //  const [gotoLastButton, setGotoLastButton] = LastButton;

      const page = gridSubconscious.chunk + 1;

      callAPI({
        path: "endpoints",
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
              record.name =
                record.client_ID !== "" ? record.client_ID.split("_")[0] : "";

              record.epcclient_ID =
                record.client_ID !== "" ? record.client_ID.split("_")[1] : "";

              record.enabled = record.enabled === 1 ? "True" : "False";

              record.tac_mutual_auth =
                record.tac_mutual_auth === true ? "True" : "False";

              record.roles =
                record.roles != null
                  ? endpointRoles.filter((role) => role.id === record.roles)[0]
                      .value
                  : "";

              record.tcp_tagging =
                record.tcp_tagging != null
                  ? endpointTCPTag.filter(
                      (tag) => tag.id === record.tcp_tagging,
                    )[0].value
                  : "";

              record.record_id = record.id;
              record.id = record.endpoint_ID;
              record.destination = record?.destination ?? "";
              record.dir_FQDN = record?.dir_FQDN ?? "";
              record.fwversion = record?.fwversion ?? "";
              record.sku = record?.sku ?? "";

              if (activeProtocols.includes("UDP")) {
                record.UDP_enable = record.UDP_enable ? "Enabled" : "Disabled";
              }

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
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [endpointsData, setEndpointsData] = useState([]);
  let [trustLevel, setTrustLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enpointDataLoading, setenpointDataLoading] = useState(true);
  const [trustLevelDataLoading, setTrustLevelDataLoading] = useState(true);
  const [getDirFQDNLoading, setGetDirFQDNLoading] = useState(true);

  const viewFilterRuleConfigPortalRef = useRef();
  const filterRuleConfigPortalRef = useRef();
  const upgradeRemoteFirmwarePortalRef = useRef();
  const clearFilterRuleConfigPortalRef = useRef();

  const [flag, setFlag] = useState(false);
  const markAsLoading = () => {
    setLoading(true);
    setenpointDataLoading(true);
    setTrustLevelDataLoading(true);
    setEndpointsData([]);
  };
  const handleClosePortal = (event, setPortalState) => {
    setPortalState((prev) => {
      return {
        ...prev,
        type: "",
        isPortal: true,
      };
    });
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
    /* Get Endpoints */
    callAPI({
      path: "endpoints",
      params: { gatewayIP },
      data: {},
      responder: EndpointsConfigAPIResponder,
      onComplete: EndpointsConfigOnCompleteHandler,
    });

    /* Get Trust Level Groups */
    callAPI({
      path: "trust-groups",
      params: { gatewayIP },
      data: {},
      responder: IdentitiesAPIResponder,
      onComplete: TrustLevelOnCompleteHandler,
    });

    /* Get DIR FQDN's */
    callAPI({
      path: "getFQDN",
      params: { gatewayIP },
      data: {},
      responder: (response, onComplete, onCompleteArgs) => {
        const responder = {
          state: "GET_FQDN_FAILURE",
          data: undefined,
        };

        if (
          response.state === "GOOD_RESPONSE" &&
          response.response.code === 200
        ) {
          responder.state = "GET_FQDN_SUCCESS";
          responder.data = response.response.body;
        } else {
          responder.catchError = response.error;
          responder.error = response.response.error;
          responder.errorFromJSON = response.response.errorFromJSON;
        }

        onComplete(responder, ...onCompleteArgs);
      },
      onComplete: (response) => {
        if (response.state === "GET_FQDN_SUCCESS") {
          setDirFQDNList(response.data);
          setTimeout(() => {
            setGetDirFQDNLoading(false);
          }, 100);
        } else {
          setGetDirFQDNLoading(false);
        }
      },
    });
  }, []);

  useEffect(() => {
    if (!enpointDataLoading && !trustLevelDataLoading && !getDirFQDNLoading) {
      let allRes = [...new Set([...trustLevel.map((res) => res.name)])];

      let dynamicOptionFilledColumns = columns.map((col) => {
        let newCol = { ...col };

        if (newCol.dataKey === "group") {
          newCol.options = allRes;
        }

        if (newCol.dataKey === "dir_FQDN") {
          newCol.options = dirFQDNList.map(({ address }) => address);
        }

        return newCol;
      });

      setGridCols(dynamicOptionFilledColumns);
      setGridRows(endpointsData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [enpointDataLoading, trustLevelDataLoading, getDirFQDNLoading]);

  return (
    <EndpointContext.Provider value={{}}>
      <Styled.StyledContainer component={"section"}>
        <AppInContentHeader
          title={AppConfig.pages.enp.title}
          breadcrumb={AppConfig.pages.enp.breadcrumb}
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
              loadingData={[loading, setLoading]}
              config={[gridConfig, setGridConfig]}
              cols={[gridCols, setGridCols]}
              subconscious={[gridSubconscious, setGridSubconscious]}
              data={[gridRows, setGridRows]}
            />
          </Suspense>
        </Styled.StyledDataGridBox>
      </Styled.StyledContainer>

      <Portal
        portalState={portalState}
        setPortalState={setPortalState}
        downloadLogsState={downloadLogsState}
        viewLogsState={viewLogsState}
        filterRuleConfig={filterRuleConfig}
        upgradeRemoteFirmware={upgradeRemoteFirmware}
        ViewFilterRuleStage={viewFilterRuleStage}
        viewFilterRuleConfig={viewFilterRuleConfig}
        clearFilterRuleConfig={clearFilterRuleConfig}
        filterRuleConfigPortalRef={filterRuleConfigPortalRef}
        viewFilterRuleConfigPortalRef={viewFilterRuleConfigPortalRef}
        upgradeRemoteFirmwarePortalRef={upgradeRemoteFirmwarePortalRef}
        clearFilterRuleConfigPortalRef={clearFilterRuleConfigPortalRef}
        handleClosePortal={handleClosePortal}
        downloadAction={downloadAction}
      >
        {portalState.type === "__download" ? (
          <DownloadLogs
            portalState={portalState}
            setPortalState={setPortalState}
            downloadLogsState={downloadLogsState}
            setDownloadLogsState={setDownloadLogsState}
            AppOverlayContext={AppOverlayContext}
          />
        ) : portalState.type === "__view" ? (
          <ViewLogs
            portalState={portalState}
            setPortalState={setPortalState}
            viewLogsState={viewLogsState}
            setViewLogsState={setViewLogsState}
            AppOverlayContext={AppOverlayContext}
          />
        ) : portalState.type === "view-filter-rules-configuration" ? (
          <ViewFilterRuleConfig
            ref={viewFilterRuleConfigPortalRef}
            portalState={portalState}
            setPortalState={setPortalState}
            viewFilterRuleConfig={viewFilterRuleConfig}
            setViewFilterRuleConfig={setViewFilterRuleConfig}
            flags={[flag, setFlag]}
            AppOverlayContext={AppOverlayContext}
          />
        ) : portalState.type === "filter-rules-configuration" ? (
          <FilterRuleConfig
            endpointRoles
            ref={filterRuleConfigPortalRef}
            portalState={portalState}
            setPortalState={setPortalState}
            filterRuleConfig={filterRuleConfig}
            setFilterRuleConfig={setFilterRuleConfig}
            setViewFilterRuleConfig={setViewFilterRuleConfig}
            AppOverlayContext={AppOverlayContext}
            endpointsRolesCheck={endpointsRolesCheck}
          />
        ) : portalState.type === "delete-filter-rules" ? (
          <ClearFilterRule
            ref={clearFilterRuleConfigPortalRef}
            portalState={portalState}
            setPortalState={setPortalState}
            clearFilterRuleConfig={clearFilterRuleConfig}
            setClearFilterRuleConfig={setClearFilterRuleConfig}
          />
        ) : portalState.type === "upgrade-remote-firmware" ? (
          <UpgradeRemoteFirmware
            ref={upgradeRemoteFirmwarePortalRef}
            portalState={portalState}
            setPortalState={setPortalState}
            upgradeRemoteFirmware={upgradeRemoteFirmware}
            setUpgradeRemoteFirmware={setUpgradeRemoteFirmware}
            AppOverlayContext={AppOverlayContext}
          />
        ) : null}
      </Portal>

      <GlobalPrompt
        openPrompt={alertDialog.open}
        title={alertDialog.contentTitle}
        content={alertDialog.contentText}
        primaryBtnText={t("commons.okayText")}
        primaryVariant={"outlined"}
        onPrimaryClick={handleAlertDialogClose}
        handleClose={handleAlertDialogClose}
      />
    </EndpointContext.Provider>
  );
};

export default withRouter(withCookies(DataGridEndpointConfig));
