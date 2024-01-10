export const validateField = (regex, value) => {
  if (regex === undefined) {
    return `No Validation Provided, Passing by default`;
  } else {
    return regex(value);
  }
};
