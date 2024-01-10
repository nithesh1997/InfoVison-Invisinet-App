import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import { GenericButton } from "../../../../style/GenericButton/GenericButton";

const StyledButton = styled(Button)`
  margin: 0rem 1rem;
  width: 110px;

  /* font-family: "Montserrat", sans-serif; */
  height: 2.2rem;

  &.MuiButton-root.Mui-disabled {
    background: #30303010;
    border: 0.1em solid #30303020;
    color: #30303090;
    font-weight: 600;
  }
`;
export const Styled = {
  ComponentContainer: styled(Box)`
    background-color: rgb(255, 255, 255);
    width: 440px;
    border-radius: 0.75em;
  `,
  HeaderWrapper: styled(Box)`
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid rgba(2, 147, 254, 1);
    height: 48px;
  `,
  HeaderText: styled(Typography)`
    color: rgba(2, 147, 254, 1);
    font-weight: 600;
    /* font-family: Montserrat; */
    font-size: 1.2em;
  `,
  ClosePopupButton: styled(IconButton)`
    padding: 0.25em;

    &:hover {
      background: rgba(2, 147, 254, 0.2);
    }
  `,
  Spinner: styled(CircularProgress)`
    width: 1rem !important;
    height: 1rem !important;
    fill: #fff;
  `,
  SkeletonWrapper: styled(Box)`
    padding: 1rem;
  `,
  Skeleton: styled(Box)``,
  ActionWrapper: styled(Box)`
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1rem auto;
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
  SubmitButton: styled(StyledButton)`
    border: 0.1em solid rgba(2, 147, 254, 1);
    color: #fff;
    background: #0094fd;

    &:hover {
      background: #0094fd;
    }
  `,
  PublisherIpHelperTextWrapper: styled(Box)`
    /* font-family: Montserrat; */
    display: flex;
    justify-content: flex-start;
    color: #ef4444;
    min-height: 2rem;
    margin: 0.2rem 1rem;
  `,
  PublisherIpHelperText: styled(Typography)`
    /* font-family: Montserrat; */
    font-size: 0.75rem;
    font-weight: 600;
  `,
  PublisherIpFieldWrapper: styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
  `,
  PublisherIpField: styled(TextField)`
    & .MuiOutlinedInput-input {
      padding: 1.2rem;
      border-radius: 4px;
      background: ${({ backgroundColor }) => backgroundColor};
      /* font-family: "Montserrat"; */
    }

    & .MuiOutlinedInput-input:hover {
      padding: 1.2rem;
      border-radius: 4px;
      background: ${({ backgroundColorOnHover }) => backgroundColorOnHover};
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
      padding: 1.2rem;
      border-radius: 4px;
      background: ${({ backgroundColorOnFocus }) => backgroundColorOnFocus};
    }

    & .MuiFormLabel-root {
      color: ${({ labelColor }) => labelColor};
    }

    & .MuiInputLabel-root {
      color: ${({ labelColor }) => labelColor};
    }

    /* todo: Unable to apply these styles */
    & .MuiFormLabel-root:hover {
      color: ${({ labelColorOnHover }) => labelColorOnHover};
    }

    & .MuiInputLabel-root:hover {
      color: ${({ labelColorOnHover }) => labelColorOnHover};
    }
    /* todo: Unable to apply these styles */

    & .MuiFormLabel-root.Mui-focused {
      color: ${({ labelColorOnFocus }) => labelColorOnFocus};
    }

    & .MuiInputLabel-root.Mui-focused {
      border-color: ${({ labelColorOnFocus }) => labelColorOnFocus};
    }

    & .MuiInputLabel-outlined {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: ${({ borderColor }) => borderColor};
      border-width: 1px;
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${({ borderColorOnHover }) => borderColorOnHover};
      border-width: 1px;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ borderColorOnFocus }) => borderColorOnFocus};
      border-width: 1px;
    }

    & .MuiInputLabel-outlined.MuiInputLabel-shrink {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  `,
  CheckBoxesWrapper: styled(Box)`
    padding: 1rem 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `,
};
