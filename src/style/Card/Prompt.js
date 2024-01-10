import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { GenericButton } from "../GenericButton/GenericButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        minWidth: 400,
        color: "#000000",
        fontWeight: 600,
        m: 0,
        p: 2,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const GlobalPrompt = ({
  openPrompt,
  handleClose,
  title,
  primaryBtnText,
  secondaryBtnText,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisable,
  secondaryDisable,
  secondaryBgColor,
  primaryVariant,
  secondaryVariant,
  content,
  ...props
}) => {
  return (
    <BootstrapDialog onClose={handleClose} open={openPrompt} {...props}>
      <BootstrapDialogTitle onClose={handleClose}>{title}</BootstrapDialogTitle>
      <DialogContent>
        <Typography gutterBottom>{content}</Typography>
      </DialogContent>
      <DialogActions>
        {secondaryBtnText && (
          <GenericButton
            buttonName={secondaryBtnText}
            backgroundColor={secondaryBgColor ? secondaryBgColor : "secondary"}
            onClick={onSecondaryClick}
            disabled={secondaryDisable ? secondaryDisable : false}
            variant={secondaryVariant}
          />
        )}
        {primaryBtnText && (
          <GenericButton
            buttonName={primaryBtnText}
            backgroundColor="primary"
            onClick={onPrimaryClick}
            disabled={primaryDisable ? primaryDisable : false}
            variant={primaryVariant}
          />
        )}
      </DialogActions>
    </BootstrapDialog>
  );
};
