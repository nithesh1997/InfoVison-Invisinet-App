import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TimePicker } from "../styled-materials";

const prefixZero = (param) =>
  Object.keys(param).length === 1 ? `0${param}` : param;

const formatTime = (value) => {
  const timeArr = value && value.split(" ");
  const times = timeArr[0].split(":");
  const minutes = prefixZero(times[1]);
  const hours = prefixZero(times[0] > 12 ? times[0] - 12 : times[0]);

  return `2020-01-01T${hours}:${minutes}`;
};

const sugarTime = (sugarTime) => {
  const timeArr = sugarTime && sugarTime.split(" ");
  const times = timeArr[0].split(":");

  const addZero = (param) =>
    typeof param !== "string"
      ? param.toString().length === 1
        ? "0".concat(param)
        : param
      : param.length === 1
      ? "0".concat(param)
      : param;

  const sugarMinutes = addZero(times[1]);
  const sugarHour = addZero(times[0] > 12 ? times[0] - 12 : times[0]);

  return `${sugarHour}:${sugarMinutes}`;
};

const setInitialTimeState = ({ type, value }) => {
  return type === "time" && `2020-01-01T${sugarTime(value)}`;
};

export function TimeInput({
  labelState,
  timeState,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleTimeChange,
  error,
  helperText = "",
  isDisabled,
  dirtyValueState,
}) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        disabled={isDisabled}
        inputVariant="outlined"
        margin="dense"
        label={labelState}
        value={formatTime(dirtyValueState)}
        onChange={(rawTime) => {
          const event = {
            type: "change",
            _reactName: "onChange",
            value: rawTime,
          };
          handleTimeChange(event, rawTime);
        }}
        handleFocusChanges={handleFocusChanges}
        handleBlurChanges={handleBlurChanges}
        borderColorState={borderColorState}
        error={error}
        helperText={helperText}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
