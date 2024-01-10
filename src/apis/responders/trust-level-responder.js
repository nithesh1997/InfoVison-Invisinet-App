export const TrustLevelsAPIResponder = (res, onComplete) => {
  const responder = {
    state: "TRUST_LEVEL_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "TRUST_LEVEL_SUCESS";
    responder.data = res.response.body;
  }

  onComplete(responder);
};

export const TrustGroupsAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "TRUST_GRPS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "TRUST_GRPS_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const SaveTrustGroupsAPIResponder = (
  res,
  onComplete,
  onCompleteArgs,
) => {
  const responder = {
    state: "SVTRUST_GRPS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "SVTRUST_GRPS_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
