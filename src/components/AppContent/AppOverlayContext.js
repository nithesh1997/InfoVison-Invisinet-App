import React, { createContext, useState } from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";

const OverlayContext = createContext();

const initialDirtyRowState = {
  id: 0,
  name: "",
  group: "",
  trustLevel: 0,
  ipaddress: "",
  comment: "",
  tcptagging: "",
  remotekey: "",
  enabled: "",
  __isEditMode: false,
};

window.gatewaysThatAreBeingDeleted = [];
window.gatewayListData = [];

const OverlayContextProvider = withRouter(
  withCookies((props) => {
    const [backdropShown, setBackdropShown] = useState(false);
    const [backdropActive, setBackdropActive] = useState(false);
    const [componentsShown, setComponentsShown] = useState("");
    const [distributedIdentity, setDistributedIdentity] = useState({
      data1: [],
    });
    const [trusted, setTrusted] = useState({});
    const [rskAddress, setRskAddress] = useState({
      dataRk: [],
    });
    const [activationConfig, setActivationConfig] = useState({});
    const [sucessRksText, setSucessRksText] = useState("");
    const [attemptErrorRksText, setAttemptErrorRksText] = useState("");
    const [sucesDistIdentText, setSucessDistIdentText] = useState("");
    const [attemptErrorDistIdentText, setAttemptErrorDistIdentText] =
      useState("");

    // let sgw = { name: "NA", address: "NA" };
    let sgw = {};

    const [selectedGateway, setSelectedGateway] = useState(sgw);
    const [gatewayList, setGatewayList] = useState([]);
    const [swapRow, setSwapRow] = useState(() => initialDirtyRowState);
    const [editableRow, setEditableRow] = useState({});
    const [gatewaySelectionMode, setGatewaySelectionMode] = useState("init");
    const [widgetData, setWidgetData] = useState({
      name: "",
      payload: [],
      loading: true,
      display: false,
    });
    const [downloadLogsState, setDownloadLogsState] = useState({});
    const [viewLogsState, setViewLogsState] = useState({});
    const [viewData, setviewData] = useState();
    const initial = {
      backdropShown: backdropShown,
      setBackdropShown: (val) => {
        setBackdropShown(val);
      },
      backdropActive: backdropActive,
      setBackdropActive: (val) => {
        setBackdropActive(val);
      },
      componentsShown: componentsShown,
      setComponentsShown: (val) => {
        setComponentsShown(val);
      },
      selectedGateway: selectedGateway,
      setSelectedGateway: (val) => {
        setSelectedGateway(val);
      },
      gatewayList: gatewayList,
      setGatewayList: (val) => {
        setGatewayList(val);
      },
      gatewaySelectionMode: gatewaySelectionMode,
      setGatewaySelectionMode: (val) => {
        setGatewaySelectionMode(val);
      },
      distributedIdentity: distributedIdentity,
      setDistributedIdentity: (val) => {
        setDistributedIdentity(val);
      },
      trusted: trusted,
      setTrusted: (val) => {
        setTrusted(val);
      },
      rskAddress: rskAddress,
      setRskAddress: (val) => {
        setRskAddress(val);
      },
      activationConfig: activationConfig,
      setActivationConfig: (val) => {
        setActivationConfig(val);
      },
      sucessRksText: sucessRksText,
      setSucessRksText: (val) => {
        setSucessRksText(val);
      },
      attemptErrorRksText: attemptErrorRksText,
      setAttemptErrorRksText: (val) => {
        setAttemptErrorRksText(val);
      },
      sucesDistIdentText: sucesDistIdentText,
      setSucessDistIdentText: (val) => {
        setSucessDistIdentText(val);
      },
      attemptErrorDistIdentText: attemptErrorDistIdentText,
      setAttemptErrorDistIdentText: (val) => {
        setAttemptErrorDistIdentText(val);
      },
      widgetData: widgetData,
      setWidgetData: (val) => {
        setWidgetData(val);
      },
      editableRow: editableRow,
      setEditableRow: (val) => {
        setEditableRow(val);
      },
      swapRow: swapRow,
      setSwapRow: (val) => {
        setSwapRow(val);
      },
      downloadLogsState: downloadLogsState,
      setDownloadLogsState: (val) => {
        setDownloadLogsState(val);
      },
      viewLogsState: viewLogsState,
      setViewLogsState: (val) => {
        setViewLogsState(val);
      },
      viewData: viewData,
      setviewData: (val) => {
        setviewData(val);
      },
    };

    return (
      <OverlayContext.Provider value={initial}>
        {props.children}
      </OverlayContext.Provider>
    );
  }),
);

export { OverlayContext, OverlayContextProvider };
export default OverlayContext;
