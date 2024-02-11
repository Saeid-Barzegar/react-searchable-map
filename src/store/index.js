import { configureStore } from "@reduxjs/toolkit";
// middlewares
import { thunk } from "redux-thunk";
import logger from "redux-logger";
// reducers
import commonReducer from "./reducers/commonSlice";
import mapReducer from "../modules/SearchableMap/model/mapSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, logger),
  devTools: process.env.REACT_APP_NODE_ENV !== "production",
});
