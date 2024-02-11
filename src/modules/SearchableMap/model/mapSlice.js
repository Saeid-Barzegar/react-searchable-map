import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchHistory: [],
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    addToSearchHistory: (state, action) => {
      const newList = [...state.searchHistory, action.payload];
      state.searchHistory = newList;
    },
  },
});

export const { addToSearchHistory } = mapSlice.actions;
export default mapSlice.reducer;
