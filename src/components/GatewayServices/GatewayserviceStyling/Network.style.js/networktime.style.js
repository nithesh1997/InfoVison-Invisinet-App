import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 1em;
  `,
  SaveButtonComponent: styled("button")`
    float: right;
    box-shadow: none !important;
    color: #fff;
    width: 6rem;
    height: 2rem;
    cursor: pointer;
    /* font-family: "Montserrat", sans-serif; */
    color: #fff;
    border: 1px solid transparent;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 0.25rem;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    margin-right: 8px;
    line-height: 32px;
    font-size: 14px;
    font-weight: bold;
    outline: none !important;
    box-shadow: none !important;
    background-color: #018ff6;
    border-color: #018ff6;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    float: right !important;
    &:hover {
      background: #1e6ee4;
      color: #fff;
    }

    &[disabled] {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
  Typo: styled(Typography)`
    /* font-family: Montserrat; */
    font-weight: 600;
  `,
};
