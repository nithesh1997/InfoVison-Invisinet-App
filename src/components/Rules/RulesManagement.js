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
import { IdentitiesAPIResponder } from "../../apis/responders/identities-api-responder";
import {
  ProResourceAPIResponder,
  ResourceListAPIResponder,
} from "../../apis/responders/resources-api-responder";
import {
  DeleteRuleAPIResponder,
  RulesAPIResponder,
  SaveRuleAPIResponder,
} from "../../apis/responders/rules-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import CircularProgressWithLabel from "../PageLoader/CircularProgressWithLabel";
import Styled from "./MaterialComponents/RulesManagement.style";
import { Trans, useTranslation } from "react-i18next";

const TrustLevel = (props) => {
  const minLevel = 0;
  const maxLevel = 7;
  return (
    <Styled.TrustLevelHolder>
      <CircularProgressWithLabel
        size={24}
        value={(100 * props.level) / (maxLevel - minLevel)}
        displayValue={props.level}
      />
    </Styled.TrustLevelHolder>
  );
};

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const DataGridRulesConfig = (props) => {
  const activeGateway = useSelector((state) => state.activeGateway);
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  let [identityData, setIdentityData] = useState([]);
  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const activeProtocols = useSelector((state) => state.activeProtocols);
  const isUDP = activeProtocols.includes("UDP");
  const gatewayConfig = useSelector((state) => state.gatewayConfig);
  const isTac = gatewayConfig.chassis_model === "5010";

  const { t, i18n } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);

    // setTimeout(() => {
    //   callback();
    // }, 1000);
  };

  const RulesOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "RULES_SUCESS" && response.data !== "") {
      data = response.data;
      let rules = data.map((row) => {
        if (activeProtocols.includes("UDP")) {
          row.protocol =
            row.protocol.toLowerCase() === "udp"
              ? "UDP"
              : "" || row.protocol.toLowerCase() === "tcp"
              ? "TCP"
              : "" || row.protocol.toLowerCase() === "all"
              ? "All"
              : "";
        }
        return row;
      });
      setRulesData(rules);
      setRulesDataLoading(false);
    }
  };

  const ApplicationsOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "Applications_SUCESS" && response.data !== "") {
      data = response.data;
      setAppsData(data);
      setAppsDataLoading(false);
    }
  };

  const ProResourceOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "ProResource_SUCESS" && response.data !== "") {
      data = response.data;
      setProResourceData(data);
      setProResourceDataLoading(false);
    }
  };

  const ResListOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "ResourceList_SUCESS" && response.data !== "") {
      data = response.data;
      setresListData(data);
      setresListDataLoading(false);
    }
  };

  const IdentitiesOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "IDENTITIES_SUCESS" && response.data !== "") {
      data = response.data;

      let group = Object.values(
        data.reduce((r, a) => {
          r[a.group] = r[a.group] || a.group;
          return r;
        }, {}),
      );
      group.sort();

      group.sort((a, b) => {
        var nameA = a.toLowerCase(),
          nameB = b.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
      });

      setIdentityData((oldState) => {
        return response.data
          .map(({ name }) => name)
          .sort((A, B) => {
            const a = A.toLowerCase();
            const b = B.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
          });
      });
      setIdentityDataLoading(false);
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

  const handleSave = (row, setTaskStatus, oldRow, setGridAllRows, gridCols) => {
    const protocol =
      row?.protocol === "UDP" ? "udp" : row?.protocol === "TCP" ? "tcp" : "All";

    // Row validation
    let tests = [
      {
        runner: ValidationHelper.validateAllGroupsFlag_Yes,
        args: [row.dynGroups, row.allDynGroup],
        success: "",
        error: (
          <Trans
            i18nKey={"page.manage.Rules.Field Error.Selected Groups"}
            components={[<br />]}
          >
            Selected groups will be ignored as "All Identity Groups" field is
            set to "Yes".
            <br />
            Please set it to "No" to apply rule only to selected groups.
          </Trans>
        ),
      },
    ];

    let result = ValidationHelper.batchValidator(tests);
    if (result !== "") {
      let shouldProceed = window.confirm(
        t(
          "page.manage.Rules.Action Options.Prompt.Edit Status Prompt.To Continue",
        ),
      );
      if (shouldProceed === false) {
        let status = {
          inProgress: false,
          error: true,
          message: t(
            "page.manage.Rules.Action Options.Prompt.Edit Status Prompt.Save Option Cancel",
          ),
        };
        setTaskStatus(status);
        return;
      }
    } else {
      tests = [
        {
          runner: ValidationHelper.validateAllGroupsFlag_No,
          args: [row.dynGroups, row.allDynGroup],
          success: "",
          error: (
            <Trans
              i18nKey={"page.manage.Rules.Field Error.At Least One"}
              components={[<br />]}
            >
              At least one group needs to be selected as "All Identity Groups"
              field is set to "No".
              <br />
              Please set it to "Yes" to apply rule to all selected groups or
              select at least one group.
            </Trans>
          ),
        },
      ];
      result = ValidationHelper.batchValidator(tests);
      if (result !== "") {
        let status = {
          inProgress: false,
          error: true,
          message: (
            <Trans
              i18nKey={
                "page.manage.Rules.Action Options.Prompt.Saved Status Prompt.Can't Save"
              }
              values={{ rowName: row.name, rowAction: row.action }}
              components={[<br />]}
            >
              Can't save rule with name "{row.name}" and action "{row.action}".
              You MUST select at least 1 group when you have selected "No" for
              "All Identity Groups" field.
              <br />
              <br />
              Please select a group or set "All Identity Groups" field to "Yes"
              and try again.
            </Trans>
          ),
        };
        setTaskStatus(status);
        return;
      }
    }

    let newRow = {
      //...row,
      id: row["id"],
      name: row["name"],
      app: row["app"] === "ANY" ? "" : row.app,
      trustLevel: row["trustLevel"],
      action: row["action"],
      resources: row["resources"],
      dynGroups: row["dynGroups"],
      allDynGroup: row.allDynGroup === "Yes" ? 1 : 0,
      enabled: row.enabled === "True" ? "true" : "false",
    };

    if (row.resource !== null && typeof row.resource !== "object") {
      newRow.resource = row.resource === "" ? [] : row.resource.split(", ");
      newRow.resources = newRow.resource;
    }

    delete newRow.resource;

    if (row.dynGroups !== null && typeof row.dynGroups !== "object") {
      newRow.dynGroups = row.dynGroups === "" ? [] : row.dynGroups.split(", ");
    }

    delete newRow["__isEditMode"];

    // if (row.allDynGroup === "Yes") {
    //   const $ = gridCols.filter(({ dataKey }) =>
    //     dataKey.includes("dynGroups")
    //   )[0].options;

    //   newRow.dynGroups.filter(
    //     (group) =>
    //       (group.dataKey.includes("dynGroups")[0].options = !$.includes(group))
    //   );

    //   const newGroup = [...newRow.dynGroups, ...$];

    //   newRow.dynGroups = [...newGroup];
    // }

    if (row.allDynGroup.toLowerCase() === "yes" && row?.id == "_newRow") {
      const [groupsColumn] = gridCols.filter(({ dataKey }) => {
        return dataKey.includes("dynGroups");
      });

      const options = groupsColumn.options;

      const filtered = newRow.dynGroups.filter(
        (group) => !options.includes(group),
      );

      const newDynGroups = [...filtered, ...options];

      newRow.dynGroups = [...newDynGroups];
    }

    if (newRow["id"] === "_newRow") {
      delete newRow["id"];
    }

    if (activeProtocols.includes("UDP")) {
      newRow.protocol = protocol;
    }

    callAPI({
      path: "save-rule",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: newRow,
      responder: SaveRuleAPIResponder,
      onComplete: SaveRuleOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const SaveRuleOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SAVE_RULES_SUCESS") {
      // alert("Rows Deleted");
      /* For Gateway */
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
        // row.resource = `${row.name}List`;
        // row.resources = [`${row.name}List`];
      }

      let status = {
        inProgress: false,
        error: false,
        payload: {
          ...row,
          dynGroups: response.data.dynGroups.join(", "),
          resource: response?.data?.resource || "",
          app: response.data.app || "ANY",
        },
        message: t(
          "page.manage.Rules.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name, rowAction: row.action },
        ),
      };
      setTaskStatus(status);
    } else {
      // alert("Error updating the DNS list. Please try again.");
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Rules.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name, rowAction: row.action }}
              components={[<br />]}
            >
              Error saving rule with name "{row.name}" and action "{row.action}
              ". Please try again.
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

  const handleDelete = (row, setTaskStatus) => {
    if (!!!activeProtocols.includes("UDP")) {
      delete row.protocol;
    }

    let newRow = {
      ...row,
      allDynGroup: row.allDynGroup === "Yes" ? 1 : 0,
      enabled: row.enabled === "True" ? "true" : "false",
    };
    /* if (row.resources !== null && typeof row.resources !== "object") {
      newRow.resources = row.resources === "" ? [] : row.resources.split(", ");
    } */
    if (row.dynGroups !== null && typeof row.dynGroups !== "object") {
      newRow.dynGroups = row.dynGroups === "" ? [] : row.dynGroups.split(", ");
    }

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "delete-rule",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
      },
      data: newRow,
      responder: DeleteRuleAPIResponder,
      onComplete: DeleteRuleOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteRuleOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_RULES_SUCESS") {
      // alert("Rows Deleted");
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.manage.Rules.Action Options.Prompt.Delete Status Prompt.Success",
          { rowName: row.name, rowAction: row.action },
        ),
      };
      setTaskStatus(status);
    } else {
      // alert("Error updating the DNS list. Please try again.");
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Rules.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ rowName: row.name, rowAction: row.action }}
              components={[<br />]}
            >
              Error deleting rule with name "{row.name}" and action "
              {row.action}
              ". Please try again.
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

  const handleEdit = (newRow, setTaskStatus) => {
    // code goes here...
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTimeout(() => {
      setTaskStatus(status);
    }, 500);
  };

  let config = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    fallbackRow: {
      trustLevel: 5,
      protocol: "All",
    },
    addHandler: {
      handleSave,
      handleDiscard: (newRow, setTaskStatus) => {
        setTaskStatus({
          inProgress: false /* Required should be false */,
          error: false /* error Flag */,
          message: "" /* Default: '' success or failure message */,
        });
      },
    },
  };

  let columns = [
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
          const pattern = new RegExp(/^[A-Za-z0-9]{1,}$/);
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
              runner: ValidationHelper.testPattern,
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
      headerName: t("commons.Component.Table Content.Action Field.Header Name"),
      dataKey: "action",
      minWidth: 180,
      flexWidth: 1.5,
      type: "select-single",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      options: ["Forward", "Drop"],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^.+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Action Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Protected Resource(s) Field.Header Name",
      ),
      dataKey: "resource",
      minWidth: 250,
      flexWidth: 2.5,
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
          const pattern = new RegExp(/^.+$/);
          const tests = [];
          const tacTests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Protected Resource(s) Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          const result = isTac
            ? ValidationHelper.batchValidator(tacTests)
            : ValidationHelper.batchValidator(tests);

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
        "commons.Component.Table Content.Group(s) Field.Header Name",
      ),
      dataKey: "dynGroups",
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
          let tests = [
            {
              runner: ValidationHelper.validateAllGroupsFlag_No,
              args: [row.dynGroups, row.allDynGroup],
              success: "",
              error: (
                <Trans
                  i18nKey={"page.manage.Rules.Field Error.At Least One"}
                  components={[<br />]}
                >
                  At least one group needs to be selected as "All Identity
                  Groups" field is set to "No".
                  <br />
                  Please set it to "Yes" to apply rule to all selected groups or
                  select at least one group.
                </Trans>
              ),
            },
          ];

          let result = ValidationHelper.batchValidator(tests);
          if (result !== "") {
            return { isValid: true, message: result };
          }
          // tests = [
          //   {
          //     runner: ValidationHelper.validateAllGroupsFlag_Yes,
          //     args: [row.dynGroups, row.allDynGroup],
          //     success: "",
          //     error: (
          //       <>
          //         Selected groups will be ignored as "All Identity Groups" field
          //         is set to "Yes".
          //         <br />
          //         Please set it to "No" to apply rule only to selected groups.
          //       </>
          //     ),
          //   },
          // ];
          // result = ValidationHelper.batchValidator(tests);
          return { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t("commons.Component.Table Content.App Field.Header Name"),
      dataKey: "app",
      minWidth: 200,
      flexWidth: 2,
      type: "select-single",
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
          const pattern = new RegExp(/^.+$/);
          const tests = [];
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
        "commons.Component.Table Content.Trust Level Field.Header Name",
      ),
      dataKey: "trustLevel",
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 2.3 : 1.5,
      type: "select-single",
      headerAlignment: "left",
      contentAlignment: "center",
      options: [3, 4, 5, 6],
      sortable: true,
      renderViewState: (columns, row, value) => {
        return <TrustLevel level={value} />;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^.+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Trust Level Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Protocol Field.Header Name",
      ),
      dataKey: "protocol",
      type: "select-single",
      options: ["TCP", "UDP", "All"],
      minWidth: 150,
      flexWidth: i18n.language === "es" ? 2.3 : 1.5,
      headerAlignment: "left",
      contentAlignment: "left",
      hideColumn: !isUDP,
      isDisableEdit: !isUDP,
      isDisableAdd: !isUDP,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^.+$/);
          const tests = [];
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
        "commons.Component.Table Content.All Identity Groups Field.Header Name",
      ),
      dataKey: "allDynGroup",
      minWidth: 175,
      flexWidth: i18n.language === "es" ? 3.5 : 1.75,
      type: "select-single",
      sortable: true,
      options: ["Yes", "No"],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          let tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [row.allDynGroup],
              success: "",
              error: t(
                "commons.Component.Table Content.All Identity Groups Field.Validation.Errors.Mandatory",
              ),
            },
          ];

          let result = ValidationHelper.batchValidator(tests);
          if (result !== "") {
            return { isValid: false, message: result };
          }

          tests = [
            {
              runner: ValidationHelper.validateAllGroupsFlag_No,
              args: [row.dynGroups, row.allDynGroup],
              success: "",
              error: (
                <Trans
                  i18nKey={"page.manage.Rules.Field Error.At Least One"}
                  components={[<br />]}
                >
                  At least one group needs to be selected as "All Identity
                  Groups" field is set to "No".
                  <br />
                  Please set it to "Yes" to apply rule to all selected groups or
                  select at least one group.
                </Trans>
              ),
            },
            {
              runner: ValidationHelper.validateAllGroupsFlag_Yes,
              args: [row.dynGroups, row.allDynGroup],
              success: "",
              error: (
                <Trans
                  i18nKey={"page.manage.Rules.Field Error.Selected Groups"}
                  components={[<br />]}
                >
                  Selected groups will be ignored as "All Identity Groups" field
                  is set to "Yes".
                  <br />
                  Please set it to "No" to apply rule only to selected groups.
                </Trans>
              ),
            },
          ];
          result = ValidationHelper.batchValidator(tests);
          return { isValid: true, message: result };
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
      minWidth: 175,
      flexWidth: 1.75,
      type: "select-single",
      sortable: true,
      options: ["True", "False"],
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^.+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Enabled Field.Validation.Errors.Mandatory",
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
        "commons.Component.Table Content.Action Option.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      minWidth: 100,
      flexWidth: 1,
      actions: [
        {
          type: "__edit",
          name: t("page.manage.Rules.Action Options.Tool Tip.Edit"),
          //   isEnabled: (row) => row.enabled === "False",
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
        {
          // Internally recognized and implemented delete row action
          type: "__delete", // Required; Must be a custom key unique to all actions in this array or a key internally recognized by the grid;
          // "__delete" is an internally recognized key for delete row functionality.
          name: t("page.manage.Rules.Action Options.Tool Tip.Delete"), // String that will be used as a tooltip or null to denote no tooltip; Default: "Delete"
          handleDelete,
          prompt: {
            contentTitle: t(
              "page.manage.Rules.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.manage.Rules.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this rule
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
        },
      ], // A list of actions that appear in this column in the form of icon buttons
    },
  ];

  let subconscious = {
    name: "ba-rules-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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
        path: "rules",
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
              contentTitle: t("page.manage.Rules.Fetch Status.Error.Title"),
              contentText: (
                <>
                  <Trans
                    i18nKey={"page.manage.Rules.Fetch Status.Error.Content"}
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

            const result = payload.map((record) => {
              let row = { ...record };
              row.allDynGroup = row.allDynGroup === 0 ? "No" : "Yes";
              row.enabled = row.enabled === false ? "False" : "True";
              row.dynGroups =
                row.dynGroups === null || row.dynGroups === undefined
                  ? ""
                  : row.dynGroups.join(", ");

              if (activeProtocols.includes("UDP")) {
                row.protocol =
                  row?.protocol.toUpperCase() === "UDP"
                    ? "udp"
                    : row?.protocol.toUpperCase() === "TCP"
                    ? "tcp"
                    : "All";
              }

              return row;
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
  let [gridRows, setGridRows] = useState([]);
  let [loading, setLoading] = useState(true);
  let [rulesDataLoading, setRulesDataLoading] = useState(true);
  let [rulesData, setRulesData] = useState([]);
  let [appsDataLoading, setAppsDataLoading] = useState(true);
  let [appsData, setAppsData] = useState([]);
  let [resDataLoading, setProResourceDataLoading] = useState(true);
  let [resData, setProResourceData] = useState([]);
  let [resListDataLoading, setresListDataLoading] = useState(true);
  let [resListData, setresListData] = useState([]);
  let [identityDataLoading, setIdentityDataLoading] = useState(true);

  const markAsLoading = () => {
    setLoading(true);
    setAppsDataLoading(true);
    setRulesDataLoading(true);
    setProResourceDataLoading(true);
    setresListDataLoading(true);
    setIdentityDataLoading(true);
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
      rulesDataLoading === true &&
      appsDataLoading === true &&
      resDataLoading === true &&
      resListDataLoading === true &&
      identityDataLoading === true
    ) {
      callAPI({
        path: "rules",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: RulesAPIResponder,
        onComplete: RulesOnCompleteHandler,
      });
      callAPI({
        path: "getApps",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ApplicationAPIResponder,
        onComplete: ApplicationsOnCompleteHandler,
      });
      callAPI({
        path: "resources",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ProResourceAPIResponder,
        onComplete: ProResourceOnCompleteHandler,
      });
      callAPI({
        path: "resourcelist",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ResourceListAPIResponder,
        onComplete: ResListOnCompleteHandler,
      });
      // GetTrustLevelGroups
      callAPI({
        path: "trust-groups",
        // path: "identities",
        params: { gatewayIP: gatewayAddress },
        data: {},
        responder: IdentitiesAPIResponder,
        onComplete: IdentitiesOnCompleteHandler,
      });
    }
  }, [
    gatewayAddress,
    rulesDataLoading,
    appsDataLoading,
    resDataLoading,
    resListDataLoading,
    identityDataLoading,
  ]);

  useEffect(() => {
    if (
      !rulesDataLoading &&
      !appsDataLoading &&
      !resDataLoading &&
      !resListDataLoading &&
      !identityDataLoading
    ) {
      // let allApps = appsData.map(app => app.name);
      let allApps = [...new Set([...appsData.map((app) => app.name)])];
      /* let allResources = resData.map(res => res.name);
      let allResourcesList = resListData.map((resList) => resList.name); */
      let allProtectedResources = [
        ...new Set([
          ...resData.map((res) => res.name),
          ...resListData.map((resList) => resList.name),
        ]),
      ];

      let dynamicOptionFilledColumns = columns.map((col) => {
        let newCol = { ...col };
        if (newCol.dataKey === "app") {
          newCol.options = allApps;
        } else if (newCol.dataKey === "resource") {
          newCol.options = allProtectedResources;
        } else if (newCol.dataKey === "dynGroups") {
          newCol.options = identityData;
        }
        return newCol;
      });

      // Pre-process rules
      let rules = rulesData.map((row) => {
        let newRow = { ...row };
        newRow.allDynGroup = newRow.allDynGroup === 0 ? "No" : "Yes";
        newRow.enabled = newRow.enabled === false ? "False" : "True";
        newRow.dynGroups = newRow.dynGroups.join(", ") || "";
        newRow.app = newRow.app || "ANY";
        newRow.resource = newRow.resource || "";

        return newRow;
      });

      setGridCols(dynamicOptionFilledColumns);
      setRulesData(rules);
      setGridRows(rules);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [
    rulesDataLoading,
    appsDataLoading,
    resDataLoading,
    resListDataLoading,
    identityDataLoading,
  ]);

  return (
    <Styled.Container component={"section"}>
      <AppInContentHeader
        title={AppConfig.pages.rum.title}
        breadcrumb={AppConfig.pages.rum.breadcrumb}
      />
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

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </Styled.Container>
  );
};

export default withRouter(withCookies(DataGridRulesConfig));
