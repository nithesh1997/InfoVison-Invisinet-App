export const pubsubSaveResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "PUBSUB_SAVE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "PUBSUB_SAVE_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
