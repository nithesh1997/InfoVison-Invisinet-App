import { Box, Button, Typography } from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 100vh;
  `,
  TextHead: styled(Typography)`
    /* font-family: Montserrat, sans-serif; */
    font-weight: 600;
    padding: 0em 0em 0.75em 0;
  `,
  SkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 1em 1em 0em;
  `,
  TrustLevelHolder: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    & > .MuiBox-root > .MuiCircularProgress-root,
    & > .MuiBox-root > .MuiBox-root {
      width: 2em !important;
      height: 2em !important;
    }
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

  StyledButton: styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    font-size: 0.85em;
    line-height: 0.85em;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 1em;
    border-radius: 0.35em;

    & .MuiButton-startIcon > *:first-child {
      font-size: 1.1em;
      line-height: 1.1em;
    }
  `,

  DataGridBox: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    width: 100%;
    padding: 1em 1.25em 1.5em 2.25em;

    & .IFV-DataGrid-action-bar {
      display: none;
    }
  `,
};

export default Styled;
