import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import Time from "./components/Time.component";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <br />
      <Route path="/" exact component={Time} />
    </BrowserRouter>
  );
}

export default App;
