const headerName = "Remote Key";
const dataKey = "remotekey";
const type = "select-single";
const options = ["False", "True"];

const minWidth = 200;
const flexWidth = 0.6;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = false;
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

export const remotekey = {
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
  actions,
  // sortComparator,
  // renderViewState,
  // filterExecutioner,
};
