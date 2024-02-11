import { lazy, Suspense } from "react";
import "./App.css";

const SearchableMap = lazy(() =>
  import("./modules/SearchableMap/SearchableMap.component")
);

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <SearchableMap />
    </Suspense>
  );
}

export default App;
