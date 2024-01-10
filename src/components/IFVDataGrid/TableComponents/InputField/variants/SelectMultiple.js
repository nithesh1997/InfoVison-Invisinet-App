import { Checkbox } from "@material-ui/core";
import React from "react";
import { AutoComplete, Input } from "../styled-materials";
import styled from "styled-components";

const SelectMultiple = ({
  labelState,
  isValid,
  dropDownState,
  dropDownList,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleSelectMultiple,
  valueState,
  helperText = "",
  isDisabled,
  dirtyValueState,
}) => {
  return (
    <AutoComplete
      id="select-multiple"
      disabled={isDisabled}
      error={!isValid}
      value={dirtyValueState
        .toString()
        .split(", ")
        .filter((val) => val.trim() !== "")}
      // value={dropDownState}
      options={dropDownList}
      onChange={(event, value) => handleSelectMultiple(event, value)}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      disableCloseOnSelect={true}
      renderOption={(option, state) => {
        return (
          <div>
            <Checks checked={state.selected} />
            <span>{option}</span>
          </div>
        );
      }}
      multiple
      filterSelectedOption={true}
      // limitTags={2}
      renderInput={(params) => (
        <StyledInput
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

export default SelectMultiple;

const Checks = styled(Checkbox)`
  &.MuiCheckbox-root.MuiCheckbox-colorSecondary.Mui-checked {
    color: #018ff6;
  }

  &.MuiCheckbox-root.MuiCheckbox-colorSecondary:hover {
    background: #018ff610;
  }
`;

const StyledInput = styled(Input)`
  & .MuiAutocomplete-clearIndicator {
    visibility: ${(props) => (props.isClearable ? "visible" : "hidden")};
  }
`;
