import { Box, Button, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../../General/ImageBanner";
import {
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
} from "@mui/material";

const Styled = {
  DialogBox: styled(Dialog)`
    &.MuiPaper-root {
      //width: 980px;
      display: flex;
      //flex-direction: column;
    }
  `,
  HeaderBox: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 0.4em;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);
  `,
  DialogTitle: styled(Typography)`
    &.MuiTypography-root {
      font-weight: 600;
      padding: 0 0 0 1em;
      font-family: "Inter";
    }
  `,
  CloseButton: styled(IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,
  DialogContent: styled(DialogContent)`
    &.MuiDialogContent-root {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  `,
  FormControlLabel: styled(FormControlLabel)`
    .MuiFormControlLabel-label {
      font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
      font-size: 13px;
      margin: 0.8rem 0;
      margin-left: 0.1rem;
    }
  `,
  SaveTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0.2em 0em 0.4em 1em;
      padding: 0.5em 0 0 0;
    }
  `,
  ListWrapper: styled(Box)`
    height: 100%;
    width: 100%;
    padding: 0.3rem 1rem;
  `,
  ListContainer: styled(Box)`
    height: 145px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;

    overflow-x: hidden;
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
  ConfigContainer: styled(Box)`
    width: 95%;
    height: 130px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin: auto 1em;
  `,
  FormControl: styled(FormControl)`
    &.MuiFormControl-root {
      border-bottom: 1px solid #e0e0e0;
      width: 100%;
    }
  `,
  FieldWrapper: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0rem 1rem;
    height: 98px;
  `,
  Rectangle: styled(Box)`
    border-style: dotted;
    width: 400px;
    height: 260px;
    border-radius: 0.5em;
    border-color: #eee;
    //margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
    word-break: break-all;
    margin: 1.5em auto;
  `,
  IconBox: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  IconWrapper: styled(Box)``,

  ImageBanner: styled(ImageBanner)`
    padding: 0.5em 0 0em 0;
  `,
  StyledTypographySize: styled(Box)`
    display: grid;
    place-items: center;
    margin: 1em auto;
  `,
  FileSizeText: styled(Typography)`
    background: #eeee;
    width: min-content;
    white-space: nowrap;
    padding: 0.1rem 0.8rem;
    /* font-family: Montserrat; */
    border-radius: 1rem;
    font-size: 12px;
  `,
  Typography: styled(Box)`
    width: 100%;
    border-radius: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-top: 0.5em;
  `,
  OrTypography: styled(Box)`
    width: 100%;
    border-radius: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #0094fd;
    margin-top: 0.5em;
  `,
  FileBtnBox: styled(Box)`
    margin: 0rem 0.5rem 0.2rem 0;
  `,
  FileBtn: styled.label`
    color: #ffffff;
    font-weight: bold;
    /* font-family: Montserrat; */
    background: #0094fd;
    font-size: 12px;
    width: 206px;
    margin: 0 0 1em 0;
    &:hover {
      background: #0074c7;
    }
  `,
  RescueTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0.2em 0em 0.4em 1em;
      padding: 0.5em 0 0 0;
    }
  `,

  SuccesContainer: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  SuccessTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 1em;
      font-weight: 600;
      // margin: 1em 0em 1em 1.5em;
      // padding: 0.5em 0 0 0;
    }
  `,
  SuccessSubTitle: styled(Typography)``,
  SuccessResponse: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 1em;
      font-weight: 600;
      margin: 1em 0em 1em 1.5em;
      padding: 0.5em 0 0 0;
      top: 1em;
    }
  `,
};

export default Styled;
