import { createSlice } from "@reduxjs/toolkit";

export const gatewayManagerSlice = createSlice({
  name: "gatewayManager",
  initialState: { isModalOpen: false, selectedGateway: "" },
  reducers: {
    setGatewayManager: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGatewayManager } = gatewayManagerSlice.actions;

export default gatewayManagerSlice.reducer;
