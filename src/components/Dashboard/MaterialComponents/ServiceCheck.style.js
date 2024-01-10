import CheckIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import styled from "styled-components";
import CloseSharpIcon from "@material-ui/icons/CloseSharp";

const Styled = {
  Box: styled(Box)`
    margin-left: 14px;
  `,
  BoxCheck: styled(Paper)`
    width: 1.5em;
    height: 1.5em;
    border: 0.2em solid #69c536;
    border-radius: 50%;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  CheckIcon: styled(CheckIcon)`
    font-size: 0.75em;
    color: #69c536;
    stroke: #69c536;
    stroke-width: 1.5;
  `,
  BoxCancel: styled(Paper)`
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    box-shadow: none;
    border: 0.2em solid #e5e5e5;
    color: #e5e5e5;
    display: grid;
    justify-content: center;
  `,
  CancelIcon: styled(CloseSharpIcon)`
    color: #e5e5e5;
    font-size: 0.75em;
    stroke: #e5e5e5;
    stroke-width: 2.2;
    position: relative;
    left: 0.075em;
    top: 0.25em;
  `,
};

export default Styled;
