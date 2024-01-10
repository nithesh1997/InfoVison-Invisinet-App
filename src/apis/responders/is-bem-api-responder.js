export const isBemAPIResponder = (res, onComplete, onCompleteArguments) => {
  const responder = {
    state: "ISBEM_AUTH_FAILED",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "ISBEM_AUTH_SUCCESSFUL";
    responder.data = res.response.body;
  } else {
    responder.error = res.response.error;
  }
  onComplete(responder, ...onCompleteArguments);
};
