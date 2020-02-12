import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import App from "./App";

import './index.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
