import { Box, Button, Paper, Typography } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../../General/ImageBanner";

const Styled = {
  StyledWidthFillerSkeleton: styled(Box)`
    padding: 1em 1.25em 1.5em 2.25em;
    width: 100%;
  `,
  StyledImageBanner: styled(ImageBanner)`
    z-index: 1;
  `,
  StyledBox: styled(Box)`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: 100%;
    padding: 0em 2em;
    box-sizing: border-box;
  `,
  ScrollingWrapper: styled(Box)`
    overflow-x: hidden;
    height: 20%;
    width: 95%;

    overflow-y: scroll;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.5em;
      height: 0.5em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 73, 122, 0);
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track:hover {
      background: rgba(0, 73, 122, 0);
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0.8)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 1)"};
    }
    /* Chrome & Edge */
  `,
  GlobalWrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 10em;
    padding: 1em 0.5em;
    border-radius: 0.5em;
    margin: 0.5em 0.25em;
    pointer-events: ${(props) => (props.cursor ? "all" : "none")};
    cursor: ${(props) => (props.cursor ? "pointer" : "default")};

    &:hover {
      background-color: rgba(96, 96, 96, 0.1);
    }

    &:hover > div > div {
      background-color: rgba(96, 96, 96, 0.2);
    }

    &:hover > div:last-child {
      background-color: rgba(36, 36, 36, 1);
    }

    &.unselected {
      background: rgba(255, 191, 0, 0.1);
    }

    &.unselected > div > div {
      background: rgba(255, 191, 0, 0.4);
    }

    &.unselected > div:last-child {
      background: rgba(255, 191, 0, 1);
    }

    &.unselected:hover {
      background-color: rgba(96, 96, 96, 0.1);
    }

    &.unselected:hover > div > div {
      background-color: rgba(96, 96, 96, 0.2);
    }

    &.unselected:hover > div:last-child {
      background-color: rgba(36, 36, 36, 1);
    }

    &.selected {
      cursor: default;
      pointer-events: none;
      background: rgba(1, 143, 246, 0.1);
    }

    &.selected > div > div {
      background: rgba(1, 143, 246, 0.4);
    }

    &.selected > div:last-child {
      background: rgba(1, 143, 246, 1);
    }
  `,
  StyledPaper: styled(Paper)`
    height: 2em;
    width: 7em;
    border-radius: 5em 5em;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -1.5em;
    padding-left: 1.5em;
  `,
  ImageLevelBox: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  StyledTypography: styled(Typography)`
    font-size: 1em;
    /* font-family: Montserrat, sans-serif; */
    font-weight: 500;
    text-align: center;
  `,
  StyledTextHead: styled(Typography)`
    padding: 1em 1.25em 0.5em 2.25em;
    /* font-family: Montserrat, sans-serif; */
    font-weight: 600;
  `,
  StyledPaper2: styled(Paper)`
    height: 0.25em;
    width: 100%;
    border-radius: 5em 5em;
    margin: 1em 0 0 0;
    background: grey;
    border: none;
    box-shadow: none;
    opacity: 0.5;

    &.selected {
      background: blue;
    }
  `,
  StyledBoxHeader: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `,
  StyledButton: styled(Button)`
    margin: 0 2em 0 0;
    color: #ffffff;
    margin: 0em 0.5em;
    padding: 0.35em 0.5em;
    font-weight: bold;
    /* font-family: Montserrat; */
    font-size: 1em;
    background: #018ff6;
    font-size: 14px;

    &:hover {
      background: #0d47a1;
    }
  `,
  StyledTextandButtonHandler: styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 2em 0 0;
  `,
  StyledGlobalModeText: styled(Typography)`
    margin-right: 1em;
    font-size: 1em;
    @media (max-width: 768px) {
      display: none;
    }
  `,
  ApplyButton: styled(Button)`
    margin-right: 1em;
    color: #ffffff;
    font-weight: bold;
    /* font-family: Montserrat; */
    font-size: 1em;
    background: #018ff6;
    font-size: 1em;
    width: 96px;
    margin-left: 0.5em;

    &:hover {
      background: #0d47a1;
    }

    &:disabled {
      color: white;
      opacity: 0.6;
      background: #018ff6;
    }
  `,
  CancelButton: styled(Button)`
    color: #000000;
    border: black 1px solid;
    font-weight: bold;
    /* font-family: Montserrat; */
    font-size: 14px;
    background: transparent;
    font-size: 1em;
    width: 96px;

    &:hover {
      background: #eee;
    }
  `,
  ButtonGroup: styled(Box)`
    margin: 0 0em 0 0;
    display: flex;
    align-items: center;
    gap: 1em;
    /* gap: 10px; */
  `,
  StyledMsg: styled(Typography)`
    color: #69c536;
    /* font-family: Montserrat; */
    font-size: 1em;
    font-weight: 600;
  `,
  StyledErr: styled(Typography)`
    color: red;
    /* font-family: Montserrat; */
    font-size: 1em;
    font-weight: 600;
  `,
};

export default Styled;
