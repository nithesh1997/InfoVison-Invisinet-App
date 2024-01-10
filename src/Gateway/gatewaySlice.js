import { createSlice } from "@reduxjs/toolkit";

export const gatewaySlice = createSlice({
  name: "gateway",
  initialState: {
    id: 0,
    name: "",
    address: "",
    fqdn: "",
    gwcertexpiry: 0,
    version: "",
    firmwareVersion: "",
    defaultGateway: false,
    timesync: 0,
    status: "",
    model: "",
    mode: null,
    domain: "",
    uptime: 0,
    offline: false,
    gwcertexpiryUTC: "",
    gwExpiryDays: null,
  },
  reducers: {
    setGatewayInfo: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGatewayInfo } = gatewaySlice.actions;

export default gatewaySlice.reducer;
