import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";

export default (root, config) => {
  ReactDOM.render(
    <div>
      <App config={config} />
    </div>,
    root
  );
};
