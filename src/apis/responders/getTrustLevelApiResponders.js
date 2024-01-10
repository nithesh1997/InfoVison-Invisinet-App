export const getTrustLevelApiResponders = (res, onComplete) => {
  const responder = {
    state: "GET_TRUST_LEVEL_RESPONDER_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "GET_TRUST_LEVEL_SUCESS";
    responder.data = res.response.body;
    responder.code = res.response.code;
    responder.error = res.response.error;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};
