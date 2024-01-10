export const logoutApiResponder = (res, onComplete) => {
  const responder = {
    state: "LOGOUT_FAILURE",
    data: undefined,
  };

  if (
    res.state === "GOOD_RESPONSE" ||
    res.response.code === 401 ||
    res.response.code === 403
  ) {
    responder.state = "LOGOUT_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
