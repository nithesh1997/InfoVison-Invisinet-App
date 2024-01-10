import { Box } from "@mui/material";
import { useContext } from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import HaltGateway from "./HaltGateway";
import RebootGateway from "./RebootGateway";

const Reboot = (props) => {
  const AppConfig = useContext(Config);
  const location = useLocation();
  const history = useHistory();
  const { gatewayConfig } = useSelector((state) => state);

  return (
    <>
      <div style={{ height: "67px", width: "100%" }}>
        <AppInContentHeader
          title={AppConfig.pages.rbt.title}
          breadcrumb={AppConfig.pages.rbt.breadcrumb}
        />
      </div>
      <StyledGrid>
        <StyledGridHalt>
          <HaltGateway
            gatewayConfig={gatewayConfig}
            location={location}
            history={history}
          />
        </StyledGridHalt>

        <StyledGridReboot>
          <RebootGateway
            gatewayConfig={gatewayConfig}
            location={location}
            history={history}
          />
        </StyledGridReboot>
      </StyledGrid>
    </>
  );
};

export default withRouter(withCookies(Reboot));
const StyledGrid = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 50px;
  /* background-color: yellowgreen; */
  padding: 1em;
  /* @media (min-width: 950px) and (max-width: 1200px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
     background-color: red;
  } */

  @media (min-width: 641px) and (max-width: 1023px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    /* height: 100%;
    width: 100%; */
    /* background-color: blue; */
  }
`;

const StyledGridHalt = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* background-color: yellow; */
  height: 50%;
  width: 50%;

  @media (min-width: 641px) and (max-width: 1023px) {
    min-width: 80%;
    max-width: 80%;
    height: min-content;
    align-items: flex-start;
    /* border: 1px solid #000; */
  }

  /* @media (min-width: 950px) and (max-width: 1200px) {
    min-width: 50%;
    max-width: 50%;
    width: 100%;
    /* border: 1px solid #000; */
`;
const StyledGridReboot = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* background-color: green; */
  height: 50%;
  width: 50%;
  /* @media (min-width: 950px) and (max-width: 1200px) {
    min-width: 50%;
    width: 100%;
    max-width: 50%;
    /* border: 1px solid #000; */

  @media (min-width: 641px) and (max-width: 1023px) {
    min-width: 80%;
    max-width: 80%;
    height: min-content;
    align-items: flex-start;
    /* border: 1px solid #000; */
  }
`;
