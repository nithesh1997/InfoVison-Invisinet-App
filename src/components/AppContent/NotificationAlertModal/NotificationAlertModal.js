import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";

export default function NotificationAlertModal({
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
      onClose={handleAgree || handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalTitle id="alert-dialog-title">{contentTitle}</ModalTitle>
      <DialogContent style={{ width: "400px" }}>
        <ModalText id="alert-dialog-description">{contentText}</ModalText>
        <Divider
          style={{ margin: "1rem 0", display: divider ? "auto" : "none" }}
        />
      </DialogContent>

      <DialogActions>
        <DialogButton
          onClick={handleAgree}
          color="primary"
          autoFocus
          variant="outlined"
        >
          {agreeTitle}
        </DialogButton>
      </DialogActions>
    </DialogBox>
  );
}

const DialogBox = styled(Dialog)``;

const DialogButton = styled(Button)`
  font-size: 0.8rem;
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: rgba(2, 147, 254, 1);
  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }
`;

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
