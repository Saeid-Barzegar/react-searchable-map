import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import MapGL, { NavigationControl, FullscreenControl, MapProvider, ScaleControl, GeolocateControl, Marker } from "react-map-gl";
import { get, isEmpty } from "lodash";
import PropTypes from "prop-types";
// components
import SearchBox from "../../components/SearchInput/SearchInput";
import SearchListItem from "../../components/SearchListItem/SearchListItem";
import { LOADING } from "../../constants/loading";
// styles
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const SearchableMapComponent = props => {
  const {
    isLoading,
    locations,
    setLocations,
    getGeoLocations,
    addToHistory,
    searchHistory,
    searchInfo
  } = props;

  const mapRef = useRef(null);
  const [state, setState] = useState({
    search: '',
    selected: null,
    showList: false,
    viewport: {
      width: "100%",
      height: "100%",
      mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN,
      mapStyle: "mapbox://styles/mapbox/streets-v9",
      asyncRender: true,
      longitude: 101.69956738701049,
      latitude: 3.147498159675069,
      zoom: 10,
    }
  })

  const locationData = useMemo(() => locations.map(item => ({
    ...item,
    label: (
      <SearchListItem
        title={get(item, "label.title", "")}
        details={get(item, "label.details", "")}
      />
    ),
  })), [locations]);

  const canShowHistory = useMemo(() => isEmpty(state.search)
    && isEmpty(locationData)
    && !isEmpty(searchHistory)
  , [state.search, locationData, searchHistory]);

  const getUserLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setState(state => ({
        ...state,
        viewport: {
          ...state.viewport,
          latitude: get(position, "coords.latitude"),
          longitude: get(position, "coords.longitude"),
          zoom: 15,
        }
      }));
    });
  }, []);

  useEffect(() => {
    getUserLocation()
  }, [getUserLocation]); 
  
  const handleSearch = async (text) => {
    if (isEmpty(text)) {
      setLocations([]);
    } else {
      await getGeoLocations(text)
      setState(state => ({
      ...state,
      showList: true
    }));
    }
    setState(state => ({
      ...state,
      search: text
    }));
  };

  const handleClearSearch = () => {
    setState(state => ({
      ...state,
      search: '',
      selected: null,
      showList: false
    }))
    setLocations([]);
  }

  const selectSearchItemHandler = coordinate => {
    if (canShowHistory) {
      const selectedItem = searchHistory.filter(item => item.value[0] === coordinate[0])[0]
      handleSearch(selectedItem.label)
      return setState(state => ({
        ...state,
        search: selectedItem.label,
        showList: true,
      }))
    }
    if (!isEmpty(state.search) && searchHistory.filter(item => item.label === state.search).length === 0) {
      addToHistory({
        label: state.search,
        value: coordinate,
      });
    }
    setState(state => ({
      ...state,
      showList: false,
      selected: {
        longitude: coordinate[0],
        latitude: coordinate[1],
      },
      viewport: {
        ...state.viewport,
        longitude: coordinate[0],
        latitude: coordinate[1],
        zoom: 15
      }
    }));
  }

  const geoLocateHandler = event => {
    setState(state => ({
      ...state,
      viewport: {
        ...state.viewport,
        latitude: event.coords.latitude,
        longitude: event.coords.longitude
      }
    }));
  };

  const onMapDrag = event => {
    setState(state => ({
      ...state,
      viewport: {
        ...state.viewport,
        latitude: get(event, 'viewState.latitude'),
        longitude: get(event, 'viewState.longitude')
      }
    }));
  };

  const onMapZoom = event => {
    setState(state => ({
      ...state,
      viewport: {
        ...state.viewport,
        zoom: event.viewState.zoom
      }
    }));
  };

  const inputFocusHandler = () => {
    setState(state => ({
      ...state,
      showList: true
    }));
  };
  
  const inputBlurHandler = () => {
    setState(state => ({
      ...state,
      showList: false
    }));
  };

  useEffect(() => {
    setState(state => ({
      ...state,
      showList: canShowHistory && isEmpty(locationData)
    }))
  }, [canShowHistory, locationData]);

  return (
    <MapProvider>
      <MapGL
        ref={mapRef}
        style={{ width: '100%', height: '100vh' }}
        {...state.viewport}
        onZoom={onMapZoom}
        onDrag={onMapDrag}
      >
        <SearchBox
          value={state.search}
          options={canShowHistory ? searchHistory : locationData}
          loading={isLoading === LOADING.SEARCH_LOCATION}
          showclose={isLoading !== LOADING.SEARCH_LOCATION && state.search !== ""}
          searchhistory={searchHistory}
          showlist={state.showList}
          onSearch={handleSearch}
          onSelect={selectSearchItemHandler}
          onClearSearch={handleClearSearch}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <ScaleControl />
        <GeolocateControl
          showUserLocation={true}
          onGeolocate={geoLocateHandler}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        {!isEmpty(state.selected) && (
          <Marker
            color="#e50000"
            latitude={state.selected.latitude}
            longitude={state.selected.longitude}
            anchor="bottom"
            pitchAlignment="map"
            onClick={() => {
              const { showModal, setModalData } = props;
              const selectedPoint = searchInfo?.filter(info => info?.center[0] === state?.selected?.longitude)[0];
              setModalData({
                title: <h3 style={{margin: 0, cursor: 'move'}}>Information</h3>,
                content: (
                  <div>
                    <h3>{selectedPoint.text}</h3>
                    <p><b>Address:</b> {selectedPoint.place_name}</p>
                  </div>
                ),
              });
              showModal(true)
            }}
          />
        )}
      </MapGL>
    </MapProvider>
  );
};

SearchableMapComponent.propTypes = {
  isLoading: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  setLocations: PropTypes.func.isRequired,
  getGeoLocations: PropTypes.func.isRequired,
  searchHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  addToHistory: PropTypes.func.isRequired,
};

export default SearchableMapComponent;
