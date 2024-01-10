export const EndpointsConfigAPIResponder = (
  res,
  onComplete,
  onCompleteArgs,
) => {
  const responder = {
    state: "ENDPOINTS_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "ENDPOINTS_SUCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder);
};

export const AddEndPointAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ADD_ENDPOINT_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "ADD_ENDPOINT_SUCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const EditEndPointAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "EDIT_ENDPOINT_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "EDIT_ENDPOINT_SUCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const DeleteEndPointAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_ENDPOINT_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_ENDPOINT_SUCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};

export const AddTodoAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ADD_TODO_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "ADD_TODO_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const FetchLogAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "FETCH_LOG_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "FETCH_LOG_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const DownloadLogAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DOWNLOAD_LOG_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "DOWNLOAD_LOG_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const deletefetchlogResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_LOG_FAILURE",
    data: undefined,
    code: res.response.code,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_LOG_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const getdirConfigAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = { state: "GETDIR_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GETDIR_SUCCESS";
    responder.code = res.response.code;
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
