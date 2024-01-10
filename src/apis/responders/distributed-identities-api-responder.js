export const DistributedIdentitiesAPIResponder = (res, onComplete) => {
  const responder = {
    state: "DISTRIBUTED_IDENTITIES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "DISTRIBUTED_IDENTITIES_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};
