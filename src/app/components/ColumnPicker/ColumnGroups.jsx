import React, { Component } from "react";

const ColumnGroups = ({ columnsGroups, onChange }) => (
  <div className="columns-groups">
    {columnsGroups.map((columnGroup, i) => (
      <div className="column-group" key={i}>
        <div className="column-group__header">{columnGroup.Header}</div>
        <Columns
          columns={columnGroup.columns}
          onChange={onChange}
          columnGroupHeader={columnGroup.Header}
        />
      </div>
    ))}
  </div>
);

const Columns = ({ columns, onChange, columnGroupHeader }) => (
  <div className="columns">
    {columns.map((column, i) => (
      <div key={i}>
        <label>
          <input
            type="checkbox"
            checked={isShown(column)}
            onChange={onChange.bind(null, columnGroupHeader, column.Header)}
          />
          {column.Header}
        </label>
      </div>
    ))}
  </div>
);

const isShown = column => column.show !== false;

export default ColumnGroups;
