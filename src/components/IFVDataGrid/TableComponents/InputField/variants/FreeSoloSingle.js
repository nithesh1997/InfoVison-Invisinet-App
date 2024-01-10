import React, { useState } from "react";
import { AutoComplete, Input } from "../styled-materials";
import styled from "styled-components";

const FreeSoloSingle = ({
  labelState,
  dropDownState,
  dropDownList,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleFreeSoloSingle,
  valueState,
  error,
  isValid,
  helperText = "",
  isDisabled,
  dirtyValueState,
}) => {
  return (
    <AutoComplete
      id="free-solo-single"
      freeSolo
      disabled={isDisabled}
      value={dirtyValueState}
      // value={valueState}
      options={dropDownList}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      onChange={(event, value, reason) => {
        handleFreeSoloSingle({ event, value, reason });
        // if (dropDownList.indexOf(value) === -1) {
        //   setSingleHelperText(
        //     '"' + value.match(/Create "(.+)"/)[1] + '" will be created.'
        //   );
        // } else {
        //   setSingleHelperText(" ");
        // }
      }}
      renderOption={(option, state) => {
        if (option.match(/^Create ".+"/) !== null) {
          return (
            <div>
              <span>{option}</span>
            </div>
          );
        }

        return (
          <div>
            {/* <span style={{ color: "red", marginRight: "1em" }}>▶️</span> */}
            <span>{option}</span>
          </div>
        );
      }}
      getOptionLabel={(value) => {
        let match = value.match(/^Create "(.+)"/);
        if (match !== null) {
          return match[1];
          /* return (
          <div>
            NEW) {match[1]}
          </div>
        ); */
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
          label={labelState}
          margin="none"
          variant="outlined"
          borderColorState={borderColorState}
          isClearable={Boolean(dropDownState)}
          helperText={helperText}
          error={!isValid}
        />
      )}
    />
  );
};

export default FreeSoloSingle;

const StyledInput = styled(Input)`
  & .MuiFormControl-marginNormal {
    margin-top: 0em;
  }
  & .MuiAutocomplete-clearIndicator {
    visibility: ${(props) => (props.isClearable ? "visible" : "hidden")};
  }
`;
