export const hoverEnterHandler = (
  event,
  setStore,
  inputRef,
  // { onHoverEnter, onValidation, onHoverEnterAddOns }
) => {
  const e = { ...event, _customName: "onHoverEnter" };
  let isDisabled = false;

  setStore.setInputFlagState((prevState) => {
    isDisabled = prevState.isDisabled;
    return prevState;
  });

  if (!isDisabled) {
    // onHoverEnter(e, setStore, inputRef);
    // onValidation(e, {}, setStore, inputRef);
  }
};
