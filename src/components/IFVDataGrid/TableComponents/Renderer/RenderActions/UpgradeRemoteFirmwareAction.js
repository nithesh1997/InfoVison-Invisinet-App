import { Button, IconButton, Typography } from "@material-ui/core";
// import SystemSecurityUpdateRoundedIcon from "@mui/icons-material/SystemSecurityUpdateRounded";
import PhonelinkSetupRoundedIcon from "@mui/icons-material/PhonelinkSetupRounded";
import React, { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { Trans, useTranslation } from "react-i18next";

export const UpgradeRemoteFirmwareAction = ({
  actionPayloadState,
  editOnPopup,
  inputRef,
  isEnabled = () => true,
  isModeEdit,
  onClick,
  row,
  rowIndex,
  setStartAsync,
  startAsync,
  isInView,
  isInMenu,
  handleMenuClose,
  id,
}) => {
  const { setDontClosePopup, setCustomActionType } =
    useContext(DataGridContext);

  const [rowActionState, setRowActionState] = actionPayloadState;

  const [openAlert, setOpenAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { t } = useTranslation();

  const handleClick = (event) => {
    handleMenuClose(event);
    setRowActionState((prev) => ({ ...prev, inProgress: true }));

    setTimeout(() => {
      setStartAsync((prev) => ({ ...prev, isUpgradeRemoteFirmware: true }));
    }, 0);
  };

  useEffect(() => {
    setIsVisible(isInView);
    setIsDisabled(!isEnabled(row));
  }, []);

  React.useEffect(() => {
    if (rowActionState.inProgress && startAsync.isUpgradeRemoteFirmware) {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState, setDontClosePopup);
    }
  }, [
    onClick,
    row,
    rowActionState.inProgress,
    setDontClosePopup,
    setRowActionState,
    startAsync,
  ]);

  React.useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isUpgradeRemoteFirmware === true
    ) {
      setStartAsync((prev) => {
        return { ...prev, isUpgradeRemoteFirmware: false };
      });
      setDontClosePopup(true);
      setIsDisabled(!isEnabled(row));

      if (rowActionState.error) {
        setOpenAlert(rowActionState.message);
      } else {
        rowActionState.message && setOpenAlert(rowActionState.message);
      }
    }
  }, [rowActionState]);

  return (
    <Fragment>
      <ToolTip
        title={t("page.Endpoint.Configure.ellipsisMenu.tooltipUpgradeRemote")}
      >
        <Styled.ACTION_BUTTON
          id={id}
          theme={{ isDisabled, isInMenu }}
          disabled={isDisabled}
          onClick={handleClick}
        >
          <PhonelinkSetupRoundedIcon
            style={{
              width: "0.85em",
              height: "0.85em",
              color: isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)",
            }}
          />
          <Styled.ACTION_BUTTON_TEXT
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
            {t("page.Endpoint.Configure.ellipsisMenu.upgradeRemoteFirmware")}
          </Styled.ACTION_BUTTON_TEXT>
        </Styled.ACTION_BUTTON>
      </ToolTip>
      <AlertDialog
        open={openAlert}
        setOpen={setOpenAlert}
        contentTitle={
          rowActionState.error
            ? t("commons.errorAlertTitle")
            : t("commons.TaskCompleted")
        }
        contentText={rowActionState.message}
        contentInfo={``}
        handleAgree={() => setOpenAlert(false)}
        // handleDisagree={() => setOpenAlert(false)}
        agreeTitle={"Close"}
        // disagreeTitle={"Cancel"}
      />
    </Fragment>
  );
};

const Styled = {
  ActionIconButton: styled(IconButton)`
    padding: 0.35em;
    margin: 0.35em 0.15em;

    &:hover {
      background-color: #d6eeff;
    }

    & svg {
      width: 0.75em;
      height: 0.75em;
    }
  `,

  ACTION_BUTTON: styled(Button)`
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
  `,

  ACTION_BUTTON_TEXT: styled(Typography)`
    &.MuiTypography-root {
      display: ${({ theme }) => (theme.isInMenu ? "inherit" : "none")};
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: capitalize;
      padding: 0 0 0 1rem;
    }
  `,
};
