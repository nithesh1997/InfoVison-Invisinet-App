import React, { useContext, useEffect, useState } from "react";
import { DataGridContext, IsSelectMultipleRows } from "../../IFVDataGrid";
import Input from "../Input/Input";
import PortalInput from "../PortalInput/PortalInput";
import { colorStatus } from "./InputUtils/defaults/colorStatus";
import { useHelperColorState } from "./InputUtils/hooks/useHelperColorState";
import { useHelperState } from "./InputUtils/hooks/useHelperState";
import { useInputColorState } from "./InputUtils/hooks/useInputColorState";
import { useInputFlagState } from "./InputUtils/hooks/useInputFlagState";
import { useInputHandlerState } from "./InputUtils/hooks/useInputHandlerState";
import { useInputState } from "./InputUtils/hooks/useInputState";
import { initialInputHandlerState } from "./InputUtils/initialState/initialInputHandlerState";

const getUniqueKey = () => Math.random().toString(16).toUpperCase().slice(2);
const initialPayloadState = { isLoading: false, payload: "", error: "" };

export const RenderInputCell = (props) => {
  /****************************************************************************/
  const {
    dirtyRows,
    setDirtyRows,
    inputHelpersText,
    isAddRow,
    gridConfig,
    ResetForm,
  } = useContext(DataGridContext);
  const isSelectMultipleRows = useContext(IsSelectMultipleRows);
  const [isErrorCheckCompleted, setIsErrorCheckCompleted] =
    props.IsErrorCheckCompleted;
  const editMode = gridConfig.editMode;
  /****************************************************************************/
  const [dirtyRow, setDirtyRow] = useState(() => props.row || {});
  const [savePoint, setSavePoint] = useState(false);
  const [infected, setInfected] = props.Infected;
  const [keyProp, setKeyProp] = useState(getUniqueKey());
  const [validateAll, setValidateAll] = props.ValidateAll;
  /****************************************************************************/
  const inputRef = props.inputRef;
  const [triggerValidationReset, setTriggerValidationReset] =
    props.TriggerValidationReset;
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
    inputHandlerState,
    setInputHandlerState,
  ] = useInputHandlerState(initialInputHandlerState);
  /****************************************************************************/
  const [helperState, setHelperState] = useHelperState();
  const [helperColorState, setHelperColorState] = useHelperColorState();
  /****************************************************************************/
  const [resetForm, setResetForm] = ResetForm;
  /****************************************************************************/

  // # map inputState type with props and base InputState
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
          return "dropdown-free-single";
        case "free-solo-multiple":
          return "dropdown-free-multiple";

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

  // # Set Dirty Value
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
      isDisabled:
        isAddRow && props.row.id === "_newRow"
          ? props.column.isDisableAdd
          : props.column.isDisableEdit ||
            (props.column?.disableField
              ? props.column?.disableField(props.row)
              : false),
      isDirty: false,
      isReseted: false,
      isCleared: false,
      isOk: true,
      isError: false,
    });
  }, []);

  // # map inputHandlerState with props
  useEffect(() => {
    const validationHandler =
      props.column.dataKey === "__action"
        ? () => {}
        : props.column.inputValidator;

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

          setStore.setInputState((oldState) => {
            setStore.setKeyProp(
              `${oldState.type.toUpperCase()}_${Math.random()
                .toString(16)
                .toUpperCase()
                .slice(2)}`,
            );

            return oldState;
          });
        },
        onClear: (event, setStore, inputRef) => {},
        onOk: (event, setStore, inputRef) => {},
        onValidation: (event, row, setStore, inputRef) => {
          const result = validationHandler(
            event,
            dirtyRow,
            setTriggerValidationReset,
          );

          result &&
            setStore.setInputFlagState((prevState) => ({
              ...prevState,
              isError: !result.isValid,
            }));

          result &&
            setStore.setHelperState(result.message ? [result.message] : []);

          return result;
        },
      };
    });
  }, [
    dirtyRow,
    props.column.dataKey,
    props.column.inputValidator,
    setInputHandlerState,
    setTriggerValidationReset,
  ]);

  useEffect(() => {
    if (triggerValidationReset.key === props.column.dataKey) {
      setInputFlagState((prevState) => ({ ...prevState, isError: false }));
      setHelperState([]);
    }
  });

  useEffect(() => {
    if (
      triggerValidationReset.key === props.column.dataKey &&
      triggerValidationReset.resetField
    ) {
      setTriggerValidationReset({});
      setInputFlagState((prevState) => ({ ...prevState, isError: false }));
      setHelperState([]);
      handleReset(
        {},
        {
          setKeyProp,
          setKeyPress,
          setInputState,
          setInputColorState,
          setInputFlagState,
          setHelperState,
          setHelperColorState,
          setSavePoint,
          setDirtyRow,
        },
        props.inputRef,
      );
    }
  }, [
    handleReset,
    props.column.dataKey,
    props.inputRef,
    setHelperColorState,
    setHelperState,
    setInputColorState,
    setInputFlagState,
    setInputState,
    setTriggerValidationReset,
    triggerValidationReset.key,
    triggerValidationReset.resetField,
  ]);

  useEffect(() => {
    if (isAddRow && props.row.id === "_newRow") {
      setInputFlagState((prevState) => ({
        ...prevState,
        isDisabled:
          props.column.isDisableAdd ||
          (props.column?.disableField
            ? props.column?.disableField(dirtyRow)
            : false),
      }));

      //   setHelperState([]);
    }

    if (!isAddRow && props.row.id !== "_newRow") {
      setInputFlagState((prevState) => ({
        ...prevState,
        isDisabled:
          props.column.isDisableEdit ||
          (props.column?.disableField
            ? props.column?.disableField(dirtyRow)
            : false),
      }));

      //   setHelperState([]);
    }
  }, [dirtyRow]);

  // # map inputColorState for isDisabled Flag
  useEffect(() => {
    inputFlagState.isDisabled
      ? setInputColorState({
          labelColor: colorState.isPristine,
          borderColor: colorState.isDisabled,
          backgroundColor: colorState.isDisabled.concat("20"),

          labelColorOnHover: colorState.isPristine,
          borderColorOnHover: colorState.isDisabled,
          backgroundColorOnHover: colorState.isDisabled.concat("20"),

          labelColorOnFocus: colorState.isPristine,
          borderColorOnFocus: colorState.isDisabled,
          backgroundColorOnFocus: colorState.isDisabled.concat("20"),
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

    if (props.column.dataKey === "certificateExpiryDate") {
      const color =
        props.row.expiryDays <= 30
          ? "#ff0000"
          : props.row.expiryDays <= 60
          ? "#FF8C00"
          : props.row.expiryDays <= 90
          ? "#01b508"
          : undefined;

      setInputColorState({
        labelColor: color ?? colorState.isPristine,
        borderColor: color ?? colorState.isDisabled,
        backgroundColor:
          color?.concat("10") ?? colorState.isDisabled.concat("20"),

        labelColorOnHover: color ?? colorState.isPristine,
        borderColorOnHover: color ?? colorState.isDisabled,
        backgroundColorOnHover:
          color?.concat("10") ?? colorState.isDisabled.concat("20"),

        labelColorOnFocus: color ?? colorState.isPristine,
        borderColorOnFocus: color ?? colorState.isDisabled,
        backgroundColorOnFocus:
          color?.concat("20") ?? colorState.isDisabled.concat("20"),
      });
    }
  }, [
    colorState.isDisabled,
    colorState.isError,
    colorState.isPristine,
    initialInputColorState,
    inputFlagState,
    props.column.dataKey,
    props.row.expiryDays,
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
    setTimeout(() => {
      const RHS = isSelectMultipleRows && editMode !== "popup" ? 1 : 0;

      if (props.colIndex === RHS) {
        inputRef.current.scrollIntoView({
          behaviour: "smooth",
          block: "center",
          inline: "center",
        });

        inputRef.current.focus();
      }
    }, 0);
  }, [editMode, inputRef, isSelectMultipleRows, props.colIndex]);

  // # Setting local Dirty Row
  useEffect(() => {
    const $ = dirtyRows.filter((r) => r.id === props.row.id)[0];

    setDirtyRow((oldState) => {
      const newState = {
        ...$,
        [props.dataKey]: inputState.dirtyValue,
      };

      return newState;
    });
  }, [dirtyRows, inputState.dirtyValue, props.dataKey, props.row.id]);

  // # Setting Top-Level Dirty Rows
  useEffect(() => {
    if (savePoint) {
      if (
        inputState.dirtyValue ||
        inputState.dirtyValue === "" ||
        inputFlagState.isReset
      ) {
        const emptyIt =
          (inputState.label === "Destination Port" ||
            inputState.label === "Source Port") &&
          inputFlagState.isReset &&
          triggerValidationReset;

        setDirtyRows((prevRows) => {
          return prevRows.map((r) => {
            if (r.id === props.dataId) {
              return {
                ...r,
                [props.dataKey]: emptyIt ? "ANY" : inputState.dirtyValue,
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
    inputRef,
    inputState.dirtyValue,
    inputState.label,
    inputState.value,
    props.dataId,
    props.dataKey,
    savePoint,
    setDirtyRows,
    setInputFlagState,
    setInputState,
    triggerValidationReset,
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
  }, [inputFlagState.isError, inputRef, setInfected]);

  // # onSubmit Validation
  useEffect(() => {
    const event = {
      type: "blur",
      _reactName: "onBlur",
      _customName: "onBlur",
      _trigger_reset_error_patch_: "ClickedSaveButton",
      target: { value: inputState.dirtyValue },
    };

    const disabled =
      isAddRow && props.row.id === "_newRow"
        ? props.column.isDisableAdd
        : props.column.isDisableEdit;

    const setStore = { setDirtyRow, setInputFlagState, setHelperState };

    if (validateAll && !disabled) {
      inputHandlerState.onValidation(event, props.row, setStore, inputRef);

      setTimeout(() => {
        setValidateAll(false);
        setIsErrorCheckCompleted(true);
      }, 0);
    }
  }, [
    inputHandlerState,
    inputRef,
    inputState.dirtyValue,
    isAddRow,
    props.column.isDisableAdd,
    props.column.isDisableEdit,
    props.isDisabled,
    props.row,
    setHelperState,
    setInputFlagState,
    setIsErrorCheckCompleted,
    setValidateAll,
    validateAll,
  ]);

  // # Setting Default Input Helper Text From EditAction
  useEffect(() => {
    if (Object.keys(inputHelpersText).length) {
      setHelperState([inputHelpersText[props.dataKey]]);
    }
  }, []);

  // # Reset Form to org values
  useEffect(() => {
    if (resetForm.isReset && props.row.id === resetForm.row.id) {
      handleReset(
        {},
        {
          setKeyProp,
          setKeyPress,
          setInputState,
          setInputColorState,
          setInputFlagState,
          setHelperState,
          setHelperColorState,
          setSavePoint,
          setDirtyRow,
        },
        inputRef,
      );

      setResetForm({ isReset: false });
    }
  }, [
    handleReset,
    inputRef,
    props.row,
    resetForm,
    setHelperColorState,
    setHelperState,
    setInputColorState,
    setInputFlagState,
    setInputState,
    setResetForm,
  ]);

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
      inputHandlerState.onValidation,
    ],
    HelperState: [helperState, setHelperState],
    HelperColorState: [helperColorState, setHelperColorState],
    inputRef,
    defaultValue:
      (inputState.label === "Destination Port" ||
        inputState.label === "Source Port") &&
      inputFlagState.isReset &&
      triggerValidationReset
        ? "ANY"
        : props.value,
    /* NEED TO REMOVE BY REFACTOR */
    SavePoint: [savePoint, setSavePoint],
    DirtyRow: [dirtyRow, setDirtyRow],
    KeyProp: [keyProp, setKeyProp],
  };

  return (
    <React.Fragment>
      {props.isInlineEdit() ? (
        <Input {...InputProps} />
      ) : (
        <PortalInput {...InputProps} />
      )}
    </React.Fragment>
  );
};
