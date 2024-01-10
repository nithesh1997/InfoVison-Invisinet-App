const fs = require("fs");
const dotenv = require("dotenv");

const ENV_VAR = "REACT_APP_LATEST_COMMIT_HEAD=";

require("child_process").exec("git rev-parse HEAD", function (err, stdout) {
  dotenv.config(); // Load existing environment variables

  const envFileContent = fs.readFileSync(".env", "utf8");
  const envFileContentList = envFileContent.split("\n");

  if (envFileContent.includes(ENV_VAR)) {
    const updatedContent = envFileContentList.filter(
      (i) => i && !i.includes(ENV_VAR),
    );

    // Write updated content to the file
    fs.writeFileSync(".env", updatedContent.join("\n"), "utf8");
  } else {
    const updatedContent = [...envFileContentList, `${ENV_VAR}${stdout}`];

    // Write updated content to the file
    fs.writeFileSync(".env", updatedContent.join("\n"), "utf8");
  }
});
