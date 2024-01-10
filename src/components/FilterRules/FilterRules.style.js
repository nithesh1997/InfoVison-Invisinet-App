import { Box } from "@mui/material";
import styled from "styled-components";

export const StyledSkeletonHolder = styled(Box)`
  height: 100%;
  padding: 3.5em 1em 0em 0em;
`;

export const AsyncStyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  padding: 0em 1.25em 1em 2.25em;
  margin-top: -3.5em;
`;

export const StyledBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0em 2.5em 0em 2.5em;
  z-index: 1;
  width: min-content;
  margin-left: 19rem;
  &
    .MuiFormControl-root
    .MuiOutlinedInput-root
    .MuiOutlinedInput-notchedOutline {
    border-color: #0293fe77;
    width: 60%;
  }

  & .MuiSvgIcon-root {
    margin-right: 4em;
  }

  &
    .MuiFormControl-root:hover
    .MuiOutlinedInput-root
    .MuiOutlinedInput-notchedOutline {
    border-color: #0293febb;
  }

  &
    .MuiFormControl-root
    .MuiOutlinedInput-root.Mui-focused
    .MuiOutlinedInput-notchedOutline {
    border-color: #0293febb;
  }

  &
    .MuiFormControl-root
    .MuiOutlinedInput-root.Mui-focused:hover
    .MuiOutlinedInput-notchedOutline {
    border-color: #0293feff;
  }

  &
    .MuiFormControl-root
    .MuiOutlinedInput-root.Mui-focused
    .MuiOutlinedInput-input {
    background-color: white;
  }

  & .MuiFormControl-root .MuiInputLabel-root {
    color: #0293febb;
    font-weight: 600;
  }

  & .MuiFormControl-root:hover .MuiInputLabel-root {
    color: #0293feff;
    font-weight: 600;
  }
  @media (max-width: 768px) {
    display: flex;
    margin-left: 2em;
    padding: 1em 0 4em 0;
  }
  @media (min-width: 769px) and (max-width: ${(props) =>
      !props.isCollapsed ? "1320px" : "1100px"}) {
    display: flex;
    margin-left: 2em;
    padding: 1em 0 4em 0;
  }
`;

export const StyledBoxContext = styled(Box)``;

export const StyledBoxTrusted = styled(Box)`
  margin: 0.1em -5em;
`;
