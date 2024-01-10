import { CircularProgress, Divider } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import styled from "styled-components";

const DataProcessingSpinnerModal = ({ open, onClose }) => {
  return (
    <DialogBox
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent style={{ width: "400px" }}>
        <Spinner />

        <Divider style={{ margin: "0.5rem 0" }} />

        <ModalTitle id="alert-dialog-title">
          Deleting Filter Rules...
        </ModalTitle>
      </DialogContent>
    </DialogBox>
  );
};

export default DataProcessingSpinnerModal;

const DialogBox = styled(Dialog)``;

const ModalTitle = styled(DialogTitle)`
  & .MuiTypography-h6 {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const Spinner = styled(CircularProgress)`
  &.MuiCircularProgress-colorPrimary {
    color: #0094fd;
  }
`;
