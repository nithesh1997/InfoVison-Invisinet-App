export const SearchTable = (rows, searchText) => {
  const newRows = [...rows].filter((row) => {
    const keys = Object.keys(row);

    const result = keys.filter((key) => {
      const reserved = ["isChecked", "__isEditMode", "id"];

      return reserved.includes(key)
        ? 0
        : `${row[key]}`
            .trim()
            .toLowerCase()
            .includes(`${searchText}`.trim().toLowerCase());
    }).length;

    return Boolean(result);
  });

  return newRows;
};
