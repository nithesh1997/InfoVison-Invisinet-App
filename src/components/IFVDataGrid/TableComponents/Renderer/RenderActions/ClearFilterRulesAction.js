import { Button, Typography } from "@material-ui/core";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { Trans, useTranslation } from "react-i18next";

const StyledIconBadge = styled(ClearAllRoundedIcon)`
  color: rgb(2, 147, 254);

  & .MuiBadge-root > svg {
    width: 0.85em;
    height: 0.85em;
  }

  & .MuiBadge-badge {
    background-color: ${(props) =>
      props.isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)"};
    border: 0.15em solid #fff;
    padding: 0.2em;
    width: auto;
    height: auto;
    border-radius: 1em;
    min-width: auto;
    min-height: auto;
    bottom: 0.3m;
    right: 0.15em;
  }

  & .MuiBadge-badge .MuiSvgIcon-root {
    font-size: 0.65em;
    color: white;
  }
`;

export const ClearFilterRulesAction = ({
  actionPayloadState,
  editOnPopup,
  inputRef,
  isEnabled = () => true,
  isInView,
  isModeEdit,
  onClick,
  row,
  rowIndex,
  setStartAsync,
  startAsync,
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
      setStartAsync((prev) => ({ ...prev, isClearFilterRules: true }));
    }, 0);
  };

  useEffect(() => {
    setIsVisible(isInView);
    setIsDisabled(!isEnabled(row));
  }, []);

  React.useEffect(() => {
    if (rowActionState.inProgress && startAsync.isClearFilterRules) {
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
      startAsync.isClearFilterRules === true
    ) {
      setStartAsync((prev) => ({ ...prev, isClearFilterRules: false }));
      setDontClosePopup(true);
      setIsDisabled(!isEnabled(row));
      if (rowActionState.message || rowActionState.error) {
        setOpenAlert(rowActionState.message);
      }
    }
  }, [rowActionState]);

  return (
    <>
      <ToolTip
        title={t(
          "page.Endpoint.Configure.ellipsisMenu.tooltipClearFilterRules",
        )}
      >
        <ACTION_BUTTON
          id={id}
          theme={{ isDisabled, isInMenu }}
          disabled={isDisabled}
          onClick={handleClick}
        >
          <StyledIconBadge
            isDisabled={isDisabled}
            style={{
              color: isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)",
            }}
          >
            <ShieldRoundedIcon />
          </StyledIconBadge>
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
            {/* Clear Filter Rules */}
            {t("page.Endpoint.Configure.clearFilterrules.title")}
          </ACTION_BUTTON_TEXT>
        </ACTION_BUTTON>
      </ToolTip>
      <AlertDialog
        open={openAlert}
        setOpen={setOpenAlert}
        contentTitle={
          rowActionState.error
            ? t("page.Endpoint.Configure.clearFilterrules.error")
            : t("page.Endpoint.Configure.clearFilterrules.taskCompletedText")
        }
        contentText={rowActionState.message}
        contentInfo={``}
        handleAgree={() => setOpenAlert(false)}
        agreeTitle={t(
          "page.Endpoint.Configure.clearFilterrules.clearFilterrulesAlert.closeButton",
        )}
      />
    </>
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
