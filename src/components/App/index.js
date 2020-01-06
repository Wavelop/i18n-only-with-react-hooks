import React from "react";
import "./style.css";
import { TranslateProvider } from "Translate";
import { HelloWorld } from "Screens";

function App() {
  return (
    <TranslateProvider>
      <HelloWorld />
    </TranslateProvider>
  );
}

export default App;
