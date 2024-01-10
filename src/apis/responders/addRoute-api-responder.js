export const AddRouteAPIResponder = (res, onComplete, onCompleteArguments) => {
  const responder = {
    state: "ROUTE_SERVICES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "ROUTE_SERVICES_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArguments);
};
