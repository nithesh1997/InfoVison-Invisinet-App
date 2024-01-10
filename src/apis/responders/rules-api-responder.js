export const RulesAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "RULES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "RULES_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const SaveRuleAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SAVE_RULES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SAVE_RULES_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DeleteRuleAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_RULES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_RULES_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
