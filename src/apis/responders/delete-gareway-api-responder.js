export const DeleteGatewayAPIResponder = (
  res,
  onComplete,
  onCompleteArguments,
) => {
  const responder = {
    state: "DELETE_GATEWAY_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "DELETE_GATEWAY_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArguments);
};
