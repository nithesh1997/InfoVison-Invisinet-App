import React from "react";
import { addOn } from "../defaults/addOn";
/* Handlers */
import { blurHandler } from "../handle/blurHandler";
import { changeHandler } from "../handle/changeHandler";
import { clearHandler } from "../handle/clearHandler";
import { focusHandler } from "../handle/focusHandler";
import { hoverEnterHandler } from "../handle/hoverEnterHandler";
import { hoverLeaveHandler } from "../handle/hoverLeaveHandler";
import { okHandler } from "../handle/okHandler";
import { resetHandler } from "../handle/resetHandler";
import { submitHandler } from "../handle/submitHandler";
/* Handlers */

const initialHandlerState = {
  onHoverEnter: (event, setStore, inputRef) => {},
  onHoverLeave: (event, setStore, inputRef) => {},
  onFocus: (event, setStore, inputRef) => {},
  onBlur: (event, setStore, inputRef) => {},
  onChange: (event, setStore, inputRef) => {},
  onSubmit: (event, setStore, inputRef) => {},
  onReset: (event, setStore, inputRef) => {},
  onClear: (event, setStore, inputRef) => {},
  onOk: (event, setStore, inputRef) => {},
  onValidation: (event, setStore, inputRef) => {},
  onHoverEnterAddOns: [
    addOn("onHoverEnterAddOns 1"),
    addOn("onHoverEnterAddOns 2"),
    addOn("onHoverEnterAddOns 3"),
  ],
  onHoverLeaveAddOns: [
    addOn("onHoverLeaveAddOns 1"),
    addOn("onHoverLeaveAddOns 2"),
    addOn("onHoverLeaveAddOns 3"),
  ],
  onFocusAddOns: [
    addOn("onFocusAddOns 1"),
    addOn("onFocusAddOns 2"),
    addOn("onFocusAddOns 3"),
  ],
  onBlurAddOns: [
    addOn("onBlurAddOns 1"),
    addOn("onBlurAddOns 2"),
    addOn("onBlurAddOns 3"),
  ],
  onChangeAddOns: [
    addOn("onChangeAddOns 1"),
    addOn("onChangeAddOns 2"),
    addOn("onChangeAddOns 3"),
  ],
  onSubmitAddOns: [
    addOn("onSubmitAddOns 1"),
    addOn("onSubmitAddOns 2"),
    addOn("onSubmitAddOns 3"),
  ],
  onResetAddOns: [
    addOn("onResetAddOns 1"),
    addOn("onResetAddOns 2"),
    addOn("onResetAddOns 3"),
  ],
  onClearAddOns: [
    addOn("onClearAddOns 1"),
    addOn("onClearAddOns 2"),
    addOn("onClearAddOns 3"),
  ],
  onOkAddOns: [
    addOn("onOkAddOns 1"),
    addOn("onOkAddOns 2"),
    addOn("onOkAddOns 3"),
  ],
};

export const useInputHandlerState = (initialState = initialHandlerState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  const handleHoverEnter = React.useCallback(
    (event, setStore, inputRef) => {
      hoverEnterHandler(event, setStore, inputRef, {
        onHoverEnter: state.onHoverEnter,
        onValidation: state.onValidation,
        onHoverEnterAddOns: [],
      });
    },
    [state.onHoverEnter],
  );

  const handleHoverLeave = React.useCallback(
    (event, setStore, inputRef) => {
      hoverLeaveHandler(event, setStore, inputRef, {
        onHoverLeave: state.onHoverLeave,
        onValidation: state.onValidation,
        onHoverLeaveAddOns: [],
      });
    },
    [state.onHoverLeave],
  );

  const handleFocus = React.useCallback(
    (event, setStore, inputRef) => {
      focusHandler(event, setStore, inputRef, {
        onFocus: state.onFocus,
        onValidation: state.onValidation,
        onFocusAddOns: [],
      });
    },
    [state.onFocus],
  );

  const handleBlur = React.useCallback(
    (event, setStore, inputRef) => {
      blurHandler(event, setStore, inputRef, {
        onBlur: state.onBlur,
        onValidation: state.onValidation,
        onBlurAddOns: [],
      });
    },
    [state.onBlur],
  );

  const handleChange = React.useCallback(
    (event, setStore, inputRef) => {
      changeHandler(event, setStore, inputRef, {
        onChange: state.onChange,
        onValidation: state.onValidation,
        onChangeAddOns: [],
      });
    },
    [state.onChange],
  );

  const handleSubmit = React.useCallback(
    (event, setStore, inputRef) => {
      submitHandler(event, setStore, inputRef, {
        onSubmit: state.onSubmit,
        onValidation: state.onValidation,
        onSubmitAddOns: [],
      });
    },
    [state.onSubmit],
  );

  const handleReset = React.useCallback(
    (event, setStore, inputRef) => {
      resetHandler(event, setStore, inputRef, {
        onReset: state.onReset,
        onValidation: state.onValidation,
        onResetAddOns: [],
      });
    },
    [state.onReset],
  );

  const handlerClear = React.useCallback(
    (event, setStore, inputRef) => {
      clearHandler(event, setStore, inputRef, {
        onClear: state.onClear,
        onValidation: state.onValidation,
        onClearAddOns: [],
      });
    },
    [state.onClear],
  );

  const handleOk = React.useCallback(
    (event, setStore, inputRef) => {
      okHandler(event, setStore, inputRef, {
        onOk: state.onOk,
        onValidation: state.onValidation,
        onOkAddOns: [],
      });
    },
    [state.onOk],
  );

  return [
    handleHoverEnter,
    handleHoverLeave,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    handlerClear,
    handleOk,
    state,
    setState,
  ];
};
