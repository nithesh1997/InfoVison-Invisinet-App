import { DeleteSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import AlertDialog from "../../../GridPortal/AlertDialog";
import Prompt from "../../../GridPortal/Prompt";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";

const handleDelete = (row, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    isError: false,
    message: "Row deleted from table successfully.",
  });
};

export const DeleteAction = ({
  onClick,
  row,
  rows,
  rowIndex,
  actionPayloadState,
  isModeEdit,
  startAsync,
  setStartAsync,
  isEnabled = () => true,
  allowBulkActions = false,
  prompt,
  id,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setDontClosePopup, gridSubconscious } = useContext(DataGridContext);
  const { gridAllRows, setGridAllRows } = useContext(DataGridContext);
  const { handlersTooltip } = useContext(DataGridContext);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [toggleViewState, setToggleViewState] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [runEffect, setRunEffect] = useState("");
  const [prompter, setPrompter] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    setIsDisabled(!isEnabled(row));
  }, [gridSubconscious.page, isEnabled, row, setIsDisabled]);

  useEffect(() => {
    if (!onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick]);

  if (onClick === null) {
    onClick = handleDelete;
  }

  useEffect(() => {
    if (startAsync.isDelete === true) {
      setPrompter(false);
      !prompt.contentTextGen &&
        setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState, setGridAllRows);
    }
  }, [startAsync.isDelete]);

  useEffect(() => {
    if (rowActionState.inProgress === false && startAsync.isDelete === true) {
      setStartAsync((prev) => ({ ...prev, isDelete: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
      } else {
        rowActionState.message && setDialogOpen(rowActionState.message);
      }
    }
  }, [rowActionState]);

  useEffect(() => {
    if (runEffect === "completeAction" && !rowActionState.error) {
      const fallFunc = (prevRows) => prevRows.filter((r) => r.id !== row.id);
      const setFunc = rowActionState?.callback ?? fallFunc;
      setGridAllRows(setFunc);
    }

    setRunEffect("");
  }, [
    row.id,
    rowActionState.callback,
    rowActionState.error,
    runEffect,
    setGridAllRows,
  ]);

  return (
    <React.Fragment>
      <ToolTip title={handlersTooltip.handleDelete}>
        <ActionIconButton
          id={id}
          isDisplay={toggleViewState && !isModeEdit}
          onClick={(event) => {
            prompt.contentTextGen &&
              setRowActionState((prev) => ({ ...prev, inProgress: true }));
            setPrompter(true);
          }}
          hoverBg="rgba(237, 20, 61, 0.15)"
          disabled={isDisabled}
        >
          <DeleteSharp
            style={{
              color: !isDisabled
                ? "rgba(237, 20, 61, 1)"
                : "rgba(237, 20, 61, 0.6)",
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
        agreeTitle={t("commons.okayText")}
        handleAgree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
      />

      <Prompt
        open={prompter}
        setOpen={setPrompter}
        contentTitle={prompt.contentTitle || "Delete Confirmation"}
        contentText={
          prompt.contentTextGen
            ? prompt.contentTextGen(row)
            : prompt.contentText || (
                <>
                  <p>
                    Please click on Confirm to delete the record, otherwise
                    click Cancel.
                  </p>
                </>
              )
        }
        contentInfo={``}
        agreeTitle={"Confirm"}
        disagreeTitle={"Cancel"}
        handleAgree={() => {
          setStartAsync((prev) => ({ ...prev, isDelete: true }));
        }}
        handleDisagree={() => {
          setRowActionState((prev) => ({ ...prev, inProgress: false }));
          setDontClosePopup(false);
          setPrompter(false);
        }}
      />
    </React.Fragment>
  );
};
