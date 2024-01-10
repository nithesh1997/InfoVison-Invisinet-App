const fs = require("fs");

// Function to check if a path exists (file or directory)
function pathExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

// Function to check if a path is a directory
function isDirectory(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

function isExistCheck(filePath) {
  if (pathExists(filePath)) {
    if (isDirectory(filePath)) {
      //   console.log(`${filePath} is a directory.`);
      return true;
    } else {
      //   console.log(`${filePath} is a file.`);
      return true;
    }
  } else {
    // console.log(`${filePath} does not exist.`);
    return false;
  }
}

module.exports = isExistCheck;
