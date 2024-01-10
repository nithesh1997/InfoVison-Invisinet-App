export const DeleteEPCFilterRulesAPIResponder = (
  res,
  onComplete,
  onCompleteArguments,
) => {
  const responder = {
    state: "DELETE_EPC_FILTER_RULES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_EPC_FILTER_RULES_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArguments);
};
