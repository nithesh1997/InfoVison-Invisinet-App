import React from "react";
import { AutoComplete, Input } from "../styled-materials";

const SelectSingle = ({
  labelState,
  isValid,
  dropDownState,
  dropDownList,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleSelectSingle,
  valueState,
  error,
  helperText = "",
  isDisabled,
  dirtyValueState,
}) => {
  return (
    <AutoComplete
      disabled={isDisabled}
      id="select-single"
      error={!isValid}
      // value={valueState}
      value={dirtyValueState}
      options={dropDownList}
      onChange={(event, value) => handleSelectSingle(event, value)}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      renderOption={(option, state) => {
        return (
          <div>
            {/* <span style={{ marginRight: "1em" }}>➡</span> */}
            <span>{option}</span>
          </div>
        );
      }}
      renderInput={(params) => (
        <Input
          {...params}
          label={labelState}
          margin="normal"
          variant="outlined"
          borderColorState={borderColorState}
          helperText={helperText}
        />
      )}
    />
  );
};

export default SelectSingle;
