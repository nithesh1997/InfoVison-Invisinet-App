const log = (e, v) => {};

const onValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};
const onHoverEnterValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};
const onHoverLeaveValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};
const onFocusValidation = (event, row) => {
  log(event, row);
  return { isValid: true, message: `[🧪]: ${event._customName}` };
};
const onBlurValidation = (event, row) => {
  log(event, row);
  return { isValid: true, message: `[🧪]: ${event._customName}` };
};
const onChangeValidation = (event, row) => {
  log(event, row);
  return { isValid: true, message: `[🧪]: ${event._customName}` };
};
const onResetValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};
const onClearValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};
const onOkValidation = (event, row) => {
  log(event, row);
  return { isValid: false, message: `[🧪]: ${event._customName}` };
};

export const validationHandler = (event, row, setStore, inputRef) => {
  switch (event._customName) {
    case "onHoverEnter":
      return onHoverEnterValidation(event, row);
    case "onHoverLeave":
      return onHoverLeaveValidation(event, row);
    case "onFocus":
      return onFocusValidation(event, row);
    case "onBlur":
      return onBlurValidation(event, row);
    case "onChange":
      return onChangeValidation(event, row);
    case "onReset":
      return onResetValidation(event, row);
    case "onClear":
      return onClearValidation(event, row);
    case "onOk":
      return onOkValidation(event, row);

    default:
      return onValidation(event, setStore, inputRef);
  }
};
