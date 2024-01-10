import React from "react";
import styled from "styled-components";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { DropDownSelect, useShrink } from "../styled-materials";

export function ToggleInput({
  labelState,
  toggleState,
  toggleOptions,
  borderColorState,
  handleFocusChanges,
  handleBlurChanges,
  handleToggling,
  error,
  isValid,
  helperText = "",
  isDisabled,
}) {
  const { root } = useShrink({ borderColorState });

  return (
    <div>
      <FormCtrl
        variant="outlined"
        borderColorState={borderColorState}
        className={root}
      >
        <LabelText id="dropdown-input-table">{labelState}</LabelText>
        <DropDownSelect
          disabled={isDisabled}
          variant="outlined"
          labelId="dropdown-input-table"
          id="simple-select-outlined"
          value={toggleState}
          onChange={handleToggling}
          handleFocusChanges={handleFocusChanges}
          handleBlurChanges={handleBlurChanges}
          label={labelState}
          error={!isValid}
        >
          {toggleOptions.map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </DropDownSelect>
        <FormHelperText>{helperText}</FormHelperText>
      </FormCtrl>
    </div>
  );
}

const FormCtrl = styled(FormControl)`
  background: ${(props) => props.borderColorState + "06"};
  position: relative;
  display: grid;
  place-items: center;
`;

const LabelText = styled(InputLabel)`
  /* font-family: montserrat; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & .MuiInputLabel-outlined {
    width: 80px;
  }
`;
