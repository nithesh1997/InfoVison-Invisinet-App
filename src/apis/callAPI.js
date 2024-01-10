import axios from "axios";
import { apiConfig } from "../apis/api-config";
import { AppName } from "../utils/ProjectName/Index";
import { requestResolver } from "./request-resolver";

const checkBodyForErrorJSON = (body) => {
  let errorCheckNeeded = false;
  let potentialErrorObject = null;
  let errorJSON = null;

  if (typeof body === "object") {
    errorCheckNeeded = true;
  } else {
    try {
      potentialErrorObject = JSON.parse(body);
      errorCheckNeeded = true;
    } catch (error) {
      console.error(error);
    }
  }

  if (errorCheckNeeded !== false) {
    if (potentialErrorObject === null) {
      potentialErrorObject = JSON.parse(JSON.stringify(body));
    }

    if (
      potentialErrorObject.error !== undefined &&
      potentialErrorObject.error !== null
    ) {
      errorJSON = {
        message:
          potentialErrorObject.errorMessage === undefined
            ? "Unknown error"
            : potentialErrorObject.errorMessage,
        json: potentialErrorObject,
        state: "RESPONSE_WITH_ERROR_JSON",
      };
    }
  }

  return errorJSON;
};

const callAPI = (apiData) => {
  const response = {
    state: "JUST_STARTING",
    error: undefined,
    response: {
      // Should be populated once response is received.
      headers: undefined, // Can be an object or `undefined` if not available.
      code: undefined, // Can be a number denoting HTTP response code or `undefined` if not available.
      body: undefined, // Can be a string or object denoting the HTTP response or `undefined` if not available.
    },
  };

  if (
    apiData.path === undefined ||
    apiData.data === undefined ||
    apiData.responder === undefined ||
    apiData.onComplete === undefined
  ) {
    return;
  }

  if (apiData.overrides === undefined) {
    apiData.overrides = {};
  }

  if (apiData.onCompleteArguments === undefined) {
    apiData.onCompleteArguments = [];
  }

  let env = apiConfig["default-env"];

  if (apiData.overrides.env !== undefined) {
    env = apiData.overrides.env;
  }

  if (apiConfig[env] !== undefined) {
    env = apiConfig[env];
    response.state = "ENV_SET";
  } else {
    response.state = "BAD_DATA::ENV";
    apiData.responder(
      response,
      apiData.onComplete,
      apiData.onCompleteArguments,
    );
    return;
  }

  let path = apiData.path;

  if (env.paths[path] !== undefined) {
    path = env.paths[path];
    response.state = "PATH_SET";
  } else {
    response.state = "BAD_DATA::PATH";
    apiData.responder(
      response,
      apiData.onComplete,
      apiData.onCompleteArguments,
    );
    return;
  }

  let host = "__default";

  if (path.host !== undefined) {
    host = path.host;
  } else if (apiData.overrides.host !== undefined) {
    host = apiData.overrides.host;
  }

  let hostkey = host;

  if (env.hosts[host] !== undefined) {
    host = env.hosts[host];
    response.state = "HOST_SET";
  } else {
    response.state = "BAD_DATA::HOST";
    apiData.responder(
      response,
      apiData.onComplete,
      apiData.onCompleteArguments,
    );

    return;
  }

  let method = host["default-method"];

  if (path.method !== undefined) {
    method = path.method;
  } else if (apiData.overrides.method !== undefined) {
    method = apiData.overrides.method;
  }

  response.state = "METHOD_SET";

  if (apiData.overrides.pathname !== undefined) {
    path.pathname = apiData.overrides.pathname;
  }

  var mergedHeaders = {};

  if (apiData.overrides.headers !== undefined) {
    mergedHeaders = apiData.overrides.headers;
  }

  if (path.headers !== undefined) {
    mergedHeaders = { ...path.headers, ...mergedHeaders };
  }

  if (env.headers[hostkey + "::" + method] !== undefined) {
    mergedHeaders = {
      ...env.headers[hostkey + "::" + method],
      ...mergedHeaders,
    };
  }
  response.state = "HEADERS_SET";

  var mergedParams = {};

  if (apiData.params !== undefined) {
    mergedParams = apiData.params;
  }

  if (path.params !== undefined) {
    mergedParams = { ...path.params, ...mergedParams };
  }

  response.state = "PARAMS_SET";

  let url = host.https ? "https" : "http";
  url += "://" + host.hostname + ":" + host.port;
  url += path.pathname;
  let parm = {};
  parm = Object.keys(mergedParams);

  if (parm.length > 0) {
    url += "?";
  }

  for (var i = 0; i < parm.length; i++) {
    url +=
      encodeURIComponent(parm[i]) +
      "=" +
      encodeURIComponent(mergedParams[parm[i]]) +
      "&";
  }

  var lastString = url.charAt(url.length - 1);

  if (lastString === "&") {
    url = url.slice(0, url.length - 1);
  }

  response.state = "CALLING";

  let req = { method, url, data: apiData.data, headers: mergedHeaders };

  if (apiData.onUploadProgress !== undefined) {
    req.onUploadProgress = (data) => {
      let args =
        apiData.onUploadProgressArguments !== undefined
          ? apiData.onUploadProgressArguments
          : [];
      apiData.onUploadProgress(data, ...args);
    };
  }

  if (apiConfig["default-env"] === "production-on-gateway") {
    req.withCredentials = true;
  }

  const request = requestResolver(req, apiData);

  axios(request)
    .then((res) => {
      response.response.body = res.data;
      response.response.code = res.status;
      response.response.headers = res.headers;

      // Check if response body contains error object's JSON
      let errorJSON = checkBodyForErrorJSON(response.response.body);
      let goodResponse = true;

      if (errorJSON !== null) {
        response.response.errorMessage = errorJSON.message;
        response.response.error = new Error(response.response.errorMessage);
        response.response.errorFromJSON = new Error(
          response.response.errorMessage,
        );
        response.response.errorBody = errorJSON.json;
        response.state = errorJSON.state;
        goodResponse = false;
      }

      if (goodResponse === true) {
        response.state = "GOOD_RESPONSE";
      }

      apiData.responder(
        response,
        apiData.onComplete,
        apiData.onCompleteArguments,
      );

      return;
    })
    .catch((err) => {
      response.error = err;
      let goodResponse = true;

      if (err.response) {
        response.response.body = err.response.data;
        response.response.code = err.response.status;
        response.response.headers = err.response.headers;

        const URL = response.error.config.url;
        const URLSpilts = URL.split("/");
        const notIsBEM = URLSpilts[URLSpilts.length - 1] !== "isBem";
        const notSignIn =
          window.location.pathname !==
          `/${AppName.toLocaleLowerCase()}/sign-in`;

        const is401 = response.response.code === 401;
        const is403 = response.response.code === 403;

        if (notIsBEM && notSignIn && (is401 || is403)) {
          if (!window.isLoggedOut) {
            callAPI({
              path: "logout",
              params: {},
              data: {},
              responder: (res, onComplete) => {
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
              },
              onComplete: (responder) => {
                // if (responder.state === "LOGOUT_SUCESS") {
                // window.alert("User is been logged out \n Due to inactivity");
                // } else {
                //   alert("Failed to logout. Please try again.");
                // }
              },
            });
          }

          window.isLoggedOut = true;

          if (window.isLoggedOut && notSignIn && !window.isUserAlerted) {
            alert("Session Expired..!");

            const currentPath = window.location.pathname;

            window.location.pathname = `/${AppName.toLocaleLowerCase()}/sign-in`;

            window.isUserAlerted = true;
          }
        }

        // Check if response body contains error object's JSON
        let errorJSON = checkBodyForErrorJSON(response.response.body);

        if (errorJSON !== null) {
          response.response.errorMessage = errorJSON.message;
          response.response.errorFromJSON = new Error(
            response.response.errorMessage,
          );
          response.response.errorBody = errorJSON.json;
          response.state = errorJSON.state;
          goodResponse = false;
        }
      }

      if (
        !response.response.code &&
        window.location.pathname !== `/${AppName.toLocaleLowerCase()}/sign-in`
      ) {
        alert("Network Error..!");

        window.location.pathname = `/${AppName.toLocaleLowerCase()}/sign-in`;
      }

      if (goodResponse === true) {
        response.state = "BAD_RESPONSE";
      }

      apiData.responder(
        response,
        apiData.onComplete,
        apiData.onCompleteArguments,
      );
      return;
    });
};

export default callAPI;
