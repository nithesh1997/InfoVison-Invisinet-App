export const hoverEnterHandler = (
  event,
  setStore,
  inputRef,
  { onHoverEnter, onHoverEnterAddOns },
) => {
  const e = { ...event, _customName: "onHoverEnter" };
  onHoverEnter(e, setStore, inputRef);
};
