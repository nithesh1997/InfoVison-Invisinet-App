import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import React, { useContext, useEffect, useState } from "react";
import AlertDialog from "../../../GridPortal/AlertDialog";
import Prompt from "../../../GridPortal/Prompt";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import callAPI from "../../../../../apis/callAPI";
import { logoutApiResponder } from "../../../../../apis/responders/logoutApiResponder";
import Auth from "../../../../../redux/actions/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Config from "../../../../../Config";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import { setRecentGateway } from "../../../../../Gateway/recentGatewaySlice";
import { Trans, useTranslation } from "react-i18next";

const handleRestore = (row, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    isError: false,
    message: "Restoration Complete.",
  });
};

export const RestoreAction = ({
  onClick,
  row,
  rows,
  rowIndex,
  actionPayloadState,
  isModeEdit,
  startAsync,
  setStartAsync,
  isEnabled = () => true,
  allowBulkActions = false,
  prompt,
  id,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  const { setDontClosePopup, gridSubconscious } = useContext(DataGridContext);
  const { gridAllRows, setGridAllRows } = useContext(DataGridContext);
  const { handlersTooltip } = useContext(DataGridContext);

  const [rowActionState, setRowActionState] = actionPayloadState;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleViewState, setToggleViewState] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [runEffect, setRunEffect] = useState("");
  const [prompter, setPrompter] = useState(false);

  const [passphraseState, setPassphraseState] = useState("");
  const [revealPassphrase, setRevealPassphrase] = useState(false);
  const [isPassphraseError, setIsPassphraseError] = useState(false);
  const [passphraseErrorMessage, setPassphraseErrorMessage] = useState("");

  const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);

  const { t } = useTranslation();

  const toggleRevealPassphrase = () => {
    setRevealPassphrase((oldState) => !oldState);
  };

  const passphraseValidationHandler = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setIsPassphraseError(true);
      setPassphraseErrorMessage(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.PassPhrase Helper Text1",
        ),
      );
      setIsAgreeDisabled(true);
      return true;
    } else if (value.length < 4) {
      setIsPassphraseError(true);
      setPassphraseErrorMessage(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.PassPhrase Helper Text2",
        ),
      );
      setIsAgreeDisabled(true);
      return true;
    } else {
      setIsPassphraseError(false);
      setPassphraseErrorMessage("");
      setIsAgreeDisabled(false);
      return false;
    }
  };

  const passphraseChangeHandler = (event) => {
    setPassphraseState(event.target.value);
    setIsAgreeDisabled(passphraseValidationHandler(event.target.value));
  };

  const passphraseBlurHandler = (event) => {
    passphraseValidationHandler(event.target.value);
  };

  useEffect(() => {
    setIsDisabled(!isEnabled(row));
  }, [gridSubconscious.page, isEnabled, row, setIsDisabled]);

  useEffect(() => {
    if (!onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick]);

  if (onClick === null) {
    onClick = handleRestore;
  }

  useEffect(() => {
    if (startAsync.isRestore === true) {
      setPrompter(false);
      !prompt.contentTextGen &&
        setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick({ ...row, passphraseState }, setRowActionState, setGridAllRows);
    }
  }, [startAsync.isRestore]);

  useEffect(() => {
    if (rowActionState.inProgress === false && startAsync.isRestore === true) {
      setStartAsync((prev) => ({ ...prev, isRestore: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
      } else {
        rowActionState.message && setDialogOpen(rowActionState.message);
      }
    }
  }, [rowActionState]);

  useEffect(() => {
    if (runEffect === "completeAction" && !rowActionState.error) {
      //   const fallFunc = (prevRows) => prevRows.filter((r) => r.id !== row.id);
      //   const setFunc = rowActionState?.callback ?? fallFunc;
      //   setGridAllRows(setFunc);

      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: (responder) => {
          setTimeout(() => {
            Auth.forcelogOut(
              { location, history },
              AppConfig,
              AppOverlayContext,
              () => dispatch(setRecentGateway({ address: gatewayIP })),
            );
          }, AppConfig.app.signOutDelay);
        },
      });
    }

    setRunEffect("");
  }, [
    row.id,
    rowActionState.callback,
    rowActionState.error,
    runEffect,
    setGridAllRows,
  ]);

  return (
    <React.Fragment>
      <ToolTip title={handlersTooltip.handleRestore}>
        <ActionIconButton
          id={id}
          isDisplay={toggleViewState && !isModeEdit}
          onClick={(event) => {
            prompt.contentTextGen &&
              setRowActionState((prev) => ({ ...prev, inProgress: true }));
            setPrompter(true);
          }}
          hoverBg="#D6EEFF"
          disabled={isDisabled}
        >
          <SettingsBackupRestoreOutlinedIcon
            style={{ color: !isDisabled ? "#0094fd" : "#0094fd60" }}
          />
        </ActionIconButton>
      </ToolTip>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={
          rowActionState.error
            ? t("commons.errorAlertTitle")
            : t("commons.TaskCompleted")
        }
        contentText={rowActionState.message}
        contentInfo={rowActionState.error ? `` : ``}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
      />

      <Prompt
        open={prompter}
        setOpen={setPrompter}
        contentTitle={
          prompt.contentTitle ||
          t("page.configure.Configuration.Restore Configuration Moal.Title")
        }
        contentText={
          prompt.contentTextGen
            ? prompt.contentTextGen(row)
            : prompt.contentText || (
                <>
                  <Trans
                    i18nKey={
                      "page.configure.Configuration.TableActionAlert.Export.Content"
                    }
                    components={[<br />, <b />]}
                  ></Trans>
                  <p style={{ color: "crimson" }}>
                    {t(
                      "page.configure.Configuration.TableActionAlert.Export.Content2",
                    )}
                    <br />
                    {t(
                      "page.configure.Configuration.TableActionAlert.Export.Content3",
                      {
                        Invisigate:
                          gatewayConfig.chassis_model === "5010"
                            ? "Controller"
                            : "Invisigate",
                      },
                    )}
                  </p>
                </>
              )
        }
        contentInfo={``}
        agreeTitle={"Confirm"}
        disagreeTitle={"Cancel"}
        isAgreeDisabled={isAgreeDisabled}
        handleAgree={() => {
          setStartAsync((prev) => ({ ...prev, isRestore: true }));
        }}
        handleDisagree={() => {
          setRowActionState((prev) => ({ ...prev, inProgress: false }));
          setDontClosePopup(false);
          setPrompter(false);
        }}
        isAuthenticator={true}
        passphraseChangeHandler={passphraseChangeHandler}
        passphraseBlurHandler={passphraseBlurHandler}
        passphraseState={passphraseState}
        revealPassphrase={revealPassphrase}
        isPassphraseError={isPassphraseError}
        passphraseErrorMessage={passphraseErrorMessage}
        toggleRevealPassphrase={toggleRevealPassphrase}
      />
    </React.Fragment>
  );
};
