export const hoverLeaveHandler = (
  event,
  setStore,
  inputRef,
  { onHoverLeave, onHoverLeaveAddOns },
) => {
  const e = { ...event, _customName: "onHoverLeave" };

  onHoverLeave(e, setStore, inputRef);
};
