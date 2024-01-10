export const configListResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "CONFIG_LIST_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "CONFIG_LIST_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const dumpConfigResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DUMP_CONFIG_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "DUMP_CONFIG_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const deleteConfigResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_CONFIG_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "DELETE_CONFIG_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const SaveGatewayConfigAPIResponder = (
  res,
  onComplete,
  onCompleteArgs,
) => {
  const responder = {
    state: "GATEWAY_CONFIG_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GATEWAY_CONFIG_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const restoreConfigResponder = (
  API_PAYLOAD,
  payloadHandler,
  payloadArguments,
) => {
  const payload = { state: "RESTORE_CONFIG_FAILURE", data: undefined };

  const condition_1 = API_PAYLOAD.state === "GOOD_RESPONSE";
  const condition_2 = API_PAYLOAD.response.code === 200;

  if (condition_1 && condition_2) {
    payload.state = "RESTORE_CONFIG_SUCCESS";
    payload.data = API_PAYLOAD.response.body;
  } else {
    payload.catchError = API_PAYLOAD.error;
    payload.error = API_PAYLOAD.response.error;
    payload.errorFromJSON = API_PAYLOAD.response.errorFromJSON;
  }

  payloadHandler(payload, ...payloadArguments);
};

export const exportConfigResponder = (
  API_PAYLOAD,
  payloadHandler,
  payloadArguments,
) => {
  const payload = { state: "EXPORT_CONFIG_FAILURE", data: undefined };

  const condition_1 = API_PAYLOAD.state === "GOOD_RESPONSE";
  const condition_2 = API_PAYLOAD.response.code === 200;

  if (condition_1 && condition_2) {
    payload.state = "EXPORT_CONFIG_SUCCESS";
    payload.data = API_PAYLOAD.response.body;
  } else {
    payload.catchError = API_PAYLOAD.error;
    payload.error = API_PAYLOAD.response.error;
    payload.errorFromJSON = API_PAYLOAD.response.errorFromJSON;
  }

  payloadHandler(payload, ...payloadArguments);
};

export const importConfigResponder = (
  API_PAYLOAD,
  payloadHandler,
  payloadArguments,
) => {
  const payload = { state: "IMPORT_CONFIG_FAILURE", data: undefined };

  const condition_1 = API_PAYLOAD.state === "GOOD_RESPONSE";
  const condition_2 = API_PAYLOAD.response.code === 200;

  if (condition_1 && condition_2) {
    payload.state = "IMPORT_CONFIG_SUCCESS";
    payload.data = API_PAYLOAD.response.body;
  } else {
    payload.catchError = API_PAYLOAD.error;
    payload.error = API_PAYLOAD.response.error;
    payload.errorFromJSON = API_PAYLOAD.response.errorFromJSON;
  }

  payloadHandler(payload, ...payloadArguments);
};
