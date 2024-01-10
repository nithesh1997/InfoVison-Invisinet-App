import React from "react";
import { Input } from "../styled-materials";

export const NumberInput = ({
  labelState,
  valueState,
  inputRef,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleOnChanges,
  helperText = "",
  isDisabled,
}) => {
  return (
    <Input
      helperText={helperText}
      type="number"
      label={labelState}
      variant="outlined"
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      onChange={handleOnChanges}
      value={valueState}
      borderColorState={borderColorState}
      disabled={isDisabled}
    />
  );
};
