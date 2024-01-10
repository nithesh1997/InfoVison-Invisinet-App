import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import styled from "styled-components";
import { GenericButton } from "../../style/GenericButton/GenericButton";

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
  isDisableActions,
}) {
  return (
    <DialogBox
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalTitle id="alert-dialog-title">{contentTitle}</ModalTitle>
      <DialogContent style={{ width: "400px" }}>
        <ModalText id="alert-dialog-description">{contentText}</ModalText>
        <Divider
          style={{ margin: "0.5rem 0", display: divider ? "auto" : "none" }}
        />
      </DialogContent>
      <DialogActions>
        {disagreeTitle ? (
          <GenericButton
            disabled={isDisableActions || false}
            onClick={handleDisagree}
            backgroundColor="secondary"
            buttonName={disagreeTitle}
          />
        ) : null}

        {agreeTitle ? (
          <GenericButton
            onClick={handleAgree}
            backgroundColor="primary"
            buttonName={agreeTitle}
            disabled={isDisableActions || false}
          />
        ) : null}
      </DialogActions>
    </DialogBox>
  );
}

const DialogBox = styled(Dialog)``;

const ModalTitle = styled(DialogTitle)`
  & .MuiTypography-h6 {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ModalText = styled(DialogContentText)`
  font-size: 0.8rem;
  font-weight: 500;
  color: #111827;
`;

const ModalTextInfo = styled(DialogContentText)`
  font-size: 0.6rem;
  font-weight: 500;
  color: #111827;
`;
