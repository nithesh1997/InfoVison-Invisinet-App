import { Button, Zoom } from "@material-ui/core";
import { DoneSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AlertDialog from "../../../GridPortal/AlertDialog";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import { AsyncIcon } from "../../../styled-materials/AsyncIcon";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import GenericButton from "./ActionUtilities/MaterialComponents/GenericButton";
import { endpoint } from "../../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";

const handleSave = (newRow, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    payload: { ...newRow },
    isError: false,
    message: "Row updated in table successfully.",
    deleteRow: false,
  });
};

const scrollToTheElement = (element) => {
  element.scrollIntoView({ block: "center", inline: "center" });
  // element.focus();
};

export const DoneAction = ({
  onClick,
  row,
  actionPayloadState,
  isModeEdit,
  editOnPopup,
  startAsync,
  setStartAsync,
  isEnabled = () => true,
  Infected,
  inputRef,
  ValidateAll,
  IsErrorCheckCompleted,
  rowIndex,
  IsEditEnabled,
  isSaveRowsFlag,
  IsEditClosed,
  isInMenu,
  id,
}) => {
  const {
    setDontClosePopup,
    addHandler,
    modifiedRows,
    dirtyRows,
    setDirtyRows,
    togglePortal,
    toggleIsEditModeHost,
    gridAllRows,
    setGridAllRows,
    gridConfig,
    gridSubconscious,
    isAddRow,
    setIsAddRow,
    getRowPosition,
    gridCols,
    ResetForm,
  } = useContext(DataGridContext);

  const [resetForm, setResetForm] = ResetForm;

  const isNewRow = row.id === "_newRow";
  const initRowPosition = row.id === "_newRow" ? rowIndex : 0;
  const rowId = isNewRow ? gridAllRows.length : gridAllRows.length + 1;

  const [runEffect, setRunEffect] = useState("");
  const [pristineAlert, setPristineAlert] = useState(false);
  const [isOnClick, setIsOnClick] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [toggleViewState, setToggleViewState] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [modalStatus, setModalStatus] = useState("neutral");
  const [rowPosition, setRowPosition] = useState(initRowPosition);

  const [isErrorCheckCompleted, setIsErrorCheckCompleted] =
    IsErrorCheckCompleted;
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [infected, setInfected] = Infected;
  const [validateAll, setValidateAll] = ValidateAll;
  const [isEditEnabled, setIsEditEnabled] = IsEditEnabled;
  const [isEditClosed, setIsEditClosed] = IsEditClosed;

  const [dirtyRow] = dirtyRows.filter((r) => r.id === row.id);

  const { t } = useTranslation();

  // initial render
  useEffect(() => setRowActionState(($) => ({ ...$, deleteRow: false })), []);

  // disable save if row is pristine
  // useEffect(() => {
  //   isSaveRowsFlag.forEach((r) => {
  //     if (r.id === row.id) {
  //       const keys = Object.keys(r).filter((rw) => rw !== "id");
  //       setIsDisabled(!keys.map((key) => r[key]).includes(false));
  //     }
  //   });
  // }, [isSaveRowsFlag, row]);

  // set row postion for modal
  useEffect(() => {
    getRowPosition(row);
  }, [getRowPosition, row]);

  const errorCheck = (infected, setStartAsync) => {
    let keys = [];
    let isPristine = false;

    isSaveRowsFlag.forEach((r) => {
      if (r.id === row.id) {
        keys = Object.keys(r).filter((rw) => rw !== "id");
        isPristine = !keys.map((key) => r[key]).includes(false);
      }
    });

    if (isPristine && row.id !== "_newRow") {
      setPristineAlert(true);
    } else {
      setIsOnClick(true);
      setValidateAll(true);
      setIsClicked(true);

      if (infected.length /* && isErrorCheckCompleted */) {
        scrollToTheElement(document.getElementById(infected[0]));
        // document.getElementById(infected[0]).focus();
      }
    }
  };

  // fallbacks
  useEffect(() => {
    if ((onClick === null || onClick === undefined) && isAddRow) {
      setToggleViewState(true);
    } else if (onClick) {
      setToggleViewState(true);
    } else {
      setToggleViewState(false);
    }
  }, [isAddRow, onClick]);

  // row position
  useEffect(() => {
    modifiedRows.forEach((r, index) => {
      if (r.id === row.id) {
        setRowPosition(index + 1);
      }
    });
  }, [gridSubconscious.page, modifiedRows, row]);

  // reset onClick flag
  useEffect(() => {
    isClicked && setTimeout(() => setIsClicked(false), 100);
  }, [isClicked]);

  // start async tasks flag
  useEffect(() => {
    if (infected.length === 0 && isErrorCheckCompleted && isClicked) {
      setStartAsync((prev) => ({ ...prev, isDone: true }));
    }
  }, [infected, isClicked, isErrorCheckCompleted, setStartAsync]);

  // ADD: async for add row
  useEffect(() => {
    if (startAsync.isDone === true && row.id === "_newRow") {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);

      addHandler &&
        addHandler.handleSave &&
        addHandler.handleSave(
          { ...dirtyRow },
          setRowActionState,
          row,
          setGridAllRows,
          gridCols,
        );
    }
  }, [startAsync.isDone, gridCols]);

  // ADD: sync for add row
  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isDone === true &&
      row.id === "_newRow"
    ) {
      setStartAsync((prev) => ({ ...prev, isDone: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        rowActionState.message && setDialogOpen(true);
        rowActionState.message && setModalStatus("opened");
      } else {
        setIsEditClosed(false);
        setGridAllRows((prevRows) => {
          const newState = [
            ...prevRows,
            {
              ...(rowActionState.payload ?? {
                ...dirtyRow,
                id: rowActionState.payload?.id ?? gridAllRows.length + 1,
                isChecked: rowActionState.payload?.isChecked ?? false,
              }),
              __isEditMode: false,
            },
          ];
          return newState;
        });

        rowActionState.message && setDialogOpen(true);
        rowActionState.message && setModalStatus("opened");
      }
    }
  }, [rowActionState]);

  // ADD: sync add row modal closed
  useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      row.id === "_newRow" &&
      modalStatus === "closed"
    ) {
      !rowActionState.error && togglePortal(false);
      setTimeout(() => {
        !rowActionState.error && setIsAddRow(false);
        !rowActionState.error && toggleIsEditModeHost(false);
      }, 300);
      setIsOnClick(false);
      setModalStatus("neutral");
    }
  }, [
    rowActionState,
    modalStatus,
    startAsync.isDone,
    row.id,
    togglePortal,
    setIsAddRow,
    toggleIsEditModeHost,
    setGridAllRows,
    rowId,
    dirtyRow,
    gridAllRows.length,
  ]);

  // EDIT: async for edit row
  useEffect(() => {
    if (startAsync.isDone === true && row.id !== "_newRow") {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);

      onClick
        ? onClick({ ...dirtyRow }, setRowActionState, row)
        : handleSave({ ...dirtyRow }, setRowActionState, row);
    }
  }, [startAsync.isDone]);

  // EDIT: sync for edit row
  useEffect(() => {
    if (rowActionState.deleteRow) {
      rowActionState.message && setDialogOpen(true);
      //   setGridAllRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
    } else if (
      rowActionState.inProgress === false &&
      startAsync.isDone === true &&
      row.id !== "_newRow"
    ) {
      setStartAsync((prev) => ({ ...prev, isDone: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setModalStatus("opened");
        setDialogOpen(true);
      } else {
        if (rowActionState.message) {
          setModalStatus("opened");
          setDialogOpen(true);
        } /* else {
          setGridAllRows((prevRows) => {
            const newState = prevRows.map((r) => {
              if (r.id === row.id) {
                const rowPayload = { ...rowActionState.payload };
                rowPayload.__isEditMode = !rowPayload.__isEditMode;
                return rowPayload;
              } else {
                return r;
              }
            });
            return newState;
          });

          if (!rowActionState.resetForm.isReset) {
            setIsEditClosed(false);

            if (!rowActionState.error) {
              toggleIsEditModeHost(false);
              setDirtyRows((prevRows) =>
                prevRows.filter((r) => r.id !== row.id)
              );
            }
          }
        } */
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
      if (!rowActionState.error) {
        const fallFunc = (prevRows) => {
          const newState = prevRows.map((r) => {
            if (r.id === row.id) {
              const rowPayload = { ...rowActionState.payload };
              if (rowActionState.resetForm) {
                setResetForm({ isReset: true, row });
              }

              if (!rowActionState.resetForm) {
                rowPayload.__isEditMode = !rowPayload.__isEditMode;
              }

              return rowPayload;
            } else {
              return r;
            }
          });

          return newState;
        };

        const setFunc = rowActionState?.callback ?? fallFunc;

        setGridAllRows(setFunc);

        if (!rowActionState.resetForm) {
          setIsEditClosed(false);

          togglePortal(false);

          setTimeout(() => {
            toggleIsEditModeHost(false);
            setDirtyRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
          }, 200);
        }
      }

      setIsOnClick(false);
      setModalStatus("neutral");
    }
  }, [
    row.id,
    modalStatus,
    setDirtyRows,
    setGridAllRows,
    toggleIsEditModeHost,
    togglePortal,
    setIsEditClosed,
    rowActionState,
    rowActionState.resetForm,
  ]);

  return (
    <React.Fragment>
      {row.__isEditMode &&
      gridConfig.editMode === "popup" &&
      editOnPopup &&
      !isInMenu ? (
        <GenericButton
          // id={`${endpoint}-addRecord-done-button`}
          id={id}
          style={{ margin: "3em 1em -1em 1em" }}
          backgroundColor="primary"
          buttonName={t("commons.doneText")}
          disabled={isDisabled}
          Icon={<DoneSharp />}
          onClick={(event) => errorCheck(infected, setStartAsync)}
          inProgress={rowActionState.inProgress}
        />
      ) : (
        <ToolTip title={t("commons.TooltipSave")}>
          <ActionIconButton
            id={id}
            isDisplay={toggleViewState && isModeEdit}
            onClick={(event) => errorCheck(infected, setStartAsync)}
            hoverBg="rgba(2, 147, 254, 0.2)"
            disabled={isDisabled}
            style={{ margin: "0.5em 0em" }}
          >
            <DoneSharp
              style={{
                color: !isDisabled
                  ? "rgba(2, 147, 254, 1)"
                  : "rgba(2, 147, 254, 0.6)",
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
        contentInfo={
          rowActionState.error
            ? ""
            : `The row is now at position: ${rowPosition}`
        }
        handleAgree={() => {
          setTimeout(() => {
            if (rowActionState.triggerReRenderFunction) {
              rowActionState.triggerReRenderFunction();
            }
          }, 100);
          setDialogOpen(false);
          setModalStatus("closed");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setModalStatus("closed");
        }}
        agreeTitle={t("commons.okayText")}
      />

      {pristineAlert ? (
        <AlertDialog
          open={pristineAlert}
          setOpen={setPristineAlert}
          contentTitle={`Alert!`}
          contentText={`Please make some changes to the record to update.`}
          handleAgree={() => setPristineAlert(false)}
          handleDisagree={() => setPristineAlert(false)}
          agreeTitle={t("commons.okayText")}
          divider={false}
        />
      ) : null}
    </React.Fragment>
  );
};

const Buttonz = styled(Button)`
  display: ${(props) => props.isDisplay && "none"};
  margin: 3em 1em -1em 1em;
  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: rgba(2, 147, 254, 1);
  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }
`;
