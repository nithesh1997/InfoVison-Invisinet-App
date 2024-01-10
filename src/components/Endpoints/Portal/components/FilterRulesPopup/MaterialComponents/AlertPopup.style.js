import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";

const Styled = {
  DialogBox: styled(Dialog)`
    /* font-family: "Montserrat"; */
  `,
  DialogButton: styled(Button)`
    /* font-family: "Montserrat"; */
    font-size: 0.8rem;
    /* font-family: "Montserrat", sans-serif; */
    border: 0.1em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);
    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }
  `,
  ModalTitle: styled(DialogTitle)`
    & .MuiTypography-h6 {
      /* font-family: "Montserrat"; */
      font-size: 0.9rem;
      font-weight: 600;
    }
  `,
  ModalText: styled(DialogContentText)`
    /* font-family: "Montserrat"; */
    font-size: 0.8rem;
    font-weight: 500;
    color: #111827;
    overflow-wrap: break-word;
  `,
  ModalTextInfo: styled(DialogContentText)`
    /* font-family: "Montserrat"; */
    font-size: 0.6rem;
    font-weight: 500;
    color: #111827;
  `,
  DialogContent: styled(DialogContent)``,

  Divider: styled(Divider)``,

  DialogActions: styled(DialogActions)``,
};

export default Styled;
