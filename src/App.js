import { lazy, Suspense } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import "./App.css";

const SearchableMap = lazy(() =>
  import("./modules/SearchableMap/SearchableMap.container")
);

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <StyleProvider hashPriority="high">
        <SearchableMap />
      </StyleProvider>
    </Suspense>
  );
}

export default App;
