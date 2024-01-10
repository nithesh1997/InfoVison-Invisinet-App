export const ApplicationAPIResponder = (res, onComplete) => {
  const responder = {
    state: "Applications_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "Applications_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder);
};

export const PortsAPIResponder = (res, onComplete) => {
  const responder = {
    state: "PORTS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "PORTS_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder);
};

export const SaveAppAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SAVE_APP_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SAVE_APP_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DeleteAppAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_APP_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_APP_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
