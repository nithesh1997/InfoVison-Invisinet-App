import React from "react";

const initialInputColorState = {
  labelColor: "#1F2937",
  borderColor: "#1F2937",
  backgroundColor: "#1F2937".concat("08"),

  labelColorOnHover: "#4B5563",
  borderColorOnHover: "#4B5563",
  backgroundColorOnHover: "#4B5563".concat("08"),

  labelColorOnFocus: "#111827",
  borderColorOnFocus: "#111827",
  backgroundColorOnFocus: "#111827".concat("08"),
};

const testInputColorState = {
  labelColor: "#EF4444",
  borderColor: "#EF4444",
  backgroundColor: "#EF4444".concat("20"),

  labelColorOnHover: "#10B981",
  borderColorOnHover: "#10B981",
  backgroundColorOnHover: "#10B981".concat("20"),

  labelColorOnFocus: "#8B5CF6",
  borderColorOnFocus: "#8B5CF6",
  backgroundColorOnFocus: "#8B5CF6".concat("20"),
};

export const useInputColorState = (initialState = testInputColorState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState, initialState];
};
