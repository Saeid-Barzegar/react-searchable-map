import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: "",
  error: "",
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setIsLoading, setError } = commonSlice.actions;
export default commonSlice.reducer;
