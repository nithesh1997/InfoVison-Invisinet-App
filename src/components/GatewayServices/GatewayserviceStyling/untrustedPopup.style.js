import { Button } from "@material-ui/core";
import styled from "styled-components";
import { GenericButton } from "../../../style/GenericButton/GenericButton";
export const Styled = {
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
    font-weight: 600;
    border: 0.1em solid rgba(2, 147, 254, 1);
    color: #fff;
    background: rgba(2, 147, 254, 1);

    &:hover {
      background: #0274fe;
    }

    &:disabled {
      color: #808080;
      background: transparent;
      border: 0.1em solid #808080;
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 1);
    }
  `,

  StyledFooterdivComponent: styled.div`
    margin-top: 0.75rem !important;
    gap: 0.5rem !important;
    /* font-family: "Montserrat", sans-serif; */
    font-size: 13px;
    display: flex;
  `,

  StyledFormComponent: styled.form`
    margin-top: 1rem !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 1em;
  `,

  StyledFormDivComponent: styled.div`
    width: 80%;
  `,

  StyledErrorDivComponent: styled.div`
    color: #ef4444;
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    height: 30px;
    margin-top: -2px;
    margin-left: 12px;
  `,
};
