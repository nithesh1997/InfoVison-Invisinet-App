import React, { useCallback } from "react";
import { Input } from "../styled-materials";

export const TextInput = ({
  labelState,
  valueState,
  isValid,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleOnChanges,
  helperText = "",
  editOnPopup,
  editModeFocusDataKey,
  dataKey,
  isDisabled,
  dirtyValueState,
}) => {
  const callbackRef = useCallback(
    (inputElement) => {
      if (inputElement && dataKey === editModeFocusDataKey) {
        inputElement.focus();
      }
    },
    [dataKey, editModeFocusDataKey],
  );

  return (
    <Input
      inputRef={callbackRef}
      editOnPopup={editOnPopup}
      variant="outlined"
      helperText={helperText}
      label={labelState}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      onChange={(event) => handleOnChanges(event)}
      value={dirtyValueState}
      borderColorState={borderColorState}
      error={!isValid}
      disabled={isDisabled}
    />
  );
};
