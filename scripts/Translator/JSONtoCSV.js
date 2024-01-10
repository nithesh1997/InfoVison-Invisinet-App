const fs = require("fs");

function convertor(json, parentKey = "", nullish) {
  let csv = [];

  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      let newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof json[key] === "object" &&
        Object.keys(json[key]).length === 0
      ) {
        // Handle empty objects by adding an null as the value
        csv.push([newKey, nullish]);
      } else if (typeof json[key] === "string" && json[key] === "") {
        // Handle empty strings
        csv.push([newKey, ""]);
      } else if (typeof json[key] === "object") {
        csv = csv.concat(convertor(json[key], newKey, nullish));
      } else {
        csv.push([newKey, json[key]]);
      }
    }
  }

  return csv;
}

function JSONtoCSV(source, destination, nullish) {
  // Read JSON file
  fs.readFile(source, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const json = JSON.parse(data);
    const csvData = convertor(json, "", nullish);

    // Convert CSV array to CSV string
    const csvString = `"KEY","VALUE"\n${csvData
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n")}`;

    // Write CSV file
    fs.writeFile(destination, csvString, "utf8", (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`CSV file saved to ${destination}`);
      }
    });
  });
}

module.exports = JSONtoCSV;
