import Autocomplete from "@material-ui/lab/Autocomplete";
import styled from "styled-components";

export const AutoComplete = styled(Autocomplete)`
  /* font-family: "Montserrat", sans-serif; */
  background: ${(props) => props.borderColorState + "06"};
  font-size: 0.8rem;
  width: 100%;
  padding: 0em;

  & .MuiChip-root {
    /* font-family: "Montserrat", sans-serif; */
    font-size: 600;
  }

  & .MuiFormControl-root {
    margin: 8px 0;
    background: transparent;
    padding: 0em;
    margin: 0em;
  }

  & .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] {
    padding: 0.19em;
  }
`;
