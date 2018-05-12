import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';
import axios from 'axios';
import numeral from 'numeral';
import columns from './columns';

const URL =
  '/api/queues?page=1&page_size=300&name=&use_regex=false&pagination=true';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  refreshData() {
    axios({ method: 'get', url: URL, withCredentials: true }).then(json => {
      this.setState({ data: json.data.items });

      setTimeout(this.refreshData.bind(this), 5000);
    });
  }

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const data = this.state.data;
    return (
      <div className="App">
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={50}
          pivotBy={['base']}
          collapseOnDataChange={false}
          showPagination={false}
          showPageSizeOptions={false}
          style={{
            height: 'calc(100vh - 200px)' // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
      </div>
    );
  }
}

export default App;
