export const focusHandler = (
  event,
  setStore,
  inputRef,
  { onFocus, onValidation, onFocusAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onFocus(e, setStore, inputRef);
  onValidation(e, {}, setStore, inputRef);
};
