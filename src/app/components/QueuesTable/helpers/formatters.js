import React from "react";
import numeral from "numeral";
import bytes from "bytes";

const numberFormatter = row => numeral(row.value).format("0a");
const percentFormatter = row => `${row.value}%`;
const perSecondFormatter = row => `${numeral(row.value).format("0.0a")}/s`;
const bytesFormatter = row => bytes(row.value);
const stateFormatter = row => {
  const states = {
    running: "green",
    blocked: "red",
    blocking: "yellow",
    flow: "yellow",
    down: "red",
    crashed: "red",
    stopped: "red"
  };

  const color = states[row.value];
  return <div style={{ color: color }}>{row.value}</div>;
};

export { numberFormatter, perSecondFormatter, bytesFormatter, stateFormatter, percentFormatter };
