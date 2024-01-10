export function testRegex(value, regex) {
  if (regex.test(value)) {
    return true;
  } else {
    return false;
  }
}
