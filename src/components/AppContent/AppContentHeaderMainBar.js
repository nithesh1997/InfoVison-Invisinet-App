import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import { withCookies } from "react-cookie";
import { useHistory, withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import ImageBanner from "../General/ImageBanner";
import AppMenuContext from "./AppMenuContext";
import { Images } from "../../NamedImages/NamedImages";
import { useEffect } from "react";
import callAPI from "src/apis/callAPI";
import { useState } from "react";

const StyledMenuInLeft = styled(IconButton)`
  margin-left: -0.3em;
  margin-right: 0.5em;
  padding: 0.35em;

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }
`;

const StyledMenuInRight = styled(IconButton)`
  margin-left: 2.5em;
  margin-right: 0.5em;

  &.collapsed {
    margin-left: 0.5em;
  }

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }
`;

const StyledIconBanner = styled(ImageBanner)`
  margin-left: 0.1em;
`;

const StyledTextBanner = styled(ImageBanner)`
  margin-left: 0.5em;
  width: ${(props) => (props.height * props.orgWidth) / props.orgHeight}px;
  transition: width ${(props) => props.collapseDelay / 1000}s ease-out;

  &.collapsed {
    width: 0px;
    transition: width ${(props) => props.collapseDelay / 1000}s ease-in;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const StyledLinkForExperiment = styled(StyledLink)`
  margin-top: 0.25em;
  cursor: pointer;
`;

const DividerIcon = styled(Divider)`
  &.MuiDivider-root {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 15px;
  }
`;

const ConsoleTitle = styled(Typography)`
  &.MuiTypography-root {
    color: #000;
    font-family: Inter;
    font-size: 1em;
    font-weight: 600;
    // line-height: 16px;
    letter-spacing: 0em;
    text-align: center;
    margin-left: 1em;
    @media (min-width: 321px) and (max-width: 1024px) {
      font-size: 0.8em;
      font-weight: 500;
    }
  }
`;

const HeaderMainBar = (props) => {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const MenuContext = useContext(AppMenuContext);
  const history = useHistory();
  const [isBem, setIsBem] = useState(false);
  const handleMenuClick = () => {
    if (!MenuContext.collapsed) {
      Object.values(MenuContext.setSubMenuCollapsed).forEach((fn) => {
        fn(true);
      });
    }

    MenuContext.setCollapsed(!MenuContext.collapsed);
    MenuContext.setShow(!MenuContext.show);
  };

  useEffect(() => {
    callAPI({
      path: "isBem",
      data: {},
      responder: (res, onComplete, onCompleteArguments) => {
        const responder = {
          state: "IS_BEM_FAILURE",
          data: undefined,
        };

        if (res.state === "GOOD_RESPONSE") {
          responder.state = "IS_BEM_SUCCESS";
          responder.data = res.response.body;
        }
        onComplete(responder, ...onCompleteArguments);
      },
      onComplete: (response) => {
        const newState = response.data;
        setIsBem(newState);
      },
    });
  }, []);
  //console.log("TEST " + isBem);

  const IMC = "Invisinet Management Console (IMC)";
  const IEM = "Invisinet Enterprise Manager (IEM)";

  return (
    <React.Fragment>
      {MenuContext.experiment ? (
        <React.Fragment>
          <StyledMenuInLeft
            className={"hidden"}
            aria-label={"menu"}
            onClick={handleMenuClick}
            hoverBg={AppTheme.__default.appHamburger.hoverBg}
          >
            <MenuIcon />
          </StyledMenuInLeft>

          <StyledLinkForExperiment
            onClick={() => history.push(AppConfig.pages.dsh.path)}
          >
            <ImageBanner
              src={Images.invisinetLogo}
              height={36}
              alt={"InvisiNet"}
            />
          </StyledLinkForExperiment>

          <DividerIcon orientation="vertical" flexItem />
          <ConsoleTitle>{isBem ? IEM : IMC}</ConsoleTitle>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledLink href={AppConfig.root + AppConfig.pages.dsh.path}>
            <StyledIconBanner src={Images.onlyLogo} height={24} alt={"BA"} />
            <StyledTextBanner
              src={Images.TextLogoInvisinet}
              height={24}
              alt={"InvisiNet"}
              className={MenuContext.collapsed ? "collapsed" : ""}
              orgWidth={AppConfig.app.headerMain.menu.textBanner.width}
              orgHeight={AppConfig.app.headerMain.menu.textBanner.height}
              collapseDelay={
                AppConfig.app.headerMain.menu.textBanner.collapseDelay
              }
            />
          </StyledLink>

          <StyledMenuInRight
            aria-label={"menu"}
            onClick={handleMenuClick}
            className={"hidden" + MenuContext.collapsed ? "collapsed" : ""}
            hoverBg={AppTheme.__default.appHamburger.hoverBg}
          >
            <MenuIcon />
          </StyledMenuInRight>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withRouter(withCookies(HeaderMainBar));
