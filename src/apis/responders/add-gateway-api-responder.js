export const AddGatewayAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ADD_GATEWAY_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && !!!res.response.error) {
    responder.state = "ADD_GATEWAY_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
