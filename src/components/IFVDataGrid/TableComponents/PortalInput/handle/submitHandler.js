export const submitHandler = (
  event,
  setStore,
  inputRef,
  { onSubmit, onSubmitAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  onSubmit(e, setStore, inputRef);
};
