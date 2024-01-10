const headerName = "Time";
const dataKey = "time";
const type = "time";
const options = [];

const minWidth = 200;
const flexWidth = 0.6;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = true;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = undefined;
const filterable = undefined;

const actions = undefined;

const filterExecutioner = (filter, value) => {};

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

export const time = {
  headerName,
  dataKey,
  type,
  options,
  minWidth,
  flexWidth,
  headerAlignment,
  contentAlignment,
  hideInViewState,
  sortable,
  isDisableEdit,
  inputValidator,
  isDisableAdd,
  filterable,
  actions,
  // sortComparator,
  // renderViewState,
  // filterExecutioner,
};
