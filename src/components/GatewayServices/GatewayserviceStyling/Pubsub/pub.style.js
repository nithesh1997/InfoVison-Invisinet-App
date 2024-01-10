import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";
export const StyledPub = {
  Typo: styled(Typography)`
    font-weight: 600;
    /* font-family: Montserrat; */
  `,
  Wrapper: styled(Box)`
    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: 2fr 0.5fr 0.5fr;
      padding: 0px 1em;
    }
    @media (max-width: 1024px) {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.3fr;
      padding: 0px 1em;
    }
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
  `,
  WrapperTwo: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 35%;
    @media (max-width: 768px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
    @media (max-width: 1024px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
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
};
