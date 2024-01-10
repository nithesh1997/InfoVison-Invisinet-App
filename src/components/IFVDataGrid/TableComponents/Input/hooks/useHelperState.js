import React from "react";

const initialHelperState = [];

export const useHelperState = (initialState = initialHelperState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
