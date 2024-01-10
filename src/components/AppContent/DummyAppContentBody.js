/* eslint-disable no-whitespace-before-property */
import { Box, Button, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import ImageBanner from "../General/ImageBanner";
import ErrorLogo from "../../images/page_error_v2.svg";
import Style from "../../style";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { useTranslation } from "react-i18next";

const DummyAppContentBody = (props) => {
  const { t, i18n } = useTranslation();

  let [loading, setLoading] = useState(true);
  const AppConfig = useContext(Config);

  const showData = () => {
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      showData();
    }, AppConfig.dashboard.showContentDelay);
  }, []);

  return (
    <Styled.Container component={"section"} onClick={showData}>
      <Styled.Images>
        <Styled.ErrorLogo src={ErrorLogo} alt={"Error"} width={"180"} />
      </Styled.Images>

      <Styled.Number>{t("commons.errorPage.404.title")}</Styled.Number>

      <Styled.ErrorText>{t("commons.errorPage.404.message")}</Styled.ErrorText>

      <Styled.StyledButton
        onClick={() => window.open("mailto:support@invisinet.net")}
      >
        {t("commons.errorPage.404.buttonName")}
      </Styled.StyledButton>
    </Styled.Container>
  );
};

export default withRouter(withCookies(DummyAppContentBody));

const Styled = {
  Container: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;

    height: 100%;
    max-height: calc(100vh - 4em);
    overflow: auto;
    /* padding-top: 0.5em; */
    text-align: center;
    /* margin-bottom: 8%; */
  `,
  StyledButton: styled(Button)`
    background: #018ff6;
    color: #ffffff;
    width: 150px;
    margin: 3em 0 0 0;
    text-transform: capitalize;
    padding: 0.75em 1em;
    font-size: 0.85em;
    &:hover {
      background: #0b5ed7;
    }
  `,
  Images: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  ErrorLogo: styled(ImageBanner)`
    padding: 2em 0 0 0;
    margin: 0 0 0 1em;
  `,
  Number: styled(Typography)`
    font-style: normal;
    font-weight: 900;
    font-size: 3rem;
    line-height: 100px;
    color: #000;
  `,
  ErrorText: styled(Typography)`
    font-style: normal;
    font-size: 18px;
    font-weight: 500;
    line-height: 5px;
    color: #000;
    text-align: center;
    max-width: 90%;
  `,
  SupportButton: styled(GenericButton)`
    top: 3em;
  `,
};
