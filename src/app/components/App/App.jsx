import React, { Component } from "react";
import axios from "axios";

import QueuesTable from "../QueuesTable/QueuesTable.jsx";
import Countdown from "../Countdown/Countdown.jsx";
import QueuesAverageState from "../../lib/QueuesAverageState";
import TimeConsts from "../../lib/TimeConsts";
import getTrend from "../../lib/getTrend";

const URL = "/api/queues?page=1&page_size=300&name=&use_regex=false&pagination=true";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.queuesAverageState = new QueuesAverageState();

    this.state = { data: [] };
  }

  refreshData() {
    axios({
      method: "get",
      url: URL,
      withCredentials: true,
      headers: { authorization: this.props.config.authHeader }
    })
      .then(json => {
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

        this.setState({
          updateError: undefined,
          data: itemsWithWindow,
          lastUpdateDate: new Date().getTime()
        });

        setTimeout(this.refreshData.bind(this), this.props.config.timerInterval);
      })
      .catch(err => {
        this.setState({
          updateError: err,
          lastUpdateDate: new Date().getTime()
        });
        setTimeout(this.refreshData.bind(this), this.props.config.timerInterval);
      });
  }

  componentDidMount() {
    this.refreshData();
  }

  render() {
    return (
      <div>
        <Countdown
          isError={!!this.state.updateError}
          duration={this.props.config.timerInterval}
          startTime={this.state.lastUpdateDate}
        />
        <QueuesTable data={this.state.data} config={this.props.config} />
      </div>
    );
  }
}

export default App;
