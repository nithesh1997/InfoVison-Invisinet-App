import React from "react";
import { TIME } from "../styled-materials/variants/TIME";

const _ = (_) => (_.toString().length === 1 ? `0${_}` : `${_}`);
const _num_ = (_) => parseInt(_);

const _24_TO_12_ = (param) => {
  const values = param.split(":");

  const hour = _num_(values[0]);
  const minutes = _num_(values[1]);
  const seconds = _num_(values[2] || 0);

  const calcHour = _(hour > 12 ? hour - 12 : hour === 0 ? 12 : hour);
  const calcMinutes = _(minutes);
  const calcSeconds = _(seconds);

  const HH = calcHour;
  const MM = calcMinutes;
  const SS = calcSeconds;
  const SEP = ":";
  const MERI =
    hour === 24
      ? "AM"
      : hour === 12 && minutes === 0
      ? "PM"
      : hour === 12 && minutes >= 1
      ? "PM"
      : hour > 12
      ? "PM"
      : "AM";

  return HH + SEP + MM + " " + MERI;
};

const _12_TO_24_ = (param) => {
  const values = param.split(" ");
  const meridian = values[1].toLowerCase();
  const timeValues = values[0].split(":");

  const hour = _num_(timeValues[0]);
  const minutes = _num_(timeValues[1]);
  const seconds = _num_(timeValues[2] || 0);

  const calcHour = _(
    hour === 12 && meridian === "am" && minutes === 0
      ? 0
      : hour === 12 && meridian === "am" && minutes >= 1
      ? 0
      : hour === 12 && meridian === "pm" && minutes === 0
      ? hour
      : hour === 12 && meridian === "pm" && minutes >= 1
      ? hour
      : hour < 12 && meridian === "pm"
      ? hour + 12
      : hour,
  );

  const calcMinutes = _(minutes);
  const calcSeconds = _(seconds);

  const HH = calcHour;
  const MM = calcMinutes;
  const SS = calcSeconds;
  const SEP = ":";

  return HH + SEP + MM;
};

export const TimeInput = (props) => {
  const value = props.dirtyValue;

  return (
    <TIME
      {...props}
      defaultValue={_12_TO_24_(value)}
      onBlur={(event) => {
        const fakeEvent = {
          ...event,
          target: { ...event.target, value: _24_TO_12_(event.target.value) },
        };
        props.onBlur(fakeEvent, props.setStore, props.inputRef);
      }}
      onChange={(event) => {
        const fakeEvent = {
          ...event,
          target: { ...event.target, value: _24_TO_12_(event.target.value) },
        };
        props.onChange(fakeEvent, props.setStore, props.inputRef);
      }}
    />
  );
};
