import React, { useContext } from "react";
import {
  DataGridContext,
  HandlersContext,
  SelectAllRowsContext,
} from "../../IFVDataGrid";
import { SelectRow } from "./SelectRow";
import { SwitchRenderCell } from "./SwitchRenderCell";

const column = { isDisableEdit: false };

export const Renderer = ({
  alignment,
  col = column,
  customWrapper,
  dataKey,
  editOnPopup,
  headerName,
  options,
  row,
  dirtyRowHandler,
  type,
  rowIndex,
  colIndex,
  Infected,
  ValidateAll,
  IsErrorCheckCompleted,
  isSaveRowsFlag,
  kw,
}) => {
  const { gridConfig, gridSubconscious } = useContext(DataGridContext);
  const { gridCols } = useContext(DataGridContext);
  const { toggleSelectRow } = useContext(HandlersContext);
  const [selectAllRows, setSelectAllRows] = useContext(SelectAllRowsContext);

  let disabled = selectAllRows.disabled;

  const elementId = `${gridSubconscious.name}-${col.dataKey}-${row.id}-${rowIndex}`;

  const getMessageIfError = () => {
    return row[dataKey] === undefined && dataKey !== "__action"
      ? `Error: ${dataKey}`
      : false;
  };

  return getMessageIfError() ? (
    <SwitchRenderCell
      rowIndex={rowIndex}
      colIndex={colIndex}
      type="error"
      value={getMessageIfError()}
      elementId={elementId}
    />
  ) : dataKey === "isChecked" ? (
    <SelectRow
      row={row}
      rowID={row.id}
      isChecked={row.isChecked}
      toggleSelectRow={toggleSelectRow}
      disabled={disabled}
      defaultChecked={Boolean(row.id === "_newRow")}
    />
  ) : dataKey === "__action" ? (
    <SwitchRenderCell
      type="action"
      Infected={Infected}
      column={col}
      rowIndex={rowIndex}
      colIndex={colIndex}
      ValidateAll={ValidateAll}
      isSaveRowsFlag={isSaveRowsFlag}
      IsErrorCheckCompleted={IsErrorCheckCompleted}
      actionProps={{
        row,
        editOnPopup,
        pageName: gridSubconscious.name,
      }}
      elementId={elementId}
    />
  ) : row.__isEditMode && gridConfig.editMode !== "popup" ? (
    <SwitchRenderCell
      colIndex={colIndex}
      column={col}
      dirtyRowHandler={dirtyRowHandler}
      Infected={Infected}
      IsErrorCheckCompleted={IsErrorCheckCompleted}
      rowIndex={rowIndex}
      type="edit"
      ValidateAll={ValidateAll}
      isSaveRowsFlag={isSaveRowsFlag}
      inputProps={{
        type,
        dataKey,
        options,
        dataId: row.id,
        label: headerName,
        value: row[dataKey],
        editOnPopup,
        editModeFocusDataKey: gridCols[0].dataKey,
        isDisabled: col.isDisableEdit,
        row,
      }}
    />
  ) : row.__isEditMode && editOnPopup ? (
    <SwitchRenderCell
      colIndex={colIndex}
      column={col}
      dirtyRowHandler={dirtyRowHandler}
      Infected={Infected}
      IsErrorCheckCompleted={IsErrorCheckCompleted}
      rowIndex={rowIndex}
      type="edit"
      ValidateAll={ValidateAll}
      isSaveRowsFlag={isSaveRowsFlag}
      inputProps={{
        type,
        dataKey,
        options,
        dataId: row.id,
        label: headerName,
        value: row[dataKey],
        editOnPopup,
        editModeFocusDataKey: gridCols[0].dataKey,
        isDisabled: col.isDisableEdit,
        row,
      }}
    />
  ) : customWrapper ? (
    customWrapper(gridCols, row, row[dataKey])
  ) : (
    <SwitchRenderCell
      type="text"
      alignment={alignment}
      value={row[dataKey]}
      elementId={elementId}
    />
  );
};
