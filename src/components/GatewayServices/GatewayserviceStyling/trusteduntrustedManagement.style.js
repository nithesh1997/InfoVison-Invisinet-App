import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../../General/ImageBanner";
export const Styled = {
  StyledImages: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  StyledErrorLogo: styled(ImageBanner)`
    padding: 2em 0 0 0;
    margin: 0 0 0 1em;
  `,
  Toolertip: styled(Tooltip)`
    &.Mui-disabled {
      pointer-events: auto;
    }
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #2d7ee9;
    }
  `,
  StyledContainer: styled(Box)`
    height: 100vh;
    overflow-y: scroll;
    overflow-y: overlay;
  `,

  SaveButtonComponent: styled("button")`
    float: right;
    box-shadow: none !important;
    color: #fff;
    width: 6rem;
    height: 2rem;
    cursor: pointer;
    /* font-family: "Montserrat", sans-serif; */
    color: #fff;
    border: 1px solid transparent;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 0.25rem;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    margin-right: 8px;
    line-height: 32px;
    font-size: 14px;
    font-weight: bold;
    outline: none !important;
    box-shadow: none !important;
    background-color: #018ff6;
    border-color: #018ff6;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    float: right !important;
    &:hover {
      background: #1e6ee4;
      color: #fff;
    }

    &[disabled] {
      opacity: 0.6;
      pointer-events: none;
    }
  `,

  StyledIasDivComponent: styled("div")`
    border-right: ${(props) =>
      props.noBorderRight ? "none" : "1px solid #e0e0e0"};
    width: 100%;
  `,

  StyledBodyLabelComponent: styled("label")`
    width: calc(100% - 50px);
    font-weight: 700;
  `,

  StyledIasSpanComponent: styled("span")`
    font-weight: 600;
    float: right;
    margin-right: 10px;
  `,

  StyledDivIdentitiesWrapper: styled("div")`
    width: calc(100% - 120px);
    float: left;
    min-height: 12px;
    padding-left: 0 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  `,

  StyledBodyWrapper: styled("div")`
    display: flex;
    flex-wrap: wrap;
    /* font-family: "Montserrat", sans-serif; */
    font-size: 13px;
    margin-top: 1rem;
    /* @media screen and (max-width: 768px) {
      display: flex;
      flex-direction: row;
    } */
  `,

  StyledBodyComponent: styled("div")`
    flex: 0 0 auto;
    width: 50%;
    @media screen and (max-width: 768px) {
      min-width: 100%;
      margin-bottom: 0rem;
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      min-width: 100%;
      margin-bottom: 0rem;
    }
    margin-bottom: 4rem;
  `,

  StyledBodyTopComponent: styled("div")`
    margin-left: 1.5rem;
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
  `,

  StyledPComponent: styled("div")`
    font-weight: 700 !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
    font-size: 14px;
    //float: left !important;
  `,

  StyledHeaderComponent: styled("div")`
    background: #eff2f7;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    padding-right: 1rem !important;
    padding-left: 1rem !important;
  `,

  StyledFormWrapper: styled("div")`
    display: block;
    border: 1px solid #e0e0e0;
    padding-bottom: 1rem !important;
    padding-top: 0.25rem !important;
    padding-right: 1rem;
    padding-left: 1rem;
    /* font-family: "Montserrat", sans-serif; */
    font-size: 13px;
  `,

  StyledTableWrapper: styled("div")``,

  StyledTableComponent: styled("table")`
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    vertical-align: top;
    border-color: #dee2e6;
  `,

  StyledTbodyComponent: styled("tbody")`
    border-color: inherit;
    border-style: solid;
    display: table-row-group;
    border-width: 0;
    caption-side: bottom;
    border-collapse: collapse;
    /* font-family: "Montserrat", sans-serif; */
    font-size: 13px;
  `,

  StyledTrComponent: styled("tr")`
    border-color: inherit;
    border-style: solid;
    border-width: 0;
    border-collapse: collapse;
  `,

  StyledTdComponent: styled("td")`
    vertical-align: middle;
    font-size: 12px;
    padding: 8px 16px;
    border-right: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    border-bottom-width: 1px;
  `,

  StyledTableH6Component: styled("h6")`
    font-size: 11px;
    margin: 7px 0 5px;
    font-weight: 700 !important;
    line-height: 1.2;
  `,

  StyledTablePComponent: styled("p")`
    font-size: 12px;
    margin-bottom: 0 !important;
    margin-top: 0;
  `,
};
