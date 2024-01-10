import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";

export const StyledSecure = {
  Typo: styled(Typography)`
    font-weight: 600;
    /* font-family: Montserrat; */
  `,
  TypoTwo: styled(Typography)`
    font-weight: 600;
    /* font-family: Montserrat; */
    font-size: 0.8rem;
    color: ${({ colors }) => (colors ? "#6c757d" : "black")};
  `,
  Wrapper: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 1em;
    width: 100%;

    @media screen and (max-width: 768px) {
      display: grid;
      grid-template-columns: 2.7fr 0.5fr 0.5fr;
      padding: 0px 1em;
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.3fr;
      padding: 0px 1em;
    }
  `,
  WrapperTwo: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 35%;
    @media screen and (max-width: 768px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      display: grid;
      gap: 10px;
      grid-template-columns: 60px 60px 25px;
    }
  `,
  WrapperThree: styled(Box)`
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,
};
