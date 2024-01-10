export const getTrustLevel = (res, onComplete) => {
  const responder = {
    state: "GET_TRUSTLEVEL_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "GET_TRUSTLEVEL_SUCESS";
    responder.data = res.response.body;
  }

  onComplete(responder);
};
