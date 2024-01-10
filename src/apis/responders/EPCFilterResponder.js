export const EPCFilterResponder = (res, onComplete) => {
  const responder = {
    state: "EPCFILtERS_FAILURE",
    data: undefined,
  };

  if (res.state == "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "EPCFILtERS_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder);
};
