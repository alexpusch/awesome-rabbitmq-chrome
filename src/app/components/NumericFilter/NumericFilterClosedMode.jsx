import React from "react";
import "./NumericFilterClosedMode.css";

const NumericFilterClosedMode = ({ min, max }) => {
  let minString = _.defaultTo(min, "-");
  let maxString = _.defaultTo(max, "-");

  return (
    <div className="numeric-filter-closed">
      <div className="numeric-filter-closed__value">{minString}</div>
      <div className="numeric-filter-closed__separator">to</div>
      <div className="numeric-filter-closed__value">{maxString}</div>
    </div>
  );
};

export default NumericFilterClosedMode;
