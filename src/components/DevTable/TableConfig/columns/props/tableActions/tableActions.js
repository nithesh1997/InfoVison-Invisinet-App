import { editRow } from "./editRow";
import { deleteRow } from "./deleteRow";

const headerName = "Action";
const dataKey = "__action";
const type = "actions";
const options = [];

const minWidth = 240 * 0.6;
const flexWidth = 0.6;
const headerAlignment = "center";
const contentAlignment = "left";

const hideInViewState = undefined;
const sortable = false;
const isDisableEdit = undefined;
const isDisableAdd = undefined;
const filterable = undefined;

const actions = [editRow, deleteRow];

const renderViewState = (columns, row, value) => {};

const filterExecutioner = (filter, value) => {};

const sortComparator = (valueA, valueB, rowA, rowB) => {};

const inputValidator = (event, row) => {};

export const tableActions = {
  type,
  sortable,
  options,
  minWidth,
  isDisableEdit,
  isDisableAdd,
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
  // inputValidator,
  // filterExecutioner,
};
