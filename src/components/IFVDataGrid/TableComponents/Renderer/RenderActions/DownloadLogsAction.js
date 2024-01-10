import { Button, styled, Typography } from "@material-ui/core";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import React, { useContext, useEffect, useRef, useState } from "react";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { Trans, useTranslation } from "react-i18next";

const handleCustomAction = (row, setRowActionState) => {
  setTimeout(() => {
    setRowActionState({
      inProgress: false,
      payload: { ...row },
      isError: false,
      message: "CUSTOM ACTION TRIGGERED FROM DEFAULT HANDLER",
    });
  }, 1500);
};

export const DownloadLogsAction = ({
  actionPayloadState,
  editOnPopup,
  icon,
  name,
  onClick,
  row,
  rowIndex,
  setStartAsync,
  startAsync,
  type,
  isEnabled = () => true,
  isInMenu,
  handleMenuClose,
  handleMenuHide,
  handleMenuUnhide,
  closePortal,
  id,
}) => {
  const actionButtonRef = useRef();
  const [rowActionState, setRowActionState] = actionPayloadState;

  const { setDontClosePopup, setCustomActionType } =
    useContext(DataGridContext);

  const [toggleViewState, setToggleViewState] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [modal, setModal] = useState("neutral");

  const { t } = useTranslation();

  const handleClick = (event) => {
    actionButtonRef.current = event;
    handleMenuHide();
    setRowActionState((prev) => ({ ...prev, inProgress: true }));
    setStartAsync((prev) => ({ ...prev, isDownloadLogs: true }));
  };

  useEffect(() => {
    setIsDisabled(!isEnabled(row));
  }, []);

  useEffect(() => {
    row.id === "__new" || !onClick
      ? setToggleViewState(false)
      : setToggleViewState(true);
  }, [onClick, row]);

  if (onClick === null) {
    onClick = handleCustomAction;
  }

  useEffect(() => {
    if (rowActionState.inProgress && startAsync.isDownloadLogs) {
      setCustomActionType(type);
      setDontClosePopup(false);
      onClick(row, setRowActionState);
    }
  }, [
    onClick,
    row,
    rowActionState.inProgress,
    setCustomActionType,
    setDontClosePopup,
    setRowActionState,
    startAsync,
    type,
  ]);

  useEffect(() => {
    if (modal === "closed") {
      closePortal();
      handleMenuClose(actionButtonRef.current);
      handleMenuUnhide();
      setModal("neutral");
    }
  }, [closePortal, handleMenuClose, handleMenuUnhide, modal]);

  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isDownloadLogs === true
    ) {
      setDontClosePopup(true);
      setStartAsync((prev) => ({ ...prev, isDownloadLogs: false }));

      setDialogOpen(Boolean(rowActionState.error || rowActionState.message));

      if (!Boolean(rowActionState.message)) {
        setModal("closed");
      }
    }
  }, [
    isEnabled,
    row,
    rowActionState,
    setDontClosePopup,
    setRowActionState.message,
    setStartAsync,
    startAsync.isDownloadLogs,
  ]);

  const calcToggle = toggleViewState && !editOnPopup ? true : false;

  return (
    <React.Fragment>
      <ToolTip title={t("page.Endpoint.Configure.ellipsisMenu.tooltipLogFile")}>
        <ACTION_BUTTON
          id={id}
          disabled={isDisabled}
          isDisplay={calcToggle}
          name={name}
          hoverBg="rgba(2, 147, 254, 0.2)"
          onClick={handleClick}
          theme={{ isInMenu }}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <NoteAddRoundedIcon
            style={{
              width: "0.85em",
              height: "0.85em",
              color: isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)",
            }}
          />

          <ACTION_BUTTON_TEXT
            style={{
              display: isInMenu ? "inherit" : "none",

              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              padding: "0 0 0 0.6em",
            }}
          >
            {t("page.Endpoint.Configure.ellipsisMenu.requestLogFile")}
          </ACTION_BUTTON_TEXT>
        </ACTION_BUTTON>
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
        contentInfo={
          rowActionState.error ? `` : `The Row is at postion ${rowIndex + 1}`
        }
        handleAgree={() => {
          setDialogOpen(false);
          setModal("closed");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setModal("closed");
        }}
        agreeTitle={t("commons.okayText")}
        // handleDisagree={() => setDialogOpen(false)}
        // disagreeTitle={"Close"}
      />
    </React.Fragment>
  );
};

const ACTION_BUTTON = styled(Button)`
  &.MuiButton-root {
    box-sizing: border-box;
    display: ${({ theme }) => {
      return theme.display ? (theme.isInMenu ? "flex" : "inherit") : "none";
    }};
    justify-content: ${({ theme }) => {
      return theme.isInMenu ? "flex-start" : "inherit";
    }};
    min-width: ${({ theme }) => (theme.isInMenu ? "100%" : "32px")};
    min-height: ${({ theme }) => (theme.isInMenu ? "100%" : "32px")};
    max-width: ${({ theme }) => (theme.isInMenu ? "min-content" : "32px")};
    max-height: ${({ theme }) => (theme.isInMenu ? "min-content" : "32px")};
    border-radius: ${({ theme }) => (theme.isInMenu ? "4px" : "50%")};
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`;

const ACTION_BUTTON_TEXT = styled(Typography)`
  &.MuiTypography-root {
    display: ${({ theme }) => (theme.isInMenu ? "inherit" : "none")};
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
    padding: 0 0 0 1rem;
  }
`;
