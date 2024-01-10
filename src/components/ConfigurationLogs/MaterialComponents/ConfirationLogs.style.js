import styled from "styled-components";
import { Box, Typography } from "@mui/material";

const Styled = {
  SkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 1em 1em 0em;
  `,
  Header: styled(Box)`
    height: 64px;
    width: 100%;
    padding: 0 1em;
  `,
  Container: styled(Box)`
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
  ActionLoading: styled(Box)`
    display: flex;
    height: 52px;
    background: #e0e0e0;
    width: 96%;
    height: 60px;
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

  TableTitleWrapper: styled(Box)`
    //height: 60px;
    width: 100%;
    padding: 1em 0;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    //background: red;
  `,
  DataGridBoxTitle: styled(Typography)`
    &.MuiTypography-root {
      color: #000;
      font-size: 1.25em;
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
  DataGridBox: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    width: 100%;
    padding: 1em 2em;

    & .IFV-DataGrid-action-bar {
      display: none;
    }
  `,
};

export default Styled;
