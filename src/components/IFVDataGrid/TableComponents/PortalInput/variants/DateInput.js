import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import React, { useState } from "react";
import { DATE_INPUT } from "../styled-materials/variants/DATE_INPUT";

const modEvent = (rawDate, date, type, _reactName) => {
  return {
    type,
    _reactName,
    target: {
      value: date,
      rawValue: rawDate,
    },
  };
};

const _ = (param) => (param.toString().length === 1 ? `0${param}` : `${param}`);

const stringDate = (raw = new Date()) => {
  const year = _(raw.getFullYear());
  const month = _(raw.getMonth() + 1);
  const date = _(raw.getDate());

  return `${year}-${month}-${date}`;
};

export const DateInput = (props) => {
  const value = props.dirtyValue;
  const [selectedDate, setSelectedDate] = React.useState(new Date(value));

  const [dateState, setDateState] = useState(() => new Date(value));
  const [dateStringState, setDateStringState] = useState(() => new Date(value));

  React.useEffect(() => {
    setDateStringState(stringDate(dateState));
  }, [dateState]);

  React.useEffect(() => {
    setSelectedDate(new Date(value));
  }, [value]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DATE_INPUT
        /* Base Attributes */
        id={props.id}
        name={props.name}
        className={props.className}
        disabled={props.disabled}
        /* Accessability */
        label={props.label}
        margin="normal"
        format="yyyy/MM/dd"
        inputVariant="outlined"
        KeyboardButtonProps={{ "aria-label": "change date" }}
        helperText={""}
        /* Value Manipulation */
        autoComplete={false}
        value={dateState}
        /* Handlers */
        onMouseOver={(event) => {
          const value = stringDate(dateState);
          const fakeEvent = { ...event, target: { ...event.target, value } };
          props.onMouseOver(fakeEvent, props.setStore, props.inputRef);
        }}
        onMouseLeave={(event) => {
          const value = stringDate(dateState);
          const fakeEvent = { ...event, target: { ...event.target, value } };
          props.onMouseLeave(fakeEvent, props.setStore, props.inputRef);
        }}
        onFocus={(event) => {
          const value = stringDate(dateState);
          const fakeEvent = { ...event, target: { ...event.target, value } };
          props.onFocus(fakeEvent, props.setStore, props.inputRef);
        }}
        onBlur={(event) => {
          const date = stringDate(dateState);
          const fakeEvent = modEvent(dateState, date, "blur", "onBlur");
          props.onBlur(fakeEvent, props.setStore, props.inputRef);
        }}
        onChange={(rawDate) => {
          setDateState(rawDate);
          const date = stringDate(rawDate);
          const fakeEvent = modEvent(rawDate, date, "change", "onChange");
          props.onChange(fakeEvent, props.setStore, props.inputRef);
          props.setStore.setSavePoint(true);
        }}
        onSubmit={(rawDate) => {
          const date = stringDate(rawDate);
          const fakeEvent = modEvent(rawDate, date, "submit", "onSubmit");
          props.onSubmit(fakeEvent, props.setStore, props.inputRef);
        }}
        /* Key */
        onKeyPress={props.onKeyPress}
        /* Ref */
        inputRef={props.inputRef}
        /* Color */
        labelColor={props.labelColor}
        borderColor={props.borderColor}
        backgroundColor={props.backgroundColor}
        /* Color on Hover */
        labelColorOnHover={props.labelColorOnHover}
        borderColorOnHover={props.borderColorOnHover}
        backgroundColorOnHover={props.backgroundColorOnHover}
        /* Color on Focus */
        labelColorOnFocus={props.labelColorOnFocus}
        borderColorOnFocus={props.borderColorOnFocus}
        backgroundColorOnFocus={props.backgroundColorOnFocus}
        /* can override everything above and able to add new props */
        // {...override}
      />
    </MuiPickersUtilsProvider>
  );
};
