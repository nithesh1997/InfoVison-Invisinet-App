export function isLimit(val, min, max) {
  if (val >= min && val <= max) {
    return true;
  } else if (val === "ANY") {
    return true;
  } else {
    return false;
  }
}
