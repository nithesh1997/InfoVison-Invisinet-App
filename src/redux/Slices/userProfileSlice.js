import { createSlice } from "@reduxjs/toolkit";

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    id: "",
    name: "Unknown",
    role: "Unknown",
  },
  reducers: {
    setUserProfile: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
