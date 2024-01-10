import React, { useContext, useEffect, useState } from "react";
import { DataGridContext } from "../../IFVDataGrid";
import { initialToggleState } from "./defaults";
import { formatDate, formatDateTime, formatTime, RenderInput } from "./logic";
import { RestoreAction } from "./logic/RestoreAction";
import { Form, sign, useShrink } from "./styled-materials";
import { useBooleanState } from "./hooks/useBooleanState";
import { useValueState } from "./hooks/useValueState";

const sugarTime = (sugarTime) => {
  const timeArr = sugarTime && sugarTime.split(" ");
  const times = timeArr[0].split(":");

  const addZero = (param) =>
    typeof param !== "string"
      ? param.toString().length === 1
        ? "0".concat(param)
        : param
      : param.length === 1
      ? "0".concat(param)
      : param;

  const sugarMinutes = addZero(times[1]);
  const sugarHour = addZero(times[0] > 12 ? times[0] - 12 : times[0]);

  return `${sugarHour}:${sugarMinutes}`;
};

const setInitialTimeState = ({ type, value }) => {
  return type === "time" && `2020-01-01T${sugarTime(value)}`;
};

export default function InputField({
  type,
  dataId,
  dataKey,
  label,
  value,
  options,
  row,
  isDisabled,
  editOnPopup,
  editModeFocusDataKey,
}) {
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const { gridCols, isAddRow, gridConfig } = useContext(DataGridContext);
  const { rowStruct } = useContext(DataGridContext);

  const [dirtyRow] = isAddRow
    ? [rowStruct]
    : dirtyRows.filter((r) => r.id === row.id);

  const [isPristine, setIsPristine] = useBooleanState(true);
  const [isValid, setIsValid] = useBooleanState(true);
  const [isDirty, setIsDirty] = useBooleanState(false);
  const [isRestore, setIsRestore] = useBooleanState(false);

  const [borderColorState, setBorderColorState] = useState(sign.pristine);
  const [helperText, setHelperText] = useState("");

  const [labelState, setLabelState] = useState(label);
  const [valueState, setValueState] = useValueState(value);

  const [dirtyValueState, setDirtyValueState] = useValueState(() => {
    return dirtyRow[dataKey] || valueState;
  });

  const [dropDownList, setDropDownList] = useState(
    options.map((opt) => opt.toString()) || [],
  );
  const [toggleOptions, setToggleOptions] = useState(options || []);
  const [dateState, setDateState] = useState(() => type === "date" && value);
  const [timeState, setTimeState] = useState(() =>
    setInitialTimeState({ type, value }),
  );
  const [dateTimeState, setDateTimeState] = useState(
    () => type === "date-time" && value,
  );
  const [toggleState, setToggleState] = useState(
    initialToggleState(type, value, options),
  );
  const [dropDownState, setDropDownState] = useState(() =>
    type && type.includes("multiple")
      ? value
          .toString()
          .split(", ")
          .filter((val) => val.trim() !== "")
      : value,
  );

  const { root } = useShrink({ borderColorState, isDisabled });

  const col = React.useCallback(() => {
    const filtered = gridCols.filter((col) => {
      return col.dataKey === dataKey && col.inputValidator;
    });

    return { ...filtered[0] };
  }, [dataKey, gridCols]);

  isDisabled = isDisabled && !isAddRow;

  const handleFocusChanges = (event) => {
    setLabelState(label);
    setBorderColorState(sign.focus);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleBlurChanges = (event) => {
    setLabelState(label);
    valueState === value
      ? setBorderColorState(sign.neutral)
      : setBorderColorState(sign.dirty);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleOnChanges = (event) => {
    event.preventDefault();
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setValueState(event.target.value);
    setDirtyValueState(event.target.value);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleDateChange = (event, rawDate) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDateState(rawDate);
    setValueState(() => formatDate(rawDate, "-"));
    setDirtyValueState(() => formatDate(rawDate, "-"));

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleTimeChange = (event, rawTime) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setTimeState(rawTime);
    setValueState(() => formatTime(rawTime));
    setDirtyValueState(() => formatTime(rawTime));

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleDateTimeChange = (event) => {
    setDateTimeState(event.target.value);
    setValueState(
      formatDateTime({
        rawDate: new Date(event.target.value),
        dateDiff: "-",
        timeDiff: ":",
        separator: " ",
        isMeridiam: true,
      }),
    );
    setDirtyValueState(
      formatDateTime({
        rawDate: new Date(event.target.value),
        dateDiff: "-",
        timeDiff: ":",
        separator: " ",
        isMeridiam: true,
      }),
    );
    setIsRestore(true);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleDropDownChange = ({ event, reason }) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDropDownState(reason);
    setValueState(reason);
    setDirtyValueState(reason);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleFreeSoloMultiple = ({ event, reason }) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDropDownState(reason);
    setValueState(reason.join(", "));
    setDirtyValueState(reason.join(", "));

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleFreeSoloSingle = ({ event, value, reason }) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDropDownState(value);
    setValueState(value);
    setDirtyValueState(value);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleSelectSingle = (event, value) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDropDownState(value);
    setValueState(value);
    setDirtyValueState(value);

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleSelectMultiple = (event, value) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setDropDownState(value);
    setValueState(value.join(", "));
    setDirtyValueState(value.join(", "));

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleToggling = (event) => {
    setIsPristine(false);
    setIsDirty(true);
    setIsRestore(true);
    setToggleState(() => event.target.value);
    setValueState((prevState) => {
      return event.target.value === options[1] ? "True" : "False";
    });
    setDirtyValueState((prevState) => {
      return event.target.value === options[1] ? "True" : "False";
    });

    setIsValid(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).isValid,
    );
    setHelperText(
      col().inputValidator(event, dirtyRow, {
        isValid,
        helperText,
      }).message,
    );
  };

  const handleFreeSoloSingleRestore = () => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setDropDownState(value);
    setValueState(value);
    setDirtyValueState(value);
  };

  const handleFreeSoloMultipleRestore = () => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setDropDownState(value.split(", "));
    setValueState(value);
    setDirtyValueState(value);
  };

  const handleToggleRestore = (event) => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setToggleState(initialToggleState(type, value, options));
    setValueState((prevState) => {
      return toggleState !== options[1] ? "True" : "False";
    });
    setDirtyValueState((prevState) => {
      return toggleState !== options[1] ? "True" : "False";
    });
  };

  const handleDropDownRestore = (event) => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setDropDownState(value);
    setValueState(() => [value]);
    setDirtyValueState(() => [value]);
  };

  const handleDateTimeRestore = () => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setDateTimeState(value);
    setValueState(value);
    setDirtyValueState(value);
  };

  const handleDateRestore = () => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setDateState(value);
    setValueState(value);
    setDirtyValueState(value);
  };

  const handleTimeRestore = () => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setTimeState(`2020-01-01T${sugarTime(value)}`);
    setValueState(value);
    setDirtyValueState(value);
  };

  const handleRestore = (event) => {
    setIsValid(true);
    setBorderColorState(sign.neutral);
    setHelperText("");
    setValueState(value);
    setDirtyValueState(value);
  };

  useEffect(() => {
    helperText === "" && setHelperText(" ");
  }, [helperText]);

  useEffect(() => {
    type === "date" && setValueState(formatDate(value));
  }, [type, value]);

  useEffect(() => {
    isDirty && !isValid
      ? setBorderColorState(sign.dirty)
      : setBorderColorState(sign.neutral);
  }, [isDirty, isValid]);

  useEffect(() => {
    valueState === value ? setIsRestore(false) : setIsRestore(true);
    isAddRow && setIsRestore(false);
  }, [value, valueState]);

  useEffect(() => {
    if (isValid) {
      setBorderColorState(sign.neutral);
    } else {
      setBorderColorState(sign.error);
    }
  }, [isValid]);

  const valueStateRef = React.useRef(valueState);

  useEffect(() => {
    if (valueState !== valueStateRef.current) {
      setDirtyValueState(valueState);
      setDirtyRows((prevRows) => {
        return prevRows.map((r) => {
          if (r.id === dataId) {
            return {
              ...r,
              [dataKey]: valueState,
            };
          } else {
            return r;
          }
        });
      });
    }
  }, [dataKey, valueState, dataId]);

  const RenderInputProps = {
    type,
    labelState,
    isValid,
    valueState:
      valueState !== null && valueState !== undefined
        ? valueState.toString()
        : valueState,
    borderColorState,
    dataKey,
    dateState,
    dateTimeState,
    dropDownList,
    dropDownState,
    editModeFocusDataKey,
    editOnPopup,
    handleBlurChanges,
    handleDateChange,
    handleDateTimeChange,
    handleDropDownChange,
    handleFocusChanges,
    handleFreeSoloMultiple,
    handleFreeSoloSingle,
    handleOnChanges,
    handleSelectMultiple,
    handleSelectSingle,
    handleTimeChange,
    handleToggling,
    helperText,
    isDisabled,
    timeState,
    toggleOptions,
    toggleState,
    dirtyValueState,
  };

  const RestoreActionProps = {
    type,
    sign,
    isRestore,
    handleToggleRestore,
    handleDropDownRestore,
    handleDateRestore,
    handleTimeRestore,
    handleDateTimeRestore,
    handleFreeSoloSingleRestore,
    handleFreeSoloMultipleRestore,
    handleRestore,
  };

  return (
    <Form
      borderColorState={borderColorState}
      noValidate={false}
      onSubmit={(event) => event.preventDefault()}
      autoComplete="off"
      className={root}
      gridConfig={gridConfig}
      editOnPopup={editOnPopup}
      isDisabled={isDisabled}
    >
      <RenderInput {...RenderInputProps} />
      <RestoreAction {...RestoreActionProps} />
    </Form>
  );
}
