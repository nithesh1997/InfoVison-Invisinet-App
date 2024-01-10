import { Box } from "@material-ui/core";
import { CloudDownloadSharp, VisibilityOutlined } from "@material-ui/icons";
import React, {
  Fragment,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import CircularProgressWithLabel from "../PageLoader/CircularProgressWithLabel";
import CustomLogsPortal from "./__test__/CustomLogsPortal";
import { DownloadLogs } from "./__test__/DownloadLogs";
import tablePayload from "./__test__/tablePayload";
import { ViewLogs } from "./__test__/ViewLogs";

const AsyncIFVDataGrid = lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const StyledSkeletonHolder = styled(Box)`
  padding: 1em 1em 1em 0em;
`;

export const TrustLevel = (props) => {
  const minLevel = 0;
  const maxLevel = 7;
  return (
    <CircularProgressWithLabel
      size={36}
      value={(100 * props.level) / (maxLevel - minLevel)}
      displayValue={props.level}
      style={{
        margin: "0.5em",
      }}
    />
  );
};

const actionsObject = {
  headerName: "Action",
  dataKey: "__action",
  type: "actions",
  options: [],
  minWidth: 250 * 0.6,
  flexWidth: 0.6,
  headerAlignment: "left",
  contentAlignment: "left",
  sortable: false,
  actions: [],
};

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-grow: 1;
  flex-wrap: nowrap;
  height: 100%;
  max-height: calc(100vh - 4.25em);
  overflow: auto;
`;

const StyledDataGridBox = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  width: 100%;
  padding: 0.5em 1.25em 0.75em 2.25em;
`;

const initialPortalState = {
  isPortal: false,
  type: "",
  row: {},
  setTaskStatus: () => "",
};

const DataGridIdentity = (props) => {
  const AppConfig = useContext(Config);
  const dataGridRef = useRef();
  const subconscious = tablePayload.subconscious;
  const uniqueSubconscious = subconscious.name + "-" + new Date().getTime();

  const [loading, setLoading] = useState(true);
  const [dataGridKey, setDataGridKey] = useState(uniqueSubconscious);
  const [tableConfig, setTableConfig] = useState(() => tablePayload.config);
  // const [columns, setColumns] = useState(() => tablePayload.columns);
  const [rows, setRows] = useState([]);
  const [gridSubconscious, setGridSubconscious] = useState(subconscious);
  const { downloadLogsState, setDownloadLogsState } =
    useContext(OverlayContext);
  const { viewLogsState, setViewLogsState } = useContext(OverlayContext);
  const { componentsShown, setComponentsShown } = useContext(OverlayContext);
  const [portalState, setPortalState] = useState(initialPortalState);

  const downloadAction = {
    type: "__download",
    name: "Download Download Download Download Download Download",
    icon: <CloudDownloadSharp style={{ color: "rgba(2, 147, 254, 1)" }} />,
    isEnabled: (row) => true,
    handleDownload: (row, setTaskStatus) => {
      setPortalState({
        isPortal: true,
        type: "__download",
        row,
        setTaskStatus,
      });
      // setDownloadLogsState({ row, setTaskStatus });
      // setComponentsShown(componentsShown + ",download-logs-portal");
    },
  };

  const viewAction = {
    type: "__view",
    name: "View",
    icon: <VisibilityOutlined style={{ color: "rgba(2, 147, 254, 1)" }} />,
    isEnabled: (row) => true,
    handleView: (row, setTaskStatus) => {
      setPortalState({
        isPortal: true,
        type: "__view",
        row,
        setTaskStatus,
      });
      // setViewLogsState({ row, setTaskStatus });
      // setComponentsShown(componentsShown + ",view-logs-portal");
    },
  };

  actionsObject.actions.push(viewAction);
  const [rawColumns, setRawColumns] = useState(tablePayload.columns);
  const [columns, setColumns] = useState(() => {
    const newCols = [...rawColumns];

    const checkIfTypeDownload = (action) => {
      return action.type === downloadAction.type;
    };

    const checkIfTypeView = (action) => {
      return action.type === viewAction.type;
    };

    newCols.map((col) => {
      if (col.dataKey === "__action") {
        if (!col.actions.find(checkIfTypeDownload)) {
          return (col.actions = [...col.actions, downloadAction]);
        } else if (!col.actions.find(checkIfTypeView)) {
          return (col.actions = [...col.actions, viewAction]);
        }
      }
    });

    return newCols;
  });

  let dgName = subconscious.name;
  let [dgKey, setDGKey] = useState(dgName + "-" + new Date().getTime());

  useEffect(() => {
    setTimeout(() => {
      setRows(tablePayload.rows);
      setLoading(false);
      setDGKey(dgName + "-" + new Date().getTime());
    }, AppConfig.identityManagement.showContentDelay);
  }, []);

  return (
    <Fragment>
      <StyledContainer component={"section"}>
        <AppInContentHeader
          title={AppConfig.pages.ifvdgdev.title}
          breadcrumb={AppConfig.pages.ifvdgdev.breadcrumb}
        />
        <StyledDataGridBox>
          <Suspense
            fallback={
              <StyledSkeletonHolder>
                <WidthFillerSkeleton />
              </StyledSkeletonHolder>
            }
          >
            <AsyncIFVDataGrid
              // key={dataGridKey}
              ref={dataGridRef}
              cols={[columns, setColumns]}
              data={[rows, setRows]}
              loadingData={[loading, setLoading]}
              config={[tableConfig, setTableConfig]}
              subconscious={[gridSubconscious, setGridSubconscious]}
            />
          </Suspense>
        </StyledDataGridBox>
      </StyledContainer>
      <CustomLogsPortal isDisplay={portalState.isPortal}>
        {portalState.type === "__download" ? (
          <DownloadLogs
            portalState={portalState}
            setPortalState={setPortalState}
          />
        ) : portalState.type === "__view" ? (
          <ViewLogs portalState={portalState} setPortalState={setPortalState} />
        ) : null}
      </CustomLogsPortal>
    </Fragment>
  );
};

export default withRouter(withCookies(DataGridIdentity));
