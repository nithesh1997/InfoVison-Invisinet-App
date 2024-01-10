/* eslint-disable no-whitespace-before-property */

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import FullViewPortOverlayReducer from "../reducers/FullViewPortOverlayReducer";
// import orderReducer from "./store/reducers/orders" ;
// import authReducer from "./store/reducers/auth" ;

const rootReducers = combineReducers({
  FullViewPortOverlay: FullViewPortOverlayReducer,
  // order: orderReducer,
  // auth: authReducer
});

const composeEnhancers =
  (process.env.NODE_ENV !== "production"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;
const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;
