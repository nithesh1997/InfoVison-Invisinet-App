import React, { useState } from "react";
import callAPI from "../../apis/callAPI";
import { dumpConfigResponder } from "../../apis/responders/config-managment-api-responder";
import {
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Styled from "./MaterialComponents/BackUpConfiguration.style";
import { CloseRounded } from "@mui/icons-material";
import { GlobalTextField } from "../../style/TextField/TextField";
import { FileX, InfoCircle } from "react-bootstrap-icons";
import ToolTip from "../../utils/Tooltip/Tooltip";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import edit from "../../images/Edit.svg";
import { useSelector } from "react-redux";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Prompt from "../IFVDataGrid/GridPortal/Prompt";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Utility from "../../redux/actions/Utility";
import { Trans, useTranslation } from "react-i18next";

const initFileNameState = (consoleName) => {
  const date = new Date();
  const utcMonth =
    `${date.getUTCMonth()}`.length === 1
      ? `0${date.getUTCMonth() + 1}`
      : `${date.getUTCMonth() + 1}`;
  const utcDate =
    `${date.getUTCDate()}`.length === 1
      ? `0${date.getUTCDate()}`
      : `${date.getUTCDate()}`;
  const dateStamp = `${utcMonth}-${utcDate}-${date.getUTCFullYear()}`;

  return {
    initialValue: `${consoleName}`,
    value: `${consoleName}`,
    isDisabled: true,
    isRescue: false,
    validation: {
      isError: false,
      validation: `Filename can contain "Alphanumeric", "-", "_" characters`,
    },
  };
};

function BackupConfiguration({
  open,
  setOpen,
  handleAgree,
  agreeTitle,
  handleDisagree,
  disagreeTitle,
  IsReloadComponentState,
}) {
  const { address: gatewayIP, name: consoleName } = useSelector(
    (state) => state.activeGateway,
  );
  const gatewayConfig = useSelector((state) => state.gatewayConfig);
  const [fileName, setFileName] = useState(() =>
    initFileNameState(consoleName),
  );
  const [isFileNameError, setIsFileNameError] = useState(false);
  const [fileNameHelperText, setFileNameHelperText] = useState("");

  const [passPhrase, setPassPhrase] = useState("");
  const [showPassPhrase, setShowPassPhrase] = useState(false);
  const [isPassPhraseError, setIsPassPhraseError] = useState(false);
  const [passPhraseHelperText, setPassPhraseHelperText] = useState("");

  const [confirmPassPhrase, setConfirmPassPhrase] = useState("");
  const [showConfirmPassPhrase, setShowConfirmPassPhrase] = useState(false);
  const [isConfirmPassPhraseError, setIsConfirmPassPhraseError] =
    useState(false);
  const [confirmPassPhraseHelperText, setConfirmPassPhraseHelperText] =
    useState("");

  const [isRescue, setIsRescue] = useState(false);

  const [comments, setComments] = useState("");
  const [isCommentsError, setIsCommentsError] = useState(false);
  const [commentsHelperText, setCommentsHelperText] = useState("");

  const [promptAction, setPromptAction] = useState(false);
  const [promptSuccess, setPromptSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const { isReloadComponent, setIsReloadComponent } = IsReloadComponentState;

  const { t } = useTranslation();

  const validateFileName = (value) => {
    const regex = new RegExp(/^[a-zA-Z0-9-_]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setIsFileNameError(true);
      setFileNameHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.File Name Helper Text1",
        ),
      );
      return true;
    } else if (regexTest) {
      setIsFileNameError(true);
      setFileNameHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.File Name Helper Text2",
        ),
      );
      return true;
    } else if (
      value.endsWith("-") ||
      value.endsWith("_") ||
      value.startsWith("-") ||
      value.startsWith("_")
    ) {
      setIsFileNameError(true);
      setFileNameHelperText("Please provide valid Filename");
      return true;
    } else {
      setIsFileNameError(false);
      setFileNameHelperText("");
      return false;
    }
  };

  const toggleFileNameMode = (isEdit) => {
    setFileName((oldState) => ({
      ...oldState,
      isDisabled: !isEdit,
      value: !isEdit ? oldState.initialValue : oldState.value,
    }));
  };

  const fileNameChangeHandler = (event) => {
    setFileName((oldState) => ({ ...oldState, value: event.target.value }));
  };

  const fileNameBlurHandler = (event) => {
    validateFileName(event.target.value);
  };

  const validatePassPhrase = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setIsPassPhraseError(true);
      setPassPhraseHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.PassPhrase Helper Text1",
        ),
      );
      return true;
    } else if (value.length < 4) {
      setIsPassPhraseError(true);
      setPassPhraseHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.PassPhrase Helper Text2",
        ),
      );
      return true;
    } else {
      setIsPassPhraseError(false);
      setPassPhraseHelperText("");
      return false;
    }
  };

  const toggleViewPassPhrase = (isEye) => {
    setShowPassPhrase(isEye);
  };

  const passPhraseChangeHandler = (event) => {
    setPassPhrase(event.target.value);
  };

  const passPhraseBlurHandler = (event) => {
    validatePassPhrase(event.target.value);
  };

  const validateConfirmPassPhrase = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setIsConfirmPassPhraseError(true);
      setConfirmPassPhraseHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.Confirm Phrase Helper Text",
        ),
      );
      return true;
    } else if (passPhrase !== value) {
      setIsConfirmPassPhraseError(true);
      setConfirmPassPhraseHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.Confirm Phrase Not Same",
        ),
      );
      return true;
    } else {
      setIsConfirmPassPhraseError(false);
      setConfirmPassPhraseHelperText("");
      return false;
    }
  };

  const toggleViewConfirmPassPhrase = (isEye) => {
    setShowConfirmPassPhrase(isEye);
  };

  const confirmPassPhraseChangeHandler = (event) => {
    setConfirmPassPhrase(event.target.value);
  };

  const confirmPassPhraseBlurHandler = (event) => {
    validateConfirmPassPhrase(event.target.value);
  };

  const toggleIsRescue = (event) => {
    setIsRescue(event.target.checked);
  };

  const validateComments = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (!value.length) {
      setIsCommentsError(false);
      setCommentsHelperText("");
      return false;
    } else if (value.length >= 64) {
      setIsCommentsError(true);
      setCommentsHelperText(
        t(
          "page.configure.Configuration.BackUp Configuration Modal.Comment Helper Text",
        ),
      );
      return true;
    } else {
      setIsCommentsError(false);
      setCommentsHelperText("");
      return false;
    }
  };

  const commentsChangeHandler = (event) => {
    setComments(event.target.value);
  };

  const commentsBlurHandler = (event) => {
    validateComments(event.target.value);
  };

  const validateAll = (event) => {
    const isFileNameError = validateFileName(fileName.value);
    const isPassPhraseError = validatePassPhrase(passPhrase);
    const isConfirmPassPhraseError =
      validateConfirmPassPhrase(confirmPassPhrase);
    const isCommentsError = validateComments(comments);

    if (
      !isFileNameError &&
      !isPassPhraseError &&
      !isCommentsError &&
      !isConfirmPassPhraseError
    ) {
      setPromptAction(true);
    }
  };

  const dumpConfigOnCompleteHandler = (response) => {
    //handleDisagree(event);
    if (response.state === "DUMP_CONFIG_SUCCESS") {
      setDialogOpen(true);
      setError(false);
      setMessage(
        <>
          <p>
            {t(
              "page.configure.Configuration.BackUp Configuration Modal.successAlert.Content",
              {
                type:
                  gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate",
                fileName: fileName.value,
              },
            )}
          </p>
        </>,
      );
      setIsReloadComponent((oldState) => oldState || true);
      setDisableSubmitButton(false);
    } else {
      setDialogOpen(true);
      setError(true);
      setMessage(
        <>
          {t("commons.errorMessages.backupConfiguration")}
          <br />
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );
      setDisableSubmitButton(false);
    }
  };

  const backupSubmitHandler = (event) => {
    setPromptAction(false);
    setDisableSubmitButton(true);

    callAPI({
      path: "dump-config",
      params: { gatewayIP },
      data: {
        fileName: fileName.value,
        passPhrase: btoa(passPhrase),
        isRescue: Number(isRescue),
        comments,
      },
      responder: dumpConfigResponder,
      onComplete: dumpConfigOnCompleteHandler,
      onCompleteArguments: [event, setMessage, setDialogOpen],
    });
  };

  const backupCancelHandler = (event) => {
    handleDisagree(event);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    handleAgree();
  };

  return (
    <>
      <Styled.ComponentContainer
        open={open}
        onClose={setOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { borderRadius: "1em" } }}
      >
        <Styled.HeaderBox>
          <Styled.DialogTitle>
            {t("page.configure.Configuration.BackUp Configuration Modal.Title")}
          </Styled.DialogTitle>

          <Styled.CloseButton onClick={handleDisagree}>
            <CloseRounded />
          </Styled.CloseButton>
        </Styled.HeaderBox>

        <DialogContent
          style={{
            width: "450px",
            height: "auto",
            padding: "16px",
            margin: "16px 0px",
          }}
        >
          {/* Filename */}
          <Styled.FieldWrapper>
            <GlobalTextField
              name="fileName"
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.FileName",
              )}
              placeholder={t(
                "page.configure.Configuration.BackUp Configuration Modal.FileName",
              )}
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              onChange={fileNameChangeHandler}
              onBlur={fileNameBlurHandler}
              value={fileName.value}
              disabled={fileName.isDisabled}
              error={isFileNameError}
              helperText={fileNameHelperText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {fileName.isDisabled === true ? (
                      <IconButton onClick={() => toggleFileNameMode(true)}>
                        <img src={edit} alt={"edit"} width={"25px"} />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => toggleFileNameMode(false)}
                        disabled={fileNameHelperText}
                      >
                        <CloseRounded
                          style={{ fontSize: "18px", color: "#0094FD" }}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Styled.FieldWrapper>
          {/* Filename */}

          {/* Passphrase */}
          <Styled.FieldWrapper>
            <GlobalTextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.PassPhrase",
              )}
              placeholder={t(
                "page.configure.Configuration.BackUp Configuration Modal.PassPhrase",
              )}
              InputLabelProps={{ shrink: true }}
              name="passphrase"
              autoComplete="passphrase"
              onChange={passPhraseChangeHandler}
              onBlur={passPhraseBlurHandler}
              value={passPhrase}
              type={!showPassPhrase ? "password" : "text"}
              error={isPassPhraseError}
              helperText={passPhraseHelperText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onMouseUp={() => toggleViewPassPhrase(false)}
                      onMouseDown={() => toggleViewPassPhrase(true)}
                      disabled={isPassPhraseError}
                    >
                      {showPassPhrase ? (
                        <VisibilityOutlinedIcon style={{ color: "#0094FD" }} />
                      ) : (
                        <VisibilityOffOutlinedIcon
                          style={{ color: "#0094FD" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Styled.FieldWrapper>
          {/* Passphrase */}

          {/* Confirm Passphrase */}
          <Styled.FieldWrapper>
            <GlobalTextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.Confirm PassPhrase",
              )}
              placeholder={t(
                "page.configure.Configuration.BackUp Configuration Modal.Confirm PassPhrase",
              )}
              InputLabelProps={{ shrink: true }}
              name="confirm-passphrase"
              autoComplete="confirm-passphrase"
              onChange={confirmPassPhraseChangeHandler}
              onBlur={confirmPassPhraseBlurHandler}
              value={confirmPassPhrase}
              type={!showConfirmPassPhrase ? "password" : "text"}
              error={isConfirmPassPhraseError}
              helperText={confirmPassPhraseHelperText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onMouseUp={() => toggleViewConfirmPassPhrase(false)}
                      onMouseDown={() => toggleViewConfirmPassPhrase(true)}
                      disabled={isConfirmPassPhraseError}
                    >
                      {showConfirmPassPhrase ? (
                        <VisibilityOutlinedIcon style={{ color: "#0094FD" }} />
                      ) : (
                        <VisibilityOffOutlinedIcon
                          style={{ color: "#0094FD" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Styled.FieldWrapper>
          {/* Confirm Passphrase */}

          {/* isRescue */}
          <Styled.Box>
            <FormControlLabel
              control={
                <Styled.CheckBox checked={isRescue} onChange={toggleIsRescue} />
              }
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.Check Box Label",
              )}
              style={{ userSelect: "none" }}
            />

            <ToolTip
              title={t(
                "page.configure.Configuration.BackUp Configuration Modal.Tooltip",
              )}
            >
              <Styled.IconButton>
                <InfoCircle size={"0.6em"} />
              </Styled.IconButton>
            </ToolTip>
          </Styled.Box>
          {/* isRescue */}

          {/* Comments */}
          <Styled.FieldWrapper>
            <GlobalTextField
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.Comment",
              )}
              placeholder="Enter your comment for future reference"
              InputLabelProps={{ shrink: true }}
              name="comment"
              autoComplete="comment"
              onChange={commentsChangeHandler}
              onBlur={commentsBlurHandler}
              error={isCommentsError}
              helperText={commentsHelperText}
            />
          </Styled.FieldWrapper>
          {/* Comments */}
        </DialogContent>

        <DialogActions style={{ padding: "0 2.5em 2em 0" }}>
          {disagreeTitle ? (
            <GenericButton
              disabled={false}
              onClick={backupCancelHandler}
              backgroundColor="secondary"
              buttonName={disagreeTitle}
            />
          ) : null}

          {agreeTitle ? (
            <GenericButton
              onClick={(event) => validateAll(event)}
              backgroundColor="primary"
              buttonName={t(
                "page.configure.Configuration.BackUp Configuration Modal.Backup Button",
              )}
              disabled={disableSubmitButton}
            />
          ) : null}
        </DialogActions>

        {promptAction ? (
          <Prompt
            open={promptAction}
            setOpen={setPromptAction}
            contentTitle={t(
              "page.configure.Configuration.BackUp Configuration Modal.Confirmation Modal.Title",
            )}
            contentText={t(
              "page.configure.Configuration.BackUp Configuration Modal.Confirmation Modal.Content",
            )}
            contentInfo={``}
            agreeTitle={"Yes"}
            disagreeTitle={"No"}
            handleAgree={backupSubmitHandler}
            handleDisagree={() => setPromptAction(false)}
          />
        ) : null}

        <AlertDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          contentTitle={
            error ? t("commons.errorAlertTitle") : t("commons.TaskCompleted")
          }
          contentText={message}
          handleAgree={handleDialogClose}
          agreeTitle={t("commons.okayText")}
        />
      </Styled.ComponentContainer>
    </>
  );
}

export default BackupConfiguration;
