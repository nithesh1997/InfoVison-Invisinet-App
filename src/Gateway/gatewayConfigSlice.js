import { createSlice } from "@reduxjs/toolkit";

export const gatewayConfigSlice = createSlice({
  name: "gatewayConfig",
  initialState: {
    num_idents: 0,
    max_conns: 0,
    max_anon_conns: 0,
    cluster_enable: 0,
    cluster_master: 0,
    under_vm: 0,
    chassis_id: 0,
    chassis_keypad: 0,
    chassis_lcd: 0,
    chassis_ipmi: 0,
    chassis_model: "XXXX",
  },
  reducers: {
    setGatewayConfig: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGatewayConfig } = gatewayConfigSlice.actions;

export default gatewayConfigSlice.reducer;
