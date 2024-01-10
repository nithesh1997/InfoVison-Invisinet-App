const headerName = "Date Time";
const dataKey = "date-time";
const type = "date-time";
const options = [];

const minWidth = 200;
const flexWidth = 0.6;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = undefined;
const filterable = undefined;

const actions = undefined;

const filterExecutioner = (filter, value) => {
  try {
    return String(value)
      .toLowerCase()
      .includes(filter.text.contains.toLowerCase());
  } catch (error) {
    console.warn("Skipping default filter for value, filter: ", value, filter);
    return true;
  }
};

const renderViewState = (columns, row, value) => {};

const sortComparator = (valueA, valueB, rowA, rowB) => {};

const inputValidator = (event, row) => {
  const value = row[dataKey];

  if (event._customName === "onBlur") {
    return !Boolean(Object.keys(value).length)
      ? {
          isValid: false,
          message: `* Input is Required`,
        }
      : {
          isValid: true,
          message: ``,
        };
  }
};

export const dateTime = {
  type,
  sortable,
  options,
  minWidth,
  isDisableEdit,
  isDisableAdd,
  inputValidator,
  hideInViewState,
  headerName,
  headerAlignment,
  flexWidth,
  filterExecutioner,
  filterable,
  dataKey,
  contentAlignment,
  actions,
  // sortComparator,
  // renderViewState,
};
