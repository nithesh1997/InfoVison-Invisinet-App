export const clearHandler = (
  event,
  setStore,
  inputRef,
  { onClear, onClearAddOns },
) => {
  const e = { ...event, _customName: "onClear" };
  onClear(e, setStore, inputRef);
};
