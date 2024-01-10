export const gatewayServiesApiResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "GATEWAY_SERVICES_API_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GATEWAY_SERVICES_API_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
