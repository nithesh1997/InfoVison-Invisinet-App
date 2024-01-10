import {
  Button,
  CircularProgress,
  Radio,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import styled from "styled-components";
import Switch from "../../General/Switch";

export const AntSwitch = withStyles((theme) => ({
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
  RadioStyle: styled(Radio)`
    // &:hover {
    //   background: #018ff6;
    // }
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
};

export const CancelBtn = styled(Button)`
  margin: 0rem 1rem;
  width: 96px;

  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(237, 20, 61, 1);
  color: rgba(237, 20, 61, 1);
  height: 2.2rem;

  &:hover {
    background: rgba(237, 20, 61, 0.1);
  }

  &.MuiButton-root.Mui-disabled {
    background: transparent;
    border: 2px solid #30303020;
    color: #30303090;
  }
`;

export const ApplyBtn = styled(Button)`
  margin: 0rem 1rem;
  width: 96px;
  /* font-family: "Montserrat", sans-serif; */
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: #fff;
  background: #0094fd;
  height: 2.2rem;

  &:hover {
    background: #0094fd;
  }

  &.MuiButton-root.Mui-disabled {
    background: transparent;
    border: 2px solid #30303020;
    color: #30303090;
  }
`;
