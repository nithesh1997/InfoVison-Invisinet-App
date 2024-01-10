import { Box, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";

export const Styled = {
  Typo: styled(Typography)`
    color: rgba(2, 147, 254, 1);
    font-weight: 550;
    /* font-family: Montserrat; */
    font-size: 1.2em;
  `,
  WrapperTwo: styled(Box)`
    padding: 0.1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid rgba(2, 147, 254, 1);
    font-weight: 600;
  `,
  NewWrapper: styled(Box)`
    width: 600px;
    height: 400px;
    background: rgb(255, 255, 255);
    border-radius: 0.75em;
  `,
  Wrapper: styled(Box)`
    width: 100%;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
  `,
  PreProcessTableWrapper: styled(Box)`
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  `,
  EligibleTableWrapper: styled(Box)`
    width: 40%;
    height: 100%;
  `,
  NotEligibleTableWrapper: styled(Box)`
    width: 40%;
    height: 100%;
  `,
  ActionWrapper: styled(Box)`
    width: 100%;
    height: 20%;
    display: grid;
    place-items: center;
  `,
  ActionSubWrapper: styled(Box)`
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  `,
  Modal: styled(Box)`
    width: 180%;
  `,
  TitleWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  ListItemText: styled(Typography)`
    position: relative;
    /* font-family: Montserrat, sans-serif; */
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    padding: 0.8rem 0.8rem;

    & span {
      background: #fff;
    }
  `,
  TableWrapper: styled(Box)`
    /* font-family: "Montserrat", sans-serif; */
    box-sizing: border-box;
    margin: 2em auto;
    flex-direction: column;
    border: 1px solid #0094fd;
    border-radius: 8px;
    width: 80%;
    height: calc(90% - 5em);
    overflow: hidden;
  `,
  Table: styled("table")`
    width: 100%;
    border-collapse: collapse;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  TableHeadWrapper: styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-shrink: 0;
    border-top-right-radius: 8px;

    overflow: scroll;
    overflow: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
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
  TableBodyWrapper: styled("div")`
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;

    & > tr:nth-child(2n) {
      background: #9cade910;
    }

    overflow-y: scroll;

    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.4rem;
      height: 0.4rem;
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
  TableRow: styled("tr")`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  `,
  TableHead: styled("thead")`
    flex-shrink: 0;
    font-weight: 600;
    background: #fff;
    color: #0094fd;

    & > td {
      border-bottom: 0.1em solid #0094fd;
    }
  `,
  TableHeadCell: styled("td")`
    font-size: 13px;
    border-bottom: 1px solid #0094fd;
    padding: 0.8em;
  `,
  TableBody: styled("tbody")`
    flex-grow: 1;
    position: relative;
    width: 100%;
  `,
  TableBodyCell: styled("td")`
    border-bottom: 1px solid #acdbfe;
    padding: 0.2em 1em;
    color: ${({ theme }) =>
      theme.isAlready ? "#333" : theme.error ? "#FD3C49" : "#000000DE"};

    & .MuiTypography-root {
      font-size: 13px;
      font-weight: ${({ theme }) => (theme.error ? 600 : 400)};
    }

    overflow-wrap: break-word;
  `,
};
