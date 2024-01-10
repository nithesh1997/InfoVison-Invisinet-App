export const FirmwareResponder = (res, onComplete) => {
  const responder = {
    state: "FIRMWARE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
    responder.state = "FIRMWARE_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};

export const DeleteFirwareAPIResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "DELETE_FIRMWARE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "DELETE_FIRMWARE_SUCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};

export const getEPCFRTemplateResponder = (res, onComplete) => {
  const responder = {
    state: "EPCFRTEMPLATE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE") {
    responder.state = "EPCFRTEMPLATE_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder);
};

export const addFirmwareResponder = (res, onComplete, onCompleteArgs) => {
  const responder = {
    state: "ADDFIRMWARE_FAILURE",
    data: undefined,
  };

  if (res.state === "GOOD_RESPONSE" && res.response.code === 204) {
    responder.state = "ADDFIRMWARE_SUCCESS";
    responder.data = res.response.body;
  } else {
    responder.catchError = res.error;
    responder.error = res.response.error;
    responder.errorFromJSON = res.response.errorFromJSON;
  }

  onComplete(responder, ...onCompleteArgs);
};
