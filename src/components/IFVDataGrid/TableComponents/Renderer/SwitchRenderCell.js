import React, { useContext, useRef, useState } from "react";
import { DataGridContext } from "../../IFVDataGrid";
import { RenderActionsInCell } from "./RenderActions/RenderActionsInCell";
import { RenderCell } from "./RenderCell";
import { RenderErrorCell } from "./RenderErrorCell";
import { RenderInputCell } from "./RenderInputCell";

const initIsInlineEdit = (gridConfig) => {
  return () => gridConfig.editMode === "inline" || gridConfig.editMode === "";
};

export const SwitchRenderCell = ({
  type,
  value,
  inputProps,
  actionProps = { row: {}, editOnPopup: false },
  alignment,
  dirtyRowHandler,
  rowIndex,
  colIndex,
  column,
  Infected,
  ValidateAll,
  IsErrorCheckCompleted,
  isSaveRowsFlag,
  elementId,
  ...props
}) => {
  const inputRef = useRef();
  const { validationHandler, gridConfig, TriggerValidationReset } =
    useContext(DataGridContext);
  const [isInlineEdit] = useState(() => initIsInlineEdit(gridConfig));

  return (
    <React.Fragment>
      {type === "error" ? (
        <RenderErrorCell value={value} />
      ) : type === "edit" ? (
        <RenderInputCell
          elementId={elementId}
          colIndex={colIndex}
          column={column}
          dirtyRowHandler={dirtyRowHandler}
          Infected={Infected}
          inputRef={inputRef}
          IsErrorCheckCompleted={IsErrorCheckCompleted}
          isInlineEdit={isInlineEdit}
          rowIndex={rowIndex}
          ValidateAll={ValidateAll}
          ValidationHandler={validationHandler}
          TriggerValidationReset={TriggerValidationReset}
          {...inputProps}
        />
      ) : type === "action" ? (
        <RenderActionsInCell
          elementId={elementId}
          rowIndex={rowIndex}
          colIndex={colIndex}
          Infected={Infected}
          inputRef={inputRef}
          ValidateAll={ValidateAll}
          ValidationHandler={validationHandler}
          IsErrorCheckCompleted={IsErrorCheckCompleted}
          isSaveRowsFlag={isSaveRowsFlag}
          {...actionProps}
        />
      ) : (
        <RenderCell
          rowIndex={rowIndex}
          colIndex={colIndex}
          alignment={alignment}
          value={value}
          elementId={elementId}
        />
      )}
    </React.Fragment>
  );
};
