export const pubsubAPIResponder = (res, onComplete) => {
  const responder = {
    state: "PUBSUB_ADDRESS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "PUBSUB_ADDRESS_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};
