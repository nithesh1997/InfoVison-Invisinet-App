import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useState } from "react";
import { Bell, Clock, Info, XCircle } from "react-bootstrap-icons";
import styled, { keyframes } from "styled-components";

const NotificationCard = ({
  id,
  type,
  message,
  created_date,
  isviewed,
  handleRemoveCard,
  animations,
}) => {
  const [signIconColor, setSignIconColor] = useState("#4E6AD7");
  const [isLoading, setIsLoading] = useState(false);
  const [anime, setAnime] = useState(false);

  useEffect(() => {
    setSignIconColor((oldState) => {
      switch (type) {
        case "WARNING":
          return "#F34E4E";
        case "ERROR":
          return "#F34E4E";

        default:
          return oldState;
      }
    });
  }, []);
  return (
    <Styled.Wrapper theme={{ isviewed }}>
      <Styled.SignWrapper>
        <Styled.SignIconWrapper theme={{ signIconColor }}>
          {type === "ERROR" ? (
            <Styled.SignError />
          ) : type === "WARNING" ? (
            <Styled.SignWarning />
          ) : (
            <Styled.SignInfo />
          )}
        </Styled.SignIconWrapper>
      </Styled.SignWrapper>

      <Styled.ContentWrapper animes={anime}>
        <Styled.ContentTextWrapper>
          <Styled.ContentText>{message}</Styled.ContentText>
        </Styled.ContentTextWrapper>

        <Styled.ContentTimeStampWrapper>
          <Styled.ContentTimeStampIconWrapper>
            <Styled.ContentTimeStampIcon />
          </Styled.ContentTimeStampIconWrapper>

          <Styled.ContentTimeStampTextWrapper>
            <Styled.ContentTimeStampText>
              {created_date}
            </Styled.ContentTimeStampText>
          </Styled.ContentTimeStampTextWrapper>
        </Styled.ContentTimeStampWrapper>
      </Styled.ContentWrapper>
      <Styled.CloseCardWrapper>
        <Styled.CloseCardButton
          onClick={(event) => {
            setIsLoading(true);
            setAnime(false);
            handleRemoveCard(id, setIsLoading, setAnime);
          }}
        >
          {isLoading ? (
            <Styled.Spinner
              style={{
                width: "0.85em",
                height: "0.85em",
              }}
            />
          ) : (
            <Styled.CloseCardIcon />
          )}
        </Styled.CloseCardButton>
      </Styled.CloseCardWrapper>
    </Styled.Wrapper>
  );
};

export default NotificationCard;
const SlideDelete = keyframes`
exitTransform: scale(0.5) translatex(-100%)'
// 0% {
//   transform:skewX(53deg) translateX(-500px);
// }
// 30% {
//   transform:translateX(0px);
// }
// 40% {
//    transform:skew(-20deg);
//    }
// 100% {
//   transform:skew(0deg);
//  }
`;
const Styled = {
  Wrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    min-height: 64px;
    background: ${({ theme }) => (theme.isviewed ? "#FFF" : "#e8e8f2")};
    margin: 0.2em auto;
    border-radius: 4px;
    padding: 0.2em 0.1em;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
    /* outline: 1px solid #e8e8f2; */
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
    /* background: pink; */
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
  SignWarning: styled(Bell)`
    font-size: 1.4em;
  `,
  SignError: styled(XCircle)`
    font-size: 1.4em;
  `,
  ContentWrapper: styled(Box)`
    width: 70%;
    height: 100%;
    border-radius: 4px;
    padding: 0.2em;
    margin: 0.75em 0;
    /* background: pink; */
    animation: ${(props) => (props.animes ? slideDelete + `.7s ease-in` : "")};
  `,
  ContentTextWrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    min-height: 1rem;
    height: 60%;
    word-wrap: break-word;
    padding: 0.2em 0.4em;
    /* background: red; */
    margin: 0.2em 0;
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
    /* background: blue; */
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
    /* background: peachpuff; */
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
    /* background: pink; */
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
  CloseCardIcon: styled(CloseRoundedIcon)``,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #333;
    }
  `,
  EmailIcon: styled(EmailIcon)``,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #333;
    }
  `,
};
