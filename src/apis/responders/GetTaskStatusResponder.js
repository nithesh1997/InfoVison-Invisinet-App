export const GetTaskStatusResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "GET_TASK_STATUS_ERROR",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "GET_TASK_STATUS_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
