export const filterProtocolResponder = (res, onComplete) => {
  const responder = {
    state: "FILTER_PROTOCOL_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "FILTER_PROTOCOL_SUCCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const fromTrustedFilterResponder = (res, onComplete) => {
  const responder = {
    state: "FROM_TRUSTED_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "FROM_TRUSTED_SUCCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const toTrustedFilterResponder = (res, onComplete) => {
  const responder = {
    state: "TO_TRUSTED_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "TO_TRUSTED_SUCCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const deleteFilterRuleResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_FILTER_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_FILTER_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
    responder.errorMessage = res.response.errorMessage;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const addFilterRuleResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ADD_FILTER_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "ADD_FILTER_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
    responder.errorMessage = res.response.errorMessage;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const toggleRulesResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "TOGGLE_FILTER_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "TOGGLE_FILTER_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
