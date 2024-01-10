import { Select } from "@material-ui/core";
import styled from "styled-components";

export const DropDownSelect = styled(Select)`
  /* font-family: "montserrat"; */
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: ${(props) => props.borderColorState + "06"};
  width: 100%;
  height: 100%;

  & .MuiSelect-outlined.MuiSelect-outlined {
    padding: 1em 0em 1em 0.8em;
  }

  /* & .MuiOutlinedInput-input {
        padding: 0.75em;
    }

    & .MuiFormHelperText-contained {
        margin: 0.2em 0em;
    } */
`;
