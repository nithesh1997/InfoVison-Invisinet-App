import { KeyboardTimePicker } from "@material-ui/pickers";
import styled from "styled-components";

export const TimePicker = styled(KeyboardTimePicker)`
  & .MuiOutlinedInput-inputAdornedEnd {
    /* font-family: "Montserrat", sans-serif; */
  }
  background: ${(props) => props.borderColorState + "06"};
  width: 100%;
`;
