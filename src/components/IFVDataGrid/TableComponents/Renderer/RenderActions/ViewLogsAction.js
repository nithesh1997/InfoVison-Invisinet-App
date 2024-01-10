import { Button, Typography } from "@material-ui/core";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
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

export const ViewLogsAction = ({
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
  pageName = "",
  href,
  id,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setDontClosePopup, setCustomActionType } =
    useContext(DataGridContext);
  const { handlersTooltip } = useContext(DataGridContext);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [toggleViewState, setToggleViewState] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const { t } = useTranslation();

  const handleClick = (event) => {
    handleMenuClose(event);
    setRowActionState((prev) => ({ ...prev, inProgress: true }));
    setTimeout(() => {
      setStartAsync((prev) => ({ ...prev, isViewLogs: true }));
    }, 0);
  };

  React.useEffect(() => {
    if (row.id === "__new" || !onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick, row]);

  if (onClick === null) {
    onClick = handleCustomAction;
  }

  React.useEffect(() => {
    if (rowActionState.inProgress && startAsync.isViewLogs) {
      setCustomActionType(type);
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState, setDontClosePopup);
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

  React.useEffect(() => {
    if (rowActionState.inProgress === false && startAsync.isViewLogs === true) {
      setStartAsync((prev) => {
        return { ...prev, isViewLogs: false };
      });
      setDontClosePopup(true);
      setIsDisabled(!isEnabled(row));

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
      } else {
        rowActionState.message && setDialogOpen(rowActionState.message);
      }
    }
  }, [rowActionState]);

  useEffect(() => {
    setIsDisabled(!isEnabled(row));
  }, []);

  const calcToggle = toggleViewState && !editOnPopup ? true : false;

  return (
    <React.Fragment>
      <ToolTip
        title={t("page.Endpoint.Configure.ellipsisMenu.tooltipDownloadLogs")}
      >
        <ACTION_BUTTON
          id={id}
          {...(href ? { href: href(row), target: "_blank" } : {})}
          disabled={isDisabled}
          isDisplay={calcToggle}
          name={name}
          hoverBg="rgba(2, 147, 254, 0.2)"
          onClick={(event) => handleClick(event)}
          theme={{ isInMenu: pageName !== "ba-logFiles-config" }}
        >
          <DownloadForOfflineRoundedIcon
            style={{
              width: "0.85em",
              height: "0.85em",
              color: isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)",
            }}
          />
          {pageName !== "ba-logFiles-config" ? (
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
              {t("page.Endpoint.Configure.ellipsisMenu.downloadLogs")}
            </ACTION_BUTTON_TEXT>
          ) : null}
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
        handleAgree={() => setDialogOpen(false)}
        handleDisagree={() => setDialogOpen(false)}
        agreeTitle={t("commons.okayText")}
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
