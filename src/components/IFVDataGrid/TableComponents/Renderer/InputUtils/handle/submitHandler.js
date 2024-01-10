export const submitHandler = (
  event,
  setStore,
  inputRef,
  { onSubmit, onValidation, onSubmitAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onSubmit(e, setStore, inputRef);
  // onValidation(e, {}, setStore, inputRef);
};
