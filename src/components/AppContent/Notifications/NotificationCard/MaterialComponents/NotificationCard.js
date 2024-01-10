import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import { Clock, Info, Envelope, EnvelopeOpen } from "react-bootstrap-icons";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import styled, { css, keyframes } from "styled-components";

const Styled = {
  Wrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    min-height: 64px;
    background: ${({ theme }) => (theme.isviewed ? "#FFF" : "#F3F4F6")};
    margin: 0.8em auto;
    padding: 0.2em 0.1em;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
    border-bottom: 1px solid #f3f4f6;
    animation: ${(props) => (props.animes ? props.animi : "")};
  `,
  SignWrapper: styled(Box)`
    width: 10%;
    height: 100%;
    border-radius: 4px;
    padding: 0.2em;
    margin: 0.65em 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  `,
  SignIconWrapper: styled(Box)`
    box-sizing: border-box;
    width: 2.4em;
    height: 2.4em;
    padding: 0.2em;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${({ theme }) => `${theme.signIconColor}10`};

    & > svg {
      fill: ${({ theme }) => `${theme.signIconColor}`};
    }
  `,
  SignInfo: styled(Info)`
    font-size: 1.8em;
  `,
  SignWarning: styled(WarningAmberRoundedIcon)`
    font-size: 1.4em;
  `,
  SignError: styled(ErrorOutlineRoundedIcon)`
    font-size: 1.4em;
  `,
  ContentWrapper: styled(Box)`
    width: 70%;
    height: 100%;
    border-radius: 4px;
    padding: 0.2em;
    margin: 0.75em 0;
  `,
  ContentTextWrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    min-height: 1rem;
    height: 60%;
    word-wrap: break-word;
    padding: 0.2em 0.4em;
  `,
  ContentText: styled(Typography)`
    font-size: 0.9rem;
  `,
  ContentTimeStampWrapper: styled(Box)`
    width: 100%;
    height: 35%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,

  ContentTimeStampIconWrapper: styled(Box)`
    display: grid;
    place-items: center;
    border-radius: 50%;
    margin: 0 0.6em;
  `,
  ContentTimeStampIcon: styled(Clock)`
    fill: #7a7a7a;
  `,

  ContentTimeStampTextWrapper: styled(Box)`
    display: grid;
    place-items: center;
    padding: 0 0.4em;
    border-radius: 4px;
  `,
  ContentTimeStampText: styled(Typography)`
    font-size: 0.8em;
    font-weight: 600;
    color: #7a7a7a;
  `,

  CloseCardWrapper: styled(Box)`
    width: 10%;
    height: 100%;
    border-radius: 4px;
    padding: 0.2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0.65em 0;
  `,
  CloseCardButton: styled(IconButton)`
    padding: 0.25em;
    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: #333;
    }
  `,
  CloseCardIcon: styled(CloseRounded)``,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #333;
    }
  `,
  MailIconWrapper: styled(Box)`
    width: 10%;
    height: 100%;
    border-radius: 4px;
    padding: 0.2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0.35em 0;
  `,
  MailIcon: styled(Envelope)`
    font-size: 1rem;
  `,
  OpenIconMail: styled(EnvelopeOpen)`
    font-size: 1rem;
  `,
};

export default Styled;
