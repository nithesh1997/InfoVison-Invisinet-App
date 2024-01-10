import React from "react";
import styled from "styled-components";
import { TextField } from "@mui/material";

const initProps = {
  id: "",
  label: "",
  type: "",
};

export const GlobalTextField = ({ icon, textFielName, ...props }) => {
  return <Styled.InputField {...initProps} {...props} />;
};

const Styled = {
  InputField: styled(TextField)`
    &.MuiOutlinedInput-root {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 6px 8px;
      width: 241px;
      height: 32px;
      /* color: #fff; */
      border: 1px solid #bababa;
      border-radius: 4px;
      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;
    }

    &.MuiOutlinedInput-root:hover {
      /* background: #fff; */
      border: 1px solid #747474;
      /* color: #fff; */
    }

    /* & .MuiLabel-root {
      color: #000000;
    } */

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border: 1px solid #0094fd;
      /* background: #ffffff; */
    }

    & .MuiFormLabel-root.Mui-focused {
      color: #0094fd;
    }

    &.MuiOutlinedInput-root.Mui-disabled {
      background: #f0f0f0;
      border: 2px solid #f0f0f0;
    }

    &.MuiOutlinedInput-root.Mui-error {
      border: 1px solid #ff3d3d;
    }

    & .MuiFormHelperText-contained {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
      color: #ff3d3d;
    }

    & .MuiOutlinedInput-root.MuiOutlinedInput-inputMultiline {
      padding: 0.2em;
    }
  `,
};
