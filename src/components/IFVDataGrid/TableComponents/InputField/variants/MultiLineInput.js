import { makeStyles } from "@material-ui/core";
import React from "react";
import { Input } from "../styled-materials";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "inherit",
      overflow: "none",
    },
    "& .MuiOutlinedInput-multiline": {
      padding: "0px",
    },
    "& .MuiInputBase-multiline": {
      padding: "0px",
    },
    "& .MuiOutlinedInput-input": {
      minHeight: "2rem",
      maxHeight: "2rem",
      overflowY: "scroll !important",
    },
  },
}));

export const MultiLineInput = ({
  borderColorState,
  handleBlurChanges,
  handleFocusChanges,
  handleOnChanges,
  helperText = "",
  inputRef,
  isDisabled,
  isValid,
  labelState,
  valueState,
  dirtyValueState,
}) => {
  const classes = useStyles();
  return (
    <MultiInput
      multiline
      disabled={isDisabled}
      className={classes.input}
      variant="outlined"
      label={labelState}
      onFocus={handleFocusChanges}
      onBlur={handleBlurChanges}
      onChange={handleOnChanges}
      value={dirtyValueState}
      borderColorState={borderColorState}
      error={!isValid}
      helperText={helperText}
    />
  );
};

const MultiInput = styled(Input)`
  & .MuiOutlinedInput-input {
  }
`;
