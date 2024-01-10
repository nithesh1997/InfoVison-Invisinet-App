export const blurHandler = (
  event,
  setStore,
  inputRef,
  { onBlur, onBlurAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onBlur(e, setStore, inputRef);
};
