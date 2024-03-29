import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { getGeoLocationSearchResult } from "../utils/helpers";

const initialState = {
  searchHistory: [],
  locations: [],
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    addToSearchHistory: (state, action) => {
      const newList = [...state.searchHistory, action.payload];
      state.searchHistory = newList;
    },
    setLocations: (state, action) => {
      state.locations = get(action, "payload", []);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGeoLocationSearchResult.fulfilled, (state, action) => {
      state.locations = action.payload;
    });
  },
});

export const { addToSearchHistory, setLocations } = mapSlice.actions;
export default mapSlice.reducer;
