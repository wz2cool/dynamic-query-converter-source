import * as React from "react";
import { hot } from "react-hot-loader";
import Counter from "./Counter";

const App = () => (
  <div>
    <h1>动态查询转化器</h1>
    <Counter />
  </div>
);

export default hot(module)(App);
