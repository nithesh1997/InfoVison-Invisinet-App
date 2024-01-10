export const EnableApiResponder = (res, onComplete) => {
  const responder = { state: "ENABLE_LAYER_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "ENABLE_LAYER3_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
    responder.errorMessage = res.response.errorMessage;
  }

  onComplete(responder);
};

export const DisableApiResponder = (res, onComplete) => {
  const responder = { state: "DISABLE_LAYER_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DISABLE_LAYER3_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
    responder.errorMessage = res.response.errorMessage;
  }

  onComplete(responder);
};
