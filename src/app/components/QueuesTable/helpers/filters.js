function containsFilter(filter, row) {
  return row[filter.id].includes(filter.value);
}

export { containsFilter };
