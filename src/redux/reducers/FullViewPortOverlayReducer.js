/* eslint-disable no-whitespace-before-property */

import { createAction, createReducer } from "@reduxjs/toolkit";

const increment = createAction("increment");
const decrement = createAction("decrement");

const isActionWithNumberPayload = (action) => {
  return typeof (action.payload === "number");
};

const initialState = {
  counter: 0,
  sumOfNumberPayloads: 0,
  unhandledActions: 0,
};

const FullViewPortOverlayReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(increment, (state, action) => {
      state.counter += action.payload;
    })
    .addCase(decrement, (state, action) => {
      state.counter -= action.payload;
    })
    .addMatcher(isActionWithNumberPayload, (state, action) => {})
    .addDefaultCase((state, action) => {});
});

export default FullViewPortOverlayReducer;
