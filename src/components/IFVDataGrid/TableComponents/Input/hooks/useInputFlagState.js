import React from "react";

const initialInputFlagsState = {
  isBlurred: false,
  isChanged: false,
  isCleared: false,
  isDirty: false,
  isDisabled: false,
  isError: false,
  isFocused: false,
  isOk: true,
  isPristine: true,
  isReseted: false,
};

export const useInputFlagState = (initialState = initialInputFlagsState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
