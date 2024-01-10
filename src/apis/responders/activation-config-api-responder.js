export const ActivationConfigAPIResponder = (res, onComplete) => {
  const responder = {
    state: "ACTIVATION_CONFIG_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "ACTIVATION_CONFIG_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
