import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { DatePicker } from "../styled-materials/DatePicker";

export function DateInput({
  borderColorState,
  dateState,
  handleBlurChanges,
  handleDateChange,
  handleFocusChanges,
  helperText = "",
  inputRef,
  isDisabled,
  isValid,
  labelState,
  dirtyValueState,
}) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        disabled={isDisabled}
        inputVariant="outlined"
        disableToolbar
        margin="dense"
        label={labelState}
        format="dd/MM/yyyy"
        // value={dateState}
        value={dirtyValueState}
        onChange={(rawDate) => {
          const event = {
            type: "change",
            _reactName: "onChange",
            value: rawDate,
          };
          handleDateChange(event, rawDate);
        }}
        handleFocusChanges={(event) => handleFocusChanges(event)}
        handleBlurChanges={(event) => handleBlurChanges(event)}
        borderColorState={(event) => borderColorState(event)}
        error={!isValid}
        helperText={helperText}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
