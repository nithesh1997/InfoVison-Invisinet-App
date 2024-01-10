import { configureStore } from "@reduxjs/toolkit";
import activeGatewayReducer from "../Gateway/activeGatewaySlice";
import gatewayConfigReducer from "../Gateway/gatewayConfigSlice";
import gatewayReducer from "../Gateway/gatewaySlice";
import gatewaysReducer from "../Gateway/gatewaysSlice";
import userProfileReducer from "../redux/Slices/userProfileSlice";
import recentGatewayReducer from "../Gateway/recentGatewaySlice";
import activeProtocolsReducer from "../redux/Slices/activeProtocolsSlice";
import gatewayManagerReducer from "../redux/Slices/gatewayManagerSlice";
import navigationMenuReducer from "../redux/Slices/navigationMenuSlice";
import windowDimensionsReducer from "../redux/Slices/windowDimensionsSlice";
import isPostHappenedSlice from "./Slices/postApiSlice";

export default configureStore({
  reducer: {
    gateway: gatewayReducer,
    gateways: gatewaysReducer,
    gatewayConfig: gatewayConfigReducer,
    activeGateway: activeGatewayReducer,
    recentGateway: recentGatewayReducer,
    activeProtocols: activeProtocolsReducer,
    gatewayManager: gatewayManagerReducer,
    userProfile: userProfileReducer,
    navigationMenu: navigationMenuReducer,
    windowDimensions: windowDimensionsReducer,
    isPostHappened: isPostHappenedSlice,
  },
});
