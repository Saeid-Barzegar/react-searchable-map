import { setIsLoading } from "../../store/reducers/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { getGeoLocationSearchResult, setLocations, addToSearchHistory } from "./model/mapSlice";
import SearchableMapComponent from "./SearchableMap.component";
import withModal from "../../components/withModal/withModal";
 

const SearchableMapContainer = (props) => {

  const dispatch = useDispatch();
  const commonState = useSelector(state => state.common);
  const mapState = useSelector(state => state.map);

  const componentProps = {
    isLoading: commonState.isLoading,
    locations: mapState.locations,
    searchHistory: mapState.searchHistory,
    searchInfo: mapState.searchInfo,
    setLoading: value => dispatch(setIsLoading(value)),
    setLocations: value => dispatch(setLocations(value)),
    getGeoLocations: text => dispatch(getGeoLocationSearchResult(text)),
    addToHistory: item => dispatch(addToSearchHistory(item)),
    ...props
  };

  return <SearchableMapComponent {...componentProps} />
}

export default withModal(SearchableMapContainer);
