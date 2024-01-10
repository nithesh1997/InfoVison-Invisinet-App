export const changeHandler = (
  event,
  setStore,
  inputRef,
  { onChange, onChangeAddOns },
) => {
  const e = { ...event, _customName: event._reactName };
  setStore.setInputState((prevState) => {
    return {
      ...prevState,
      dirtyValue: event.target.value || "",
    };
  });

  onChange(e, setStore, inputRef);
};
