import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../../../General/ImageBanner";

const Styled = {
  StyledSkeletonHolder: styled(Box)`
    padding: 1em;
    margin-bottom: -1em;
  `,
  StyledBox: styled(Box)`
    display: grid;
    border-radius: 0.8em;
    height: 275px;
    width: 55%;
    // border: 0.05rem solid #e0e0e0;
    box-sizing: border-box;
    margin: 2rem 1rem 0rem 1rem;
    padding: 0 0 1.5em 0;
    box-shadow: 0em 0em 3em rgb(0 0 0 / 10%);
    @media (max-width: 768px) {
      width: 50%;
      margin-right: 10px;
    }
    @media (max-width: 1024px) {
      width: 50%;
      margin-right: 10px;
    }
    @media (max-width: 1200px) {
      width: 50%;
      margin-right: 10px;
    }
  `,
  StyledTitle: styled(Typography)`
    width: 100%;
    padding: 1em 0em 0em 1.5em;
    font-weight: 600;
    font-size: 13px;
    /* font-family: Montserrat; */
    color: #212529;
  `,
  StyledlistItem: styled(Box)`
    color: #000000;
    padding: 0 0 0 0.7em;
    /* font-family: Montserrat; */
    font-weight: 500;
    display: flex;
    flex-direction: row;
  `,
  StyledBoxItem: styled(Box)`
    display: flex;
    flex-direction: row;
    margin: 1.5em 0.75em 0 1.2em;
    word-break: break-all;
  `,
  StyledImage: styled(ImageBanner)`
    padding: 0;
    margin: 0;
    width: 22px;
    height: 22px;
  `,
  ScrollContainer: styled(Box)`
    width: 100%;
    overflow-x: hidden;

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
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */
  `,
};

export default Styled;
