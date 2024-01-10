export const TokensAPIResponder = (res, onComplete) => {
  const responder = {
    state: "TOKENS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "TOKENS_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
