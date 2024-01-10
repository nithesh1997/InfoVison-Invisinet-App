import {
  Box,
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";

export const Styled = {
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
  ActionCancel: styled(Button)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
    width: 120px;
    background: rgba(2, 147, 254, 0);
    border-color: black;

    &.MuiButton-root.Mui-disabled {
    }

    &:hover {
      background: rgba(2, 147, 254, 0);
    }

    & .MuiTouchRipple-child {
      background: rgba(0, 0, 0, 0.4);
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: rgba(2, 147, 254, 1);
    }
  `,
  ActionContinue: styled(Button)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
    width: 120px;
    background: #0094fd;
    color: #f0f0f0;

    &.MuiButton-root.Mui-disabled {
    }

    &:hover {
      background: #0175cb;
    }

    & .MuiTouchRipple-child {
      background: #0094fd;
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: #0094fd;
    }
  `,
  Modal: styled(Box)`
    width: 180%;
  `,
  TitleWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  Title: styled(DialogTitle)`
    & * {
      /* font-family: Montserrat; */
    }
  `,
  Content: styled(DialogContent)`
    height: 400px;
  `,
  Message: styled(DialogContentText)`
    &.MuiDialogContentText-root {
      /* font-family: "Montserrat"; */
      font-weight: 600;
      color: ${({ theme }) => (theme.error ? "#FD3C49" : "#232323")};
    }
  `,
  ListItemText: styled(Typography)`
    position: relative;
    /* font-family: "Montserrat", sans-serif; */
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    padding: 0.8rem 0.8rem;

    & span {
      background: #fff;
    }
  `,
  Divider: styled(Divider)`
    &.MuiDivider-root {
      margin: 1rem 0;
    }
  `,
  TableWrapper: styled(Box)`
    /* font-family: "Montserrat", sans-serif; */
    box-sizing: border-box;
    position: relative;
    flex-direction: column;
    border: 1px solid #0094fd;
    border-radius: 8px;
    width: 100%;
    height: calc(100% - 5em);
    margin-top: 0.3rem;
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
    padding: 0.2em 0.4em;
    color: ${({ theme }) =>
      theme.isAlready ? "#333" : theme.error ? "#FD3C49" : "#000000DE"};

    & .MuiTypography-root {
      font-size: 13px;
      font-weight: ${({ theme }) => (theme.error ? 600 : 400)};
    }

    overflow-wrap: break-word;
  `,
};
