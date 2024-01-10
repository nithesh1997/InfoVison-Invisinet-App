import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import callAPI from "../../apis/callAPI";
import { DistributedIdentitiesAPIResponder } from "../../apis/responders/distributed-identities-api-responder";
import { SetDistIdentAPIResponder } from "../../apis/responders/set-dist-ident-api-responder";
import Utility from "../../redux/actions/Utility";
import { gatewayServices } from "../../utils/GeneralComponentNames";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { Styled } from "./GatewayserviceStyling/Identities.style";
import { GlobalTextField } from "../../style/TextField/TextField";
import { Trans, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const initCurrDefault = {
  alg: "UMAC-AES",
  groups: [],
  enable: 1,
  tcp_ident_tag: 1,
  timeout: 3600,
};

const IdentitiesPopup = (props) => {
  const { t, i18n } = useTranslation();

  const classes = useStyles();

  const textFieldForTimeoutRef = useRef(null);
  const textFieldForGroupsRef = useRef(null);
  const buttonForSaveRef = useRef(null);

  const AppOverlayContext = useContext(OverlayContext);

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const { gatewayConfig } = useSelector((state) => state);

  const [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeoutState, setTimeoutState] = useState("3600");
  const [drop, setDrop] = useState("");
  const [isDrop, setIsDrop] = useState("");
  const [groups, setGroups] = useState([]);
  const [timeoutError, setTimeoutError] = useState(false);
  const [errDropDown, setErrDropDown] = useState({ algErr: "", tcpErr: "" });
  const [groupsError, setGroupsError] = useState(false);
  const [timeoutHelperText, setTimeoutHelperText] = useState(" ");
  const [attemptErrorText, setAttemptErrorText] = useState("");
  const [groupsHelperText, setGroupsHelperText] = useState(" ");
  const [disableSave, setDisableSave] = useState(true);
  const [groupsString, setGroupsString] = useState("");
  const [currDefault, setCurrDefault] = useState(initCurrDefault);
  const [isAllValid, setIsAllValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [run, setRun] = useState("");

  const handleBlur = (event) => {
    const isTimeout = `${currDefault.timeout}` === `${timeoutState}`;
    const isAlg = `${currDefault.alg}` === `${drop}`;
    const isTcpIdentTag = `${currDefault.tcp_ident_tag}` === `${isDrop}`;
    const isGroup = currDefault.groups.toString() === groups.toString();
    const results = [isAlg, isGroup, isTimeout, isTcpIdentTag];

    setDisableSave(!results.includes(false));
  };

  const onCompleteSetDistIdent = useCallback((response) => {
    let data = response.data;

    if (response.state === "DISTRIBUTED_IDENTITIES_SUCESS") {
      setLoading(false);
      setDrop(data?.alg?.toUpperCase() ?? "");
      setGroups(data.groups ?? []);
      setTimeoutState(data.timeout ?? 0);
      setIsDrop(data.tcp_ident_tag);
      setCurrDefault({
        alg: data?.alg?.toUpperCase() ?? "",
        groups: data.groups ?? [],
        timeout: data.timeout ?? 0,
        tcp_ident_tag: data.tcp_ident_tag,
        enable: data.enable,
      });
    }
  }, []);

  const validateDrops1 = (drop) => {
    if (!!!drop || drop === "NOT CONFIGURED") {
      setErrDropDown((e) => ({
        ...e,
        algErr: t(
          `page.gatewayServer.services.context.distributedIdentities.validation.algorithm`,
        ),
      }));
    } else {
      return true;
    }
  };
  const validateDrops2 = (isDrop) => {
    if (!!!isDrop || isDrop === "not configured") {
      setErrDropDown((e) => ({
        ...e,
        tcpErr: t(
          `page.gatewayServer.services.context.distributedIdentities.validation.tcp`,
        ),
      }));
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    let isValidTimeout = validateTimeout(timeoutState);
    let isValidGroups = validateGroups(groups.toString());
    let drops = validateDrops1(drop);
    let drops2 = validateDrops2(isDrop);

    if (!isValidTimeout || !isValidGroups || !drops || !drops2) {
      props.setOpenAlertDialog(false);
    } else {
      if (disableSave) {
        props.setOpenAlertDialog(true);
        props.setAlertContent({
          contentTitle: t(
            `page.gatewayServer.services.context.distributedIdentities.prompt.alert.title`,
          ),
          contentText: t(
            `page.gatewayServer.services.context.distributedIdentities.prompt.alert.info`,
          ),
          contentInfo: "",
        });
      } else if (
        isValidTimeout &&
        isValidGroups &&
        drops &&
        drops2 &&
        !isAttemptOnGoing
      ) {
        setIsAllValid(true);
        setIsSubmitted(true);
      }
    }
    // }
  };

  const SetDistIdentOnCompleteHandler = useCallback(
    (response) => {
      const successIdentText = t(
        `page.gatewayServer.services.context.distributedIdentities.prompt.success.info1`,
      );
      const alertContentState = {
        contentTitle: t(
          `page.gatewayServer.services.context.distributedIdentities.prompt.success.title`,
        ),
        contentText: t(
          `page.gatewayServer.services.context.distributedIdentities.prompt.success.info`,
        ),
        contentInfo: "",
      };
      setApiCall(false);
      if (response.state === "SET_DIST_IDENT_SUCESS") {
        setIsAttemptOnGoing(false);
        setAttemptErrorText("");
        AppOverlayContext.setSucessDistIdentText(successIdentText);
        props.handleClosePortal();
        props.setOpenAlertDialog(true);
        props.setAlertContent(alertContentState);
        if (
          gatewayConfig.chassis_model === "5010" &&
          props.currRunEffect === "DistributedBump0"
        ) {
          props.setInitialResponseBump0((oldState) => ({
            ...oldState,
            data: {
              ...oldState.data,
              timeout: timeoutState,
              alg: drop,
              tcp_ident_tag: isDrop,
              groups,
            },
          }));
        } else {
          props.setInitialResponse((oldState) => ({
            ...oldState,
            data: {
              ...oldState.data,
              timeout: timeoutState,
              alg: drop,
              tcp_ident_tag: isDrop,
              groups,
            },
          }));
        }
      } else {
        props.setOpenAlertDialog(true);
        props.setAlertContent({
          contentTitle: `${t(`commons.errorText`)}..!`,
          contentText: (
            <>
              {t(
                `page.gatewayServer.services.context.distributedIdentities.prompt.error.save.0`,
              )}
              <br />
              <br />
              {t(
                `page.gatewayServer.services.context.distributedIdentities.prompt.error.save.1`,
              )}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </>
          ),
          contentInfo: "",
        });

        AppOverlayContext.setAttemptErrorDistIdentText(
          t(
            `page.gatewayServer.services.context.distributedIdentities.prompt.error.save.info`,
          ),
        );
        setIsAttemptOnGoing(false);
      }
    },
    [AppOverlayContext, drop, groups, isDrop, props, timeoutState],
  );

  const handleDrop = (event) => {
    setIsDrop(event.target.value);
  };

  const handleCheck = (event) => {
    setDrop(event.target.value);
  };

  const validateTimeout = (value) => {
    const min = 3600;
    const max = 65534;

    if (!value && value !== 0 && value === "") {
      setTimeoutHelperText(
        t(
          `page.gatewayServer.services.context.distributedIdentities.validation.timeout.0`,
        ),
      );
      setTimeoutError(true);
      return false;
    } else if (isNaN(value)) {
      const _value = typeof value;
      setTimeoutHelperText(
        <p>
          <Trans
            i18nKey={`page.gatewayServer.services.context.distributedIdentities.validation.timeout.1`}
            value={_value}
          >
            Timeout field accepts only <b>numeric</b> not <b>{_value}</b>
          </Trans>
        </p>,
      );

      setTimeoutError(true);
      return false;
    } else if (Number(value) < min || Number(value) > max) {
      setTimeoutHelperText(
        <p>
          <Trans
            i18nKey={`page.gatewayServer.services.context.distributedIdentities.validation.timeout.2`}
          >
            Timeout should range from <b>3600</b> to <b>65534</b> (seconds).
          </Trans>
        </p>,
      );
      setTimeoutError(true);
      return false;
    } else {
      setTimeoutHelperText(" ");
      setTimeoutError(false);
      return true;
    }
  };

  const handleTimeoutBlur = (event) => {
    const value = event.target.value;
    setTimeoutState(value);
    validateTimeout(value);
    handleBlur(event);
  };

  const handleChangeTimeout = (props) => {
    let value = props.target.value;
    setTimeoutState(value);
    // setDisableSave(false);
    if (!(value.length < 1)) {
      setTimeoutHelperText(" ");
      setTimeoutError(false);
    }
  };

  const validateGroups = (value) => {
    const checkIndexLetter = new RegExp(`^[a-z0-9\\s,]{1}$`, "i");
    const checkAlphaNumeric = new RegExp(/^[A-Za-z0-9,\s]+$/);
    const count = value.split(",").length;

    if (value.length < 1) {
      setGroupsHelperText(
        t(
          `page.gatewayServer.services.context.distributedIdentities.validation.groups.0`,
        ),
      );
      setGroupsError(true);
      return false;
    } else if (!checkAlphaNumeric.test(value)) {
      setGroupsHelperText(
        t(
          `page.gatewayServer.services.context.distributedIdentities.validation.groups.1`,
        ),
      );

      setGroupsError(true);
      return false;
    } else if (!checkIndexLetter.test(value[value.length - 1])) {
      setGroupsHelperText(
        t(
          `page.gatewayServer.services.context.distributedIdentities.validation.groups.1`,
        ),
      );
      setGroupsError(true);
      return false;
    } else if (count >= 41) {
      setGroupsHelperText(
        t(
          `page.gatewayServer.services.context.distributedIdentities.validation.groups.2`,
        ),
      );
      setGroupsError(true);
      return false;
    } else {
      setGroupsHelperText(" ");
      setGroupsError(false);
      return true;
    }
  };

  const handleChangeGroups = (event) => {
    let value = event.target.value ?? "";
    setGroups(
      value
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
    );

    if (!(value.length < 1)) {
      setGroupsHelperText(" ");
      setGroupsError(false);
    }
  };

  const handleGroupsBlur = (event) => {
    let value = event.target.value;
    validateGroups(value);
    handleBlur(event);
  };

  useEffect(() => {
    if (isAllValid && isSubmitted) {
      setIsAttemptOnGoing(true);

      callAPI({
        path: "set-distributed-identities",
        params: { gatewayIP, context: props.context },
        data: {
          alg: drop,
          groups,
          enable: currDefault.enable,
          tcp_ident_tag: Number(isDrop),
          timeout: Number(timeoutState),
        },
        responder: SetDistIdentAPIResponder,
        onComplete: SetDistIdentOnCompleteHandler,
      });
      setApiCall(true);
      setIsSubmitted(false);
      setIsAllValid(false);
    }
  }, [
    SetDistIdentOnCompleteHandler,
    drop,
    gatewayIP,
    groups,
    isAllValid,
    isDrop,
    isSubmitted,
    props.context,
    props.initialResponse,
    timeoutState,
  ]);

  useEffect(() => {
    setRun("run");
  }, []);

  useEffect(() => {
    if (run === "run") {
      if (props.currRunEffect === "Distributed") {
        callAPI({
          path: "distributedIdentities",
          params: { gatewayIP, context: props.context },
          data: {},
          responder: DistributedIdentitiesAPIResponder,
          onComplete: (response) => {
            let data = response.data;

            if (response.state === "DISTRIBUTED_IDENTITIES_SUCESS") {
              setLoading(false);

              setDrop(data?.alg?.toUpperCase() ?? "");
              setGroups(data.groups ?? []);
              setTimeoutState(data.timeout ?? 0);
              setIsDrop(data?.tcp_ident_tag);
              setCurrDefault({
                alg: data.alg.toUpperCase(),
                groups: data.groups ?? [],
                timeout: data.timeout ?? 0,
                tcp_ident_tag: data?.tcp_ident_tag,
                enable: data.enable,
              });
            }
          },
        });
      } else if (props.currRunEffect === "DistributedBump0") {
        callAPI({
          path: "distributedIdentities",
          params: { gatewayIP, context: "bump0" },
          data: {},
          responder: DistributedIdentitiesAPIResponder,
          onComplete: (response) => {
            let data = response.data;

            if (response.state === "DISTRIBUTED_IDENTITIES_SUCESS") {
              setLoading(false);

              setDrop(data?.alg?.toUpperCase() ?? "");
              setGroups(data.groups ?? []);
              setTimeoutState(data.timeout ?? 0);
              setIsDrop(data?.tcp_ident_tag);
              setCurrDefault({
                alg: data.alg.toUpperCase(),
                groups: data.groups ?? [],
                timeout: data.timeout ?? 0,
                tcp_ident_tag: data?.tcp_ident_tag,
                enable: data.enable,
              });
            }
          },
        });
      }
    }
  }, [run]);

  useEffect(() => {
    if (props.postEffects) {
      onCompleteSetDistIdent(props.initialResponse);
      props.setPostEffects(false);
    } else if (props.postEffectsBump0) {
      onCompleteSetDistIdent(props.initialResponseBump0);
      props.setPostEffectsBump0(false);
    }
  }, []);

  return (
    <>
      <Styled.StyledContainer
        tabindex="-1"
        id="addgateway"
        not
        aria-labelledby="addgatewayLabel"
      >
        <Styled.StyledMainDivComponent>
          <Styled.HeaderDivComponent class="offcanvas-header">
            <Styled.StyledH5Component>{props.name}</Styled.StyledH5Component>
            <Styled.StyledCloseIconComponent
              id={`${gatewayServices}-distributed-identities-close-icon-btn`}
              onClick={() => {
                props.handleClosePortal();
                setTimeoutHelperText("");
                setGroupsHelperText("");
              }}
            />
          </Styled.HeaderDivComponent>

          <Styled.BodyDivComponent class="offcanvas-body">
            {loading ? (
              <div style={{ padding: "1em 0em" }}>
                <WidthFillerSkeleton height="400" width="500" />
              </div>
            ) : (
              <Styled.StyledFormContainer>
                <Styled.StyledFormDivComponent>
                  <GlobalTextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(
                      `page.gatewayServer.services.context.distributedIdentities.fields.timeout.label`,
                    )}
                    id={`${gatewayServices}-timeout`}
                    name="timeout"
                    onChange={handleChangeTimeout}
                    onBlur={handleTimeoutBlur}
                    aria-describedby="emailHelp"
                    disabled={!isAttemptOnGoing ? "" : "true"}
                    value={`${timeoutState}`}
                    inputRef={textFieldForTimeoutRef}
                    inputProps={{
                      onKeyPress: (event) => {
                        const { key } = event;

                        if (
                          key === "Enter" &&
                          timeoutState.length !== 0 &&
                          timeoutError === false
                        ) {
                          textFieldForGroupsRef.current.focus();
                        }
                      },
                    }}
                  />

                  <Styled.StyledErrorDivComponent>
                    {timeoutHelperText}
                  </Styled.StyledErrorDivComponent>
                </Styled.StyledFormDivComponent>

                <Styled.StyledFormDivComponent>
                  <Styled.StyledFormControlComponent
                    variant="outlined"
                    className={(classes.formControl, "field-wrap")}
                    style={{ width: "100%" }}
                    disabled={isAttemptOnGoing}
                  >
                    <InputLabel id="simple-select-outlined-label">
                      Algorithm
                    </InputLabel>
                    <Select
                      label={t(
                        `page.gatewayServer.services.context.distributedIdentities.fields.algorithm.label`,
                      )}
                      labelId="simple-select-outlined-label"
                      id={`${gatewayServices}-algorithm-dropdown`}
                      value={drop}
                      onChange={handleCheck}
                      onBlur={() => {
                        handleBlur();
                        if (drop !== "") {
                          setErrDropDown((e) => {
                            return { ...e, algErr: "" };
                          });
                        }
                      }}
                      class="select-dd"
                      style={{ fontWeight: "400" }}
                    >
                      <MenuItem
                        style={{ fontWeight: "400" }}
                        value={"UMAC-AES"}
                      >
                        UMAC-AES
                      </MenuItem>
                      <MenuItem
                        style={{ fontWeight: "400" }}
                        value={"HMAC-SHA-256"}
                      >
                        HMAC-SHA-256
                      </MenuItem>
                      <MenuItem
                        style={{ fontWeight: "400" }}
                        value={"UMAC-AES-64"}
                      >
                        UMAC-AES-64
                      </MenuItem>
                      <MenuItem
                        style={{ fontWeight: "400" }}
                        value={"HMAC-SHA-256-64"}
                      >
                        HMAC-SHA-256-64
                      </MenuItem>
                    </Select>
                  </Styled.StyledFormControlComponent>
                </Styled.StyledFormDivComponent>

                <Styled.StyledFormDivComponent>
                  <Styled.StyledFormLabelComponent for="gatewayaddress"></Styled.StyledFormLabelComponent>

                  <Styled.StyledErrorDivComponent>
                    {errDropDown.algErr}
                  </Styled.StyledErrorDivComponent>

                  <Styled.StyledFormControlComponent
                    disabled={isAttemptOnGoing}
                    variant="outlined"
                    className={(classes.formControl, "field-wrap")}
                    style={{
                      width: "100%",
                      bordeRadius: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    <InputLabel
                      id="simple-select-outlined-label="
                      style={{ fontWeight: "400" }}
                    >
                      {t(
                        `page.gatewayServer.services.context.distributedIdentities.fields.tcpTagging.label`,
                      )}
                    </InputLabel>

                    <Select
                      label={t(
                        `page.gatewayServer.services.context.distributedIdentities.fields.tcpTagging.label`,
                      )}
                      labelId="simple-select-outlined-label"
                      id={`${gatewayServices}-tcp-tagging-dropdown`}
                      value={isDrop}
                      onChange={handleDrop}
                      onBlur={() => {
                        handleBlur();
                        if (isDrop !== "") {
                          setErrDropDown((e) => {
                            return { ...e, tcpErr: "" };
                          });
                        }
                      }}
                      style={{ fontWeight: "400" }}
                    >
                      <MenuItem style={{ fontWeight: "400" }} value={"1"}>
                        SEQ
                      </MenuItem>
                      <MenuItem style={{ fontWeight: "400" }} value={"2"}>
                        SID
                      </MenuItem>
                    </Select>
                  </Styled.StyledFormControlComponent>

                  <Styled.StyledErrorDivComponent>
                    {errDropDown.tcpErr}
                  </Styled.StyledErrorDivComponent>
                </Styled.StyledFormDivComponent>

                <Styled.StyledFormDivComponent>
                  <GlobalTextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(
                      `page.gatewayServer.services.context.distributedIdentities.fields.groups.label`,
                    )}
                    id={`${gatewayServices}-groups-input`}
                    name="groups"
                    onBlur={handleGroupsBlur}
                    onChange={(event) => {
                      handleChangeGroups(event);
                      setGroupsString(event.target.value);
                    }}
                    aria-describedby="emailHelp"
                    inputRef={textFieldForGroupsRef}
                    disabled={!isAttemptOnGoing ? "" : "true"}
                    value={groupsString || groups.join(", ")}
                    inputProps={{
                      onKeyPress: (event) => {
                        const { key } = event;

                        if (
                          key === "Enter" &&
                          groups.length !== 0 &&
                          groupsError === false
                        ) {
                          buttonForSaveRef.current.focus();
                        }
                      },
                    }}
                  />
                  <Styled.StyledErrorDivComponent>
                    {groupsHelperText}
                  </Styled.StyledErrorDivComponent>
                </Styled.StyledFormDivComponent>

                <Styled.StyledFooterDivComponent>
                  <GenericButton
                    id={`${gatewayServices}-distributed-identities-cancel-btn`}
                    buttonName={t(`commons.cancelText`)}
                    backgroundColor="secondary"
                    disabled={!isAttemptOnGoing ? "" : "true"}
                    onClick={() => {
                      props.handleClosePortal();
                      setTimeoutHelperText("");
                      setGroupsHelperText("");
                    }}
                  />
                  <GenericButton
                    id={`${gatewayServices}-distributed-identities-save-btn`}
                    backgroundColor="primary"
                    buttonName={t(`commons.saveText`)}
                    buttonRef={buttonForSaveRef}
                    disabled={apiCall}
                    onClick={handleSubmit}
                  />
                </Styled.StyledFooterDivComponent>

                <div style={{ marginTop: "1rem", color: "red" }}>
                  {attemptErrorText}
                </div>
              </Styled.StyledFormContainer>
            )}
          </Styled.BodyDivComponent>
        </Styled.StyledMainDivComponent>

        <AlertDialog
          divider={false}
          open={dialogOpen}
          setOpen={setDialogOpen}
          contentTitle={`${t(`commons.errorText`)}..!`}
          contentText={"API failed"}
          agreeTitle={t(`commons.okayText`)}
          handleAgree={() => setDialogOpen(false)}
          handleDisagree={() => setDialogOpen(false)}
        />
      </Styled.StyledContainer>
    </>
  );
};

export default IdentitiesPopup;
