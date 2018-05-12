import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';
import axios from 'axios';
import getColumns from './columns';
import './QueuesTable.css';
import QueuesHealthState from './helpers/QueueHealthState';
import getBaseQueueName from './helpers/getBaseQueueName';

const URL =
  '/api/queues?page=1&page_size=300&name=&use_regex=false&pagination=true';

class App extends Component {
  constructor(props) {
    super(props);
    this.config = props.config;
    this.queuesHealthState = new QueuesHealthState(6);
    this.state = {
      data: []
    };
  }

  refreshData() {
    axios({
      method: 'get',
      url: URL,
      withCredentials: true,
      headers: { authorization: this.config.authHeader }
    }).then(json => {
      const items = json.data.items;
      this.queuesHealthState.addDataPoint(items);

      const itemsWithWindow = items.map((queue, i) => {
        return Object.assign({}, queue, {
          health: this.queuesHealthState.getWindow(queue.name)
        });
      });

      const numberOfRows = _.uniq(
        items.map(item => getBaseQueueName(item.name))
      ).length;

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
          pageSize={numberOfRows}
          pivotBy={['baseName']}
          collapseOnDataChange={false}
          showPagination={false}
          showPageSizeOptions={false}
          className="-striped -highlight"
          style={{
            height: 'calc(100vh - 200px)' // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
      </div>
    );
  }
}

export default App;
