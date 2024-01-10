import { isIPv4WithPrefix } from "./isIPv4WithPrefix";

export const isIPv4WithPrefixOrWildcard = (val) => {
  val = val.toString();
  if (val === "ANY") {
    return true;
  }

  return isIPv4WithPrefix(val, true);
};
