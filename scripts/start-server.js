const path = require("path");
const mockserver = require("mockserver-node");

const expectationDir = path.join(".", "server/mocks");
const expectationJSONs = [path.join(expectationDir, "common.json")];
// Future task:
// get all JSON paths in expectation directory and dynamically generate an array to pass to the mock server.

let port = isNaN(parseInt(process.argv[2])) ? 8080 : parseInt(process.argv[2]);

mockserver.start_mockserver({
  serverPort: port,
  verbose: true,
  trace: true,
  enableCORSForAPI: true,
  enableCORSForAllResponses: true,
  watchInitializationJson: true,
  initializationJsonPath: expectationJSONs,
});
