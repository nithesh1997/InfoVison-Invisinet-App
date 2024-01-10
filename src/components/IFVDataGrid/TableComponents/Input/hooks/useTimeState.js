import React from "react";

const initialTimeState = {
  rawTime: new Date(),
  onlyDate: "",
  onlyTime: "",
  asNamedMonth: "",
  asMeridian: "",
  timestamp: "",
  weekDay: "",
};

const fixZero = (param) =>
  param.toString().length === 1 ? `0${param}` : `${param}`;

const onlyDate = (rawTime) => {
  const day = fixZero(rawTime.getDate() || "");
  const month = fixZero(rawTime.getMonth());
  const year = fixZero(rawTime.getFullYear());

  return `${year}-${month}-${day}`;
};

const onlyTime = (rawTime) => {
  const milliSeconds = fixZero(rawTime.getMilliseconds());
  const seconds = fixZero(rawTime.getSeconds());
  const minutes = fixZero(rawTime.getMinutes());
  const hours = fixZero(rawTime.getHours());

  return `${hours}:${minutes}:${seconds}:${milliSeconds}`;
};

const asNamedMonth = (rawTime = new Date()) => {
  const day = fixZero(rawTime.getDate());
  const year = fixZero(rawTime.getFullYear());
  const monthName = rawTime
    .toLocaleString("default", { month: "long" })
    .slice(0, 3);

  return `${day}-${monthName}-${year}`;
};

const asMeridian = (rawTime) => {
  const hours = fixZero(rawTime.getHours());
  const minutes = fixZero(rawTime.getMinutes());
  const meridian = Number(hours) >= 12 ? "PM" : "AM";

  return `${hours}:${minutes} ${meridian}`;
};

const timestamp = (rawTime) => onlyDate(rawTime) + "T" + onlyTime(rawTime);

const weekDay = (rawTime) =>
  rawTime.toLocaleString("default", { weekday: "long" });

export const useTimeState = (initialState = initialTimeState) => {
  const [state, setState] = React.useState(() => initialState);

  React.useEffect(() => {
    setState({
      onlyDate: onlyDate(state.rawTime),
      onlyTime: onlyTime(state.rawTime),
      asNamedMonth: asNamedMonth(state.rawTime),
      asMeridian: asMeridian(state.rawTime),
      timestamp: timestamp(state.rawTime),
      weekDay: weekDay(state.rawTime),
    });
  }, []);

  return [state, setState];
};
