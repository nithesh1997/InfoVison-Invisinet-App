const headerName = "TCP Tagging";
const dataKey = "tcptagging";
const type = "free-solo-single";
const options = ["SEQ", "FIN", "SYN", "ACK"];

const minWidth = 200;
const flexWidth = 0.6;
const headerAlignment = "left";
const contentAlignment = "left";

const hideInViewState = true;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = false;
const filterable = true;

const actions = undefined;

const filterExecutioner = (filter, value) => {};

const renderViewState = (columns, row, value) => {};

const sortComparator = (valueA, valueB, rowA, rowB) => {};

const inputValidator = (event, row) => {
  const value = row[dataKey];

  if (event._customName === "onBlur") {
    return value.length === 0
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

export const tcptagging = {
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
