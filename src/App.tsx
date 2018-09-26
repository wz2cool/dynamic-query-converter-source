import * as React from "react";
import { hot } from "react-hot-loader";
import Converter from "./Converter";
import "./App.css";

const App = () => (
  <div className="root">
    <Converter />
  </div>
);

export default hot(module)(App);
