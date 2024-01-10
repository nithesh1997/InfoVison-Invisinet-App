import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import callAPI from "../../../apis/callAPI";
import { networkTwoAPIResponder } from "../../../apis/responders/networkTwoAPIResponder";
import Utility from "../../../redux/actions/Utility";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import AlertDialog from "../../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/TacMode.style";
import { GenericButton } from "../../../style/GenericButton/GenericButton";
import { tac } from "../../../utils/GeneralComponentNames";
import { EditRounded } from "@material-ui/icons";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import { useTranslation } from "react-i18next";
import * as common from "../../../common";
import Config from "../../../Config";

const initSwitchMode = {
  visible: true,
  cursor: false,
  disable: true,
  cursorIcon: false,
};

export const TacMode = (props) => {
  const { t, i18n } = useTranslation();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const AppConfig = useContext(Config);

  const [selectedMode, setSelectedMode] = useState("");
  const [switchState, setSwitchState] = useState("");
  const [switchMode, setSwitchMode] = useState(initSwitchMode);
  const [newMode, setNewMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  function helpTextGenerator(
    switchState,
    selectedMode,
    newMode,
    gatewayVariant,
  ) {
    return gatewayVariant ? (
      t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.0", {
        GATEWAY: common.GATEWAY,
      })
    ) : switchState === "view" ? (
      t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.1", {
        mode: t(
          `page.configure.dnsTacMode.tacModeWidget.TacMode.${selectedMode}`,
        ),
        GATEWAY: common.GATEWAY,
      })
    ) : switchState === "save disable" ? (
      t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.1", {
        mode: t(
          `page.configure.dnsTacMode.tacModeWidget.TacMode.${selectedMode}`,
        ),
        GATEWAY: common.GATEWAY,
      })
    ) : switchState === "save enable" ? (
      t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.2", {
        mode: t(
          `page.configure.dnsTacMode.tacModeWidget.TacMode.${selectedMode}`,
        ),
        GATEWAY: common.GATEWAY,
      })
    ) : switchState === "saving" ? (
      t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.3", {
        oldMode: t(
          `page.configure.dnsTacMode.tacModeWidget.TacMode.${selectedMode}`,
        ),
        newMode: t(
          `page.configure.dnsTacMode.tacModeWidget.TacMode.${newMode}`,
        ),
        GATEWAY: common.GATEWAY,
      })
    ) : switchState === "saved" ? (
      <Styled.StyledSaved>
        {t("page.configure.dnsTacMode.tacModeWidget.currentModeInfo.4", {
          mode: t(`page.configure.dnsTacMode.tacModeWidget.TacMode.${newMode}`),
          GATEWAY: common.GATEWAY,
        })}
      </Styled.StyledSaved>
    ) : (
      ""
    );
  }

  useEffect(() => {
    if (typeof props.networkData === "object" && props.networkData !== null) {
      if (typeof props.networkData.mode === "string") {
        setSelectedMode(props.networkData.mode);
        setNewMode(props.networkData.mode);
        setSwitchState("view");
      } else {
        setSelectedMode("");
        setNewMode("");
        setSwitchState("");
      }
    } else {
      setSelectedMode("");
      setNewMode("");
      setSwitchState("");
    }
  }, [props.networkData]);

  const onclickHandlerCancel = () => {
    setNewMode(selectedMode);
    setSwitchState("view");
    setSwitchMode((prevState) => ({
      ...prevState,
      visible: true,
      cursor: false,
      disable: true,
      cursorIcon: false,
    }));
  };

  const BridgeButtonHandler = () => {
    setNewMode("Bridge");

    if (!switchMode.cursor) {
      return;
    }

    if (selectedMode === "Bridge") {
      setSwitchState("save disable");
      setSwitchMode((prevState) => ({ ...prevState, disable: true }));
    } else {
      setSwitchState("save enable");
      setSwitchMode((prevState) => ({ ...prevState, disable: false }));
    }
  };

  const MonitorButtonHandler = () => {
    setNewMode("Monitor");

    if (!switchMode.cursor) {
      return;
    }

    if (selectedMode === "Monitor") {
      setSwitchState("save disable");
      setSwitchMode((prevState) => ({ ...prevState, disable: true }));
    } else {
      setSwitchState("save enable");
      setSwitchMode((prevState) => ({ ...prevState, disable: false }));
    }
  };

  const EnforceButtonHandler = () => {
    setNewMode("Enforce");

    if (!switchMode.cursor) {
      return;
    }

    if (selectedMode === "Enforce") {
      setSwitchState("save disable");
      setSwitchMode((prevState) => ({ ...prevState, disable: true }));
    } else {
      setSwitchState("save enable");
      setSwitchMode((prevState) => ({ ...prevState, disable: false }));
    }
  };

  const onclickHandler = () => {
    setSwitchState("save disable");
    setSwitchMode((prevState) => ({
      ...prevState,
      visible: false,
      cursor: true,
      cursorIcon: true,
      disable: true,
    }));
  };

  const networkTwoOnCompleteHandler = (responder) => {
    if (responder.code === 200 && responder.state === "NETWORK_SUCESS") {
      setSwitchMode((prevState) => ({
        ...prevState,
        visible: true,
        cursor: false,
        cursorIcon: false,
      }));

      setLoading(false);
      setSelectedMode(newMode);

      setTimeout(() => {
        setSwitchState((oldState) =>
          oldState === "saved" ? "view" : oldState,
        );
      }, 2000);

      setSwitchState("saved");
      setLoading(false);
    } else {
      setDialogOpen(true);
      setMessage(
        <p>
          {t(
            "page.configure.dnsTacMode.tacModeWidget.prompt.error.switchError.0",
          )}
          <br />
          <br />
          {t(
            "page.configure.dnsTacMode.tacModeWidget.prompt.error.switchError.1",
          )}
          <br />
          {Utility.getErrorsFromResponse(responder)}
        </p>,
      );

      setLoading(false);
      onclickHandlerCancel();
    }
  };

  const handleDialogClose = () => setDialogOpen(false);

  const onApplyHandler = () => {
    callAPI({
      path: "networkTwo",
      params: { gatewayIP, mode: newMode },
      data: { gatewayIP, mode: newMode },
      responder: networkTwoAPIResponder,
      onComplete: networkTwoOnCompleteHandler,
    });
    AppConfig.setTacMode(newMode);
    setSwitchState("saving");
    setLoading(true);
    setSwitchMode((prevState) => ({
      ...prevState,
      disable: true,
      cursor: false,
      cursorIcon: false,
    }));
  };

  return (
    <>
      <Styled.StyledBox>
        <Styled.StyledTitle>
          {t("page.configure.dnsTacMode.tacModeWidget.title")}
        </Styled.StyledTitle>

        {props.load ? (
          <Styled.StyledSkeletonHolder>
            <WidthFillerSkeleton height="200" />
          </Styled.StyledSkeletonHolder>
        ) : selectedMode === "" ? (
          ""
        ) : (
          <>
            <Styled.StyledOuterBox>
              <Styled.StyledCheck
                className={
                  newMode === "Bridge"
                    ? "selected"
                    : selectedMode === "Bridge"
                    ? "active"
                    : ""
                }
                cursor={switchMode.cursorIcon}
                onClick={BridgeButtonHandler}
              >
                <Styled.StyledBoxMode>
                  <Styled.StyledIcon />
                </Styled.StyledBoxMode>

                <Styled.ButtonMode
                  id={`${tac}-bridge-button`}
                  variant="contained"
                  disableRipple="true"
                >
                  {t("page.configure.dnsTacMode.tacModeWidget.TacMode.Bridge")}
                </Styled.ButtonMode>
              </Styled.StyledCheck>

              <Styled.StyledDividerOne orientation="vertical" />

              <Styled.StyledCheck
                className={
                  newMode === "Monitor"
                    ? "selected"
                    : selectedMode === "Monitor"
                    ? "active"
                    : ""
                }
                cursor={switchMode.cursorIcon}
                onClick={MonitorButtonHandler}
              >
                <Styled.StyledBoxMode>
                  <Styled.StyledIcon />
                </Styled.StyledBoxMode>

                <Styled.ButtonMode
                  id={`${tac}-monitor-button`}
                  variant="contained"
                  disableRipple="true"
                >
                  {t("page.configure.dnsTacMode.tacModeWidget.TacMode.Monitor")}
                </Styled.ButtonMode>
              </Styled.StyledCheck>

              <Styled.StyledDividerTwo orientation="vertical" />
              <Styled.StyledCheck
                className={
                  newMode === "Enforce"
                    ? "selected"
                    : selectedMode === "Enforce"
                    ? "active"
                    : ""
                }
                cursor={switchMode.cursorIcon}
                onClick={EnforceButtonHandler}
              >
                <Styled.StyledBoxMode>
                  <Styled.StyledIcon />
                </Styled.StyledBoxMode>

                <Styled.ButtonMode
                  id={`${tac}-enforce-button`}
                  variant="contained"
                  disableRipple="true"
                >
                  {t("page.configure.dnsTacMode.tacModeWidget.TacMode.Enforce")}
                </Styled.ButtonMode>
              </Styled.StyledCheck>
            </Styled.StyledOuterBox>

            <Styled.StyledDividerThree light width="100%" />

            <Styled.StyledBottom>
              <Styled.StyledBottomText>
                {switchMode.visible ? (
                  <> {helpTextGenerator(switchState, selectedMode, newMode)}</>
                ) : null}
              </Styled.StyledBottomText>

              {switchMode.visible ? (
                <GenericButton
                  id={`${tac}-edit-button`}
                  backgroundColor="primary"
                  buttonName={t(
                    "page.configure.dnsTacMode.dnsTable.table.action.edit",
                  )}
                  Icon={
                    <EditRounded style={{ width: "0.8em", height: "0.8em" }} />
                  }
                  disabled={false}
                  onClick={onclickHandler}
                />
              ) : (
                <Styled.ButtonBox>
                  <Styled.StyledClipLoaderContainer loading={loading}>
                    <ClipLoader size="3vh" />
                  </Styled.StyledClipLoaderContainer>

                  <GenericButton
                    backgroundColor="primary"
                    buttonName={t("commons.ApplyText")}
                    id={`${tac}-editButton-apply-button`}
                    disabled={switchMode.disable}
                    onClick={onApplyHandler}
                    Icon={
                      <DoneSharpIcon
                        style={{ width: "0.8em", height: "0.8em" }}
                      />
                    }
                  />
                  <GenericButton
                    buttonName={t("commons.cancelText")}
                    id={`${tac}-editButton-cancel-button`}
                    disabled={false}
                    onClick={onclickHandlerCancel}
                    backgroundColor="secondary"
                    Icon={
                      <ClearSharpIcon
                        style={{ width: "0.8em", height: "0.8em" }}
                      />
                    }
                  />
                </Styled.ButtonBox>
              )}
            </Styled.StyledBottom>
          </>
        )}
      </Styled.StyledBox>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={t("commons.errorText")}
        contentText={message}
        handleAgree={handleDialogClose}
        agreeTitle={t("commons.okayText")}
        handleDisagree={() => setDialogOpen(false)}
      />
    </>
  );
};
