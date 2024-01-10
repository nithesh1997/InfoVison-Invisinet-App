import React from "react";

export const initialInputState = {
  id: "text",
  label: "text",
  name: "text",
  type: "text",
  className: "textInput",
  placeholder: "Enter text here...",
  value: "2021-02-18T12:30:59",
  rawValue: new Date(`2021-02-18T12:30:59`),
  dirtyValue: "",
};

export const useInputState = (initialState = initialInputState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
