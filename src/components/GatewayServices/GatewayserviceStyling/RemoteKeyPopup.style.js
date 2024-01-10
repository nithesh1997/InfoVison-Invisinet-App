import { Button } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { GenericButton } from "../../../style/GenericButton/GenericButton";

export const Styled = {
  StyledContainer: styled.div`
    background-color: rgb(255, 255, 255);
    width: 500px;
    border-radius: 0.75em;
  `,
  HeaderDivComponent: styled.div`
    display: flex;
    align-items: center;
    padding-left: 3rem;
    justify-content: space-between;
    padding: 2rem;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
  `,
  StyledH6Component: styled.h6`
    font-weight: 700 !important;
    margin-bottom: 0px;
    line-height: 1.5;
    font-size: 1rem;
    margin-top: 0px;
    font-weight: 400;
    /* font-family: Montserrat, sans-serif; */
    color: rgba(2, 147, 254, 1);
  `,
  StyledCloseIconComponent: styled(CloseIcon)`
    padding: 0.25em;
    margin: -0.5rem -0.5rem -0.5rem auto;
    color: rgb(0, 0, 0);
    cursor: pointer;
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    border: 0px;
    border-radius: 0.25rem;
    opacity: 0.5;
  `,

  BodyDivComponent: styled.div`
    /* font-family: Montserrat, sans-serif; */
    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
    color: #212529 !important;
  `,

  StyledSubDivContainer: styled.p`
    /* font-family: "Montserrat"; */
    font-size: 15px;
    margin: 1em 0 0 0;
  `,

  CancelButton: styled(GenericButton)`
    &.MuiButton-root {
      height: 2rem;
      width: 6.9rem;
      /* font-family: "Montserrat"; */
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1.5;
      text-align: center;
      text-transform: capitalize;
      /* border: 2px solid #e83b46;
      background: #e83b46; */
      color: #fff;
      min-width: 38px;
      padding: 8px 16px;
    }
    &.MuiButton-root:hover {
      /* border: 2px solid #e83b46;
      background: #e83b46; */
      color: #fff;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }
  `,

  ApplyBtn: styled(Button)`
    margin: 0rem 1rem;
    width: 96px;
    /* font-family: "Montserrat", sans-serif; */
    border: 0.1em solid rgba(2, 147, 254, 1);
    color: #fff;
    background: #0094fd;

    &:hover {
      background: #0094fd;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }
  `,
  StyledFormDivComponent: styled.div`
    height: 25px;
    margin-left: 12px;
  `,
};
