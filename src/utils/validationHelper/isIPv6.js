export const isIPv6 = (val = "") => {
  val = val.toString();

  // Rules
  // - Ipv6 is a group of 1-8 strings containing 1-4 hex chars and separated by a colon.
  // - Leading zeros in a string are not mandatory.
  // - Double colons indicate all strings in between are 0 and may be used only once in an address.
  //   - 22::23:45 is interpreted as 22:0:0:0:0:0:23:45.
  //   - :: is interpreted as 0:0:0:0:0:0:0:0

  // IPv6 shouldn't have any unnecessary characters.
  if (val.match(/^[0-9a-fA-F:]+$/) === null) {
    return false;
  }

  // Ipv6 can't have 3 consecutive colons.
  if (val.includes(":::")) {
    return false;
  }

  // Check if there are more than 2 double octets.
  let first = val.indexOf("::");
  let last = val.lastIndexOf("::");
  if (first !== -1 && last !== -1 && first !== last) {
    return false;
  }

  val = val.split(":");
  // IPv6 can't have more than 8 strings separated by colon.
  if (val.length < 3 || val.length > 8) {
    return false;
  }

  // Validate each octet's
  return val
    .map((v) => {
      if (v.length > 4) {
        return false;
      }
      return true;
    })
    .every((r) => r === true);
};
