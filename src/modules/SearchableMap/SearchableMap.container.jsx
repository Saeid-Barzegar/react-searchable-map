import { setIsLoading } from "../../store/reducers/commonSlice";
import SearchableMapComponent from "./SearchableMap.component";
import { useDispatch, useSelector } from "react-redux";
 

const SearchableMapContainer = () => {
  const dispatch = useDispatch();
  const commonState = useSelector(state => state.common)

  const componentProps = {
    isLoading: commonState.isLoading,
    setLoading: (value) => dispatch(setIsLoading(value)),
  };

  return <SearchableMapComponent {...componentProps} />
}

export default SearchableMapContainer;
