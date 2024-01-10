import React from "react";
import styled from "styled-components";

const PubSubCurrentState = ({ currentState }) => {
  return <Styled.Text theme={{ currentState }}>{currentState}</Styled.Text>;
};

export default PubSubCurrentState;

const Styled = {
  Text: styled("span")`
    /* font-family: Montserrat; */
    font-weight: 500;
    font-size: 0.9rem;
    letter-spacing: 0.4pt;
    color: ${({ theme }) => (theme.currentState === "Error" ? "red" : "auto")};
  `,
};
