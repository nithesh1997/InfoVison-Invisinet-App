import React from "react";
import Style from "../../style";
import more from "../../images/more.svg";
import Styled from "./MaterialComponents/Settings.style";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";

const initConsoleType = (chassis_model) => {
  return chassis_model === "5010" ? "Controller Name" : "Invisigate";
};

const HeaderInfo = ({ disabled, moreButton, handleClick }) => {
  const {
    name: gatewayName,
    firmwareVersion: firmVersion,
    fqdn: gatewayfqdn,
  } = useSelector((state) => state.gateway);
  const { gatewayConfig } = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [consoleType, setConsoleType] = React.useState(() =>
    initConsoleType(gatewayConfig.chassis_model),
  );

  const { t } = useTranslation();

  React.useEffect(() => {
    setConsoleType(
      gatewayConfig.chassis_model === "5010"
        ? t("page.configure.Configuration.Banner.Controller Name")
        : t("page.configure.Configuration.Banner.Invisigate Name"),
    );
  }, [gatewayConfig.chassis_model]);

  return (
    <Styled.ActionStripe>
      <Styled.TextWrapper>
        <Styled.StripeTitle>{consoleType}</Styled.StripeTitle>
        <Styled.StripeSubTitle>{gatewayName}</Styled.StripeSubTitle>
      </Styled.TextWrapper>

      <Styled.TextWrapper>
        <Styled.StripeTitle>
          {t("page.configure.Configuration.Banner.Current Firmware Version")}
        </Styled.StripeTitle>
        <Styled.StripeSubTitle>{firmVersion}</Styled.StripeSubTitle>
      </Styled.TextWrapper>

      <Styled.TextWrapper>
        <Styled.StripeTitle>
          {t("page.configure.Configuration.Banner.fqdn")}
        </Styled.StripeTitle>
        <Styled.StripeSubTitle>{gatewayfqdn}</Styled.StripeSubTitle>
      </Styled.TextWrapper>

      <Box
        style={{
          justifyContent: "flex-end",
          marginRight: "1em",
          display: moreButton ? "auto" : "none",
        }}
      >
        <Style.GenericButton
          aria-label="more"
          id="long-button"
          aria-controls={!!anchorEl ? "long-menu" : undefined}
          aria-expanded={!!anchorEl ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          backgroundColor={"primary"}
          buttonName={t("page.configure.Configuration.Banner.More Button")}
          startIcon={<img src={more} alt={"more"} width={"20px"} />}
          disabled={disabled}
        />
      </Box>
    </Styled.ActionStripe>
  );
};
export default HeaderInfo;
