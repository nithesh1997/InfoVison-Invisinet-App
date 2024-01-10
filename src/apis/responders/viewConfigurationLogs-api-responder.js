export const ViewConfigLogsAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "VIEW_CONFIG_LOGS_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "VIEW_CONFIG_LOGS_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const DeleteGatewayConfigLogsResponder = (
  res,
  onComplete,
  onCompleteArgs,
) => {
  const responder = {
    state: "DELETE_GATEWAY_CONFIG_LOGS_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_GATEWAY_CONFIG_LOGS_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
