import { isIPv6 } from "./isIPv6";

export const isIPv6WithPrefix = (val = "", optionalPrefix = false) => {
  val = val.toString();
  let ip = val.match(/^[0-9a-fA-F:]+$/);
  let withPrefix = val.match(/^[0-9a-fA-F:]+\/\d{1,3}$/);
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

    let isIP = isIPv6(val[0]); // Validate the IP
    if (isIP === false) {
      return false;
    }

    val[1] = parseInt(val[1]); // Validate the prefix
    if (isNaN(val[1])) {
      return false;
    }
    if (val[1] > 47 && val[1] < 129) {
      return true;
    }
  }
  if (optionalPrefix === true) {
    if (withPrefix === null) {
      if (ip === null) {
        return false;
      }

      return isIPv6(val);
    }
  }
  return false;
};
