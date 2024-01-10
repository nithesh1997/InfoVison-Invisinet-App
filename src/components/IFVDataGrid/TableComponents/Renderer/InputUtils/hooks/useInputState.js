import React from "react";

const initialInputState = {
  id: "text",
  label: "text",
  name: "text",
  type: "text",
  className: "textInput",
  placeholder: "Enter text here...",
  options: [],
  value: "",
  rawValue: "",
  dirtyValue: "",
};

export const useInputState = (initialState = initialInputState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
