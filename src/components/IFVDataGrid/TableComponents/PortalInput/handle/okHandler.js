export const okHandler = (event, setStore, inputRef, { onOk, onOkAddOns }) => {
  const e = { ...event, _customName: "onOk" };
  onOk(e, setStore, inputRef);
};
