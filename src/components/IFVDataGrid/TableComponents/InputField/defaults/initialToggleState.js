export const initialToggleState = (type, value, options) => {
  if (type === "toggle") {
    if (value.toLowerCase() === "false") {
      return options[0] ? options[0] : value;
    } else if (value.toLowerCase() === "true") {
      return options[1] ? options[1] : value;
    } else {
      return value;
    }
  } else {
    return value;
  }
};
