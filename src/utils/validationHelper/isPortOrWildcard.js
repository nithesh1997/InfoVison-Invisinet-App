import { isPort } from "./isPort";

export function isPortOrWildcard(val) {
  val = val.toString();
  if (val.toLowerCase() === "any") {
    return true;
  }

  return isPort(val);
}
