import { useEffect, useState } from "react";
import Styled from "./MaterialComponents/NotificationCard";

const NotificationCard = ({
  id,
  type,
  message,
  created_date,
  isviewed,
  handleRemoveCard,
}) => {
  const [signIconColor, setSignIconColor] = useState("#4E6AD7");
  const [isLoading, setIsLoading] = useState(false);
  const [anime, setAnime] = useState(false);
  const [animate, setAnimate] = useState(false);

  /* RUNS ON INITIAL RENDER */
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
    <Styled.Wrapper theme={{ isviewed, animate }}>
      <Styled.SignWrapper>{COLORS(type)}</Styled.SignWrapper>

      <Styled.ContentWrapper>
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
          id={`alert-${id}`}
          disabled={isLoading}
          onClick={(event) => {
            setAnime(true);
            setIsLoading(true);
            handleRemoveCard(id, setIsLoading, isLoading, setAnimate);
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
        <Styled.MailIconWrapper>
          {isviewed ? <Styled.OpenIconMail /> : <Styled.MailIcon />}
        </Styled.MailIconWrapper>
      </Styled.CloseCardWrapper>
    </Styled.Wrapper>
  );
};

export default NotificationCard;

function COLORS(type) {
  if (type === "ERROR") {
    return (
      <Styled.SignIconWrapper style={{ backgroundColor: "#F34E4E10" }}>
        <Styled.SignError style={{ color: "#F34E4E" }} />
      </Styled.SignIconWrapper>
    );
  } else if (type === "WARNING") {
    return (
      <Styled.SignIconWrapper style={{ backgroundColor: "#F34E4E10" }}>
        <Styled.SignWarning style={{ color: "#F34E4E" }} />
      </Styled.SignIconWrapper>
    );
  } else if (type === "INFO") {
    return (
      <Styled.SignIconWrapper style={{ backgroundColor: "#4E6AD710" }}>
        <Styled.SignInfo style={{ color: "#4E6AD7" }} />
      </Styled.SignIconWrapper>
    );
  } else {
    return "";
  }
}
