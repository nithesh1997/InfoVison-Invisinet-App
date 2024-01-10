import * as Mat from "@material-ui/core";
import styled from "styled-components";

export const StyledMat = {
  Wrapper: styled(Mat.Box)`
    background: ${({ isTransparent }) =>
      isTransparent ? "#00000000" : "#fff"};
    border-radius: 1rem;
    width: ${({ isSpinner }) => (isSpinner ? "500px" : "95vw")};
    height: ${({ isSpinner }) => (isSpinner ? "300px" : "80vh")};
    display: ${({ isSpinner }) => (isSpinner ? "grid" : "auto")};
    place-items: ${({ isSpinner }) => (isSpinner ? "center" : "auto")};
    /* display: ${({ isSpinner }) => (isSpinner ? "grid" : "none")}; */
  `,
  HeaderWrapper: styled(Mat.Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem 0 2rem;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    height: 64px;
  `,
  HeaderTitle: styled(Mat.Typography)`
    font-size: 1em;
    line-height: 1.4em;
    font-weight: 700;
    color: rgba(2, 147, 254, 1);
  `,
  CloseButton: styled(Mat.IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,
  ContentContainer: styled(Mat.Box)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    padding: 1em 1em 0 1em;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: auto;
  `,
  Spinner: styled(Mat.CircularProgress)`
    width: 180px !important;
    height: 180px !important;

    & .MuiCircularProgress-circleIndeterminate {
      stroke-width: 1;
    }

    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
  SingleEndpointWrapper: styled(Mat.Box)`
    width: 80%;
    height: 90%;
    display: grid;
    place-items: center;
  `,
  SingleEndpointText: styled(Mat.Typography)`
    color: "#DC143C";

    font-weight: 500;
  `,
  SingleEndpointAlertCloseButton: styled(Mat.Button)`
    &.MuiButton-root {
      font-weight: 500;
      text-transform: capitalize;
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
      min-width: 38px;
      height: 2.4rem;
      padding: 0 1rem;
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
  LoadingText: styled.img`
    top: 1.5em;
    width: 100px !important;
    height: 100px !important;
  `,
};
