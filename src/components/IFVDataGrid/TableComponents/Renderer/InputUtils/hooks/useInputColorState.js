import React from "react";

// const initialInputColorState = {
//   labelColor: "#10B981",
//   borderColor: "#10B981",
//   backgroundColor: "#10B981".concat("08"),

//   labelColorOnHover: "#3B82F6",
//   borderColorOnHover: "#3B82F6",
//   backgroundColorOnHover: "#3B82F6".concat("08"),

//   labelColorOnFocus: "#F59E0B",
//   borderColorOnFocus: "#F59E0B",
//   backgroundColorOnFocus: "#F59E0B".concat("08"),
// };

const initialInputColorState = {
  labelColor: "#1F2937",
  borderColor: "#1F2937",
  backgroundColor: "#1F2937".concat("08"),

  labelColorOnHover: "#3B82F6",
  borderColorOnHover: "#3B82F6",
  backgroundColorOnHover: "#3B82F6".concat("08"),

  labelColorOnFocus: "#3B82F6",
  borderColorOnFocus: "#3B82F6",
  backgroundColorOnFocus: "#3B82F6".concat("08"),
};

export const useInputColorState = (initialState = initialInputColorState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState, initialState];
};
