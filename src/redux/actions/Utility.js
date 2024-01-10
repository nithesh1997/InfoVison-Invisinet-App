const Utility = {
  getErrorsFromResponse: (response, asText = false) => {
    let msgs = [
      response.error !== undefined ? response.error.message : undefined,
      response.errorFromJSON !== undefined
        ? response.errorFromJSON.message
        : undefined,
      response.catchError !== undefined
        ? response.catchError.message
        : undefined,
    ];

    let tmpMsgs = [];
    msgs = msgs.filter((val) => {
      if (val === undefined || val === null || val === "") {
        return false;
      }

      if (tmpMsgs.indexOf(val) !== -1) {
        return false;
      }

      tmpMsgs.push(val);
      return true;
    });
    if (msgs.length === 0) {
      msgs.push("Unknown error.");
    }
    if (asText === false) {
      msgs = msgs.map((l) => <li style={{ margin: "1rem" }}>{l}</li>);
    }

    return msgs;
  },
};

export default Utility;
