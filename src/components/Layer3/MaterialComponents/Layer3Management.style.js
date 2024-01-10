import {
  Box,
  FormControlLabel,
  Radio,
  Switch,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { CircularProgress, Divider } from "@mui/material";
import styled from "styled-components";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#8fdc6a",
        border: "1px solid rgba(0,0,0,.25)",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: "1px solid rgba(0,0,0,.25)",
    borderRadius: "2rem",
    opacity: 1,
    backgroundColor: "#C1C4CE",
  },
  checked: false,
}))(Switch);

export const Styled = {
  Header: styled(Box)`
    height: 64px;
    width: 100%;
  `,
  Wrapper: styled(Box)`
    align-items: start;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: start;
    margin-left: "25px";
    max-height: calc(100vh - 4.25em);
  `,
  ActionStripe: styled(Box)`
    background: #f8f8f8;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
    margin: 1em 0 0 0;
    padding: 0.75em 2em 0.75em 2.25em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,
  StripeSegment: styled(Box)`
    width: 480px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
  `,
  Layer3ServiceWrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding-right: 1em;
  `,
  Layer3ServiceComponents: styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
      display: flex;
      justify-content: space-evenly;
    }
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #2d7ee9;
    }
  `,
  ActionStripeTitle: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
    width: 5em;
    color: ${({ theme }) => theme.color};
    font-size: 1em;
  `,
  ToggleSwitchWrapper: styled(Box)`
    width: 15em;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    @media (max-width: 768px) {
      width: 10em;
      align-items: center;
    }
  `,
  ToggleSwitchText: styled(Typography)`
    font-size: 0.9em;
    font-weight: 600;
    /* font-family: "Montserrat"; */
    margin: 0 1em;
    color: ${({ theme }) => theme.color};
  `,
  ToggleSwitch: styled(AntSwitch)``,
  StatusTextWrapper: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0.5em;
  `,
  StatusText: styled(Typography)`
    font-size: 0.8em;
    text-align: left;
    /* font-family: "Montserrat"; */
    font-weight: 600;
    color: ${({ theme }) => theme.color};

    & ul {
      margin: 0.25em 0em;
      padding-left: 2em;
    }
  `,
  Divider: styled(Divider)``,
  ActionItemsWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  ToggleWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,
  TableWrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    padding: 0em 2em 1em 2.25em;
    width: 100%;
  `,
  TableTitleWrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    height: min-content;
    padding: 1em 2em 0.5em 2.25em;
  `,
  TableTitle: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
  `,
  RadioGroupWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 200px;
    margin: 0 1rem;

    & .MuiTypography-body1 {
      /* font-family: Montserrat; */
      font-family: Inter;
      font-size: 0.875rem;
      font-weight: 600;
    }
  `,
  RadioText: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-size: 0.8rem;
    font-weight: 600;
  `,
  RadioButton: styled(Radio)`
    padding: 0.4rem;
    margin: 0 0.3rem 0 1rem;

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    &.Mui-checked:hover {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiSvgIcon-root {
      fill: rgba(2, 147, 254, 1);
    }
  `,
  LayerLabels: styled(FormControlLabel)``,
  LoadingWrapper: styled(Box)`
    margin: 0 1em 0 0;
    width: 20em;
  `,
};
