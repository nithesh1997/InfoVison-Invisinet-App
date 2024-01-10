export const isPort = (val = "") => {
  val = parseInt(val.toString());

  if (isNaN(val)) {
    return false;
  }

  if (val > -1 && val < 65536) {
    return true;
  }

  return false;
};
