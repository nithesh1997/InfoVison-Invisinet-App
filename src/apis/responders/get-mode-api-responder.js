export const GetModeApiResponder = (res, onComplete) => {
  const responder = {
    state: "GET_MODE_BRIDGE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "GET_MODE_BRIDGE_SUCCESS";
    responder.data = res.response.body;
  }

  onComplete(responder);
};
