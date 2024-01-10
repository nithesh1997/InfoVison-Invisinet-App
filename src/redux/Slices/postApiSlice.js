import { createSlice } from "@reduxjs/toolkit";

export const isPostHappenedSlice = createSlice({
  name: "saveApi",
  initialState: false,
  reducers: {
    setIsPostHappened: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setIsPostHappened } = isPostHappenedSlice.actions;

export default isPostHappenedSlice.reducer;
