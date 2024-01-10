const { access, copyFile, mkdir } = require("fs");
const { join } = require("path");

// Paths are relative to root directory i.e., blue-armor/...
const source = "scripts/WEB-INF/web.xml";
const destination = "build/WEB-INF/web.xml";

const handleResult = (error) => {
  error
    ? console.error(`${error}\nPlease copy WEB-INF from scripts -> build directory`)
    : console.log(`Copied WEB-INF to build Successfully...`);
};

access("./build/WEB-INF", (error) => {
  if (error) {
    console.log("WEB-INF does not exist.");

    mkdir(join(__dirname, "../build/WEB-INF"), (error) => {
      error ? console.error(error) : console.info(`Created WEB-INF under build directory...`);

      copyFile(source, destination, handleResult);
    });
  } else {
    console.log("Directory exists...");
    console.log("Checking for `web.xml`...");

    access("./build/WEB-INF/web.xml", (error) => {
      error
        ? copyFile(source, destination, handleResult)
        : console.info(`web.xml already exists...`);
    });
  }
});
