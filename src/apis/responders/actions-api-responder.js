export const ActionsAPIResponder = (res, onComplete) => {
  const responder = {
    state: "Actions_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "Actions_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
