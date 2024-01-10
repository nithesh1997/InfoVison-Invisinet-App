export const resetHandler = (
  event,
  setStore,
  inputRef,
  { onReset, onResetAddOns },
) => {
  const e = { ...event, _customName: "onReset" };
  setStore.setInputState((prevState) => ({
    ...prevState,
    dirtyValue: prevState.value,
  }));
  onReset(e, setStore, inputRef);
};
