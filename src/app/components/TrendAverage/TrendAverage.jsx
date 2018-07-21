import React, { Component } from "react";
import "./TrendAverage.css";

const TrendAverage = ({ trend1m, trend5m, trend15m }) => (
  <div className="trend-average">
    <div className="trend-average__item trend-average__item--1">{trend1m.toFixed(1)}</div>
    <div className="trend-average__item trend-average__item--5">{trend5m.toFixed(1)}</div>
    <div className="trend-average__item trend-average__item--15">{trend15m.toFixed(1)}</div>
  </div>
);
export default TrendAverage;
