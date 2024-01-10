import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";

export const StyledDir = {
  DistWrapper: styled(Box)`
    display: flex;
    flexdirection: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
    width: 100%;
  `,
  Typo1: styled(Typography)`
    /* font-family: Montserrat; */
    font-weight: 600;
  `,
  DistWrapperTwo: styled(Box)`
    display: flex;
    flexdirection: row;
    alignitems: center;
    justifycontent: space-evenly;
    width: 39.7%;
  `,
};
