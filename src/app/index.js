import React from "react";
import ReactDOM from "react-dom";
import QueuesTable from "./components/QueuesTable/QueuesTable";

export default (root, config) => {
  ReactDOM.render(
    <div>
      <QueuesTable config={config} />
    </div>,
    root
  );
};
