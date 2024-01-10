const filterExecutioner = (filterConfig, cellValue = "") => {
  try {
    return String(cellValue)
      .toLowerCase()
      .includes(filterConfig.text.contains.toLowerCase());
  } catch (error) {
    return true;
  }
};

const getFilterExes = (columns) => {
  const _ = {};

  columns.map(
    (column) =>
      (_[column.dataKey] = column.filterExecutioner || filterExecutioner),
  );

  return _;
};

const getFilterable = (columns) => {
  const _ = {};
  columns.map(
    (column) =>
      (_[column.dataKey] =
        column.filterable === undefined ? true : column.filterable),
  );
  return _;
};

const filterRows = (rows, columns, filters) => {
  let filteredRows = [];
  const exe = getFilterExes(columns);
  const isFilterable = getFilterable(columns);

  const getKeys = (row) =>
    Object.keys(row).filter(
      (rowKey) =>
        rowKey !== "id" &&
        rowKey !== "__isEditMode" &&
        rowKey !== "__isChecked" &&
        rowKey !== "__action",
    );

  filteredRows = rows.filter((row) => {
    let _ = getKeys(row).map((key, index) => {
      return isFilterable[key] ? exe[key](filters[key], row[key]) : true;
    });

    return !Boolean(_.includes(false));
  });

  return filteredRows;
};

export default filterRows;
