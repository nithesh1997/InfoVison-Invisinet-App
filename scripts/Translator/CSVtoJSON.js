const fs = require("fs");
const csv = require("csv-parser");

function CSVtoJSON(source, destination, nullish) {
  // Initialize the JSON object
  let json = {};

  // Read CSV file
  fs.createReadStream(source)
    .pipe(csv())
    .on("data", (row) => {
      const key = row["KEY"];
      const value = row["VALUE"];

      if (key) {
        const keys = key.split(".");
        let temp = json;

        for (let i = 0; i < keys.length; i++) {
          const subKey = keys[i];
          if (!temp[subKey]) {
            if (i === keys.length - 1) {
              // Set the final value if 'VALUE' exists, or an empty string otherwise
              // temp[subKey] = value || "";
              temp[subKey] = value ? (value === nullish ? {} : value) : "";
            } else {
              // Check for "null" and create an empty object
              temp[subKey] = {};
            }
          }
          temp = temp[subKey];
        }
      }
    })
    .on("end", () => {
      // Save the JSON object to a file
      fs.writeFile(
        destination,
        JSON.stringify(json, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`JSON data saved to ${destination}`);
          }
        },
      );

      console.log("CSV to JSON conversion complete.");
    });
}

module.exports = CSVtoJSON;
