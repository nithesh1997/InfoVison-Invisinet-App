import { KeyboardDatePicker } from "@material-ui/pickers";
import styled from "styled-components";

export const DATE_INPUT = styled(KeyboardDatePicker)`
  & {
    width: 100%;
  }

  &.MuiFormControl-marginNormal {
    margin: 0;
  }

  & .MuiOutlinedInput-input {
    padding: 1.2rem;
    border-radius: 4px;
    /* font-family: "Montserrat"; */
  }

  & .MuiOutlinedInput-input:hover {
    padding: 1.2rem;
    border-radius: 4px;
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
    padding: 1.2rem;
    border-radius: 4px;
  }

  & .MuiOutlinedInput-adornedEnd {
    padding: 0;
    border-radius: 4px;
    background: ${({ backgroundColor }) => backgroundColor};
  }

  & .MuiOutlinedInput-adornedEnd:hover {
    padding: 0;
    border-radius: 4px;
    background: ${({ backgroundColorOnHover }) => backgroundColorOnHover};
  }

  & .MuiOutlinedInput-adornedEnd.Mui-focused {
    padding: 0;
    border-radius: 4px;
    background: ${({ backgroundColorOnFocus }) => backgroundColorOnFocus};
  }

  & .MuiFormLabel-root {
    color: ${({ labelColor }) => labelColor};
  }

  & .MuiInputLabel-root {
    color: ${({ labelColor }) => labelColor};
  }

  /* todo: Unable to apply these styles */
  & .MuiFormLabel-root:hover {
    color: ${({ labelColorOnHover }) => labelColorOnHover};
  }

  & .MuiInputLabel-root:hover {
    color: ${({ labelColorOnHover }) => labelColorOnHover};
  }
  /* todo: Unable to apply these styles */

  & .MuiFormLabel-root.Mui-focused {
    color: ${({ labelColorOnFocus }) => labelColorOnFocus};
  }

  & .MuiInputLabel-root.Mui-focused {
    border-color: ${({ labelColorOnFocus }) => labelColorOnFocus};
  }

  & .MuiInputLabel-outlined {
    /* transform: translate(4%, 100%) scale(0.9); */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
  }

  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColor }) => borderColor};
    border-width: 1px;
  }

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColorOnHover }) => borderColorOnHover};
    border-width: 1px;
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColorOnFocus }) => borderColorOnFocus};
    border-width: 1px;
  }

  & .MuiInputLabel-outlined.MuiInputLabel-shrink {
    /* transform: translate(6%, -20%) scale(0.7); */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
