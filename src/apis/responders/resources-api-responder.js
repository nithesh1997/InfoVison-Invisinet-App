export const ProResourceAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ProResource_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "ProResource_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};

export const SaveProResrcAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SaveProResrc_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SaveProResrc_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DelProResrcAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DelProResrc_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DelProResrc_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const UnProResourceAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "UnProResource_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "UnProResource_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};

export const SaveUnProResrcAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SaveUnProResrc_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SaveUnProResrc_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DelUnProResrcAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DelUnProResrc_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DelUnProResrc_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const ResourceListAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ResourceList_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "ResourceList_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.error = res.response.error;
  }
  onComplete(responder);
};

export const SaveResrcListAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "SaveResrcList_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "SaveResrcList_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DelResrcListAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DelResrcList_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DelResrcList_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
