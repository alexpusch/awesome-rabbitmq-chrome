import React from 'react';
import numeral from 'numeral';
import _ from 'lodash';
import classnames from 'classnames';
import getBaseQueueName from './helpers/getBaseQueueName';

function AlarmCell({ value, alarmFn, children }) {
  const isAlarm = alarmFn(value);

  const className = classnames({ 'is-alarm': isAlarm });
  return <div className={className}>{children}</div>;
}

function moreThanFn(predicate) {
  return value => value > predicate;
}

function lessThanFn(predicate) {
  return value => value < predicate;
}

function equalsFn(predicate) {
  return value => value === predicate;
}

function containsFilter(filter, row) {
  return row[filter.id].includes(filter.value);
}

function getColumns(queueConfig) {
  return [
    {
      Header: '🔗',
      accessor: item => `/#/queues/%2F/${item.name}`,
      id: 'link',
      maxWidth: 30,
      Cell: row => (
        <a href={row.value} target="_blank">
          🔗
        </a>
      ),
      aggregate: vals => vals[0],
      filterable: false
    },
    {
      pivot: true,
      Header: () => <strong>Overridden Pivot Column Header Group</strong>
    },
    {
      Header: 'Name',
      accessor: 'name',
      show: false,
      minWidth: 500,
      filterMethod: containsFilter
    },
    {
      Header: 'Node',
      id: 'node',
      maxWidth: 200,
      accessor: item => {
        const node = item.node;
        const match = node.match(/\d+-\d+-\d+-\d+/);
        if (match) {
          const [ip] = match;
          return ip.replace(/-/g, '.');
        } else {
          return node;
        }
      },
      aggregate: vals => (vals.length == 1 ? vals[0] : ''),
      filterMethod: containsFilter
    },
    {
      Header: 'Consumers',
      accessor: 'consumers',
      maxWidth: 50,
      aggregate: vals => _.sum(vals),
      Cell: row => {
        const queueBaseName = row.row.baseName;
        const alarmFn =
          queueConfig[queueBaseName] &&
          queueConfig[queueBaseName].alarm.noConsumers === false
            ? () => false
            : equalsFn(0);

        return (
          <AlarmCell value={row.value} alarmFn={alarmFn}>
            {numeral(row.value).format('0a')}
          </AlarmCell>
        );
      },
      filterable: false
    },
    {
      Header: 'ready',
      accessor: 'messages_ready',
      maxWidth: 120,
      aggregate: vals => _.sum(vals),
      Cell: row => {
        const queueBaseName = row.row.baseName;
        const maxReady =
          queueConfig[queueBaseName] &&
          queueConfig[queueBaseName].alarm.maxReady
            ? queueConfig[queueBaseName].alarm.maxReady
            : 30000;

        const alarmFn = moreThanFn(maxReady);

        return (
          <AlarmCell value={row.value} alarmFn={alarmFn}>
            {numeral(row.value).format('0a')}
          </AlarmCell>
        );
      },
      filterable: false
    },
    {
      Header: 'publish',
      accessor: 'message_stats.publish_details.rate',
      maxWidth: 120,
      aggregate: vals => _.sum(vals),
      Cell: row => `${numeral(row.value).format('0.0a')}/s`,
      filterable: false
    },
    {
      Header: 'deliver',
      accessor: 'message_stats.deliver_details.rate',
      maxWidth: 120,
      aggregate: vals => _.sum(vals),
      Cell: row => `${numeral(row.value).format('0.0a')}/s`,
      filterable: false
    },
    {
      Header: 'redeliver',
      accessor: 'message_stats.redeliver_details.rate',
      maxWidth: 120,
      aggregate: vals => _.sum(vals),
      Cell: row => {
        return (
          <AlarmCell value={row.value} alarmFn={moreThanFn(0)}>
            {numeral(row.value).format('0.0a')}/s
          </AlarmCell>
        );
      },
      filterable: false
    },
    {
      Header: 'Trend',
      id: 'health',
      accessor: item => _.mean(item.health),
      aggregate: vals => vals[0],
      Cell: row =>
        row.value >= 1 ? (
          <div className="health--good">☺</div>
        ) : (
          <div className="health--bad">😢</div>
        )
    },
    {
      Header: 'Base queue name',
      id: 'baseName',
      minWidth: 500,
      accessor: item => getBaseQueueName(item.name),
      filterMethod: containsFilter
    }
  ];
}

export default getColumns;
