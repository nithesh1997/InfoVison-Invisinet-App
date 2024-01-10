import { useState } from "react";

export const useValueState = (initialValueState) => {
  initialValueState = initialValueState || "";
  const [state, setState] = useState(() =>
    typeof initialValueState === "function"
      ? initialValueState()
      : initialValueState,
  );

  return [state, setState];
};
