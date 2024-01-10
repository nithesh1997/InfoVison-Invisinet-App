export const resetHandler = (
  event,
  setStore,
  inputRef,
  { onReset, onValidation, onResetAddOns },
) => {
  const e = { ...event, _customName: "onReset" };

  setStore.setInputState((prevState) => {
    return {
      ...prevState,
      dirtyValue: prevState.value,
    };
  });

  setStore.setInputFlagState({
    isPristine: true,
    isFocused: false,
    isBlurred: false,
    isChanged: false,
    isDisabled: false,
    isDirty: false,
    isReseted: false,
    isCleared: false,
    isOk: true,
    isError: false,
  });
  setStore.setHelperState([]);

  inputRef.current.focus();

  setTimeout(() => {
    inputRef.current.blur();
    setStore.setSavePoint(true);
  }, 100);

  onReset(e, setStore, inputRef);
  // onValidation(e, {}, setStore, inputRef);
};
