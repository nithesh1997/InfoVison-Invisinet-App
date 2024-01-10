import React from "react";

const initialInputFlagsState = {
  isPristine: true,
  isFocused: false,
  isBlurred: false,
  isChanged: false,
  isDisabled: false,
  isDirty: false,
  isReseted: false,
  isCleared: false,
  isOk: true,
  isError: false,
};

export const useInputFlagState = (initialState = initialInputFlagsState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
