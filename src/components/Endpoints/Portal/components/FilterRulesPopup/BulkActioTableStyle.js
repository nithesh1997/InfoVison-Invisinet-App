import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";

const StyledButton = styled(Button)`
  &.MuiButton-root {
    text-transform: capitalize;
    min-width: 38px;
    height: 2.4rem;
    padding: 0 1rem;
  }
`;

const FitlerButton = styled(Button)`
  padding: 0.25em;

  & .MuiSvgIcon-root {
    width: 0.85em;
    height: 0.85em;
  }
`;

export const Styled = {
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
  FilterWrapper: styled(Box)`
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 40%;
  `,
  SuccessFilterButton: styled(FitlerButton)`
    color: ${({ theme }) => (theme.isSelected ? "#f0f0f0" : "#10b981")};
    background: ${({ theme }) => (theme.isSelected ? "#10b981" : "#10b98100")};
    border: 2px solid #10b981;

    &:hover {
      background: ${({ theme }) =>
        theme.isSelected ? "#10b981" : "#10b98100"};
    }

    & .MuiTouchRipple-child {
      background: #16ffb1;
    }
  `,
  FailureFilterButton: styled(FitlerButton)`
    color: ${({ theme }) => (theme.isSelected ? "#f0f0f0" : "#fd3c49")};
    background: ${({ theme }) => (theme.isSelected ? "#fd3c49" : "#fd3c4900")};
    border: 2px solid #fd3c49;

    &:hover {
      background: ${({ theme }) =>
        theme.isSelected ? "#fd3c49" : "#fd3c4900"};
    }

    & .MuiTouchRipple-child {
      background: #ff563c;
    }
  `,
  Content: styled(DialogContent)`
    height: 400px;
  `,
  Message: styled(DialogContentText)`
    &.MuiDialogContentText-root {
      color: ${({ theme }) => (theme.error ? "#FD3C49" : "#232323")};
    }
  `,
  ListedMessage: styled(DialogContentText)`
    flex-direction: column;
    /* font-family: "Montserrat", sans-serif; */
    width: 100%;
    height: 300px;
    padding: 0 5%;

    overflow-y: scroll;
    overflow-y: overlay;
    box-shadow: inset 0px 11px 8px -10px #ccc, inset 0px -11px 8px -10px #ccc;

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
  Span: styled.span`
    position: absolute;
    top: -20%;
    /* font-family: monospace, "Montserrat", sans-serif; */
    font-size: 0.8rem;
    box-sizing: border-box;
    min-width: 1rem;
    min-height: 1rem;
    padding: 0.1rem 0.2rem;
    margin: 0 0.4rem;
    background: ${({ theme }) => (theme.error ? "#FD3C4920" : "#10B98120")};
    color: ${({ theme }) => (theme.error ? "#FD3C49" : "#10B981")};
    border: 1px solid ${({ theme }) => (theme.error ? "#FD3C49" : "#10B981")};
    border-radius: 2px;
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
  Actions: styled(DialogActions)`
    padding: 0.75em 1em 1em 1em;
  `,
  AcceptButton: styled(StyledButton)`
    &.MuiButton-root {
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
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
  RejectButton: styled(StyledButton)`
    &.MuiButton-root {
      border: 2px solid #fd3c49;
      background: #fd3c49;
      color: #fff;
    }

    &.MuiButton-root:hover {
      border: 2px solid #ca2f3a;
      background: #ca2f3a;
      color: #fff;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }

    & .MuiTouchRipple-child {
      background: #d14574;
    }
  `,
  CloseButton: styled(StyledButton)`
    &.MuiButton-root {
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
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

  TableWrapper: styled(Box)`
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    /* font-family: "Montserrat", sans-serif; */
    /* width: 100%;
      height: 300px; */
    margin-top: 0.3rem;
    border-radius: 8px;
    box-shadow: 0px 0px 8px 2px #ccc;

    width: 100%;
    /* max-height: 240px; */
    height: calc(100% - 5em);

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

    overflow-y: scroll;
    overflow-x: scroll;

    overflow-y: overlay;
    overflow-x: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
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
    /* height: 200px; */

    /* & > tr:nth-child(2n) {
        background: #f1fdfc;
      } */

    overflow-y: scroll;
    overflow-x: scroll;

    overflow-y: overlay;
    overflow-x: overlay;

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
    color: rgba(2, 147, 254, 1);

    & > td {
      border-bottom: 0.1em solid rgba(2, 147, 254, 1);
    }
  `,
  TableHeadCell: styled("td")`
    padding: 0.8em;
    border-bottom: 1px solid rgba(2, 147, 254, 1);
    padding: 1em;
    font-size: 12px;
  `,
  TableBody: styled("tbody")`
    flex-grow: 1;
    position: relative;
    width: 100%;
  `,
  TableBodyCell: styled("td")`
    padding: 0.8em;
    border-bottom: 1px solid #2d7ee940;
    padding: 0.2em 0.4em;
    color: ${({ theme }) =>
      theme.isAlready ? "#333" : theme.error ? "#FD3C49" : "#000000DE"};

    & .MuiTypography-root {
      font-weight: ${({ theme }) => (theme.error ? 600 : 400)};
    }
  `,
};
