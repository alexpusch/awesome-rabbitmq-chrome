import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import getColumns from "./columns.js";
import "./QueuesTable.css";
import getBaseQueueName from "../../lib/getBaseQueueName";
import ColumnPicker from "../ColumnPicker/ColumnPicker";

class QueuesTable extends Component {
  constructor(args) {
    super(args);

    const columns = getColumns(this.props.config.queuesConfig);

    this.state = {
      columns: columns
    };
  }

  render() {
    const data = this.props.data;
    const numberOfRows = _.uniq(data.map(item => getBaseQueueName(item.name))).length;

    const onColumnsChange = columns => {
      this.setState({ columns });
    };

    return (
      <div className="queues-table">
        <ColumnPicker columns={this.state.columns} onColumnChange={onColumnsChange} />
        <ReactTable
          filterable
          data={data}
          columns={this.state.columns}
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
  }
}

export default QueuesTable;
