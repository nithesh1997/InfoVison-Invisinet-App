import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, { useContext } from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppContentHeaderMainBar from "./AppContentHeaderMainBar";
import AppContentHeaderToolBar from "./AppContentHeaderToolBar";

const StyledHeader = styled(Box)`
  position: absolute;
  z-index: 99;
  left: 0em;
  top: 0em;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  width: 100%;
  margin: 0em;
  padding: 0em;
  box-shadow: 0px 2px 12px 2px ${(props) => props.boxShadow};
  min-height: 62px;
  max-height: 62px;
  ${({ bg }) => (bg === "auto" ? "" : "background-color: " + bg + ";")}

  @media (max-width: 320px) {
    z-index: 1;
  }

  @media (min-width: 321px) and (max-width: 640px) {
    z-index: 1;
  }
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  margin: 0em;
`;

const StyledMainBar = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  padding: 5px 12px 5px 12px !important;
  background-color: #fff;
`;

const StyledToolBar = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  padding: 5px 12px 5px 12px !important;
`;

const Header = (props) => {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];

  return (
    <StyledHeader
      bg={AppTheme.__default.appHeader.bg}
      boxShadow={AppTheme.__default.appHeader.boxShadow}
      component={"header"}
    >
      <StyledGrid container xs={12} spacing={3}>
        <StyledMainBar item xs={4}>
          <AppContentHeaderMainBar />
        </StyledMainBar>

        <StyledToolBar item xs={9}>
          <AppContentHeaderToolBar
            setShowSignIn={props.setShowSignIn}
            RunEffect={props.RunEffect}
            isLoggedOut={props.isLoggedOut}
          />
        </StyledToolBar>
      </StyledGrid>
    </StyledHeader>
  );
};

export default withRouter(withCookies(Header));
