export const signInAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "LOGIN_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "LOGIN_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.error = res.response.error;
    responder.errorMessage = res.response.errorMessage;
  }

  onComplete(responder, ...onCompleteArgs);
};
