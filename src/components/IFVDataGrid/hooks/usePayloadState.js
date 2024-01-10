import React from "react";

const initialPayload = {
  isLoading: false,
  payload: [],
  error: "",
};

export const usePayloadState = () => {
  const [state, setState] = React.useState(initialPayload);

  React.useEffect(() => {}, []);

  return [state, setState];
};
