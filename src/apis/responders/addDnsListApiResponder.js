export const addDnsListApiResponder = (res, onComplete, args) => {
  const responder = {
    state: "ADDDNSLIST_FAILURE",
    data: undefined,
    code: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "ADDDNSLIST_SUCESS";
    responder.code = res.response.code;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...args);
};
