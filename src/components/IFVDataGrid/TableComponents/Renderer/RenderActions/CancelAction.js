import { Button, Zoom } from "@material-ui/core";
import { CancelSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import GenericButton from "./ActionUtilities/MaterialComponents/GenericButton";
import { endpoint } from "../../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";

const handleDiscard = (newRow, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    isError: false,
    message: "",
  });
};

export const CancelAction = ({
  onClick,
  row,
  rowIndex,
  actionPayloadState,
  isModeEdit,
  startAsync,
  setStartAsync,
  editOnPopup,
  isEnabled = () => true,
  IsEditEnabled,
  IsEditClosed,
  isInMenu,
  id,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setDontClosePopup } = useContext(DataGridContext);
  const { addHandler } = useContext(DataGridContext);
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const { togglePortal } = useContext(DataGridContext);
  const { toggleIsEditModeHost, setGridAllRows } = useContext(DataGridContext);
  const { gridConfig, gridAllRows } = useContext(DataGridContext);
  const { isAddRow, setIsAddRow } = useContext(DataGridContext);
  const { handlersTooltip } = useContext(DataGridContext);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [toggleViewState, setToggleViewState] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isEditEnabled, setIsEditEnabled] = IsEditEnabled;
  const [modalStatus, setModalStatus] = useState("neutral");
  const rowId = gridAllRows.length + 1;
  const [isEditClosed, setIsEditClosed] = IsEditClosed;

  const [dirtyRow] = dirtyRows.filter((r) => r.id === row.id);

  const { t } = useTranslation();

  React.useEffect(() => {
    if ((onClick === null || onClick === undefined) && isAddRow) {
      setToggleViewState(true);
    } else if (onClick) {
      setToggleViewState(true);
    } else {
      setToggleViewState(false);
    }
  }, [isAddRow, onClick]);

  if (onClick === null) {
    onClick = handleDiscard;
  }

  // # For Async Add Row
  React.useEffect(() => {
    if (startAsync.isCancel === true && row.id === "_newRow") {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);

      addHandler &&
        addHandler.handleDiscard &&
        addHandler.handleDiscard({ ...dirtyRow, id: rowId }, setRowActionState);
    }
  }, [startAsync.isCancel]);

  // # For Async Edit Row
  React.useEffect(() => {
    if (startAsync.isCancel === true && row.id !== "_newRow") {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);

      onClick
        ? onClick(dirtyRow, setRowActionState)
        : handleDiscard(dirtyRow, setRowActionState);
    }
  }, [startAsync.isCancel]);

  // # For Sync Add Row
  React.useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isCancel === true &&
      row.id === "_newRow"
    ) {
      setStartAsync((prev) => ({ ...prev, isCancel: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
        setModalStatus("opened");
      } else {
        setIsEditClosed(false);
        rowActionState.message && setDialogOpen(rowActionState.message);
        rowActionState.message && setModalStatus("opened");
        setIsAddRow(false);
        // const rowPayload = rowActionState.payload;
      }
      toggleIsEditModeHost(false);
    }
  }, [rowActionState]);

  // # After Add Modal closed
  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      row.id === "_newRow" &&
      modalStatus === "closed"
    ) {
      setIsEditEnabled(true);
      togglePortal(false);
      setIsAddRow(false);
      setModalStatus("neutral");
    }
  }, [
    modalStatus,
    row.id,
    rowActionState.inProgress,
    setDirtyRows,
    setIsAddRow,
    setIsEditClosed,
    setIsEditEnabled,
    toggleIsEditModeHost,
    togglePortal,
  ]);

  // # For Sync Edit Row
  React.useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isCancel === true &&
      rowIndex !== -1 /* !isAddRow */
    ) {
      setStartAsync((prev) => ({ ...prev, isCancel: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
        setModalStatus("opened");
      } else {
        if (rowActionState.message) {
          setDialogOpen(rowActionState.message);
          setModalStatus("opened");
        } else {
          setIsEditClosed(false);
          togglePortal(false);

          setGridAllRows((prevRows) =>
            prevRows.map((r) => {
              if (r.id === row.id) {
                const newRow = { ...row };
                newRow.__isEditMode = !newRow.__isEditMode;
                return newRow;
              } else {
                return r;
              }
            }),
          );
          setIsEditEnabled(true);
          toggleIsEditModeHost(false);
          setDirtyRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
        }
      }
    }
  }, [rowActionState]);

  // EDIT: sync edit row modal closed
  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      row.id !== "_newRow" &&
      modalStatus === "closed"
    ) {
      setIsEditClosed(false);
      togglePortal(false);

      setGridAllRows((prevRows) =>
        prevRows.map((r) => {
          if (r.id === row.id) {
            const newRow = { ...row };
            newRow.__isEditMode = !newRow.__isEditMode;
            return newRow;
          } else {
            return r;
          }
        }),
      );

      setIsEditEnabled(true);
      toggleIsEditModeHost(false);
      setDirtyRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
      setModalStatus("neutral");
    }
  }, [
    modalStatus,
    row,
    row.id,
    rowActionState.inProgress,
    setDirtyRows,
    setGridAllRows,
    setIsEditClosed,
    setIsEditEnabled,
    toggleIsEditModeHost,
    togglePortal,
  ]);

  return (
    <React.Fragment>
      {/* {gridConfig.editMode === "popup" ? ( */}
      {row.__isEditMode &&
      gridConfig.editMode === "popup" &&
      editOnPopup &&
      !isInMenu ? (
        <GenericButton
          // id={`${endpoint}-addRecord-cancel-button`}
          id={id}
          style={{
            margin: "3em 1em -1em 1em",
            // background: "#e83b46",
            // border: "2px solid #e83b46",
          }}
          backgroundColor="secondary"
          buttonName={t("commons.cancelText")}
          disabled={isDisabled}
          startIcon={<CancelSharp />}
          onClick={(event) => {
            setStartAsync((prev) => ({ ...prev, isCancel: true }));
          }}
        />
      ) : (
        <ToolTip title={t("commons.TooltipCancel")}>
          <ActionIconButton
            id={id}
            isDisplay={toggleViewState && isModeEdit}
            onClick={(event) => {
              setStartAsync((prev) => ({ ...prev, isCancel: true }));
            }}
            hoverBg="rgba(237, 20, 61, 0.15)"
            disabled={isDisabled}
            style={{
              margin: "0.5em 0em",
            }}
          >
            <CancelSharp
              style={{
                color: !isDisabled
                  ? "rgba(237, 20, 61, 1)"
                  : "rgba(237, 20, 61, 0.6)",
              }}
            />
          </ActionIconButton>
        </ToolTip>
      )}
      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={
          rowActionState.error
            ? t("commons.errorAlertTitle")
            : t("commons.TaskCompleted")
        }
        contentText={rowActionState.message}
        contentInfo={rowActionState.error ? `` : ``}
        handleAgree={() => {
          setDialogOpen(false);
          setModalStatus("closed");
        }}
        agreeTitle={t("commons.okayText")}
        handleDisagree={() => {
          setDialogOpen(false);
          setModalStatus("closed");
        }}
        // disagreeTitle={"Close"}
      />
    </React.Fragment>
  );
};

const Buttonz = styled(Button)`
  display: ${(props) => props.isDisplay && "none"};
  margin: 3em 1em -1em 1em;
  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(237, 20, 61, 1);
  color: rgba(237, 20, 61, 1);

  &:hover {
    background: rgba(237, 20, 61, 0.1);
  }
`;
