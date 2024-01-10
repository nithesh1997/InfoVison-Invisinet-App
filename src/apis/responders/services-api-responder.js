export const ServicesAPIResponder = (res, onComplete) => {
  const responder = {
    state: "SERVICES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "SERVICES_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
