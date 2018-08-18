import React from "react";
import numeral from "numeral";
import _ from "lodash";
import classnames from "classnames";
import getBaseQueueName from "../../lib/getBaseQueueName";
import TrendAverage from "../TrendAverage/TrendAverage";

function AlarmCell({ value, alarmFn, children }) {
  const isAlarm = alarmFn(value);

  const className = classnames({ "is-alarm": isAlarm });
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

const numberFormatter = row => numeral(row.value).format("0a");
const perSecondFormatter = row => `${numeral(row.value).format("0.0a")}/s`;

const withAlarm = (queueConfig, formatter) => row => {
  const queueBaseName = row.row.baseName;
  const alarmFn =
    queueConfig[queueBaseName] && queueConfig[queueBaseName].alarm.noConsumers === false
      ? () => false
      : equalsFn(0);

  return (
    <AlarmCell value={row.value} alarmFn={alarmFn}>
      {formatter(row)}
    </AlarmCell>
  );
};

const withFormatter = formatter => row => formatter(row);

function getColumns(queueConfig) {
  return [
    {
      Header: "🔗",
      accessor: item => `/#/queues/%2F/${item.name}`,
      id: "link",
      maxWidth: 30,
      Cell: row => (
        <a href={row.value} target="_blank">
          🔗
        </a>
      ),
      aggregate: vals => vals[0],
      filterable: false,
      pickable: false,
      show: true
    },
    {
      pivot: true,
      Header: () => <strong>Overridden Pivot Column Header Group</strong>,
      pickable: false,
      show: true
    },
    {
      Header: "Name",
      accessor: "name",
      show: false,
      minWidth: 500,
      filterMethod: containsFilter,
      pickable: false
    },
    {
      Header: "Overview",
      columns: [
        {
          Header: "Base queue name",
          id: "baseName",
          minWidth: 500,
          accessor: item => getBaseQueueName(item.name),
          filterMethod: containsFilter,
          pickable: false,
          show: true
        },
        {
          Header: "Node",
          id: "node",
          maxWidth: 200,
          accessor: item => {
            const node = item.node;
            const match = node.match(/\d+-\d+-\d+-\d+/);
            if (match) {
              const [ip] = match;
              return ip.replace(/-/g, ".");
            } else {
              return node;
            }
          },
          aggregate: vals => (vals.length == 1 ? vals[0] : ""),
          filterMethod: containsFilter,
          pickable: true,
          show: true
        },
        // features (with policy)
        // features (no policy)
        {
          Header: "Policy",
          accessor: "policy",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Consumers count",
          accessor: "consumers",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withAlarm(queueConfig, numberFormatter),
          filterable: false,
          pickable: true,
          show: true
        },
        {
          Header: "Consumers utilisation",
          accessor: "consumer_utilisation",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "State",
          accessor: "state",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          filterable: false,
          pickable: true,
          show: false
        }
      ]
    },
    {
      Header: "Messages",
      columns: [
        {
          Header: "Ready",
          accessor: "messages_ready",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter), // TODO: make default alarm value
          filterable: false,
          pickable: true,
          show: true
        },
        {
          Header: "Unacknowledged",
          accessor: "messages_unacknowledged",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "In memory",
          accessor: "messages_ram",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Persistent",
          accessor: "messages_persistent",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Total",
          accessor: "messages",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        }
      ]
    },
    {
      Header: "Message bytes",
      columns: [
        {
          Header: "Ready",
          accessor: "message_bytes_ready",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Unacknowledged",
          accessor: "message_bytes_unacknowledged",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "In memory",
          accessor: "message_bytes_message_bytes_ramnacknowledged",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Persistent",
          accessor: "message_bytes_persistent",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Total",
          accessor: "message_bytes",
          maxWidth: 50,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(numberFormatter),
          filterable: false,
          pickable: true,
          show: false
        }
      ]
    },
    {
      Header: "Message rates",
      columns: [
        {
          Header: "Incoming",
          accessor: "message_stats.publish_details.rate",
          maxWidth: 120,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(perSecondFormatter),
          filterable: false,
          pickable: true,
          show: true
        },
        {
          Header: "deliver",
          accessor: "message_stats.deliver_details.rate",
          maxWidth: 120,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(perSecondFormatter),
          filterable: false,
          pickable: true,
          show: true
        },
        {
          Header: "redelivered",
          accessor: "message_stats.redeliver_details.rate",
          maxWidth: 120,
          aggregate: vals => _.sum(vals),
          Cell: row => {
            return (
              <AlarmCell value={row.value} alarmFn={moreThanFn(0)}>
                {numeral(row.value).format("0.0a")}/s
              </AlarmCell>
            );
          },
          filterable: false,
          pickable: true,
          show: true
        },
        {
          Header: "ack",
          accessor: "message_stats.ack_details.rate",
          maxWidth: 120,
          aggregate: vals => _.sum(vals),
          Cell: withFormatter(perSecondFormatter),
          filterable: false,
          pickable: true,
          show: false
        },
        {
          Header: "Trend average",
          id: "trendAverage",
          accessor: "trendAverage",
          aggregate: vals => ({
            trend1m: _.meanBy(vals, "trend1m"),
            trend5m: _.meanBy(vals, "trend5m"),
            trend15m: _.meanBy(vals, "trend15m")
          }),
          Cell: row => (
            <TrendAverage
              trend1m={row.value.trend1m}
              trend5m={row.value.trend5m}
              trend15m={row.value.trend15m}
            />
          ),
          filterable: false,
          pickable: true,
          show: false
        }
      ]
    }
  ];
}

export default getColumns;
