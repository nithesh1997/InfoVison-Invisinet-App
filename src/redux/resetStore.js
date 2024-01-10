import { setActiveGateway } from "../Gateway/activeGatewaySlice";
import { setGatewayConfig } from "../Gateway/gatewayConfigSlice";
import { setGatewayInfo } from "../Gateway/gatewaySlice";
import { setGateways } from "../Gateway/gatewaysSlice";
import { setGatewayManager } from "./Slices/gatewayManagerSlice";

const resetStore = (dispatch) => [
  setGateways({}),
  setGatewayInfo({}),
  setGatewayConfig({}),
  setActiveGateway({}),
  setGatewayManager({}),
];

export default resetStore;
