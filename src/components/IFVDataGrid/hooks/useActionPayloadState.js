import React from "react";

const initialPayload = {
  inProgress: false,
  payload: {},
  isError: false,
  message: "",
};

export const useActionPayloadState = () => {
  const [state, setState] = React.useState(initialPayload);

  return [state, setState];
};
