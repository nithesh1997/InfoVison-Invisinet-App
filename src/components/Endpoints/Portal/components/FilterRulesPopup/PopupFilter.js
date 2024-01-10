import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@material-ui/core";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { InfoCircle } from "react-bootstrap-icons";
import { SyncDisabledRounded } from "@material-ui/icons";
import BrowserNotSupportedOutlinedIcon from "@mui/icons-material/BrowserNotSupportedOutlined";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import React, { useContext, useEffect, useState } from "react";
import Styled from "./MaterialComponents/PopupFilter.style";
import callAPI from "../../../../../apis/callAPI";
import { getEPCFRTemplateResponder } from "../../../../../apis/responders/FirmwareResponder";
import { GetTaskStatusResponder } from "../../../../../apis/responders/GetTaskStatusResponder";
import { SaveEPCFRRulesResponder } from "../../../../../apis/responders/SaveEPCFRRulesResponder";
import Utility from "../../../../../redux/actions/Utility";
import ValidationHelper from "../../../../../utils/validationHelper/ValidationHelper";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../../../../General/WidthFillerSkeleton";
import { StyledMat } from "../../ClearFilterRuleAction/StyledMat";
import PreProcessValidation from "../../PreProcessValidation/PreProcessValidation";
import AlertPopup from "../AlertPopup";
import FilterTable from "./FilterTable";
import { GenericButton } from "../../../../../style/GenericButton/GenericButton";
import { endpoint } from "./../../../../../utils/GeneralComponentNames";
import { useSelector } from "react-redux";
import Prompt from "../../../../DeletePrompt/Prompt";
import loadingText from "../../../../../images/right.svg";
import { Trans, useTranslation } from "react-i18next";

const initModalAlert = {
  open: false,
  contentTitle: "",
  contentText: "",
  onClose: () => {},
  onCloseArgs: [],
};

const initEpcCheck = { state: "init", message: "" };

export const PopupFilter = (props) => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const AppOverlayContext = useContext(OverlayContext);

  const [loading, setLoading] = useState({ loaded: false });
  const [epCheckState, setEPCheckState] = useState(initEpcCheck);
  const [filterRuleData, setFilterRuleData] = useState([]);
  const [loadData, setLoadData] = useState([]);
  const [editState, setEditState] = useState({});
  const [ruleUneditableInfo, setRuleUneditableInfo] = useState({});
  const [saving, setSaving] = useState(false);
  const [eligibleRows, setEligibleRows] = useState([]);
  const [inEligibleRows, setInEligibleRows] = useState([]);
  const [logsLoading, setLogsLoading] = useState("loading");
  const [modalAlert, setModalAlert] = useState(initModalAlert);
  const [prompt, setPrompt] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [disableReset, setDisableReset] = useState(false);

  const { t } = useTranslation();

  const validateSIP = ({ value, error, helperText, $ }) => {
    const { tid, itype, ilabel, rnum, relativeLabel } = $;
    const regex = new RegExp(/^(ANY)$/);
    const destinationIP =
      editState?.[tid]?.["dip"]?.[relativeLabel]?.[rnum]?.value ?? "";
    let data;

    if (rnum === "1021" || rnum === "1022" || rnum === "1023") {
      error = false;
      return { value, error, helperText };
    }

    if (value.toUpperCase() === "ANY") {
      const tests = [
        {
          runner: ValidationHelper.testRegex,
          args: [value, regex],
          success: "",
          error: t(
            "commons.Component.Table Content.Source Port Field.Validation.Errors.Invalid",
          ),
        },
      ];
      data = ValidationHelper.batchValidator(tests);
    } else if (value.includes(".")) {
      const tests = [
        {
          runner: ValidationHelper.isNotEmpty,
          args: [value],
          success: "",
          error: t(
            "page.Endpoint.Configure.configureFilterRulesModal.blankSourceIp",
          ),
        },
        {
          runner: ValidationHelper.isIPv4WithPrefixOrWildcard,
          args: [value],
          success: "",
          error: (
            <p style={{ height: "0.1rem", marginTop: 0 }}>
              {t("page.Endpoint.Configure.bulkTable.Tool Tip.Source IP Title")}
              <ToolTip
                title={
                  <>
                    <p>
                      {" "}
                      {t(
                        "page.Endpoint.Configure.bulkTable.Tool Tip.Source Ip Description",
                      )}
                    </p>

                    <ul style={{ paddingLeft: "1rem" }}>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Octet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code>{" "}
                          with just octet sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> with Prefix range between
                          8-32 such as <code>1.2.3.4/24</code>
                        </Trans>
                      </li>

                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Hextet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> such as{" "}
                          <code>2001:db8:3333::0:00FF:08</code> with just hextet
                          sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> with prefix range between
                          48-128 such as{" "}
                          <code>2001:db8:3333::0:00FF:08/56</code>
                        </Trans>
                      </li>
                    </ul>
                  </>
                }
              >
                <Styled.TooltipButton>
                  <InfoCircle size={"0.55em"} />
                </Styled.TooltipButton>
              </ToolTip>
            </p>
          ),
        },
      ];

      data = ValidationHelper.batchValidator(tests);
    } else {
      const tests = [
        {
          runner: ValidationHelper.isNotEmpty,
          args: [value],
          success: "",
          error: t(
            "page.Endpoint.Configure.configureFilterRulesModal.blankSourceIp",
          ),
        },
        {
          runner: ValidationHelper.isIPv6WithPrefix,
          args: [value, true],
          success: "",
          error: (
            <p style={{ height: "0.1rem", marginTop: 0 }}>
              {t("page.Endpoint.Configure.bulkTable.Tool Tip.Source IP Title")}
              <ToolTip
                title={
                  <>
                    <p>
                      {" "}
                      {t(
                        "page.Endpoint.Configure.bulkTable.Tool Tip.Source Ip Description",
                      )}
                    </p>

                    <ul style={{ paddingLeft: "1rem" }}>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Octet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code>{" "}
                          with just octet sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> with Prefix range between
                          8-32 such as <code>1.2.3.4/24</code>
                        </Trans>
                      </li>

                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Hextet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> such as{" "}
                          <code>2001:db8:3333::0:00FF:08</code> with just hextet
                          sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> with prefix range between
                          48-128 such as{" "}
                          <code>2001:db8:3333::0:00FF:08/56</code>
                        </Trans>
                      </li>
                    </ul>
                  </>
                }
              >
                <Styled.TooltipButton>
                  <InfoCircle size={"0.55em"} />
                </Styled.TooltipButton>
              </ToolTip>
            </p>
          ),
        },
      ];

      data = ValidationHelper.batchValidator(tests);
    }

    if (data === "") {
      error = false;
    } else {
      error = true;
    }

    const passAny = value === "ANY" && destinationIP === "ANY";

    if (!data && value && destinationIP === value && !passAny) {
      error = true;
      data = t("page.Endpoint.Configure.configureFilterRulesModal.sameMessage");

      const ruleNumbers = Object.keys(editState[tid]["dip"][relativeLabel])
        .filter((item) => item !== "linked" && item !== "focussed")
        .map((item) => (!isNaN(item) ? Number(item) : false));

      setEditState((oldState) => {
        const newState = { ...oldState };

        ruleNumbers.forEach((ruleNumber) => {
          editState[tid]["dip"][relativeLabel][ruleNumber].error = true;
          editState[tid]["dip"][relativeLabel][ruleNumber].helperText = t(
            "page.Endpoint.Configure.configureFilterRulesModal.sameMessage",
          );
        });

        return newState;
      });
    } else {
      const ruleNumbers = Object.keys(editState[tid]["dip"][relativeLabel])
        .filter((item) => item !== "linked" && item !== "focussed")
        .map((item) => (!isNaN(item) ? Number(item) : false));

      setEditState((oldState) => {
        const newState = { ...oldState };

        ruleNumbers.forEach((ruleNumber) => {
          const helperText = t(
            "page.Endpoint.Configure.configureFilterRulesModal.sameMessage",
          );
          const currentHelperText =
            editState[tid]["dip"][relativeLabel][ruleNumber].helperText;

          if (currentHelperText === helperText) {
            editState[tid]["dip"][relativeLabel][ruleNumber].error = false;
            editState[tid]["dip"][relativeLabel][ruleNumber].helperText = "";
          }
        });

        return newState;
      });
    }

    helperText = data;

    return { value, error, helperText };
  };

  const validateDIP = ({ value, error, helperText, $ }) => {
    const { tid, itype, ilabel, rnum, relativeLabel } = $;
    const regex = new RegExp(/^(ANY)$/);
    const sourceIP =
      editState?.[tid]?.["sip"]?.[relativeLabel]?.[rnum]?.value ?? "";
    let data;

    if (rnum === "1021" || rnum === "1022" || rnum === "1023") {
      error = false;
      return { value, error, helperText };
    }
    if (value.toUpperCase() === "ANY") {
      const tests = [
        {
          runner: ValidationHelper.testRegex,
          args: [value, regex],
          success: "",
          error: t(
            "commons.Component.Table Content.Source Port Field.Validation.Errors.Invalid",
          ),
        },
      ];
      data = ValidationHelper.batchValidator(tests);
    } else if (value.includes(".")) {
      const tests = [
        {
          runner: ValidationHelper.isNotEmpty,
          args: [value],
          success: "",
          error: t(
            "page.Endpoint.Configure.configureFilterRulesModal.blankDestinationIp",
          ),
        },
        {
          runner: ValidationHelper.isIPv4WithPrefixOrWildcard,
          args: [value],
          success: "",
          error: (
            <p style={{ height: "0.1rem", marginTop: 0 }}>
              {t(
                "page.Endpoint.Configure.bulkTable.Tool Tip.Destination IP Title",
              )}
              <ToolTip
                title={
                  <>
                    <p>
                      {" "}
                      {t(
                        "page.Endpoint.Configure.bulkTable.Tool Tip.Destination IP Description",
                      )}
                    </p>

                    <ul style={{ paddingLeft: "1rem" }}>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Octet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code>{" "}
                          with just octet sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> with Prefix range between
                          8-32 such as <code>1.2.3.4/24</code>
                        </Trans>
                      </li>

                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Hextet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> such as{" "}
                          <code>2001:db8:3333::0:00FF:08</code> with just hextet
                          sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> with prefix range between
                          48-128 such as{" "}
                          <code>2001:db8:3333::0:00FF:08/56</code>
                        </Trans>
                      </li>
                    </ul>
                  </>
                }
              >
                <Styled.TooltipButton>
                  <InfoCircle size={"0.55em"} />
                </Styled.TooltipButton>
              </ToolTip>
            </p>
          ),
        },
      ];

      data = ValidationHelper.batchValidator(tests);
    } else {
      const tests = [
        {
          runner: ValidationHelper.isNotEmpty,
          args: [value],
          success: "",
          error: t(
            "page.Endpoint.Configure.configureFilterRulesModal.blankDestinationIp",
          ),
        },
        {
          runner: ValidationHelper.isIPv6WithPrefix,
          args: [value, true],
          success: "",
          error: (
            <p style={{ height: "0.1rem", marginTop: 0 }}>
              {t(
                "page.Endpoint.Configure.bulkTable.Tool Tip.Destination IP Title",
              )}
              <ToolTip
                title={
                  <>
                    <p>
                      {" "}
                      {t(
                        "page.Endpoint.Configure.bulkTable.Tool Tip.Destination IP Description",
                      )}
                    </p>

                    <ul style={{ paddingLeft: "1rem" }}>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Octet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code>{" "}
                          with just octet sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv4 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv4 Address</b> with Prefix range between
                          8-32 such as <code>1.2.3.4/24</code>
                        </Trans>
                      </li>

                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Hextet Section"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> such as{" "}
                          <code>2001:db8:3333::0:00FF:08</code> with just hextet
                          sections.
                        </Trans>
                      </li>
                      <li style={{ margin: "0.2rem 0" }}>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.bulkTable.Tool Tip.List.Ipv6 Prefix Range"
                          }
                          components={[<b />, <code />]}
                        >
                          Valid <b>IPv6 Address</b> with prefix range between
                          48-128 such as{" "}
                          <code>2001:db8:3333::0:00FF:08/56</code>
                        </Trans>
                      </li>
                    </ul>
                  </>
                }
              >
                <Styled.TooltipButton>
                  <InfoCircle size={"0.55em"} />
                </Styled.TooltipButton>
              </ToolTip>
            </p>
          ),
        },
      ];
      data = ValidationHelper.batchValidator(tests);
    }

    if (data === "") {
      error = false;
    } else {
      error = true;
    }

    const passAny = value === "ANY" && sourceIP === "ANY";

    if (!data && value && sourceIP === value && !passAny) {
      error = true;
      data = t("page.Endpoint.Configure.configureFilterRulesModal.sameMessage");

      const ruleNumbers = Object.keys(editState[tid]["sip"][relativeLabel])
        .filter((item) => item !== "linked" && item !== "focussed")
        .map((item) => (!isNaN(item) ? Number(item) : false));

      setEditState((oldState) => {
        const newState = { ...oldState };

        ruleNumbers.forEach((ruleNumber) => {
          editState[tid]["sip"][relativeLabel][ruleNumber].error = true;
          editState[tid]["sip"][relativeLabel][ruleNumber].helperText = t(
            "page.Endpoint.Configure.configureFilterRulesModal.sameMessage",
          );
        });

        return newState;
      });
    } else {
      const ruleNumbers = Object.keys(editState[tid]["sip"][relativeLabel])
        .filter((item) => item !== "linked" && item !== "focussed")
        .map((item) => (!isNaN(item) ? Number(item) : false));

      setEditState((oldState) => {
        const newState = { ...oldState };

        ruleNumbers.forEach((ruleNumber) => {
          const helperText = t(
            "page.Endpoint.Configure.configureFilterRulesModal.sameMessage",
          );
          const currentHelperText =
            editState[tid]["sip"][relativeLabel][ruleNumber].helperText;

          if (currentHelperText === helperText) {
            editState[tid]["sip"][relativeLabel][ruleNumber].error = false;
            editState[tid]["sip"][relativeLabel][ruleNumber].helperText = "";
          }
        });

        return newState;
      });
    }

    helperText = data;

    return { value, error, helperText };
  };

  const validateSPort = ({ value, error, helperText }) => {
    const regex = new RegExp(/^([0-9]+|ANY)$/);
    const tests = [
      {
        runner: ValidationHelper.isNotEmpty,
        args: [value],
        success: "",
        error: "Source Port cannot be empty.",
      },
      {
        runner: ValidationHelper.testRegex,
        args: [value, regex],
        success: "",
        error: t(
          "commons.Component.Table Content.Source Port Field.Validation.Errors.Invalid",
        ),
      },
      {
        runner: ValidationHelper.isPortOrWildcard,
        args: [value],
        success: "",
        error: (
          <>
            {t(
              "commons.Component.Table Content.Source Port Field.Validation.Errors.Range",
            )}
          </>
        ),
      },
    ];

    let data = ValidationHelper.batchValidator(tests);

    if (data === "") {
      error = false;
    } else {
      error = true;
    }

    helperText = data;

    return { value, error, helperText };
  };

  const validateDPort = ({ value, error, helperText }) => {
    const regex = new RegExp(/^([0-9]+|ANY)$/);
    const tests = [
      {
        runner: ValidationHelper.isNotEmpty,
        args: [value],
        success: "",
        error: t(
          "page.Endpoint.Configure.configureFilterRulesModal.blankDestinationPort",
        ),
      },
      {
        runner: ValidationHelper.testRegex,
        args: [value, regex],
        success: "",
        error: t(
          "page.Endpoint.Configure.configureFilterRulesModal.destinationPortInvalid",
        ),
      },
      {
        runner: ValidationHelper.isPortOrWildcard,
        args: [value],
        success: "",
        error: (
          <>
            {/* Destination Port should be in the range of <b>0 - 65535</b>. */}
            <Trans
              i18nKey={
                "page.Endpoint.Configure.configureFilterRulesModal.rangeDestinationPort"
              }
              components={[<b />]}
            >
              Destination Port should be in the range of <b>0 - 65535</b>.
            </Trans>
          </>
        ),
      },
    ];
    let data = ValidationHelper.batchValidator(tests);

    if (data === "") {
      error = false;
    } else {
      error = true;
    }

    helperText = data;

    return { value, error, helperText };
  };

  const validate = (itype, val) => {
    if (itype === "sip") {
      return validateSIP(val);
    } else if (itype === "dip") {
      return validateDIP(val);
    } else if (itype === "sport") {
      return validateSPort(val);
    } else if (itype === "dport") {
      return validateDPort(val);
    }

    return val;
  };

  const closeModalHandler = () => {
    modalAlert.onClose(...modalAlert.onCloseArgs);
    setModalAlert(initModalAlert);
  };

  const handleSave = () => {
    let templates = [];
    let keys = ["sip", "sport", "dip", "dport"];
    let oppositeLabel = "";

    setSaving(true);

    // List items to be processed
    filterRuleData.forEach((template) => {
      if (template.isChecked === true) {
        templates.push(template.id);
      }
    });

    if (templates.length == 1 && templates[0] == 4) {
      // default template
      const contentText = t(
        "page.Endpoint.Configure.configureFilterRulesModal.taskRequired",
      );

      setModalAlert({
        open: true,
        contentTitle: t("commons.errorText"),
        contentText,
        onCloseArgs: [],
        onClose: () => {
          setSaving(false);
        },
      });

      return;
    }

    // Validate user inputs
    let invalidRules = [];
    templates.forEach((tid) => {
      keys.forEach((key) => {
        let labels = Object.keys(editState[tid][key]);

        labels.forEach((label, index) => {
          let rules = Object.keys(editState[tid][key][label]);

          if (key === "sip") {
            const labels = Object.keys(editState[tid]["dip"]);

            oppositeLabel = labels[index] ?? "";
          }

          if (key === "dip") {
            const labels = Object.keys(editState[tid]["sip"]);

            oppositeLabel = labels[index] ?? "";
          }

          rules.forEach((rule) => {
            if (rule === "linked" || rule === "focussed") {
              return; // Extraneous key
            }

            let value = editState[tid][key][label][rule].value;
            let error = editState[tid][key][label][rule].error;
            let helperText = editState[tid][key][label][rule].helperText;

            // Validate the value: editState[tid][key][label][rule].value
            ({ value, error, helperText } = validate(key, {
              value,
              error,
              helperText,
              $: {
                tid,
                itype: key,
                ilabel: label,
                rnum: rule,
                relativeLabel: oppositeLabel,
              },
            }));

            setEditState((oldState) => {
              let newState = { ...oldState };
              newState[tid][key][label][rule] = {
                value,
                error,
                helperText,
              };
              return newState;
            });

            if (error === true) {
              invalidRules.push(rule + "-" + key);
            }
          });
        });
      });
    });

    if (invalidRules.length > 0) {
      let len = invalidRules.length;
      const contentText =
        len +
        t(
          "page.Endpoint.Configure.configureFilterRulesModal.invalidRules.line1",
        ) +
        (len > 1 ? "s" : "") +
        t(
          "page.Endpoint.Configure.configureFilterRulesModal.invalidRules.line2",
        ) +
        (len > 1 ? "s" : "") +
        t(
          "page.Endpoint.Configure.configureFilterRulesModal.invalidRules.line3",
        );

      setModalAlert({
        open: true,
        contentTitle: "Error",
        contentText,
        onCloseArgs: [],
        onClose: () => {
          setSaving(false);
        },
      });

      return;
    }

    // Generate data object
    let data = {
      endpointIds: eligibleRows.map(({ endpoint_ID }) => endpoint_ID),
      taskId: 6,
      rules: {}, // later converted into an array
    };

    // Populate data with new rules
    templates.forEach((tid) => {
      keys.forEach((key) => {
        let labels = Object.keys(editState[tid][key]);
        labels.forEach((label) => {
          let rules = Object.keys(editState[tid][key][label]);
          rules.forEach((rule) => {
            if (rule === "linked" || rule === "focussed") {
              return; // Extraneous key
            }
            if (key === keys[0]) {
              data.rules[rule] = {
                ...ruleUneditableInfo[rule],
                templateId: tid,
              };
            }
            delete data.rules[rule][key + "Label"];
            data.rules[rule][key] = editState[tid][key][label][rule].value;
          });
        });
      });
    });

    data.rules = Object.values(data.rules);
    // Call save API
    callAPI({
      path: "add-configure-filter-rules-task",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
      },
      data,
      responder: SaveEPCFRRulesResponder,
      onComplete: onCompleteSaveEPCFRRules,
      onCompleteArguments: [],
    });

    props.setViewFilterRuleConfig((oldState) => ({
      ...oldState,
      tableRows: undefined,
      selectedRows: [...data.rules],
      setTaskStatus: () => {},
    }));
  };

  const onCompleteSaveEPCFRRules = (response) => {
    setSaving(false);

    if (response.state === "SAVE_SUCESS") {
      const contentText = t(
        "page.Endpoint.Configure.configureFilterRulesModal.successSaving",
      );

      setModalAlert({
        open: true,
        contentTitle: t(
          "page.Endpoint.Configure.configureFilterRulesModal.alert.titleSuccess",
        ),
        contentText,
        onCloseArgs: [],
        onClose: () => {
          props.cancelHandler();
        },
      });
    } else {
      const contentText =
        t("page.Endpoint.Configure.bulkTable.configurRulesError") +
        Utility.getErrorsFromResponse(response, true).join("\n- ");

      setModalAlert({
        open: true,
        contentTitle: t("commons.errorText"),
        contentText,
        onCloseArgs: [],
        onClose: () => {
          setSaving(false);
        },
      });
    }
  };

  const handleChange = (e, el) => {
    setFilterRuleData((oldState) => {
      const newState = oldState.map((data) => {
        if (el.id === data.id) {
          data.isChecked = e.target.checked;
        }
        return data;
      });
      return newState;
    });
  };

  const [isTemplatesFetched, setIsTemplatesFetched] = useState(false);
  const [isFilterRulesFetched, setIsFilterRulesFetched] = useState(false);
  const [templatesPayload, setTemplatesPayload] = useState({});
  const [filterRulesPayload, setFilterRulesPayload] = useState({});

  const getFilterRulesTemplatesResponseHandler = (response, isReset) => {
    let data = response.data ?? [];

    if (!!data.length) {
      let editState = {};
      let ruleUneditableInfo = {};
      let keys = ["sip", "sport", "dip", "dport"];
      // Used while generating save payload
      let modify = data.map((row, index) => {
        let template = row.id;

        editState[template] = { sip: {}, sport: {}, dip: {}, dport: {} };

        row.rules.forEach((rule) => {
          ruleUneditableInfo[rule.rulenum] = { ...rule }; // Storing all values actually, and will override keys before generating save data
          keys.forEach((key) => {
            let label = rule[key + "Label"];

            if (editState[template][key][label] === undefined) {
              editState[template][key][label] = {
                linked: true,
                focussed: false,
              };
            }

            editState[template][key][label][rule.rulenum] = {
              // value: isReset ? "" : rule[key],
              value: rule[key],
              error: false,
              helperText: "",
            };
          });
        });

        keys.forEach((key) => {
          Object.keys(editState[template][key]).forEach((label) => {
            Object.values(editState[template][key][label]).forEach(
              (rule, index) => {
                const modEditState = editState[template][key][label];
                const modEditStateAsList = Object.keys(modEditState)
                  .filter(($) => !isNaN($))
                  .map(($) => Number($));
                const sameLabelList = Object.keys(
                  editState[template][key],
                ).filter(($) => $);

                if (
                  !!label &&
                  modEditStateAsList.length > 1 &&
                  sameLabelList.length === 1
                ) {
                  editState[template][key][label]["linked"] = true;
                } else {
                  editState[template][key][label]["linked"] = false;
                }
              },
            );
          });
        });

        return {
          isChecked: Boolean(index === 0),
          isDisabled: Boolean(index === 0),
          ...row,
        };
      });

      if (filterRulesPayload?.data?.length > 0) {
        const ids = filterRulesPayload.data.map(({ templateId }) => templateId);
        const filterUniq = (id, index) => (id !== ids[index + 1] ? id : null);
        const newState = ids.filter(filterUniq);
        const newFilterRulesData = modify.map(($) => ({
          ...$,
          isChecked: newState.includes($.id),
          isDisabled: false,
        }));

        setFilterRuleData(
          newFilterRulesData.map((data, index) => ({
            ...data,
            isChecked: newState.length ? data.isChecked : index === 0,
          })),
        );
      } else {
        setFilterRuleData(
          modify.map((data, index) => ({
            ...data,
            isChecked: index === 0,
          })),
        );
      }

      setLoadData([...modify[0].rules]);
      setEditState(editState);
      setRuleUneditableInfo(ruleUneditableInfo);
      setLoading({ loaded: true });
    }
  };

  const onCompletegetEPCFRTemplate = (response) => {
    if (response.state === "EPCFRTEMPLATE_SUCCESS") {
      // getFilterRulesTemplatesResponseHandler(response);

      let defaultrule = response.data.filter(
        (item) => item.templateName === "Default Rule",
      );
      let notdefaultRule = response.data.filter(
        (item) => item.templateName !== "Default Rule",
      );
      response.data = [...defaultrule, ...notdefaultRule];
      setTemplatesPayload(response);

      if (response <= 0) {
        setDisableReset(true);
      }

      setTimeout(() => {
        setIsTemplatesFetched(true);
      }, 100);
    } else {
      setLoading({
        loaded: "error",
        message: (
          <>
            {t("commons.errorMessages.errorFetching")}
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

  useEffect(() => {
    const successCode = "SUCCESS";
    const failureCode = "FAILURE";

    if (isTemplatesFetched && props.filterRuleConfig.selectedRows.length > 1) {
      getFilterRulesTemplatesResponseHandler(templatesPayload);
    } else if (isTemplatesFetched && isFilterRulesFetched) {
      if (
        filterRulesPayload.state === successCode &&
        !!filterRulesPayload.data &&
        filterRulesPayload.data.length > 0
      ) {
        const templates = templatesPayload.data;
        const filterRules = filterRulesPayload.data;

        const getPropValue = (prop, templateId, rulenum, defaultVal) => {
          const [filtered] = filterRules.filter(
            ($) => $.templateId === templateId && $.rulenum === rulenum,
          );

          return filtered ? filtered[prop] : defaultVal;
        };

        const mergeHandler = () => {
          return templates.map((template) => {
            return {
              ...template,
              rules: template.rules.map((rule) => ({
                ...rule,
                sip: getPropValue(
                  "sip",
                  rule.templateId,
                  rule.rulenum,
                  rule.sip,
                ),
                dip: getPropValue(
                  "dip",
                  rule.templateId,
                  rule.rulenum,
                  rule.dip,
                ),
                sport: getPropValue(
                  "sport",
                  rule.templateId,
                  rule.rulenum,
                  rule.sport,
                ),
                dport: getPropValue(
                  "dport",
                  rule.templateId,
                  rule.rulenum,
                  rule.dport,
                ),
              })),
            };
          });
        };

        const newPayload = { ...templatesPayload, data: mergeHandler() };

        getFilterRulesTemplatesResponseHandler(newPayload);
      } else {
        getFilterRulesTemplatesResponseHandler(templatesPayload);
      }
    }
  }, [
    filterRulesPayload,
    isFilterRulesFetched,
    isTemplatesFetched,
    templatesPayload,
  ]);

  useEffect(() => {
    setLoading({ loaded: false });
    setEPCheckState({ state: "checking", message: "" });

    // Generate list of endpoints
    let endpoints = {};
    props.filterRuleConfig.selectedRows.forEach((ep) => {
      endpoints[ep.endpoint_ID] = {
        id: ep.id,
        endpoint_ID: ep.endpoint_ID,
        name: ep.name,
        epcclient_ID: ep.epcclient_ID,
        taskStatus: "Not Running",
      };
    });

    const onCompleteGetTaskStatus = (response, endpoints) => {
      setLogsLoading("");
      props.setLoadingState("validating");
      setTimeout(() => {
        props.setLoadingState("");
      }, 1000);
      if (response.state === "GET_TASK_STATUS_SUCCESS") {
        let data = response.data;
        let inEligibleCount = 0;
        let totalEPs = Object.keys(endpoints).length;

        setInEligibleRows(() => {
          const firstCheck = props.filterRuleConfig.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!data.map(({ endpointId }) => endpointId).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [
                {
                  icon: <HourglassBottomRoundedIcon />,
                  tooltip: t(
                    "page.Endpoint.Configure.bulkTable.progressTooltip",
                  ),
                },
              ],
            }));

          const firstUncheck = props.filterRuleConfig.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!!data.map(({ endpointId }) => endpointId).includes(id);
            });

          const lastCheck = [...firstCheck, ...firstUncheck]
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(
              ({ enabled, roles }) =>
                enabled === "False" || roles === "Remote Keying",
            )
            //   .filter(({ id }) => !!!firstCheck.map(({ id }) => id).includes(id))
            .map((row) => {
              const icons = [
                ...row.icons, //,
                // {
                //  icon: <MatIcons.SyncDisabledRounded />,
                //   tooltip: "Endpoint is Disabled",
                // },
              ];

              if (row.enabled === "False") {
                icons.push({
                  icon: <SyncDisabledRounded />,
                  tooltip: t(
                    "page.Endpoint.Configure.bulkTable.epcDisableTooltip",
                  ),
                });
              }

              if (row.roles === "Remote Keying") {
                icons.push({
                  icon: <BrowserNotSupportedOutlinedIcon />,
                  tooltip: t("page.Endpoint.Configure.bulkTable.remoteTooltip"),
                });
              }

              return {
                ...row,
                icons,
              };
            });

          const newState = [
            ...firstCheck.filter(
              (_1) => !!!lastCheck.filter((_2) => _1.id === _2.id).length,
            ),
            ...lastCheck,
          ];

          // setIsBlocker(!![...firstCheck, ...lastCheck].length);
          inEligibleCount = newState.length;

          return newState;
        });

        setEligibleRows(() => {
          return props.filterRuleConfig.selectedRows
            .map(({ id, name, endpoint_ID, epcclient_ID, enabled, roles }) => ({
              id,
              name,
              endpoint_ID,
              epcclient_ID,
              enabled,
              roles,
            }))
            .filter(({ id }) => {
              return !!!data.map(({ endpointId }) => endpointId).includes(id);
            })
            .filter(
              ({ enabled, roles }) =>
                enabled === "True" && roles !== "Remote Keying",
            );
        });

        if (inEligibleCount === 0) {
          setEPCheckState({
            state: "check-complete-all-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        } else if (inEligibleCount < totalEPs) {
          setEPCheckState({
            state: "check-complete-partially-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        } else {
          setEPCheckState({
            state: "check-complete-not-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        }
      } else {
        setEPCheckState({
          state: "check-error",
          message: (
            <>
              {/* Error fetching configure filter rules task status. Please try
              again. */}
              {t("page.Endpoint.Configure.configureFilterRulesModal.errorTask")}
              <br />
              <br />
              {t(
                "page.Endpoint.Configure.configureFilterRulesModal.errorDetails",
              )}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </>
          ),
        });
      }
    };

    // Fetch active tasks
    callAPI({
      path: "get-task-status",
      params: {
        gatewayIP,
        taskId: 6,
      },
      data: {},
      responder: GetTaskStatusResponder,
      onComplete: onCompleteGetTaskStatus,
      onCompleteArguments: [endpoints],
    });

    // Fetch template
    callAPI({
      path: "getEPCFRTemplate",
      params: { gatewayIP },
      data: {},
      responder: getEPCFRTemplateResponder,
      onComplete: onCompletegetEPCFRTemplate,
    });

    const successCode = "SUCCESS";
    const failureCode = "FAILURE";

    props.filterRuleConfig.selectedRows.length === 1 &&
      callAPI({
        path: "EPCFilterRules",
        params: {
          gatewayIP,
          endpointId: props.filterRuleConfig.selectedRows[0].endpoint_ID,
        },
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
        onCompleteArguments: [],
        onComplete: (response) => {
          setFilterRulesPayload(response);

          setTimeout(() => {
            setIsFilterRulesFetched(true);
          }, 100);
        },
      });
  }, []);

  const handleContinue = () => {
    setEPCheckState((old) => ({
      ...old,
      state: "check-complete-partially-eligible-accepted",
    }));
  };

  useEffect(() => {
    setLoadData((oldState) => {
      let newState = [];

      filterRuleData
        .filter(({ isChecked }) => isChecked)
        .map(({ rules }) => rules.map((row) => newState.push(row)));
      if (props.filterRuleConfig.selectedRows.length == 1)
        newState =
          props.filterRuleConfig.selectedRows[0].roles == "Invisipoint Enforcer"
            ? newState
            : newState?.filter(
                (e) => e.rulenum != "1021" && e.rulenum != "1022",
              );

      return newState;
    });
  }, [filterRuleData, props.filterRuleConfig.selectedRows]);

  useEffect(() => {
    const filtered = filterRuleData.filter(
      (item) => item.isChecked || item.templateName == "Default Rule",
    );

    if (filtered.length === 1 && !filtered[0].isDisabled) {
      setFilterRuleData((oldState) => {
        const newState = oldState.map((rowPayload) => {
          return rowPayload.isChecked
            ? { ...rowPayload, isDisabled: true }
            : rowPayload;
        });
        return newState;
      });
    }

    const BoolFilter = Boolean(
      filtered.filter(({ isDisabled }) => isDisabled).length,
    );

    const defFilter = filtered.filter(
      (item) => item.templateName == "Default Rule",
    );

    if (defFilter.length > 0 && !defFilter[0].isDisabled) {
      setFilterRuleData((oldState) => {
        const newState = oldState.map((rowPayload) => {
          return rowPayload.templateName == "Default Rule"
            ? { ...rowPayload, isDisabled: true }
            : rowPayload;
        });
        return newState;
      });
    }
  }, [filterRuleData]);

  /** Reset Functionality */
  const handleResetAlert = () => {
    setPrompt(true);
  };

  const handleReset = () => {
    getFilterRulesTemplatesResponseHandler(templatesPayload, "reset");
    setPrompt(false);
    setLoadingReset(true);
  };

  return (
    <>
      {epCheckState.state === "init" || epCheckState.state === "checking" ? (
        <div
          style={{
            padding: "0.3em",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledMat.LoadingText src={loadingText} />
          <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
            Fetching Task Status...
          </Typography>
        </div>
      ) : epCheckState.state === "check-complete-all-eligible" ||
        epCheckState.state === "check-complete-partially-eligible-accepted" ? (
        loading.loaded === false ? (
          <div
            style={{
              padding: "0.3em",
              width: "100%",
              height: "100%",
            }}
          >
            <WidthFillerSkeleton height="100%" />
          </div>
        ) : loading.loaded === "error" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1em",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                textAlign: "left",
                color: "crimson",
              }}
            >
              {loading.message}
            </div>
          </div>
        ) : (
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "column",
              flexGrow: "1",
              width: "100%",
            }}
          >
            <Styled.ParentBox>
              <Styled.BoxLeft>
                <Styled.BoxLeftInner>
                  {filterRuleData.map(
                    (
                      { id, isChecked, isDisabled, templateName, ...args },
                      index,
                    ) => {
                      let template = filterRuleData.find(
                        (template) => template.templateName === templateName,
                      );
                      template =
                        template === undefined ? { rules: [] } : template;
                      template.rules =
                        template.rules === undefined ? [] : template.rules;
                      return (
                        <Styled.Box
                          key={id}
                          disabled={isDisabled || saving}
                          onClick={(e) => {
                            if (!(isDisabled || saving)) {
                              e.target.checked = !isChecked;

                              handleChange(e, {
                                id,
                                isChecked,
                                isDisabled,
                                templateName,
                                ...args,
                              });
                            }
                          }}
                        >
                          <Styled.CheckBox
                            checked={isChecked}
                            disabled={isDisabled || saving}
                            value={templateName}
                            onChange={(e) =>
                              handleChange(e, {
                                id,
                                isChecked,
                                isDisabled,
                                templateName,
                                ...args,
                              })
                            }
                          />
                          <Styled.Typo
                            checked={isChecked}
                            disabled={isDisabled || saving}
                          >
                            <span
                              style={{
                                display: "flex",
                              }}
                            >
                              {templateName}
                            </span>
                            <span
                              style={{
                                fontSize: "0.9em",
                                lineHeight: "1em",
                                marginTop: "0.5em",
                                paddingTop: "0.75em",
                                paddingRight: "1.25em",
                                borderTop:
                                  "0.15em solid " +
                                  (isChecked && !(isDisabled || saving)
                                    ? "rgba(2, 147, 254, 1)"
                                    : "#212529"),
                              }}
                            >
                              {template.rules.length}{" "}
                              {t(
                                "page.Endpoint.Configure.configureFilterRulesModal.rules",
                              )}
                            </span>
                          </Styled.Typo>
                        </Styled.Box>
                      );
                    },
                  )}
                </Styled.BoxLeftInner>
              </Styled.BoxLeft>
              <FilterTable
                loadData={loadData}
                editState={editState}
                setEditState={setEditState}
                saving={saving}
                validate={validate}
                endpointsRolesCheck={props.endpointsRolesCheck}
              />
            </Styled.ParentBox>
            <Styled.Btn>
              <GenericButton
                id={`${endpoint}-confiureFilterRule-reset-button`}
                style={{ margin: "0em 1em 0em 0em" }}
                backgroundColor="secondary"
                buttonName={t("commons.resetText")}
                disabled={saving || disableReset}
                onClick={handleResetAlert}
              />

              <GenericButton
                id={`${endpoint}-confiureFilterRule-cancel-button`}
                backgroundColor="secondary"
                buttonName={t("page.Endpoint.Configure.bulkTable.cancelButton")}
                disabled={saving}
                onClick={props.cancelHandler}
              />

              {saving ? (
                <GenericButton
                  width={"7.8rem"}
                  backgroundColor="primary"
                  buttonName={
                    <>
                      {t("commons.savingText")}
                      <Styled.Spinner
                        style={{
                          width: "1em",
                          height: "1em",
                        }}
                      />
                    </>
                  }
                  disabled={false}
                  onClick={false}
                />
              ) : (
                <GenericButton
                  id={`${endpoint}-confiureFilterRule-save-button`}
                  backgroundColor="primary"
                  buttonName={t("commons.saveText")}
                  disabled={saving}
                  onClick={handleSave}
                />
              )}
            </Styled.Btn>
          </Box>
        )
      ) : epCheckState.state === "check-complete-partially-eligible" ? (
        <>
          {props.loadingState === "validating" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledMat.LoadingText src={loadingText} />
              <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                {t(
                  "page.Endpoint.Configure.configureFilterRulesModal.validating",
                )}
              </Typography>
            </div>
          ) : (
            <PreProcessValidation
              disabled={!!!eligibleRows.length || saving}
              title={t(
                "page.Endpoint.Configure.configureFilterRulesModal.title",
              )}
              // onClose={cancelHandler}
              loading={logsLoading}
              qualifiedRecords={eligibleRows}
              unQualifiedRecords={inEligibleRows}
              footerActions={{
                onAbort: props.cancelHandler,
                onConfirm: handleContinue,
              }}
            />
          )}
        </>
      ) : epCheckState.state === "check-complete-not-eligible" ? (
        <>
          {props.loadingState === "validating" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledMat.LoadingText src={loadingText} />
              <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                {t(
                  "page.Endpoint.Configure.configureFilterRulesModal.validating",
                )}
              </Typography>
            </div>
          ) : (
            <>
              {epCheckState.inEligibleCount === 1 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1em",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      textAlign: "center",
                      color: "crimson",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#DC143C",
                        /* fontFamily: "", */
                        fontWeight: 500,
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.configureFilterRulesModal.taskMessage1",
                      )}
                      <br />
                      <br />
                      {t(
                        "page.Endpoint.Configure.configureFilterRulesModal.taskRequired",
                      )}
                    </Typography>
                  </div>
                </div>
              ) : (
                <PreProcessValidation
                  disabled={!!!eligibleRows.length || saving}
                  title={t(
                    "page.Endpoint.Configure.configureFilterRulesModal.title",
                  )}
                  // onClose={cancelHandler}
                  loading={logsLoading}
                  qualifiedRecords={eligibleRows}
                  unQualifiedRecords={inEligibleRows}
                  footerActions={{
                    onAbort: props.cancelHandler,
                    onConfirm: handleContinue,
                  }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1em",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              textAlign: "left",
              color: "crimson",
            }}
          >
            {epCheckState.message}
          </div>
        </div>
      )}

      <AlertPopup
        divider={false}
        open={modalAlert.open}
        contentTitle={modalAlert.contentTitle}
        contentText={modalAlert.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={closeModalHandler}
        handleDisagree={closeModalHandler}
      />

      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={"Reset Confirmation"}
        contentText={
          <p>
            <Trans
              i18nKey={
                "page.Endpoint.Configure.configureFilterRulesModal.resetCurrentValue"
              }
              components={[<br />, <b />]}
            >
              Following aciton will clear the current values and reset to the
              template values.
              <br />
              <br />
              Click <b>Confirm</b> to reset, otherwise click <b>Cancel</b>.
            </Trans>
          </p>
        }
        contentInfo={``}
        agreeTitle={"Confirm"}
        disagreeTitle={t("page.Endpoint.Configure.bulkTable.cancelButton")}
        handleAgree={handleReset}
        handleDisagree={() => setPrompt(false)}
      />
    </>
  );
};
