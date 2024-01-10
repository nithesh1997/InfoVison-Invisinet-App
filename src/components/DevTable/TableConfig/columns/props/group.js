const headerName = "Group";
const dataKey = "group";
const type = "free-solo-multiple";
const options = [
  "Regional Manager",
  "Co-Regional Manager",
  "Salesman",
  "Shareholder",
  "Telemarketer",
];

const minWidth = 250 * 1;
const flexWidth = 1;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = false;
const filterable = true;

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

const sortComparator = (valueA, valueB, rowA, rowB) => {
  return valueA > valueB ? 1 : valueA === valueB ? 0 : -1;
};

const inputValidator = (event, row) => {
  const value = row[dataKey];

  if (event._customName === "onBlur") {
    return !value.length
      ? {
          isValid: false,
          message: `* Input is Required`,
        }
      : {
          isValid: true,
          message: ``,
        };
  }

  if (event._customName === "onChange") {
    return (
      value.length && {
        isValid: true,
        message: ``,
      }
    );
  }
};

export const group = {
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
  filterable,
  dataKey,
  contentAlignment,
  filterExecutioner,
  actions,
  // sortComparator,
  // renderViewState,
};
