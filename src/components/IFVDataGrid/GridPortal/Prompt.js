import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import { GenericButton } from "../../../style/GenericButton/GenericButton";
import { deleteConfirmation } from "../../../utils/GeneralComponentNames";
import { CloseRounded } from "@material-ui/icons";
import { Trans, useTranslation } from "react-i18next";

export default function Prompt({
  open,
  setOpen,
  contentTitle,
  contentText,
  contentInfo,
  handleAgree,
  agreeTitle,
  handleDisagree,
  disagreeTitle,
  divider = true,
  isAgreeDisabled,
  isDisagreeDisabled,
  isAuthenticator,
  passphraseChangeHandler,
  passphraseBlurHandler,
  passphraseState,
  revealPassphrase,
  isPassphraseError,
  passphraseErrorMessage,
  toggleRevealPassphrase,
}) {
  const { t } = useTranslation();

  return (
    <DialogBox
      open={open}
      onClose={setOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {isAuthenticator ? (
        <Styled.HeaderBox>
          <Styled.DialogTitle>{contentTitle}</Styled.DialogTitle>
          <Styled.CloseButton onClick={handleDisagree}>
            <CloseRounded />
          </Styled.CloseButton>
        </Styled.HeaderBox>
      ) : (
        <ModalTitle id="alert-dialog-title">{contentTitle}</ModalTitle>
      )}
      <DialogContent style={{ width: "400px" }}>
        <ModalText id="alert-dialog-description">{contentText}</ModalText>

        {isAuthenticator ? (
          <Styled.FieldWrapper>
            <Styled.GlobalTextField
              variant="outlined"
              margin="normal"
              fullWidth
              // size="small"
              label={t(
                "page.configure.Configuration.BackUp Configuration Modal.PassPhrase",
              )}
              placeholder={t(
                "page.configure.Configuration.BackUp Configuration Modal.PassPhrase",
              )}
              InputLabelProps={{ shrink: true }}
              name="passphrase"
              autoComplete="passphrase"
              onChange={passphraseChangeHandler}
              onBlur={passphraseBlurHandler}
              // aria-describedby="emailHelp"
              value={passphraseState}
              type={revealPassphrase ? "text" : "password"}
              error={isPassphraseError}
              helperText={passphraseErrorMessage}
              required
              // ref={}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onMouseUp={() => toggleRevealPassphrase(false)}
                      onMouseDown={() => toggleRevealPassphrase(true)}
                      disabled={isPassphraseError}
                    >
                      {revealPassphrase ? (
                        <VisibilityOutlinedIcon style={{ color: "#333" }} />
                      ) : (
                        <VisibilityOffOutlinedIcon style={{ color: "#333" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Styled.FieldWrapper>
        ) : (
          <></>
        )}

        <Divider
          style={{ margin: "0.5rem 0", display: divider ? "auto" : "none" }}
        />
      </DialogContent>

      <DialogActions>
        {disagreeTitle ? (
          <GenericButton
            id={`${deleteConfirmation}-cancel-button`}
            // style={{ background: "#e83b46", border: "2px solid #e83b46" }}
            backgroundColor="secondary"
            buttonName={t("commons.cancelText")}
            disabled={isDisagreeDisabled}
            onClick={handleDisagree}
          />
        ) : null}

        {agreeTitle ? (
          <GenericButton
            id={`${deleteConfirmation}-confirm-button`}
            backgroundColor="primary"
            buttonName={t("commons.confirmText")}
            disabled={isAgreeDisabled}
            onClick={handleAgree}
            autoFocus
          />
        ) : null}
      </DialogActions>
    </DialogBox>
  );
}

const DialogBox = styled(Dialog)`
  /* font-family: "Montserrat"; */
`;

const DisagreeButton = styled(Button)`
  /* font-family: "Montserrat", sans-serif; */
  font-size: 0.8rem;
  font-weight: 600;
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: rgba(2, 147, 254, 1);
  text-transform: capitalize;

  &:hover {
    background: rgba(2, 147, 254, 0.1);
    border: 0.1em solid rgba(2, 147, 254, 1);
  }
`;

const AgreeButton = styled(Button)`
  /* font-family: "Montserrat", sans-serif; */
  font-size: 0.8rem;
  font-weight: 600;
  border: 0.1em solid rgba(237, 20, 61, 1);
  color: rgba(237, 20, 61, 1);
  text-transform: capitalize;

  &:hover {
    background: rgba(237, 20, 61, 0.1);
    border: 0.1em solid rgba(237, 20, 61, 1);
  }
`;

const ModalTitle = styled(DialogTitle)`
  & .MuiTypography-h6 {
    /* font-family: "Montserrat"; */
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ModalText = styled(DialogContentText)`
  /* font-family: "Montserrat"; */
  font-size: 0.8rem;
  font-weight: 500;
  color: #111827;
  inset: inherit;
  overflow-wrap: break-word;
`;

const ModalTextInfo = styled(DialogContentText)`
  /* font-family: "Montserrat"; */
  font-size: 0.6rem;
  font-weight: 500;
  color: #111827;
`;

const Styled = {
  FieldWrapper: styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 98px;
  `,
  GlobalTextField: styled(TextField)`
    &.MuiOutlinedInput-root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 6px 8px;
      width: 241px;
      height: 32px;
      /* color: #fff; */
      border: 1px solid #bababa;
      border-radius: 4px;
      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;
    }

    &.MuiOutlinedInput-root:hover {
      /* background: #fff; */
      border: 1px solid #747474;
      /* color: #fff; */
    }

    /* & .MuiLabel-root {
      color: #000000;
    } */

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border: 1px solid #0094fd;
      /* background: #ffffff; */
    }

    & .MuiFormLabel-root.Mui-focused {
      color: #0094fd;
    }

    &.MuiOutlinedInput-root.Mui-disabled {
      background: #f0f0f0;
      border: 2px solid #f0f0f0;
    }

    &.MuiOutlinedInput-root.Mui-error {
      border: 1px solid #ff3d3d;
    }

    & .MuiFormHelperText-contained {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
      color: #ff3d3d;
    }

    & .MuiOutlinedInput-root.MuiOutlinedInput-inputMultiline {
      padding: 0.2em;
    }
  `,
  HeaderBox: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 0.4em;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);
  `,
  DialogTitle: styled(Typography)`
    &.MuiTypography-root {
      font-weight: 600;
      padding: 0 0 0 1em;
      font-family: "Inter";
    }
  `,
  CloseButton: styled(IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,
};
