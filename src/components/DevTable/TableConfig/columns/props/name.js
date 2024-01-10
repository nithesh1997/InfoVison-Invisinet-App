const headerName = "Name";
const dataKey = "name";
const type = "";
const options = [];

const minWidth = 200;
const flexWidth = 1.25;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = undefined;
const isDisableAdd = undefined;
const filterable = undefined;

const actions = undefined;

const renderViewState = (columns, row, value) => {};

const filterExecutioner = (filter, value) => true;

const sortComparator = (valueA, valueB, rowA, rowB) => {
  return valueA > valueB ? 1 : valueA === valueB ? 0 : -1;
};

const inputValidator = (event, row) => {
  if (event._customName === "onBlur") {
    return !Boolean(Object.keys(row[dataKey]).length)
      ? {
          isValid: false,
          message: `* Input is Required`,
        }
      : row[dataKey].length <= 4
      ? {
          isValid: false,
          message: `* Required more than 4 characters`,
        }
      : {
          isValid: true,
          message: ``,
        };
  }
};

export const name = {
  type,
  sortComparator,
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
  // renderViewState,
};
