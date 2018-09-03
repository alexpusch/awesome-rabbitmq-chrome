import React from "react";
import numeral from "numeral";
import _ from "lodash";
import classnames from "classnames";
import getBaseQueueName from "../../lib/getBaseQueueName";
import TrendAverage from "../TrendAverage/TrendAverage";
import { containsFilter, queueFilter, numericRangeFilter } from "./helpers/filters";
import {
  numberFormatter,
  perSecondFormatter,
  bytesFormatter,
  stateFormatter,
  percentFormatter
} from "./helpers/formatters";
import { unique, first, sum, empty } from "./helpers/aggregates";
import NumericFilter from "../NumericFilter/NumericFilter";
import TextFilter from "../TextFilter/TextFilter";

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

const withFilterComponent = Component => ({ filter, onChange }) => (
  <Component filter={filter} onChange={onChange} />
);

const numericHeaderClassNames = "numeric-header";

function getColumns(queueConfig) {
  return [
    {
      Header: "🔗",
      accessor: item => {
        console.log("item", item.name);
        return `/#/queues/%2F/${item.name}`;
      },
      id: "link",
      maxWidth: 40,
      Cell: row => {
        return row.value ? (
          <a href={row.value} target="_blank">
            🔗
          </a>
        ) : (
          ""
        );
      },
      aggregate: first,
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
      filterMethod: containsFilter,
      pickable: false
    },
    {
      Header: "Overview",
      columns: [
        {
          Header: "Queue",
          id: "baseName",
          accessor: item => getBaseQueueName(item.name),
          filterMethod: queueFilter,
          Filter: withFilterComponent(TextFilter),
          pickable: false,
          show: true,
          Cell: cellData => {
            // https://github.com/react-tools/react-table/issues/882
            if (cellData.original) {
              cellData.pivoted = false;
              return <div style={{ marginLeft: "30px" }}>{cellData.row.node}</div>;
            }
          }
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
          aggregate: empty,
          filterMethod: containsFilter,
          pickable: false,
          show: false
        },
        // features (with policy)
        // features (no policy)
        {
          Header: "Policy",
          accessor: "policy",
          maxWidth: 150,
          aggregate: unique,
          filterable: true,
          Filter: withFilterComponent(TextFilter),
          filterMethod: containsFilter,
          pickable: true,
          show: false
        },
        {
          Header: "Consumers count",
          accessor: "consumers",
          maxWidth: 100,
          aggregate: sum,
          Cell: withAlarm(queueConfig, numberFormatter),
          filterable: true,
          pickable: true,
          show: true,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Consumers utilisation",
          id: "consumer_utilisation",
          accessor: item => Math.floor(item.consumer_utilisation * 100),
          maxWidth: 100,
          aggregate: vals => _.mean(vals),
          Cell: withFormatter(percentFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "State",
          accessor: "state",
          maxWidth: 100,
          aggregate: unique,
          filterable: false,
          pickable: true,
          Cell: withFormatter(stateFormatter),
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
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(numberFormatter), // TODO: make default alarm value
          filterable: true,
          pickable: true,
          show: true,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Unacknowledged",
          accessor: "messages_unacknowledged",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(numberFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "In memory",
          accessor: "messages_ram",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(numberFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Persistent",
          accessor: "messages_persistent",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(numberFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Total",
          accessor: "messages",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(numberFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        }
      ]
    },
    {
      Header: "Message bytes",
      columns: [
        {
          Header: "Ready",
          accessor: "message_bytes_ready",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(bytesFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Unacknowledged",
          accessor: "message_bytes_unacknowledged",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(bytesFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "In memory",
          accessor: "message_bytes_message_bytes_ramnacknowledged",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(bytesFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Persistent",
          accessor: "message_bytes_persistent",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(bytesFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Total",
          accessor: "message_bytes",
          maxWidth: 100,
          aggregate: sum,
          Cell: withFormatter(bytesFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
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
          aggregate: sum,
          Cell: withFormatter(perSecondFormatter),
          filterable: true,
          pickable: true,
          show: true,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "deliver",
          accessor: "message_stats.deliver_details.rate",
          maxWidth: 120,
          aggregate: sum,
          Cell: withFormatter(perSecondFormatter),
          filterable: true,
          pickable: true,
          show: true,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "redelivered",
          accessor: "message_stats.redeliver_details.rate",
          maxWidth: 120,
          aggregate: sum,
          Cell: row => {
            return (
              <AlarmCell value={row.value} alarmFn={moreThanFn(0)}>
                {numeral(row.value).format("0.0a")}/s
              </AlarmCell>
            );
          },
          filterable: true,
          pickable: true,
          show: true,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "ack",
          accessor: "message_stats.ack_details.rate",
          maxWidth: 120,
          aggregate: sum,
          Cell: withFormatter(perSecondFormatter),
          filterable: true,
          pickable: true,
          show: false,
          Filter: withFilterComponent(NumericFilter),
          filterMethod: numericRangeFilter,
          headerClassName: numericHeaderClassNames
        },
        {
          Header: "Trend average",
          id: "trendAverage",
          accessor: "trendAverage",
          maxWidth: 300,
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
