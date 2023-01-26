/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";

import App from "./App";
import { DataProvider } from "./context/DataContext";

render(
  () => (
    <DataProvider>
      <App />
    </DataProvider>
  ),
  document.getElementById("root") as HTMLElement
);
