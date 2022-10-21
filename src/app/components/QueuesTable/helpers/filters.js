import _ from "lodash";

function containsFilter(filter, row) {
  return row[filter.id].includes(filter.value);
}

function queueFilter(filter, row) {
  const isBaseName = row["baseName"].toLowerCase().includes(filter.value.toLowerCase());
  let isNode = false;

  isNode =
    (row._subRows && row._subRows.some(subRow => subRow["node"].includes(filter.value))) ||
    (!row._subRows && row["node"].includes(filter.value));
  return isBaseName || isNode;
}

function numericRangeFilter(filter, row) {
  const value = row[filter.id] ? parseInt(row[filter.id], 10) : 0;
  const { min, max } = _.defaults(filter.value, { min: -Infinity, max: Infinity });

  return value >= min && value <= max;
}

export { containsFilter, queueFilter, numericRangeFilter };
