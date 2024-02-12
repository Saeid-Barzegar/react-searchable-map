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
import ModalHeader from "./components/ModalHeader/ModalHeader";
import ModalContent from "./components/ModalContent/ModalContent";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const SearchableMapComponent = props => {
  const {
    isLoading,
    locations,
    setLocations,
    getGeoLocations,
    addToHistory,
    searchHistory,
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

  const locationData = useMemo(() => locations.map(item => {
    const locationId = get(item, 'id', '');
    const coordinates = get(item, 'geometry.coordinates');
    return ({
      label: (
        <SearchListItem
          title={get(item, "text", "")}
          details={get(item, "place_name", "")}
        />
      ),
      value: [locationId, coordinates]
    });
  }), [locations]);

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
    getUserLocation();
  }, [getUserLocation]); 
  
  const clearLocations = () => setLocations([]);

  const handleSearch = async (text) => {
    if (isEmpty(text)) {
      clearLocations();
    } else {
      if (text.length > 2) {
        await getGeoLocations(text)
        setState(state => ({
          ...state,
          showList: text.length > 2
        }));
      } else {
        clearLocations();
      }
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
    clearLocations();
  }

  const selectSearchItemHandler = info => {
    const locationId = info[0];
    const longitude = info[1][0];
    const latitude = info[1][1];

    if (canShowHistory) {
      const selectedItem = searchHistory.filter(item => {
        const itemId = item.value[0];
        return (itemId === locationId)
      })[0]
      handleSearch(selectedItem.label)
      return setState(state => ({
        ...state,
        search: selectedItem?.label,
        showList: true,
      }))
    }
    if (!isEmpty(state.search) && isEmpty(searchHistory.find(item => item.label === state.search))) {
      addToHistory({
        label: state.search,
        value: info,
      });
    }
    setState(state => ({
      ...state,
      showList: false,
      selected: {
        id: locationId,
        longitude,
        latitude
      },
      viewport: {
        ...state.viewport,
        longitude,
        latitude,
        zoom: 15
      }
    }));
  }

  const geoLocateHandler = event => {
    setState(state => ({
      ...state,
      viewport: {
        ...state.viewport,
        latitude: get(event,'coords.latitude'),
        longitude: get(event,'coords.longitude')
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
        zoom: get(event, 'viewState.zoom')
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

  const markerClickHandler = () => {
    const { showModal, setModalData } = props;
    const selectedLocation = locations.filter(item => item.id === state.selected.id)[0];
    setModalData({
      title: <ModalHeader title="Location Information"/>,
      content: <ModalContent name={selectedLocation.text} address={selectedLocation.place_name}/>,
    });
    showModal(true);
  }

  useEffect(() => {
    setState(state => ({
      ...state,
      showList: canShowHistory && isEmpty(locations)
    }))
  }, [canShowHistory, locations]);

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
            onClick={markerClickHandler}
          />
        )}
      </MapGL>
    </MapProvider>
  );
};

SearchableMapComponent.propTypes = {
  isLoading: PropTypes.string,
  setLoading: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  setLocations: PropTypes.func.isRequired,
  getGeoLocations: PropTypes.func.isRequired,
  searchHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  addToHistory: PropTypes.func.isRequired,
};

SearchableMapComponent.defaultProps = {
  isLoading: false,
  locations: []
}

export default SearchableMapComponent;
