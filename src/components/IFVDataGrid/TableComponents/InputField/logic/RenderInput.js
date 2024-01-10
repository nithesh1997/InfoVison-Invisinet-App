import React from "react";
import { DateInput } from "../variants/DateInput";
import { DateTimeInput } from "../variants/DateTimeInput";
import { DropDownInput } from "../variants/DropDownInput";
import FreeSoloMultiple from "../variants/FreeSoloMultiple";
import FreeSoloSingle from "../variants/FreeSoloSingle";
import { MultiLineInput } from "../variants/MultiLineInput";
import { NumberInput } from "../variants/NumberInput";
import SelectMultiple from "../variants/SelectMultiple";
import SelectSingle from "../variants/SelectSingle";
import { TextInput } from "../variants/TextInput";
import { TimeInput } from "../variants/TimeInput";
import { ToggleInput } from "../variants/ToggleInput";

export const RenderInput = (props) => {
  switch (props.type) {
    case "text":
      return <TextInput {...props} />;
    case "number":
      return <NumberInput {...props} />;
    case "date":
      return <DateInput {...props} />;
    case "time":
      return <TimeInput {...props} />;
    case "date-time":
      return <DateTimeInput {...props} />;
    case "dropdown":
      return <DropDownInput {...props} />;
    case "free-solo-multiple":
      return <FreeSoloMultiple {...props} />;
    case "free-solo-single":
      return <FreeSoloSingle {...props} />;
    case "select-multiple":
      return <SelectMultiple {...props} />;
    case "select-single":
      return <SelectSingle {...props} />;
    case "toggle":
      return <ToggleInput {...props} />;
    case "multiline":
      return <MultiLineInput {...props} />;
    default:
      return <TextInput {...props} />;
  }
};
