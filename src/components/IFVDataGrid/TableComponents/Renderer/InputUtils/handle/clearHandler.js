export const clearHandler = (
  event,
  setStore,
  inputRef,
  { onClear, onValidation, onClearAddOns },
) => {
  const e = { ...event, _customName: "onClear" };
  onClear(e, setStore, inputRef);
  // onValidation(e, {}, setStore, inputRef);
};
