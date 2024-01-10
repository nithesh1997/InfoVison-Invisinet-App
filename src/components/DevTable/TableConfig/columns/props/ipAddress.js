const headerName = "IP Address / MAC";
const dataKey = "ipaddress";
const type = "text";
const options = [];

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
  if (event._reactName === "onBlur") {
    const valid = { isValid: true, message: `` };

    const required = {
      isValid: false,
      message: "IP Address field is mandatory",
    };

    const inValidAddress = {
      isValid: false,
      message: "IP Address is Invalid",
    };

    const inValidPrefix = {
      isValid: false,
      message: "IP Address Prefix is Invalid",
    };

    const inValidSlashes = {
      isValid: false,
      message: "IP Address Prefix Slashes is Invalid",
    };

    const ipRegex = new RegExp(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    );
    const prefixRegex = new RegExp(/^\d{1,2}$/);

    const value = event.target.value;

    const ip = value.split("/")[0];
    const prefix = value.split("/")[1];

    const ipRegexTest = !Boolean(ipRegex.test(ip));

    const isPrefix = prefix && (isNaN(prefix) || parseInt(prefix) > 32);
    const isSlashes = !Boolean(value.split("/").length === 2);
    const isEndsWithSlash = value.endsWith("/");

    if (event._reactName === "onBlur") {
      if (!Boolean(value.length)) {
        return required;
      }

      if (ipRegexTest) {
        return inValidAddress;
      }

      if (isPrefix) {
        return inValidPrefix;
      }

      if (value.includes("/")) {
        if (isSlashes || isEndsWithSlash) {
          return inValidSlashes;
        }
      }

      return valid;
    }
  }
};

export const ipAddress = {
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
