import React from "react";

const initialHelperColorState = {
  helperTextColor: "#F9F9F9",
  helperBorderColor: "#1F2937",
  helperBackgroundColor: "#1F2937",
};

export const useHelperColorState = (initialState = initialHelperColorState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
