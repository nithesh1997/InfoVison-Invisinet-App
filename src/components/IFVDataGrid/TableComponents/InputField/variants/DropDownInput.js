import React from "react";
import styled from "styled-components";
import { InputLabel, FormControl, MenuItem } from "@material-ui/core";
import { DropDownSelect, useShrink } from "../styled-materials";

export function DropDownInput({
  labelState,
  dropDownState,
  dropDownList,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleDropDownChange,
  error,
  helperText = "",
  isDisabled,
}) {
  const { root } = useShrink({ borderColorState });
  return (
    <FormCtrl
      variant="outlined"
      borderColorState={borderColorState}
      className={root}
    >
      <LabelText id="dropdown-input-table">{labelState}</LabelText>
      <DropDownSelect
        disabled={isDisabled}
        labelId="dropdown-input-table"
        id="simple-select-outlined"
        value={dropDownState}
        onChange={handleDropDownChange}
        handleFocusChanges={handleFocusChanges}
        handleBlurChanges={handleBlurChanges}
        label={labelState}
        error={error}
        helperText={helperText}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {dropDownList.map((value) => (
          <MenuItem value={value}>{value}</MenuItem>
        ))}
      </DropDownSelect>
    </FormCtrl>
  );
}

const FormCtrl = styled(FormControl)`
  background: ${(props) => props.borderColorState + "06"};
  position: relative;
  display: grid;
  place-items: center;
  padding: 0em 1em;
`;

const LabelText = styled(InputLabel)``;
