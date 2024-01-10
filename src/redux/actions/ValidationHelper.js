const isIPv4 = (val = "") => {
  val = val.toString();
  if (val.match(/^(\d{1,3}\.){3}\d{1,3}$/) === null) {
    return false;
  }

  val = val.split(".");

  return val
    .map((v) => {
      v = parseInt(v);
      if (isNaN(v)) {
        return false;
      }
      if (v > -1 && v < 256) {
        return true;
      }
      return false;
    })
    .every((r) => r === true);
};

const isIPv4WithPrefix = (val = "", optionalPrefix = false) => {
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

const isIPv6 = (val = "") => {
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

const isIPv6WithPrefix = (val = "", optionalPrefix = false) => {
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

const isPort = (val = "") => {
  val = parseInt(val.toString());

  if (isNaN(val)) {
    return false;
  }

  if (val > -1 && val < 65536) {
    return true;
  }

  return false;
};

const ValidationHelper = {
  isNan: (_) => isNaN(_),
  isWithinRange: (_, min, max) => _ >= min && _ <= max,
  isNotEmpty: (value) => Object.keys(value.trim() || "").length !== 0,
  testPattern: (_, pattern) => pattern.test(_),
  isLimit: (val, min, max) => {
    if (val >= min && val <= max) {
      return true;
    } else if (val === "ANY") {
      return true;
    } else {
      return false;
    }
  },
  testRegex: (value, regex) => {
    if (regex.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  testMinSize: (value, minSize) => {
    if (Object.prototype.toString.call(value) === "[object Array]") {
      if (value.length < minSize) {
        return false;
      } else {
        return true;
      }
    } else if (typeof value === "object") {
      if (Object.keys(value).length < minSize) {
        return false;
      } else {
        return true;
      }
    } else if (typeof value === "string") {
      if (value.length < minSize) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  testMaxSize: (value, maxSize) => {
    if (Object.prototype.toString.call(value) === "[object Array]") {
      if (value.length > maxSize) {
        return false;
      } else {
        return true;
      }
    } else if (typeof value === "object") {
      if (Object.keys(value).length > maxSize) {
        return false;
      } else {
        return true;
      }
    } else if (typeof value === "string") {
      if (value.length > maxSize) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  isIPv4: isIPv4,
  isIPv4WithPrefix: isIPv4WithPrefix,
  isIPv4WithPrefixOrWildcard: (val) => {
    val = val.toString();
    if (val === "ANY") {
      return true;
    }

    return isIPv4WithPrefix(val, true);
  },
  isIPv6: isIPv6,
  isIPv6WithPrefix: isIPv6WithPrefix,
  isPort: isPort,
  isPortOrWildcard: (val) => {
    val = val.toString();
    if (val.toLowerCase() === "any") {
      return true;
    }

    return isPort(val);
  },
  validateAllGroupsFlag_Yes: (groups, allDynGroup) => {
    groups = groups.split(", ").filter((grp) => grp.trim() !== "");
    if (allDynGroup === "Yes" && groups.length > 0) {
      return false;
    }
    return true;
  },
  validateAllGroupsFlag_No: (groups, allDynGroup) => {
    groups = groups.split(", ").filter((grp) => grp.trim() !== "");
    if (allDynGroup === "No" && groups.length === 0) {
      return false;
    }
    return true;
  },
  isCommaSeparatedListWithNoEmptyElements: (val) => {
    /* val = val
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== ""); */
    return (
      val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s === "").length === 0
    );
  },
  batchValidator: (tests) => {
    let result = "";

    for (let i = 0; i < tests.length; i++) {
      let res = tests[i].runner(...tests[i].args);

      if (res === false) {
        result = tests[i].error;
        break;
      } else {
        result = tests[i].success;
      }
    }

    return result;
  },
};

export default ValidationHelper;
