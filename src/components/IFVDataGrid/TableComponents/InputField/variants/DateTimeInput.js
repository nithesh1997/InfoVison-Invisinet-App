import React from "react";
import { Input } from "../styled-materials";

const formatDateTime = (param = "") => {
  const date = param.split(" ")[0];
  const time = param.split(" ")[1].split(":");
  const hour = time[0] > 12 ? time[0] - 12 : time[0];
  const minutes = time[1];

  return `${date}T${hour}:${minutes}`;
};

export function DateTimeInput({
  labelState,
  valueState,
  dateTimeState,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleDateTimeChange,
  error,
  isValid,
  helperText = "",
  isDisabled,
  dirtyValueState,
}) {
  return (
    <Input
      disabled={isDisabled}
      id="datetime-local"
      type="datetime-local"
      variant="outlined"
      label={labelState}
      value={dateTimeState}
      onChange={handleDateTimeChange}
      borderColorState={borderColorState}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      error={!isValid}
      helperText={helperText}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
