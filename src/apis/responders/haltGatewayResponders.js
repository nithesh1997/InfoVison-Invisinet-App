export const haltGatewayResponders = (res, onComplete) => {
  const responder = {
    state: "HALTWAY_GATEWAY_FAILURE",
    data: undefined,
    code: 200,
  };

  if (
    res.state === "GOOD_RESPONSE" ||
    (res.response &&
      res.response.code == 200 &&
      res.response.errorMessage.indexOf("Bad Request") > 0)
  ) {
    responder.state = "HALTWAY_GATEWAY_SUCESS";
    responder.data = res.response.body;
    responder.code = res.response.code;
  }
  onComplete(responder);
};

export const rebootGatewayResponders = (res, onComplete) => {
  const responder = {
    state: "REBOOT_GATEWAY_FAILURE",
    data: undefined,
    code: 200,
  };

  if (
    res.state === "GOOD_RESPONSE" ||
    (res.response &&
      res.response.code == 200 &&
      res.response.errorMessage.indexOf("Bad Request") > 0)
  ) {
    responder.state = "REBOOT_GATEWAY_SUCESS";
    responder.data = res.response.body;
    responder.code = res.response.code;
  }
  onComplete(responder);
};
