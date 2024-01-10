export const focusHandler = (
  event,
  setStore,
  inputRef,
  { onFocus, onFocusAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onFocus(e, setStore, inputRef);
};
