import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import MapGL, { FlyToInterpolator } from "react-map-gl";
import axios from "axios";
import { get, isEmpty } from "lodash";
import SearchBox from "../../components/SearchBox";
import SearchListItem from "../../components/SearchListItem";

axios.defaults.baseURL = process.env.REACT_APP_MAPBOX_BASE_URL;
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const SearchableMapComponent = () => {
  const mapRef = useRef();
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState({ text: '', isLoading: false, });
  const [viewport, setViewport] = useState({
    longitude: 101.69956738701049,
    latitude: 3.147498159675069,
    zoom: 10,
  });

  const handleViewportChange = useCallback(newViewport => {
      setViewport(newViewport)
  },[]);

  const getUserLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport(state => ({
        ...state,
        lalatitude: get(position, "coords.latitude", 0),
        longitude: get(position, "coords.longitude", 0),
        zoom: 15,
      }));
    });
  }, [setViewport]);

  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])
  
  const getLocationSuggestion = async (text) => {
    const endpoint = `/geocoding/v5/mapbox.places/${text}.json?proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}&limit=10`;
    setSearch(state => ({...state, isLoading: true}))
    try {
      const response = await axios.get(endpoint);
      const data = get(response, 'data.features', []);
      const process = data.map(item => ({
        value: get(item, 'center', ''),
        label: <SearchListItem title={get(item, 'text', '')} details={get(item, 'place_name', '')}/>,
      }));
      setLocations(process);
    } catch (error) {
      console.error("Error in fetch locations: ", error)
    } finally {
      setSearch(state => ({ ...state, isLoading: false }))
    }
  };

  const handleSearch = async (text) => {
    if (isEmpty(text)) {
      setLocations([]);
    } else {
      await getLocationSuggestion(text)
    }
    setSearch(state => ({
      ...state,
      text: text
    }));
  };

  const handleClearSearch = () => {
    setSearch(state => ({
      ...state,
      text: ''
    }));
    setLocations([]);
  }

  const selectSearchItemHandler = coordinate => {
    setViewport(state => ({
      ...state,
      longitude: coordinate[0],
      latitude: coordinate[1],
      zoom: 15
    }))
  }

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={handleViewportChange}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <SearchBox
          value={search.text}
          listData={locations}
          isLoading={get(search, 'isLoading', false)}
          shwoClose={!get(search, 'isLoading', false) && get(search, 'text', '') !== ""}
          onSearch={handleSearch}
          onSelect={selectSearchItemHandler}
          onClearSearch={handleClearSearch}
        />
      </MapGL>
    </div>
  );
};

export default SearchableMapComponent;
