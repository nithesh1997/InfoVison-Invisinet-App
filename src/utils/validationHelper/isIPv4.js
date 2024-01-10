export const isIPv4 = (val = "") => {
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
