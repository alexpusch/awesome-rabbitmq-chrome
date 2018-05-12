export default [
  {
    Header: 'Name',
    accessor: 'name',
    show: false,
    minWidth: 500
  },
  {
    Header: 'Node',
    id: 'node',
    minWidth: 50,
    accessor: item => {
      const node = item.node;
      const [ip] = node.match(/\d+-\d+-\d+-\d+/);
      return ip.replace(/-/g, '.');
    }
  },
  {
    Header: 'Consumers',
    accessor: 'consumers',
    minWidth: 30,
    aggregate: vals => _.sum(vals)
  },
  {
    Header: 'ready',
    accessor: 'messages_ready',
    minWidth: 30,
    aggregate: vals => _.sum(vals),
    Cell: row => numeral(row.value).format('0.0a')
  },
  {
    Header: 'deliver',
    accessor: 'message_stats.deliver_details.rate',
    minWidth: 30,
    aggregate: vals => _.sum(vals),
    Cell: row => (row.value ? row.value.toFixed(0) : '')
  },
  {
    Header: 'redeliver',
    accessor: 'message_stats.redeliver_details.rate',
    minWidth: 30,
    aggregate: vals => _.sum(vals),
    Cell: row => (row.value ? row.value.toFixed(0) : '')
  },
  {
    Header: 'Base queue name',
    id: 'base',
    accessor: item => {
      const regex = /sharding: ([^ ]+) - rabbit.*/;
      const [, match] = item.name.match(regex) || [];
      return match ? match : item.name;
    }
  }
];
