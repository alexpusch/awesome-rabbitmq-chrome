const STORAGE_KEY = "awesome-rabbit__columns-state";

const getColumnsState = columnGroups => {
  return columnGroups.reduce((result, columnGroup) => {
    const header = columnGroup.Header;
    const groupsShownColumns = columnGroup.columns
      .filter(column => column.show)
      .map(column => column.Header);

    return Object.assign({}, result, { [header]: groupsShownColumns });
  }, {});
};

const loadColumnsState = (columnGroups, state) => {
  // evil mutations
  columnGroups.forEach(columnGroup =>
    columnGroup.columns.forEach(column => {
      column.show = state[columnGroup.Header].includes(column.Header);
    })
  );

  return columnGroups;
};

const ColumnStateProvider = {
  loadState(columnGroups) {
    const stateString = window.localStorage.getItem(STORAGE_KEY);
    if (stateString) {
      const state = JSON.parse(stateString);
      return loadColumnsState(columnGroups, state);
    } else {
      return columnGroups;
    }
  },

  saveState(columnGroups) {
    const state = getColumnsState(columnGroups);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

export default ColumnStateProvider;
