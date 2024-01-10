import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import styled from "styled-components";
import { AutoComplete, Input } from "../styled-materials";

const FreeSoloMultiple = ({
  borderColorState,
  dropDownList,
  dropDownState,
  error,
  handleBlurChanges,
  handleFocusChanges,
  handleFreeSoloMultiple,
  helperText = "",
  isDisabled,
  isValid,
  labelState,
  valueState,
  dirtyValueState,
}) => {
  return (
    <AutoComplete
      disabled={isDisabled}
      id="free-solo-multiple"
      freeSolo
      multiple
      error={!isValid}
      value={dirtyValueState
        .toString()
        .split(", ")
        .filter((val) => val.trim() !== "")}
      // value={dropDownState}
      onChange={(event, reason) => handleFreeSoloMultiple({ event, reason })}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      options={dropDownList}
      filterSelectedOption={true}
      // limitTags={2}
      disableCloseOnSelect={true}
      renderOption={(option, state) => {
        if (option.match(/^Create ".+"/) !== null) {
          return (
            <div>
              <Checks color="secondary" checked={state.selected} />
              {/* Replace with new icon preferrably with a tooltip. Additionally, helper text can also be added as in freeSolo Single. */}
              <span>{option}</span>
            </div>
          );
        }

        return (
          <div>
            <Checks color="secondary" checked={state.selected} />
            <span>{option}</span>
          </div>
        );
      }}
      getOptionLabel={(value) => {
        let match = value.match(/^Create "(.+)"/);
        if (match !== null) {
          return (
            <div>
              <Checks color="secondary" checked={true} disabled={true} />
              {match[1]}
            </div>
          );
        }
        return value;
      }}
      filterOptions={(options, state) => {
        const newOpts = options.filter(
          (option) =>
            option.search(
              new RegExp(
                state.inputValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
                "i",
              ),
            ) !== -1,
        );
        if (
          options.indexOf(state.inputValue) === -1 &&
          state.inputValue !== ""
        ) {
          newOpts.push('Create "' + state.inputValue + '"');
        }
        return newOpts;
      }}
      renderInput={(params) => (
        <StyledInput
          {...params}
          borderColorState={borderColorState}
          label={labelState}
          margin="none"
          variant="outlined"
          isClearable={Boolean(!dropDownState)}
          helperText={helperText}
        />
      )}
    />
  );
};

export default FreeSoloMultiple;

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
