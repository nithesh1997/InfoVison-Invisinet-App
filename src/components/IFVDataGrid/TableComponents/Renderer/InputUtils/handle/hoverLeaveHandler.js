export const hoverLeaveHandler = (
  event,
  setStore,
  inputRef,
  // { onHoverLeave, onValidation, onHoverLeaveAddOns }
) => {
  const e = { ...event, _customName: "onHoverLeave" };
  let isDisabled = false;

  setStore.setInputFlagState((prevState) => {
    isDisabled = prevState.isDisabled;
    return prevState;
  });

  if (!isDisabled) {
    // onHoverLeave(e, setStore, inputRef);
    // onValidation(e, {}, setStore, inputRef);
  }
};
