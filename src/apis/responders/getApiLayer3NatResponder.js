export const getApiLayer3NatResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "GET_API_LAYER3_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "GET_API_LAYER_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const deleteApiLayer3NatResponder = (
  res,
  onComplete,
  onCompleteArgs,
) => {
  const responder = {
    state: "Delete_API_LAYER3_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_LAYER3_SUCESS";
    responder.code = res.response.code;
    responder.body = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const saveApiLayer3NatResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SAVE_API_LAYER3_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SAVE_LAYER3_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
