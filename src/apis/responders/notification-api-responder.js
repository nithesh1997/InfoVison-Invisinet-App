export const getNotificationResponder = (
  res,
  onCompleteHandler,
  onCompleteArguments,
) => {
  const responder = { state: "GET_NOTIFICATION_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GET_NOTIFICATION_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onCompleteHandler(responder, ...onCompleteArguments);
};

export const getAllNotificationResponder = (
  res,
  onCompleteHandler,
  onCompleteArguments,
) => {
  const responder = { state: "GET_ALL_NOTIFICATION_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GET_ALL_NOTIFICATION_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onCompleteHandler(responder, ...onCompleteArguments);
};

export const AddNotificationResponder = (
  res,
  onCompleteHandler,
  onCompleteArguments,
) => {
  const responder = { state: "ADD_NOTIFICATION_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "ADD_NOTIFICATION_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onCompleteHandler(responder, ...onCompleteArguments);
};

export const updateNotificationResponder = (
  res,
  onCompleteHandler,
  onCompleteArguments,
) => {
  const responder = { state: "UPDATE_NOTIFICATION_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "UPDATE_NOTIFICATION_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onCompleteHandler(responder, ...onCompleteArguments);
};

export const deleteNotificationResponder = (
  res,
  onCompleteHandler,
  onCompleteArguments,
) => {
  const responder = { state: "DELETE_NOTIFICATION_FAILURE", data: undefined };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_NOTIFICATION_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onCompleteHandler(responder, ...onCompleteArguments);
};
