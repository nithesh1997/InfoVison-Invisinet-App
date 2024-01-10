export const IdentitiesAPIResponder = (res, onComplete) => {
  const responder = {
    state: "IDENTITIES_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "IDENTITIES_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const SaveIdentityAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SAVE_IDENTITY_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SAVE_IDENTITY_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DeleteIdentityAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_IDENTITY_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_IDENTITY_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
