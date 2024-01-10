export const SummaryAPIResponder = (res, onComplete) => {
  const responder = {
    state: "SUMMARY_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "SUMMARY_SUCESS";
    responder.data = res.response.body;
  }
  onComplete(responder);
};
