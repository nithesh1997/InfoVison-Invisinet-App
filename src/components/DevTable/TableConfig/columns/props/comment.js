const headerName = "Comments";
const dataKey = "comment";
const type = "multiline";
const options = [];

const minWidth = 250 * 1.25;
const flexWidth = 1.25;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = true;
const isDisableAdd = true;
const filterable = false;

const actions = undefined;

const filterExecutioner = (filter, value) => {};

const renderViewState = (columns, row, value) => {};

const sortComparator = (valueA, valueB, rowA, rowB) => {};

const inputValidator = (event, row) => {
  const value = event.target.value;

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

  if (event._customName === "onChange") {
    return (
      Boolean(Object.keys(value).length) &&
      !value.length <= 4 && {
        isValid: true,
        message: ``,
      }
    );
  }
};

export const comment = {
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
