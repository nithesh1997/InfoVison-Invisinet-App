export const GatewayServicesAPIResponder = (res, onComplete, onCompleteArg) => {
  const responder = {
    state: "GATEWAY_SERVICES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GATEWAY_SERVICES_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArg);
};

export const modifyServiceResponder = (res, onComplete, onCompleteArg) => {
  const responder = {
    state: "GATEWAY_SERVICES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "GATEWAY_SERVICES_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArg);
};
