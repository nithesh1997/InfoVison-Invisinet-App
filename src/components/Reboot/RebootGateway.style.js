import { Box, Paper, Typography } from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  WrapperTypography: styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 0 0em;
  `,

  TypographyGateway: styled(Typography)`
    font-size: 1em;
    /* font-family: Montserrat; */
    text-align: center;
    word-spacing: 0.3em;

    @media (min-width: 641px) and (max-width: 1023px) {
      display: none;
    }
  `,
  TypographyGatewayDesc: styled(Typography)`
    /* display: none; */
    /* @media (min-width: 641px) and (max-width: 1023px) {
  display: flex;
  font-size: 1em;
  text-align: center;
  word-spacing: 0.3em;
} */
  `,
  ParentTypo: styled(Box)`
    display: none;
    @media (min-width: 641px) and (max-width: 1023px) {
      height: 160px;
      width: 500px;
      display: flex;
      /* align-items: center;
      justify-content: flex-start; */
      overflow: auto;
    }
  `,
  ResponsiveBox: styled(Box)`
    /* display: flex;
flex-direction: row; */
    background-color: red;
    /* @media (min-width: 641px) and (max-width: 1023px) {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 20px;
} */
  `,
  ResponsiveTypo: styled(Box)`
    height: 200px;
    @media (min-width: 641px) and (max-width: 1023px) {
      height: 0px;
    }
  `,
  StyledInnerDiv: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 200px;
  `,
  Div: styled(Box)`
    height: 200px;
    padding: 1em 0 2em 0;
    @media (min-width: 641px) and (max-width: 1023px) {
      display: none;
    }
  `,

  PaperDesc: styled(Paper)`
    display: none;
  `,

  TypographyGatewayDesc: styled(Typography)`
    display: none;
    @media (min-width: 641px) and (max-width: 1023px) {
      display: flex;
      font-size: 1em;
      text-align: left;
      word-spacing: 0.3em;
    }
  `,
  ResponsiveBox: styled(Box)`
    @media (min-width: 641px) and (max-width: 1023px) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 20px;
    }
  `,
  PaperDesc: styled(Paper)`
    display: none;

    @media (min-width: 641px) and (max-width: 1023px) {
      max-height: 250px;
      max-width: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2em;
      /* border-radius: 0.5em; */
      margin: 0 0em 0 0em;
    }
  `,
  Paper: styled(Paper)`
    /* min-width: 20em; */
    width: 23em;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
    border-radius: 1em;
    margin: 0 0em 0 0em;
    @media (min-width: 641px) and (max-width: 1023px) {
      max-height: 250px;
      width: 100%;
      border-radius: 0em;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 2em;
      border-radius: 1em;
      margin: 0 0em 0 0em;
      gap: 30px;
    }
    &:hover {
      box-shadow: 0em 0em 3em rgba(0, 0, 0, 0.11);
    }
  `,
  Typography: styled(Typography)`
    font-size: 1.5em;
    padding: 0.8em 0;
    font-weight: 600;
    /* font-family: Montserrat; */
    @media (min-width: 641px) and (max-width: 1023px) {
      display: none;
    }
  `,
};

export default Styled;
