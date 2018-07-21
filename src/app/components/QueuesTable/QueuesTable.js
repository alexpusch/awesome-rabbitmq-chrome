import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import getColumns from "./columns.js";
import "./QueuesTable.css";
import getBaseQueueName from "../../lib/getBaseQueueName";

const QueuesTable = props => {
  const data = props.data;
  const numberOfRows = _.uniq(data.map(item => getBaseQueueName(item.name))).length;
  const columns = getColumns(props.config.queuesConfig);

  return (
    <div className="App">
      <ReactTable
        filterable
        data={data}
        columns={columns}
        pageSize={Math.max(numberOfRows, 15)}
        pivotBy={["baseName"]}
        collapseOnDataChange={false}
        showPagination={false}
        showPageSizeOptions={false}
        className="-striped -highlight"
        style={{
          height: "calc(100vh - 200px)" // This will force the table body to overflow and scroll, since there is not enough room
        }}
      />
    </div>
  );
};

export default QueuesTable;
