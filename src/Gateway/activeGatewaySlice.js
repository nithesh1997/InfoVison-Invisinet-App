import { createSlice } from "@reduxjs/toolkit";

export const activeGatewaySlice = createSlice({
  name: "activeGateway",
  initialState: {
    address: "",
  },
  reducers: {
    setActiveGateway: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveGateway } = activeGatewaySlice.actions;

export default activeGatewaySlice.reducer;
