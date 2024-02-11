import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "lodash";
import { setIsLoading } from "../../../store/reducers/commonSlice";
import { LOADING } from "../../../constants/loading";

axios.defaults.baseURL = process.env.REACT_APP_MAPBOX_BASE_URL;
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export const getGeoLocationSearchResult = createAsyncThunk(
  "map/getGeoLocationSearchResult",
  async (text, { dispatch }) => {
    const endpoint = `/geocoding/v5/mapbox.places/${text}.json?proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}&limit=10`;
    dispatch(setIsLoading(LOADING.SEARCH_LOCATION));
    try {
      const response = await axios.get(endpoint);
      const data = get(response, "data.features", []);
      const locations = data.map((item) => ({
        value: get(item, "center", ""),
        label: {
          title: get(item, "text", ""),
          details: get(item, "place_name", ""),
        },
      }));
      return {
        locations,
        searchInfo: data,
      };
    } catch (error) {
      console.error("Error in fetch locations: ", error);
      throw error;
    } finally {
      dispatch(setIsLoading(""));
    }
  }
);

const initialState = {
  searchHistory: [],
  locations: [],
  searchInfo: [],
  error: null,
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
    builder
      .addCase(getGeoLocationSearchResult.fulfilled, (state, action) => {
        state.locations = action.payload.locations;
        state.searchInfo = action.payload.searchInfo;
      })
      .addCase(getGeoLocationSearchResult.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { addToSearchHistory, setLocations } = mapSlice.actions;
export default mapSlice.reducer;
