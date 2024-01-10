import { createSlice } from "@reduxjs/toolkit";

export const dshprofileSlice = createSlice({
  name: "profileSlice",
  initialState: {
    defaultValue: "",
  },
  reducers: {
    setProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setProfile } = dshprofileSlice.actions;

export default dshprofileSlice.reducer;
