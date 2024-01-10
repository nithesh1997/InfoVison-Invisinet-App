import { Box, Button, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../../General/ImageBanner";

export const Styled = {
  Wrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0 0 0;

    overflow-y: scroll;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.7em;
      height: 0.7em;
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
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */

    /*
  &::-webkit-scrollbar {
    display: none;
  }


  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
  `,
  StyledBox: styled(Box)`
    height: 480px;
    width: 500px;
    background: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 1em;
  `,

  CloseButton: styled(IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,

  IconWrapper: styled(Box)`
    // background: red;
  `,

  StyledImageBanner: styled(ImageBanner)`
    padding: 0.5em 0 0em 0;
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

  StyledTypography: styled(Box)`
    width: 100%;
    border-radius: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  `,

  StyledTypographySize: styled(Box)`
    display: grid;
    place-items: center;
  `,

  StyledIcnTypo: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  StyledHead: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 0.4em;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
  `,

  StyledRectangle: styled(Box)`
    border-style: dotted;
    width: 450px;
    height: 280px;
    border-radius: 0.5em;
    border-color: #eee;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
    word-break: break-all;
  `,

  FileBtn: styled.label`
    color: #ffffff;
    font-weight: bold;
    /* font-family: Montserrat; */
    background: #0094fd;
    font-size: 12px;
    width: 206px;
    margin: 0 0 0 0;
    &:hover {
      background: #0074c7;
    }
  `,

  StyledError: styled(Box)`
    color: #cc0000;
    display: block;
    font-size: 13px;
    height: 18px;
  `,
  StyledButtonTwo: styled(Button)`
    margin: 0rem 1rem;
    /* font-family: "Montserrat", sans-serif; */
    border: 0.1em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);

    &:disabled {
      border: 0.1em solid rgba(0, 0, 0, 0.2);
    }

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }
  `,
  StyledCancel: styled(Button)`
    /* font-family: "Montserrat", sans-serif; */
    border: 0.1em solid rgba(237, 20, 61, 1);
    color: rgba(237, 20, 61, 1);

    &:hover {
      background: rgba(237, 20, 61, 0.1);
    }
    &:disabled {
      border: 0.1em solid rgba(0, 0, 0, 0.2);
    }
  `,
};
