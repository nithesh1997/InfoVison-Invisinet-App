import { createSlice } from "@reduxjs/toolkit";

export const windowDimensionsSlice = createSlice({
  name: "windowDimensions",
  initialState: {
    width: 0,
    height: 0,
  },
  reducers: {
    setWindowDimensions: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWindowDimensions } = windowDimensionsSlice.actions;

export default windowDimensionsSlice.reducer;
