export const changeHandler = (
  event,
  setStore,
  inputRef,
  { onChange, onValidation, onChangeAddOns },
) => {
  const e = { ...event, _customName: event._reactName };

  setStore.setInputState((prevState) => {
    return {
      ...prevState,
      dirtyValue: e.target.value || "",
    };
  });

  onChange(e, setStore, inputRef);
  // onValidation(e, {}, setStore, inputRef);
};
