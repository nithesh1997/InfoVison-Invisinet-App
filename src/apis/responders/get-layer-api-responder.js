export const GetLayerApiResponder = (res, onComplete) => {
  const responder = {
    state: "GET_LAYER_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "GET_LAYER3_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder);
};
