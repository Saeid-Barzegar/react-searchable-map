import { lazy, Suspense } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import FallBack from "./components/FallBack/FallBack";

const SearchableMap = lazy(() =>
  import("./modules/SearchableMap/SearchableMap.container")
);

function App() {
  return (
    <StyleProvider hashPriority="high">
      <Suspense fallback={<FallBack />}>
        <SearchableMap />
      </Suspense>
    </StyleProvider>
  );
}

export default App;
