import { Button, Typography } from "@material-ui/core";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Badge } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { Trans, useTranslation } from "react-i18next";

const StyledIconBadge = styled(Badge)`
  /* color: ${({ theme }) => theme.color}; */

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

export const ViewFilterRuleConfigAction = ({
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
  const { setDontClosePopup } = useContext(DataGridContext);

  const [rowActionState, setRowActionState] = actionPayloadState;

  const [openAlert, setOpenAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { t } = useTranslation();

  const handleClick = (event) => {
    handleMenuClose(event);
    setRowActionState((prev) => ({ ...prev, inProgress: true }));
    setTimeout(() => {
      setStartAsync((prev) => ({ ...prev, isViewFilterRulesConfig: true }));
    }, 0);
  };

  useEffect(() => {
    setIsVisible(isInView);
    setIsDisabled(!isEnabled(row));
  }, []);

  useEffect(() => {
    if (rowActionState.inProgress && startAsync.isViewFilterRulesConfig) {
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

  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isViewFilterRulesConfig === true
    ) {
      setStartAsync((prev) => ({ ...prev, isViewFilterRulesConfig: false }));
      setDontClosePopup(true);
      setIsDisabled(!isEnabled(row));
      if (rowActionState.message || rowActionState.error) {
        setOpenAlert(rowActionState.message);
      }
    }
  }, [rowActionState]);

  return (
    <Fragment>
      <ToolTip
        title={t("page.Endpoint.Configure.ellipsisMenu.tooltipViewFilterRules")}
      >
        <ACTION_BUTTON
          id={id}
          theme={{ isDisabled, isInMenu }}
          disabled={isDisabled}
          onClick={handleClick}
        >
          <StyledIconBadge
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={<VisibilityRoundedIcon />}
            style={{
              color: isDisabled ? "rgb(2, 147, 254, 0.4)" : "rgb(2, 147, 254)",
            }}
            isDisabled={isDisabled}
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
            {t("page.Endpoint.Configure.ellipsisMenu.viewFilterRules")}
          </ACTION_BUTTON_TEXT>
        </ACTION_BUTTON>
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
        handleDisagree={() => setOpenAlert(false)}
        agreeTitle={"Close"}
        // disagreeTitle={"Cancel"}
      />
    </Fragment>
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
