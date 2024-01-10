import Box from "@material-ui/core/Box";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppInContentFooter from "../AppContent/AppInContentFooter";
import GeneralErrorBoundary from "../ErrorBoundaries/GeneralErrorBoundary";
import PageLoader from "../PageLoader/PageLoader";
import AppContentSideMenu from "./AppContentSideMenu";
import AppManageGatewayBanner from "./AppManageGatewayBanner";
import OverlayContext from "./AppOverlayContext";

const AsyncDashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const AsyncIdentites = React.lazy(() => import("../Identities/Identities"));
const AsyncResourceMgmt = React.lazy(() =>
  import("../ResourceManagement/ProtectedResources"),
);
const AsyncResourceList = React.lazy(() =>
  import("../ResourceManagement/ResourceList"),
);
const AsyncUResourceMgmt = React.lazy(() =>
  import("../ResourceManagement/UnProtectedResources"),
);
const AsyncRulesMgmt = React.lazy(() => import("../Rules/RulesManagement"));
const AsyncEndpointMgmt = React.lazy(() =>
  import("../Endpoints/EndpointConfig"),
);
const AsyncLayer3Mgmt = React.lazy(() => import("../Layer3/Layer3Management"));
const AsyncDummyApp = React.lazy(() => import("./DummyAppContentBody"));
const AsyncTrustedUntrustedManagement = React.lazy(() =>
  import("../GatewayServices/TrustedUntrustedManagement"),
);
const AsyncDnsManagement = React.lazy(() =>
  import("../ManagementNetwork/DnsManagement"),
);
const AsyncTrustLevelManagement = React.lazy(() =>
  import("../ManagementTrustLevel/TrustLevelManagement"),
);
const AsyncRbtManagement = React.lazy(() => import("../Reboot/Reboot"));
const AsyncApplicationManagement = React.lazy(() =>
  import("../Applications/Applications"),
);
const AsyncSettingsManagement = React.lazy(() =>
  import("../Settings/Settings"),
);
const AsyncConfigurationLogsManagement = React.lazy(() =>
  import("../ConfigurationLogs/ConfigurationLogs"),
);

const AsyncMonitoring = React.lazy(() => import("../IFVDGDevelopment/index"));
const AsyncFirmware = React.lazy(() => import("../FirmwareVersion/Firmware"));
const AsyncFilterRules = React.lazy(() => import("../FilterRules/FilterRules"));
const AsyncDevTable = React.lazy(() => import("../DevTable/DevTable"));
const AsyncTodoTasks = React.lazy(() => import("../TodoTasks/TodoTasksList"));
const AsyncLogFiles = React.lazy(() => import("../GetLogEPC/GetLogEPC"));

const StyledBody = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex-grow: 1;
  position: absolute;
  left: 0em;
  top: 4.5em;
  z-index: 1;
  width: 100%;
  height: calc(100vh - 4.5em);
  background-color: ${(props) => props.bg};
`;

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  flex-grow: 1;
  height: 100%;
  max-height: calc(100vh - 4.25em);
  overflow: auto;
  padding-bottom: 2.5em;
`;

const AppContentBody = (props) => {
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [gatewayAddress, setGatewayAddress] = useState(null);

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      setGatewayAddress(null);
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
    }
  }, [AppOverlayContext.selectedGateway]);

  return (
    <StyledBody component={"main"}>
      <AppContentSideMenu />

      <AppManageGatewayBanner />

      <Suspense
        fallback={
          <GeneralErrorBoundary>
            <PageLoader />
          </GeneralErrorBoundary>
        }
      >
        <StyledContainer component={"section"} key={"ba-cb-" + gatewayAddress}>
          <Switch>
            <Route path={AppConfig.pages.dsh.path}>
              <AsyncDashboard />
            </Route>

            <Route path={AppConfig.pages.idm.path}>
              <AsyncIdentites />
            </Route>

            <Route path={AppConfig.pages.prs.path}>
              <AsyncResourceMgmt />
            </Route>

            <Route path={AppConfig.pages.rsl.path}>
              <AsyncResourceList />
            </Route>

            {gatewayConfig.chassis_model !== "5010" ? (
              <Route path={AppConfig.pages.urs.path}>
                <AsyncUResourceMgmt />
              </Route>
            ) : null}

            <Route path={AppConfig.pages.rum.path}>
              <AsyncRulesMgmt />
            </Route>

            <Route path={AppConfig.pages.trl.path}>
              <AsyncTrustLevelManagement />
            </Route>

            <Route path={AppConfig.pages.dns.path}>
              <AsyncDnsManagement />
            </Route>

            {gatewayConfig.chassis_model !== "5010" ? (
              <Route path={AppConfig.pages.ly3.path}>
                <AsyncLayer3Mgmt />
              </Route>
            ) : null}

            <Route path={AppConfig.pages.apm.path}>
              <AsyncApplicationManagement />
            </Route>

            <Route path={AppConfig.pages.set.path}>
              <AsyncSettingsManagement />
            </Route>
            <Route path={AppConfig.pages.con.path}>
              <AsyncConfigurationLogsManagement />
            </Route>

            <Route path={AppConfig.pages.tum.path}>
              <AsyncTrustedUntrustedManagement />
            </Route>

            {gatewayConfig.chassis_model !== "5010" ? (
              <Route path={AppConfig.pages.flr.path}>
                <AsyncFilterRules />
              </Route>
            ) : null}

            <Route path={AppConfig.pages.enp.path}>
              <AsyncEndpointMgmt />
            </Route>

            <Route path={AppConfig.pages.rbt.path}>
              <AsyncRbtManagement />
            </Route>

            <Route path={AppConfig.pages.ifvdgdev.path}>
              <AsyncMonitoring />
            </Route>

            <Route path={AppConfig.pages.mfw.path}>
              <AsyncFirmware />
            </Route>

            {process.env.NODE_ENV !== "production" && (
              <Route path={AppConfig.pages.dev.path}>
                <AsyncDevTable />
              </Route>
            )}

            <Route path={AppConfig.pages.tsk.path}>
              <AsyncTodoTasks />
            </Route>

            <Route path={AppConfig.pages.lgf.path}>
              <AsyncLogFiles />
            </Route>

            <Route path="/">
              <AsyncDummyApp path={props.location.pathname} />
            </Route>
          </Switch>

          <AppInContentFooter />
        </StyledContainer>
      </Suspense>
    </StyledBody>
  );
};

export default withRouter(withCookies(AppContentBody));
