import { EditSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";

const handleEdit = (row, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    isError: false,
    payload: { ...row },
    message: "",
  });
};

export const EditAction = ({
  onClick,
  row,
  actionPayloadState,
  isModeEdit,
  startAsync,
  setStartAsync,
  rowIndex,
  isEnabled = () => true,
  IsEditEnabled,
  IsEditClosed,
  isInMenu,
  id,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setDontClosePopup } = useContext(DataGridContext);
  const { togglePortal, gridConfig } = useContext(DataGridContext);
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const { handlersTooltip, gridSubconscious } = useContext(DataGridContext);
  const { setGridAllRows, toggleIsEditModeHost } = useContext(DataGridContext);
  const { inputHelpersText, setInputHelpersText } = useContext(DataGridContext);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [toggleViewState, setToggleViewState] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [dirtyRow] = dirtyRows.filter((r) => r.id === row.id);
  const [isEditEnabled, setIsEditEnabled] = IsEditEnabled;
  const [isEditClosed, setIsEditClosed] = IsEditClosed;

  const { t } = useTranslation();

  useEffect(() => {
    setIsEditEnabled(isEnabled(row));
  }, [gridSubconscious.page, isEnabled, row, setIsEditEnabled]);

  React.useEffect(() => {
    if (!onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick]);

  if (onClick === null) {
    onClick = handleEdit;
  }

  React.useEffect(() => {
    if (startAsync.isEdit === true) {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState, rowIndex + 1);
    }
  }, [startAsync.isEdit]);

  React.useEffect(() => {
    if (rowActionState.inProgress === false && startAsync.isEdit === true) {
      setStartAsync((prev) => ({ ...prev, isEdit: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
      } else {
        rowActionState.message && setDialogOpen(rowActionState.message);
        setIsEditClosed(true);

        setGridAllRows((currRows) => {
          return currRows.map((currRow) => {
            if (currRow.id === row.id) {
              const payloadRow = rowActionState.payload || row;
              const newRow = { ...payloadRow };
              newRow.__isEditMode = true;
              setDirtyRows((currRows) => [...currRows, { ...newRow }]);
              toggleIsEditModeHost(true);
              setInputHelpersText((oldState) => {
                return Object.keys(inputHelpersText).length === 0
                  ? rowActionState.inputHelpersText || {}
                  : oldState;
              });
              return newRow;
            } else {
              return currRow;
            }
          });
        });
        gridConfig.editMode === "popup" && togglePortal(true);
      }
    }
  }, [rowActionState]);

  return (
    <React.Fragment>
      <ToolTip title={handlersTooltip.handleEdit}>
        <ActionIconButton
          id={id}
          isDisplay={toggleViewState && !isModeEdit}
          onClick={(event) => {
            setStartAsync((prev) => ({ ...prev, isEdit: true }));
          }}
          disabled={!isEditEnabled}
          hoverBg="rgba(2, 147, 254, 0.2)"
        >
          <EditSharp
            style={{
              color: !isEditEnabled
                ? "rgba(2, 147, 254, 0.6)"
                : "rgba(2, 147, 254, 1)",
            }}
          />
        </ActionIconButton>
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
        contentInfo={rowActionState.error ? `` : ``}
        handleAgree={() => setDialogOpen(false)}
        agreeTitle={t("commons.okayText")}
        handleDisagree={() => setDialogOpen(false)}
        // disagreeTitle={"Close"}
      />
    </React.Fragment>
  );
};
