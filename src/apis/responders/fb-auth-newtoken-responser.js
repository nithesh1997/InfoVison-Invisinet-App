export const refreshAuthTokenAPIResponder = (res, onComplete) => {
  const responder = {
    state: "REFRESH_TOKEN_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "REFRESH_TOKEN_SUCESS";
    responder.data = res.response.body;
  }

  onComplete(responder);
};
