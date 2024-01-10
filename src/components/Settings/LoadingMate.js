import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import * as Mat from "@material-ui/core";

export default function LoadingMate({
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
}) {
  return (
    <DialogBox
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalTitle id="alert-dialog-title">{contentTitle}</ModalTitle>
      <DialogContent style={{ width: "500px" }}>
        <ModalText id="alert-dialog-description">
          <Spinner />
          <br />
          {contentText}
        </ModalText>
      </DialogContent>
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
  text-align: center;
`;

const Spinner = styled(Mat.CircularProgress)`
  width: 160px !important;
  height: 160px !important;

  & .MuiCircularProgress-circleIndeterminate {
    stroke-width: 1;
  }

  &.MuiCircularProgress-colorPrimary {
    color: #0094fd;
  }
`;
