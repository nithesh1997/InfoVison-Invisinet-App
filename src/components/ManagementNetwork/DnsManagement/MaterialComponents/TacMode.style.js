import { Box, Button, Paper, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import CheckIcon from "@material-ui/icons/Check";
import styled from "styled-components";

const Styled = {
  StyledClipLoaderContainer: styled(Box)`
    opacity: ${(props) => (props.loading ? 1 : 0)};
  `,
  StyledSkeletonHolder: styled(Box)`
    padding: 1em 1.3em 1em 0.1em;
  `,
  StyledBox: styled(Box)`
    display: grid;
    padding-left: 1.5em;
    padding-bottom: 1.5em;
    height: 275px;
    width: 60%;
    box-shadow: 0em 0em 3em rgb(0 0 0 / 10%);
    border-radius: 0.8em;
    box-sizing: border-box;
    margin: 2rem 1rem 0rem 1rem;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      width: 97%;
    }
    @media (max-width: 1024px) {
      display: flex;
      flex-direction: column;
      width: 97%;
    }
    @media (max-width: 1200px) {
      display: flex;
      flex-direction: column;
      width: 97%;
    }
  `,
  StyledTitle: styled(Box)`
    width: 100%;
    padding: 1em 0em 0em 0em;
    font-weight: 600;
    /* font-family: Montserrat; */
    font-size: 14px;
  `,
  StyledOuterBox: styled(Box)`
    height: 80%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `,
  StyledCheck: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
    margin: 1em 0em 0.5em 0em;
    border-radius: 0.5em;
    background-color: transparent;
    cursor: ${(props) => (props.cursor ? "pointer" : "default")};
    pointer-events: ${(props) => (props.cursor ? "all" : "none")};

    &:hover {
      background-color: #f1f1f1;
    }

    &.selected > button {
      background: #69c536;
    }

    &.selected > div > svg {
      stroke: #69c536;
      color: #69c536;
    }

    &.selected > div {
      border-color: #69c536;
    }

    &.active > div > svg {
      stroke: #4ed4cf;
      color: #4ed4cf;
    }

    &.active > div {
      border-color: #4ed4cf;
    }

    &.active > button {
      background: #4ed4cf;
    }
  `,
  StyledBoxMode: styled(Paper)`
    width: 4.5em;
    height: 4.5em;
    border: 0.3em solid #bababa;
    border-radius: 50%;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
  `,
  StyledIcon: styled(CheckIcon)`
    font-size: 3em;
    color: #bababa;
    stroke: #bababa;
    stroke-width: 1.5;
    opacity: 0.85;

    &:hover {
      opacity: 1;
    }
  `,
  ButtonMode: styled(Button)`
    font-weight: bold;
    margin: 0.6rem 0rem;
    background-color: #bababa;
    color: #ffffff;
    box-shadow: none;
    width: 96px;
    text-transform: capitalize;
    &:hover {
      background-color: #bababa;
      box-shadow: none;
    }
  `,
  StyledBottom: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 1em 0em 0em 0em;
    padding-right: 1em;
  `,
  StyledBottomText: styled(Typography)`
    width: 100%;
    color: #212529;
    font-weight: 400;
    /* font-family: Montserrat; */
    font-size: 1em;
    display: flex;
    text-align: left;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow-wrap: break-word;

    /* @media (min-width: 1201px) {
      display: none;
    } */
  `,
  EditButton: styled(Button)`
    /* font-family: Montserrat; */
    font-size: 14px;
    font-weight: bold;

    color: #ffffff;
    background: #018ff6;
    border: 1px solid #018ff6;

    margin: 0em 0.5em;
    padding: 0.35em 0.5em;

    &:hover {
      color: #ffffff;
      background: #0d47a1;
      border: 1px solid #0d47a1;
    }

    &.MuiButton-root.Mui-disabled {
      background: #fff;
      border: 1px solid #b9baba;
    }
  `,
  ButtonBox: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-left: 0.5em;
    gap: 0.5em;
  `,
  ApplyButton: styled(Button)`
    color: #ffffff;
    font-weight: bold;
    /* font-family: Montserrat; */
    font-size: 14px;
    background: #018ff6;
    font-size: 14px;
    width: 96px;
    margin: 0em 0.5em;

    &:hover {
      background: #0d47a1;
    }

    &:disabled {
      color: white;
      opacity: 0.6;
    }
  `,
  CancelButton: styled(Button)`
    color: #000000;
    border: black 1px solid;
    font-weight: bold;
    /* font-family: Montserrat; */
    font-size: 14px;
    background: transparent;
    font-size: 14px;
    width: 96px;
    margin: 0em 0.5em;

    &:hover {
      background: #eee;
    }
  `,
  StyledDividerOne: styled(Divider)`
    margin: 0.6em 0 0 0;
    height: 12em;
    background-color: #e3f2fd;
  `,
  StyledDividerTwo: styled(Divider)`
    margin: 0.6em 0 0 0;
    height: 12em;
    background-color: #e3f2fd;
  `,
  StyledDividerThree: styled(Divider)`
    width: 95%;
    background-color: #e3f2fd;
  `,
  StyledSaved: styled(Typography)`
    color: #69c536;
    /* font-family: Montserrat; */
    font-size: 1em;
    font-weight: 600;
  `,
};

export default Styled;
