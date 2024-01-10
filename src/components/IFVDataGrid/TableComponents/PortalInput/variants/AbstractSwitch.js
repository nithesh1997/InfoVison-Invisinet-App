import React from "react";
import { Sacred, Multiline, Dropdown, DateInput, TimeInput, DateTime } from ".";

export const AbstractSwitch = (props) => {
  switch (props.type) {
    case "text":
      return <Sacred {...props} />;
    case "multiline":
      return <Multiline {...props} />;
    case "date":
      return <DateInput {...props} />;
    case "time":
      return <TimeInput {...props} />;
    case "date-time":
      return <DateTime {...props} type="datetime-local" />;
    case "dropdown-single":
      return <Dropdown {...props} />;
    case "dropdown-multiple":
      return <Dropdown {...props} />;
    case "dropdown-free-single":
      return <Dropdown {...props} />;
    case "dropdown-free-multiple":
      return <Dropdown {...props} />;
    default:
      return <Sacred {...props} />;
  }
};
