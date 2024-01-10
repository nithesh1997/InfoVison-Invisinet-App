import { Typography, Box } from "@material-ui/core";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import styled from "styled-components";

export const Styled = {
  BoxWrapper: styled(Box)`
    display: flex;
    flexdirection: column;
    alignitems: center;
  `,
  Wrapper: styled(Box)`
    position: relative;
  `,
  Typo: styled(Typography)`
    color: #0094fd;
  `,
  //   CircularProgressOuter: styled(CircularProgress)`
  //     color: #e3e3e3;
  //   `,
  CircularProgressInner: styled(CircularProgress)`
  color: #0094FD;
  animationDuration: 990ms;
  position: absolute;
  left: 0;
  "& .${circularProgressClasses.circle}": {
    strokeLinecap: "round",
  },
  `,
};
