import { Box, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";

export const StyledPopUp = {
  HeaderWrapper: styled(Box)`
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid rgba(2, 147, 254, 1);
  `,
  Typo: styled(Typography)`
    color: rgba(2, 147, 254, 1);
    font-weight: 600;
    /* font-family: Montserrat; */
    font-size: 1.5em;
  `,

  StyledBox: styled(Box)`
    width: 60vw;
    height: 500px;
    background: #fff;
    border-radius: 0.5em;
  `,
  StyledCloseRounded: styled(IconButton)`
    padding: 0.25em;

    &:hover {
      background: rgba(2, 147, 254, 0.2);
    }
  `,
};

export const StyledSys = {
  HeaderWrapTwo: styled(Box)`
    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: 2fr 0.5fr 0.5fr;
      padding: 0px 1em;
    }
    @media (max-width: 1024px) {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.3fr;
      padding: 0px 1em;
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
    width: 100%;
  `,
  TypoTwo: styled(Typography)`
    /* font-family: Montserrat; */
    font-weight: 600;
  `,

  HeaderWrapThree: styled(Box)`
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,
  Mainwrap: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 35%;
    @media (max-width: 768px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
    @media (max-width: 1024px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
  `,
};
