export const networkTwoAPIResponder = (res, onComplete) => {
  const responder = {
    state: "NETWORK_FAILURE",
    data: undefined,
    code: undefined,
    err: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "NETWORK_SUCESS";
    responder.data = res.response.body;
    responder.code = res.response.code;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};
