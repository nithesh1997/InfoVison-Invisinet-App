import { Button, CircularProgress } from "@material-ui/core";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DoNotDisturbOnRoundedIcon from "@mui/icons-material/DoNotDisturbOnRounded";
import { Typography } from "@mui/material";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import ToolerTip from "../../../styled-materials/ToolerTip";
import { useTranslation } from "react-i18next";

export const TogglerAction = ({
  actionPayloadState,
  editOnPopup,
  inputRef,
  isEnabled,
  isModeEdit,
  onClick,
  row,
  rowIndex,
  setStartAsync,
  startAsync,
  icons = [<CheckCircleRoundedIcon />, <DoNotDisturbOnRoundedIcon />],
  icon = 1,
  isInView,
  isInMenu,
  handleMenuClose,
  handleMenuHide,
  handleMenuUnhide,
  id,
}) => {
  const actionButtonRef = useRef();

  const { setDontClosePopup, setGridAllRows } = useContext(DataGridContext);

  const [rowActionState, setRowActionState] = actionPayloadState;
  const [openAlert, setOpenAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [iconFlag, setIconFlag] = useState(icon);
  const [iconState, setIconState] = useState(icons[iconFlag]);

  const [modal, setModal] = useState("neutral");

  const { t } = useTranslation();

  const handleClick = (event) => {
    actionButtonRef.current = event;
    handleMenuHide();
    setRowActionState((prev) => ({ ...prev, inProgress: true }));
    setStartAsync((prev) => ({ ...prev, isTogglerAction: true }));
  };

  useEffect(() => {
    setIsVisible(isInView);
  }, []);

  useEffect(() => {
    if (rowActionState.inProgress && startAsync.isTogglerAction) {
      setDontClosePopup(false);
      onClick(row, setRowActionState);
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
    if (modal === "closed") {
      // closePortal();
      handleMenuClose(actionButtonRef.current);
      handleMenuUnhide();
      setModal("neutral");
    }
  }, [handleMenuClose, handleMenuUnhide, modal]);

  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isTogglerAction === true
    ) {
      setDontClosePopup(true);
      setStartAsync((prev) => ({ ...prev, isTogglerAction: false }));

      setOpenAlert(Boolean(rowActionState.error || rowActionState.message));

      if (!Boolean(rowActionState.message)) {
        setModal("closed");
      }

      if (!rowActionState.error) {
        setGridAllRows((currRows) => {
          return currRows.map((currRow) => {
            if (currRow.id === row.id) {
              const payloadRow = rowActionState.payload || {
                ...row,
                enabled: row.enabled === "True" ? "False" : "True",
              };
              const newRow = { ...payloadRow };

              setIconFlag(($) => {
                setIconState(icons[newRow.enabled === "True" ? 0 : 1]);
                return !(newRow.enabled === "True") ? 0 : 1;
              });
              return newRow;
            } else {
              return currRow;
            }
          });
        });
      }
    }
  }, [
    icons,
    row,
    rowActionState,
    setDontClosePopup,
    setGridAllRows,
    setStartAsync,
    startAsync.isTogglerAction,
  ]);

  useEffect(() => {
    setIconFlag(($) => {
      setIconState(icons[row.enabled === "True" ? 0 : 1]);
      return !(row.enabled === "True") ? 0 : 1;
    });

    setIsDisabled(!isEnabled(row));
  }, []);

  return (
    <Fragment>
      <ToolerTip title={iconFlag ? "Disable Rule" : "Enable Rule"}>
        <ACTION_BUTTON
          id={id}
          theme={{ isDisabled, isInMenu }}
          disabled={isDisabled}
          onClick={handleClick}
        >
          {rowActionState.inProgress ? (
            <Styled.Spinner
              style={{
                width: "0.85em",
                height: "0.85em",
                color: "rgb(2, 147, 254)",
              }}
            />
          ) : (
            iconState
          )}
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
            {iconFlag ? "Disable Rule" : "Enable Rule"}
          </ACTION_BUTTON_TEXT>
        </ACTION_BUTTON>
      </ToolerTip>
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
        handleAgree={() => {
          setOpenAlert(false);
          setModal("closed");
        }}
        handleDisagree={() => {
          setOpenAlert(false);
          setModal("closed");
        }}
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

const Styled = {
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
};
