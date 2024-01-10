export const okHandler = (
  event,
  setStore,
  inputRef,
  { onOk, onValidation, onOkAddOns },
) => {
  const e = { ...event, _customName: "onOk" };
  onOk(e, setStore, inputRef);
  // onValidation(e, {}, setStore, inputRef);
};
