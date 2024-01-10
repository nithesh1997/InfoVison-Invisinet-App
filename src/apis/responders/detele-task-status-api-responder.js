export const DeleteTaskAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DeleteTask_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DeleteTask_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }
  onComplete(responder, ...onCompleteArgs);
};
