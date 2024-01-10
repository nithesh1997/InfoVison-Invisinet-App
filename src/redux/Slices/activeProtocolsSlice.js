import { createSlice } from "@reduxjs/toolkit";

export const activeProtocolsSlice = createSlice({
  name: "activeProtocols",
  initialState: ["UDP"],
  reducers: {
    setActiveProtocols: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveProtocols } = activeProtocolsSlice.actions;

export default activeProtocolsSlice.reducer;
