export const blurHandler = (
  event,
  setStore,
  inputRef,
  { onBlur, onValidation, onBlurAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onBlur(e, setStore, inputRef);
  onValidation(e, {}, setStore, inputRef);
};
