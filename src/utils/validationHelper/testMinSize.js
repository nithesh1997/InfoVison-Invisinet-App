export function testMinSize(value, minSize) {
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
}
