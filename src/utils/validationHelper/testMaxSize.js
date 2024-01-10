export function testMaxSize(value, maxSize) {
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
}
