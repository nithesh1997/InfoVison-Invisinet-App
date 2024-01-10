import styled from "styled-components";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { MoreVertRounded } from "@material-ui/icons";

const Styled = {
  SkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 1em 1em 0em;
  `,
  Wrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex-grow: 1;
    flex-wrap: nowrap;
    height: 100%;
    max-height: calc(100vh - 4.25em);
    overflow: auto;
  `,
  Header: styled(Box)`
    height: 64px;
    width: 100%;
    padding: 0 1em;
  `,
  ActionStripe: styled(Box)`
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    width: 96%;
    height: 72px;
    margin: 0 auto;
    justify-content: flex-start;
    gap: 2em;

    @media screen and (max-width: 1024px) {
      display: flex;
      gap: 20px;
      width: 100%;
    }
  `,
  ActionLoading: styled(Box)`
    display: flex;
    background: #f8f8f8;
    border-radius: 4px;
    width: 96%;
    height: 72px;
    margin: 0 auto;
    @media screen and (max-width: 1024px) {
      display: flex;
      gap: 20px;
      width: 100%;
    }
  `,
  LoadingWrapper: styled(Box)`
    margin: 0 auto;
    width: 100%;
    height: 100%;
  `,
  TextWrapper: styled(Box)`
    height: 60px;
    width: 100%;
    padding: 0 2rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    //background: red;
  `,
  StripeTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 1em;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
      @media (min-width: 321px) and (max-width: 1024px) {
        font-size: 0.8em;
        font-weight: 600;
      }
    }
  `,
  StripeSubTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 0.9em;
      font-weight: 500;
      padding: 0.5em 0 0 0;
      @media (min-width: 321px) and (max-width: 1024px) {
        font-size: 0.8em;
        font-weight: 500;
      }
    }
  `,

  ButtonsWrapper: styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 1em;
    height: 40px;
    width: 97%;
    margin: 1em 0em 0 1em;
    justify-content: flex-start;
    gap: 2em;
  `,
  TitleWrapper: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0.6em;
    height: 40px;
  `,
  TiltleText: styled(Typography)`
    &.MuiTypography-root {
      font-weight: 600;
      font-family: Inter;
      font-size: 14px;
      line-height: 17.07px;
    }
  `,
  ButtonsTableWrapper: styled(Box)`
    display: flex;
    position: absolute;
    z-index: 1000;
    right: 0%;
    margin: 4px 40px;
    align-items: center;
    gap: 1em;
  `,
  DataGridBox: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    border-radius: 1em;
    width: 98%;
    padding: 0.5em 1.25em 0.5em 1.25em;
    margin: 1em 1em;
    //box-shadow: 0px 0px 8px 2px #ccc;
    & .IFV-DataGrid-action-bar {
      margin-left: 15em;
    }
  `,
  Menu: styled(Menu)`
    & .MuiPaper-root {
      box-sizing: border-box;
      min-width: 8em;
      max-width: 25em;
    }

    &.MuiPopover-root {
      display: ${({ theme }) => (theme.display ? "inherit" : "none")};
    }

    & .MuiMenu-list {
      padding: 0em;
    }

    & .MuiButton-text {
      padding: 0.75em 1em;
      color: #000;
      text-transform: capitalize;
    }

    & .MuiButton-startIcon {
      margin-right: 0.75em;
    }
  `,
  TableDivider: styled(Divider)`
    &.MuiDivider-root {
      margin: 2em auto 0em;
      width: 100%;
      border: 1px solid #e0e0e0;
    }
  `,
  MenuButtonWrapper: styled(Box)`
    width: 100%;
  `,
  MenuButton: styled(Button)`
    /* font-family: "Montserrat"; */
    text-transform: capitalize;
    /* height: 2.4rem; */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1rem;
    word-wrap: break-word;
    text-align: left;

    &:hover {
      background: #0293fe20;
      /* color: #f9f9f9; */
    }

    &.MuiButton-root.Mui-disabled {
      background: #fff;
      border: 0px solid #30303020;
    }

    & .MuiButton-startIcon .MuiSvgIcon-root {
      //color: rgb(2, 147, 254);
      // width: 1em;
      // height: 1em;
    }

    &.MuiButton-root.Mui-disabled .MuiButton-startIcon .MuiSvgIcon-root {
      color: rgba(2, 147, 254, 0.2);
    }
  `,
  Modal: styled(Dialog)``,
  Content: styled(DialogContent)``,

  TableTitleWrapper: styled(Box)`
    position: fixed;
    top: 18.5em;
    box-sizing: border-box;
    width: 80%;
    // background: red;
  `,
  TableTitle: styled(Typography)`
    &.MuiTypography-root {
      font-family: Inter;
      font-weight: 600;
      margin: 0 0 0 0.5em;
    }
  `,
};

export default Styled;
