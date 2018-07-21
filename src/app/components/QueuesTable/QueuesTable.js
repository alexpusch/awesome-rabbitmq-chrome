import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";
import axios from "axios";
import getColumns from "./columns.js";
import "./QueuesTable.css";
import QueuesAverageState from "../../lib/QueuesAverageState";
import getBaseQueueName from "../../lib/getBaseQueueName";
import TimeConsts from "../../lib/TimeConsts";
import getTrend from "../../lib/getTrend";

const URL = "/api/queues?page=1&page_size=300&name=&use_regex=false&pagination=true";

class App extends Component {
  constructor(props) {
    super(props);
    this.config = props.config;
    this.queuesAverageState = new QueuesAverageState();
    this.state = {
      data: []
    };
  }

  refreshData() {
    axios({
      method: "get",
      url: URL,
      withCredentials: true,
      headers: { authorization: this.config.authHeader }
    }).then(json => {
      const items = json.data.items;
      this.queuesAverageState.addDataPoint(items);

      const itemsWithWindow = items.map((queue, i) => {
        const queueAverageState1m = this.queuesAverageState.getAverage(
          queue.name,
          TimeConsts.MINUTE
        );
        const queueAverageState5m = this.queuesAverageState.getAverage(
          queue.name,
          5 * TimeConsts.MINUTE
        );
        const queueAverageState15m = this.queuesAverageState.getAverage(
          queue.name,
          15 * TimeConsts.MINUTE
        );

        return Object.assign({}, queue, {
          average: queueAverageState1m,
          trendAverage: {
            trend1m: getTrend(queueAverageState1m),
            trend5m: getTrend(queueAverageState5m),
            trend15m: getTrend(queueAverageState15m)
          }
        });
      });

      const numberOfRows = _.uniq(items.map(item => getBaseQueueName(item.name))).length;

      this.setState({
        data: itemsWithWindow,
        numberOfRows: numberOfRows
      });

      setTimeout(this.refreshData.bind(this), 5000);
    });
  }

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const data = this.state.data;
    const columns = getColumns(this.config.queuesConfig);
    const numberOfRows = this.state.numberOfRows || 0;

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
  }
}

export default App;
