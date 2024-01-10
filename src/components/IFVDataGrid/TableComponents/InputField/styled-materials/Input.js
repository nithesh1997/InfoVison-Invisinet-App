import { TextField } from "@material-ui/core";
import styled from "styled-components";

export const Input = styled(TextField)`
  background: ${({ borderColorState, disabled }) =>
    !disabled && borderColorState + "06"};
  font-size: 0.8rem;
  width: 100%;

  & :hover {
    background: ${({ disabled }) => !disabled && "#0293fe06"};
  }

  & .MuiOutlinedInput-multiline {
    /* font-family: "Montserrat", sans-serif; */
    padding: 0.2em;
  }

  & .makeStyles-root-569 .MuiTextField-root {
    width: 100%;
  }

  & .MuiOutlinedInput-input {
    /* font-family: "Montserrat", sans-serif; */
    padding: 0.75em;
  }

  & .MuiFormHelperText-contained {
    /* font-family: "Montserrat", sans-serif; */
    margin: 0.2em 0em;
    color: ${(props) => props.borderColorState};
  }
`;

/* PROPER STYLING
    & .MuiFormControl-root {
    }

    & .MuiOutlinedInput-input {
        padding: 0.8rem;
        border-radius: 4px;
        background: #F9F9F9;
    }

    & .MuiFormLabel-root {
    }

    & .MuiFormLabel-root.Mui-focused {
        color: red;
    }

    & .MuiInputLabel-root {
    }

    & .MuiInputLabel-root.Mui-focused {
        border-color: red;
    }

    & .MuiInputLabel-outlined {
        transform: translate(20%, 100%) scale(1);
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
        border-color: red;
        border-width: 2px;
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: blue;
        border-width: 2px;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: green;
        border-width: 2px;
    }
*/
