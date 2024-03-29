import { createSlice } from "@reduxjs/toolkit";

export const gatewaysSlice = createSlice({
  name: "gateways",
  initialState: {},
  reducers: {
    setGateways: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGateways } = gatewaysSlice.actions;

export default gatewaysSlice.reducer;
