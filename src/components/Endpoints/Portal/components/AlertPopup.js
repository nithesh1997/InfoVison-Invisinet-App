import React from "react";
import Styled from "./FilterRulesPopup/MaterialComponents/AlertPopup.style";

export default function AlertPopup({
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
    <Styled.DialogBox
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Styled.ModalTitle id="alert-dialog-title">
        {contentTitle}
      </Styled.ModalTitle>
      <Styled.DialogContent style={{ width: "400px" }}>
        <Styled.ModalText id="alert-dialog-description">
          {contentText}
        </Styled.ModalText>
        <Styled.Divider
          style={{ margin: "0.5rem 0", display: divider ? "auto" : "none" }}
        />
      </Styled.DialogContent>
      <Styled.DialogActions>
        {disagreeTitle && (
          <Styled.DialogButton
            onClick={handleDisagree}
            color="primary"
            variant="outlined"
          >
            {disagreeTitle}
          </Styled.DialogButton>
        )}

        <Styled.DialogButton
          onClick={handleAgree}
          color="primary"
          autoFocus
          variant="outlined"
        >
          {agreeTitle}
        </Styled.DialogButton>
      </Styled.DialogActions>
    </Styled.DialogBox>
  );
}
