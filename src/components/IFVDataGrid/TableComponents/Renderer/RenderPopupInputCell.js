// import React from "react";
// import InputField from "../InputField";
//
// export const RenderInputCell = (props) => {
//   return <InputField {...props} />;
// };

import React, { useContext, useEffect, useState } from "react";
import { DataGridContext } from "../../IFVDataGrid";
import Input from "../Input/Input";
import { colorStatus } from "./InputUtils/defaults/colorStatus";
import { useHelperColorState } from "./InputUtils/hooks/useHelperColorState";
import { useHelperState } from "./InputUtils/hooks/useHelperState";
import { useInputColorState } from "./InputUtils/hooks/useInputColorState";
import { useInputFlagState } from "./InputUtils/hooks/useInputFlagState";
import { useInputHandlerState } from "./InputUtils/hooks/useInputHandlerState";
import { useInputState } from "./InputUtils/hooks/useInputState";
import { initialInputHandlerState } from "./InputUtils/initialState/initialInputHandlerState";

const initialPayloadState = { isLoading: false, payload: "", error: "" };

export const RenderInputCell = (props) => {
  /****************************************************************************/
  const { setDirtyRows } = useContext(DataGridContext);
  /****************************************************************************/
  const [dirtyRow, setDirtyRow] = useState(() => props.row || {});
  const [savePoint, setSavePoint] = useState(false);
  const [infected, setInfected] = props.Infected;
  /****************************************************************************/
  const inputRef = React.useRef();
  const validationHandler = props.column.inputValidator;
  /****************************************************************************/
  const [payloadState, setPayloadState] = useState(() => initialPayloadState);
  /****************************************************************************/
  const [keyPress, setKeyPress] = useState({ key: "" });
  const [colorState, setColorState] = useState(colorStatus);
  /****************************************************************************/
  const [inputState, setInputState] = useInputState();
  const [inputColorState, setInputColorState, initialInputColorState] =
    useInputColorState();
  const [inputFlagState, setInputFlagState] = useInputFlagState();
  const [
    handleHoverEnter,
    handleHoverLeave,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    handlerClear,
    handleOk,
    setInputHandlerState,
  ] = useInputHandlerState(initialInputHandlerState);
  /****************************************************************************/
  const [helperState, setHelperState] = useHelperState();
  const [helperColorState, setHelperColorState] = useHelperColorState();
  /****************************************************************************/

  // # map inputState type with props
  useEffect(() => {
    const type = (t) => {
      switch (t) {
        case "text":
          return "text";
        case "multiline":
          return "multiline";
        case "date":
          return "date";
        case "time":
          return "time";
        case "date-time":
          return "date-time";
        case "select-single":
          return "dropdown-single";
        case "select-multiple":
          return "dropdown-multiple";
        case "free-solo-single":
          return "dropdown-single";
        case "free-solo-multiple":
          return "dropdown-multiple";

        default:
          return "";
      }
    };

    setInputState((oldState) => ({
      ...oldState,
      id: `${props.dataKey}-${props.dataId}`,
      label: props.label,
      name: `${props.dataKey}-${props.dataId}`,
      type: type(props.type),
      className: props.className || "",
      placeholder: props.label,
      options: [...props.options],
      value: props.value,
    }));
  }, [
    props.className,
    props.dataId,
    props.dataKey,
    props.label,
    props.options,
    props.type,
    props.value,
    setInputState,
  ]);

  // # map inputState value with dirtyValue
  useEffect(() => {
    setInputState((prevState) => ({
      ...prevState,
      value: `${props.value}`,
    }));
  }, []);

  useEffect(() => {
    setInputState((prevState) => ({
      ...prevState,
      dirtyValue: prevState.value,
    }));
  }, [inputState.value, setInputState]);

  // # map inputColorState with props
  useEffect(() => {
    setInputColorState({
      labelColor: colorState.isPristine,
      borderColor: colorState.isPristine,
      backgroundColor: colorState.isPristine.concat("08"),

      labelColorOnHover: colorState.isHovered,
      borderColorOnHover: colorState.isHovered,
      backgroundColorOnHover: colorState.isHovered.concat("08"),

      labelColorOnFocus: colorState.isFocused,
      borderColorOnFocus: colorState.isFocused,
      backgroundColorOnFocus: colorState.isFocused.concat("08"),
    });
  }, []);

  // # map inputFlagState with props
  useEffect(() => {
    setInputFlagState({
      isPristine: true,
      isFocused: false,
      isBlurred: false,
      isChanged: false,
      isDisabled: props.isDisabled,
      isDirty: false,
      isReseted: false,
      isCleared: false,
      isOk: true,
      isError: false,
    });
  }, []);

  // # map inputHandlerState with props
  useEffect(() => {
    setInputHandlerState((prevState) => {
      return {
        onHoverEnter: (event, setStore, inputRef) => {},
        onHoverLeave: (event, setStore, inputRef) => {},
        onFocus: (event, setStore, inputRef) => {},
        onBlur: (event, setStore, inputRef) => {
          setStore.setSavePoint(true);
        },
        onChange: (event, setStore, inputRef) => {},
        onSubmit: (event, setStore, inputRef) => {},
        onReset: (event, setStore, inputRef) => {
          setStore.setInputFlagState((oldState) => ({
            ...oldState,
            isReset: true,
          }));
        },
        onClear: (event, setStore, inputRef) => {},
        onOk: (event, setStore, inputRef) => {},
        onValidation: (event, {}, setStore, inputRef) => {
          setStore.setDirtyRow((oldState) => {
            const dirtyRow = oldState;
            const result = validationHandler(event, dirtyRow);

            result &&
              setStore.setInputFlagState((prevState) => ({
                ...prevState,
                isError: !result.isValid,
              }));

            result &&
              setStore.setHelperState(result.message ? [result.message] : []);

            return oldState;
          });
        },
      };
    });
  }, []);

  // # map inputColorState for isDisabled Flag
  useEffect(() => {
    inputFlagState.isDisabled
      ? setInputColorState({
          labelColor: colorState.isPristine,
          borderColor: colorState.isDisabled,
          backgroundColor: colorState.isDisabled.concat("08"),

          labelColorOnHover: colorState.isPristine,
          borderColorOnHover: colorState.isDisabled,
          backgroundColorOnHover: colorState.isDisabled.concat("08"),

          labelColorOnFocus: colorState.isPristine,
          borderColorOnFocus: colorState.isDisabled,
          backgroundColorOnFocus: colorState.isDisabled.concat("08"),
        })
      : inputFlagState.isError
      ? setInputColorState({
          labelColor: colorState.isError,
          borderColor: colorState.isError,
          backgroundColor: colorState.isError.concat("08"),

          labelColorOnHover: colorState.isError,
          borderColorOnHover: colorState.isError,
          backgroundColorOnHover: colorState.isError.concat("08"),

          labelColorOnFocus: colorState.isError,
          borderColorOnFocus: colorState.isError,
          backgroundColorOnFocus: colorState.isError.concat("08"),
        })
      : setInputColorState({ ...initialInputColorState });
  }, [
    colorState.isDisabled,
    colorState.isError,
    colorState.isPristine,
    initialInputColorState,
    inputFlagState,
    setInputColorState,
  ]);

  // # map HelperState for helper
  useEffect(() => {
    setHelperState([]);
  }, []);

  // # map HelperColorState for helperColor
  useEffect(() => {
    inputFlagState.isPristine &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });

    inputFlagState.isFocused &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });

    inputFlagState.isBlurred &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });

    inputFlagState.isChanged &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });

    inputFlagState.isDisabled &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });

    inputFlagState.isDirty &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });
    inputFlagState.isReseted &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });
    inputFlagState.isCleared &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });
    inputFlagState.isOk &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: "#1F2937",
        helperBackgroundColor: "#1F2937",
      });
    inputFlagState.isError &&
      setHelperColorState({
        helperTextColor: "#F9F9F9",
        helperBorderColor: colorState.isError,
        helperBackgroundColor: colorState.isError,
      });
  }, [colorState.isError, inputFlagState, setHelperColorState]);

  // # map focus to the first input from list of inputs
  useEffect(() => {
    // props.colIndex === 0 && inputRef.current.focus();
  }, [props.colIndex]);

  // # Setting local Dirty Row
  useEffect(() => {
    setDirtyRow((oldState) => {
      const newState = { ...oldState, [props.dataKey]: inputState.dirtyValue };
      return newState;
    });
  }, [inputState.dirtyValue, props.dataKey]);

  // # Setting Top-Level Dirty Rows
  useEffect(() => {
    if (savePoint) {
      if (
        inputState.dirtyValue !== inputState.value ||
        inputFlagState.isReset
      ) {
        setDirtyRows((prevRows) => {
          return prevRows.map((r) => {
            if (r.id === props.dataId) {
              return {
                ...r,
                [props.dataKey]: inputState.dirtyValue,
              };
            } else {
              return r;
            }
          });
        });
      }

      setSavePoint(false);
      setInputFlagState((oldState) => ({ ...oldState, isReset: false }));
    }
  }, [
    inputFlagState.isReset,
    inputState.dirtyValue,
    inputState.value,
    props.dataId,
    props.dataKey,
    savePoint,
    setDirtyRows,
    setInputFlagState,
  ]);

  // # Infected Input List
  useEffect(() => {
    if (inputFlagState.isError) {
      setInfected((oldState) => {
        return oldState.includes(inputRef.current.id)
          ? oldState
          : [...oldState, inputRef.current.id];
      });
    } else {
      setInfected((oldState) => {
        return oldState.filter((id) => id !== inputRef.current.id);
      });
    }
  }, [inputFlagState.isError, setInfected]);

  // # Props Object for Input Component
  const InputProps = {
    InputState: [inputState, setInputState],
    InputColorState: [inputColorState, setInputColorState],
    InputFlagState: [inputFlagState, setInputFlagState],
    InputHandlerState: [
      handleHoverEnter,
      handleHoverLeave,
      handleFocus,
      handleBlur,
      handleChange,
      handleSubmit,
      handleReset,
      handlerClear,
      handleOk,
    ],
    HelperState: [helperState, setHelperState],
    HelperColorState: [helperColorState, setHelperColorState],
    inputRef,
    /* NEED TO REMOVE BY REFACTOR */
    SavePoint: [savePoint, setSavePoint],
    DirtyRow: [dirtyRow, setDirtyRow],
  };

  return <Input {...InputProps} />;
};
