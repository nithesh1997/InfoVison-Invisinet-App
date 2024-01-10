import React from "react";

export const useBooleanState = (initialBooleanState = false) => {
  const [state, setState] = React.useState(initialBooleanState);

  return [state, setState];
};
