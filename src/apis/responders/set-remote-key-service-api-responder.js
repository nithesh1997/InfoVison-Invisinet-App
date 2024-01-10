export const SetRemoteKeyAddressAPIResponder = (res, onComplete) => {
  const responder = {
    state: "SET_REMOTE_KEY_ADDRESS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "SET_REMOTE_KEY_ADDRESS_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};
