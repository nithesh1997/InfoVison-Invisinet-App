import CircularProgressWithLabel from "../../../../PageLoader/CircularProgressWithLabel";

const headerName = "Trust Level";
const dataKey = "trustlevel";
const type = "free-solo-single";
const options = [0, 1, 2, 3, 4, 5, 6, 7];

const minWidth = 200;
const flexWidth = 0.5;
const headerAlignment = "left";
const contentAlignment = "center";

const hideInViewState = undefined;
const sortable = true;
const isDisableEdit = false;
const isDisableAdd = undefined;
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

const renderViewState = (columns, row, value) => {
  const TrustLevel = (props) => {
    const minLevel = 0;
    const maxLevel = 7;

    return (
      <CircularProgressWithLabel
        size={36}
        value={(100 * props.level) / (maxLevel - minLevel)}
        displayValue={props.level}
        style={{ margin: "0.5em" }}
      />
    );
  };

  return <TrustLevel level={value} />;
};

const sortComparator = (valueA, valueB, rowA, rowB) => {
  return valueA > valueB ? 1 : valueA === valueB ? 0 : -1;
};

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

export const trustlevel = {
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
  sortComparator,
  renderViewState,
  filterExecutioner,
  actions,
};
