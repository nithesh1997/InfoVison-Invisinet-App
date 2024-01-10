import { Button, FormControl } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { GenericButton } from "../../../style/GenericButton/GenericButton";

export const Styled = {
  StyledContainer: styled.div`
    background-color: rgb(255, 255, 255);
    width: 500px;
    border-radius: 0.75em;
    margin: 0.5em 0 0 0;
  `,

  HeaderDivComponent: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    padding-left: 1.5rem;
    border-bottom: 2px;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    opacity: "0.95";
    padding-top: "16px";
    padding-bottom: "12px";
    color: black;
    @media (max-width: 768px) {
      position: sticky;
      top: 5;
      background-color: rgb(255, 255, 255);
    }
    @media (max-width: 1024px) {
      position: sticky;
      top: 5;
      background-color: rgb(255, 255, 255);
    }
  `,

  StyledH5Component: styled.h5`
    & {
      /* font-family: "Montserrat", sans-serif; */
    }
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 700;
    line-height: 1.5;
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
    display: flex;
  `,

  BodyDivComponent: styled.div`
    padding: 1rem 4rem;
    overflow-y: auto;
    /* font-family: Montserrat; */
    height: 100%;
    @media (max-width: 768px) {
      height: 350px;
      overflow-y: auto;
    }
    @media (max-width: 1024px) {
      height: 350px;
      overflow-y: auto;
    }
  `,

  StyledFormContainer: styled.form`
    margin-top: 0.5rem;
  `,

  StyledFormDivComponent: styled.div`
    margin-bottom: 1rem;
  `,

  StyledFooterDivComponent: styled.div`
    display: flex;
    justify-content: center;
    padding-top: 1em;
    gap: 10px;
  `,

  StyledFormLabelComponent: styled.label`
    font-size: 12px;
    line-height: 14px;
    display: block;
    margin-bottom: 8px;
    color: #000;
  `,

  StyledErrorDivComponent: styled.div`
    color: #ef4444;
    margin-bottom: 12px;
    margin: 0.2rem;
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    min-height: 20px;
  `,

  StyledFormControlComponent: styled(FormControl)`
    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #018ff6;
    }
    .Mui-focused {
      color: #018ff6;
    }
    margin: 1em 0 0 0;
  `,

  StyledSaveButtonComponent: styled(Button)`
    &.MuiButton-root {
      /* font-family: "Montserrat"; */
      text-transform: capitalize;
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
      min-width: 80px;
      max-width: 80px;
      height: 2.4rem;
      padding: 0 1rem;
      margin: 0 1rem;
    }

    &.MuiButton-root:hover {
      border: 2px solid #0074c7;
      background: #0074c7;
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

  StyledCancelButtonComponent: styled(Button)`
    &.MuiButton-root {
      /* font-family: "Montserrat"; */
      text-transform: capitalize;
      border: 2px solid rgba(237, 20, 61, 1);
      background: rgba(237, 20, 61, 0.1);
      color: rgba(237, 20, 61, 1);
      min-width: 80px;
      max-width: 80px;
      height: 2.4rem;
      padding: 0 1rem;
      margin: 0 1rem;
    }

    &.MuiButton-root:hover {
      border: 2px solid rgba(237, 20, 61, 1);
      background: rgba(237, 20, 61, 0.1);
      color: rgba(237, 20, 61, 1);
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303096;
    }

    & .MuiTouchRipple-child {
      background: rgba(237, 20, 61, 0.3);
    }
  `,

  StyledMainDivComponent: styled.div`
    bottom: 0;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    background-color: #fff;
    background-clip: padding-box;
    outline: 0;
    border-radius: 0.75em;
    transition: transform 0.3s ease-in-out;
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
};
