import Autocomplete from "@material-ui/lab/Autocomplete";
import styled from "styled-components";

export const DROPDOWN = styled(Autocomplete)`
  &.MuiAutocomplete-hasClearIcon
    .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] {
    padding: 0.4rem;
    padding-right: 0;
  }

  &.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon
    .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] {
    padding: ${({ _type }) =>
      _type.includes("single") ? "0.4rem" : "0.4rem 0.2rem"};
  }

  &
    .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]
    .MuiAutocomplete-input {
    padding: 0.8rem;
    /* padding: 0.4em 0.8rem; */
    width: 100%;
  }

  & .MuiAutocomplete-tag {
    /* font-family: "Montserrat"; */
    max-width: 80%;
  }

  & .MuiAutocomplete-inputRoot {
    padding: 0.4em 0.8rem;
    border-radius: 4px;
    background: ${({ backgroundColor }) => backgroundColor};
    /* font-family: "Montserrat"; */
    width: 100%;
  }

  & .MuiAutocomplete-inputRoot:hover {
    padding: 0.4em 0.8rem;
    border-radius: 4px;
    background: ${({ backgroundColorOnHover }) => backgroundColorOnHover};
  }

  & .MuiAutocomplete-inputRoot.Mui-focused {
    padding: 0.8rem;
    /* padding: 0.4em 0.8rem; */
    border-radius: 4px;
    background: ${({ backgroundColorOnFocus }) => backgroundColorOnFocus};
  }

  & .MuiOutlinedInput-input {
    /* padding: 0.2rem; */
    /* border-radius: 4px; */
    background: ${({ backgroundColor }) => "transparent"};
  }

  & .MuiOutlinedInput-input:hover {
    /* padding: 0.2rem; */
    /* border-radius: 4px; */
    background: ${({ backgroundColorOnHover }) => "transparent"};
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
    /* padding: 0.2rem; */
    /* border-radius: 4px; */
    background: ${({ backgroundColorOnFocus }) => "transparent"};
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
    /* transform: ${({ _type }) =>
      `translate(10%, ${
        _type.includes("single") ? `150%` : `150%`
      }) scale(0.9)`}; */
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
    /* transform: ${({ _type }) =>
      _type.includes("single")
        ? `translate(12%, -20%) scale(0.7)`
        : `translate(8%, -20%) scale(0.7)`}; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
