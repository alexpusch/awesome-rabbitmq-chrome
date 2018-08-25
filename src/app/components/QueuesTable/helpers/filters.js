function containsFilter(filter, row) {
  return row[filter.id].includes(filter.value);
}

function queueFilter(filter, row) {
  const isBaseName = row["baseName"].includes(filter.value);
  let isNode = false;

  isNode =
    (row._subRows && row._subRows.some(subRow => subRow["node"].includes(filter.value))) ||
    (!row._subRows && row["node"].includes(filter.value));
  return isBaseName || isNode;
}

export { containsFilter, queueFilter };
