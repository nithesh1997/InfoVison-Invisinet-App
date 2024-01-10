import { isIPv4 } from "./isIPv4";

export const isIPv4WithPrefix = (val = "", optionalPrefix = false) => {
  val = val.toString();
  let ip = val.match(/^(\d{1,3}\.){3}\d{1,3}$/);
  let withPrefix = val.match(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/);

  if (
    (ip === null && withPrefix === null) ||
    (withPrefix === false && optionalPrefix === false)
  ) {
    return false;
  }

  if (
    (withPrefix !== null && optionalPrefix === false) ||
    (withPrefix !== null && optionalPrefix === true)
  ) {
    val = val.split("/");
    /* if (val.length !== 2) {
          return false;
        } */

    let isIP = isIPv4(val[0]); // Validate the IP
    if (isIP === false) {
      return false;
    }

    val[1] = parseInt(val[1]); // Validate the prefix
    if (isNaN(val[1])) {
      return false;
    }
    if (val[1] > 7 && val[1] < 33) {
      return true;
    }
  }
  if (optionalPrefix === true) {
    if (withPrefix === null) {
      if (ip === null) {
        return false;
      }

      return isIPv4(val);
    }
  }
  return false;
};
