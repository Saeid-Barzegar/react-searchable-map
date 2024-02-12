import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { get } from "lodash";
import { setIsLoading, setError } from "../../../store/reducers/commonSlice";
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
      const locations = get(response, "data.features", []);
      return locations;
    } catch (error) {
      setError("Error in fetch locations: ", error);
      console.error("Error in fetch locations: ", error);
      throw error;
    } finally {
      dispatch(setIsLoading(""));
    }
  }
);
