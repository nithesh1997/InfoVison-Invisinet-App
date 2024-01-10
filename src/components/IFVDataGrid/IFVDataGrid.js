import { Box, Checkbox } from "@material-ui/core";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { ThemeProvider } from "styled-components";
import GridPortal from "./GridPortal";
import { EditPopup } from "./GridPortal/EditPopup.js";
import filterRows from "./TableComponents/Features/Filter/filterRows";
import { SearchTable } from "./TableComponents/Features/SearchTable/SearchTable";
import IFVDataGridActionBar from "./TableComponents/IFVDataGridActionBar.js";
import IFVDataGridTable from "./TableComponents/IFVDataGridTable.js";
import IFVDataGridTablePagination from "./TableComponents/IFVDataGridTablePagination.js";
import { Search } from "./TableComponents/LeftPaneIcons";
import { MoreishActions } from "./TableComponents/RightPaneIcons";
import { AddRecord } from "./TableComponents/RightPaneIcons/AddRecord";
import { useSelector } from "react-redux";
import { CsvExport } from "./TableComponents/RightPaneIcons/CsvExport/CsvExport";

export const DataGridContext = createContext();
export const SelectAllRowsContext = createContext();
export const HandlersContext = createContext();
export const IsSelectMultipleRows = createContext();
export const SelectedRows = createContext();
export const IsPopupEditClosed = createContext();

const initSearch = () => {
  return { value: "" };
};

const initSelectAllRows = () => ({
  checked: false,
  disabled: false,
  defaultChecked: false,
  indeterminate: false,
});

const IFVDataGridRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  width: 100%;
  flex-grow: 1;
  border-radius: 0.5em;
  overflow: hidden;
  position: relative;
`;

const calculateColumnWidth = (cols) => {
  let allFlex = true;
  let flexSum = 0;
  // let flexColCount = 0;

  cols.forEach((col) => {
    if (col.flexWidth === undefined && col.width === undefined) {
      col.flexWidth = 1; // Default assignment
    }
    if (col.flexWidth === undefined || col.width !== undefined) {
      allFlex = false;
    } else {
      flexSum += col.flexWidth;
      // flexColCount += 1;
    }
  });

  cols.forEach((col) => {
    if (col.width !== undefined) {
      col.__calcWidth = col.width;
    } else if (allFlex) {
      col.__calcWidth = ((98 / flexSum) * col.flexWidth).toFixed(2) + "%";
    } else {
      col.__calcWidth = ((98 / cols.length) & col.flexWidth).toFixed(2) + "%"; // Handling of some columns with flexWidth and some with width
    }
  });
  return cols;
};

const addDefaultStateIfNeeded = (rows) => {
  rows.forEach((row) => {
    if (row.__isEditMode === undefined) {
      row.__isEditMode = false;
    }

    if (row.isChecked === undefined) {
      row.isChecked = false;
    }
  });
  return rows;
};

const addDefaultKeys = (cols) => {
  cols.forEach((col) => {
    if (col.sortable === undefined) {
      col.sortable = true;
    }
  });
  return cols;
};

const extractHandlers = (columns) => {
  const [{ actions }] = columns.filter((column) => column.type === "actions");
  const handlers = actions.filter((action) => action["handler"]);

  return handlers;
};

const extractHrefs = (columns) => {
  const actions = columns.filter(({ dataKey }) => dataKey === "__action")[0]
    .actions;
  const actionsHref = {};

  actions.forEach(({ type, href, ...args }) => {
    const actionName = Object.keys(args)
      .map((propName) => (propName.includes("handle") ? propName : undefined))
      .filter((propName) => propName)[0];

    if (type && type !== "__edit") {
      actionsHref[actionName] = href;
    }
  });

  return actionsHref;
};

const extractPrompts = (columns) => {
  let actionsToggle = {};
  let handlerNames = [];

  const [actionObject] = columns.filter(
    ({ dataKey }) => dataKey === "__action",
  );
  const actions = actionObject.actions;

  actions.forEach(
    ({
      type,
      name,
      icon,
      isEnabled,
      prompt,
      hideEditInRow,
      colorState,
      closePortal,
      ...handlers
    }) => {
      const currHandlers = Object.keys(handlers);
      handlerNames = [...handlerNames, ...currHandlers];

      handlerNames.forEach((handlerName) => {
        if (currHandlers.includes(handlerName)) {
          actionsToggle[handlerName] = prompt ?? {
            contentTitle: "",
            contextText: "",
          };
        }
      });
    },
  );

  return actionsToggle;
};

const extractIcons = (columns) => {
  const $ = columns
    .filter((col) => col.dataKey === "__action")[0]
    .actions.filter(({ type }) => type === "toggle-enable")[0];

  return $ !== undefined ? { icons: $.icons, icon: $.icon } : {};
};

const extractActionsToggle = (columns) => {
  let actionsToggle = {};
  let handlerNames = [];

  const actionObject = columns.filter(({ dataKey }) => dataKey === "__action");
  const actions = actionObject[0].actions;

  actions.map(({ type, name, icon, isEnabled, ...handlers }) => {
    const currHandlers = Object.keys(handlers);
    handlerNames = [...handlerNames, ...currHandlers];

    handlerNames.map((handlerName) => {
      if (currHandlers.includes(handlerName)) {
        actionsToggle[handlerName] = isEnabled;
      }
    });
  });

  return actionsToggle;
};

const extractHandlerNames = (columns) => {
  let actionsName = {};
  let handlerNames = [];

  const actionObject = columns.filter(({ dataKey }) => dataKey === "__action");
  const actions = actionObject[0].actions;

  actions.map(({ type, name, icon, isEnabled, ...handlers }) => {
    const currHandlers = Object.keys(handlers);
    handlerNames = [...handlerNames, ...currHandlers];

    handlerNames.map((handlerName) => {
      if (currHandlers.includes(handlerName)) {
        actionsName[handlerName] = name;
      }
    });
  });

  return actionsName;
};

const extract = (actions) => {
  let actionHandlers = {};

  actions.forEach(({ type, name, icon, ...args }) => {
    if (
      type === "__edit" ||
      type === "__delete" ||
      type === "__download" ||
      type === "__view" ||
      type === "__restore" ||
      type === "__export" ||
      type === "view-filter-rules-configuration" ||
      type === "filter-rules-configuration" ||
      type === "upgrade-remote-firmware" ||
      type === "toggle-enable" ||
      type === "clear-filter-rules"
    ) {
      actionHandlers = { ...actionHandlers, ...args };
    }
  });

  return actionHandlers;
};

const extractPortalState = (columns) => {
  const actionObject = columns.filter(({ dataKey }) => dataKey === "__action");
  const actions = actionObject[0].actions;

  let closePortalHandler = undefined;
  const $ = () => {};

  actions.forEach(({ type, closePortal }) => {
    if (type === "__download") {
      closePortalHandler = closePortal ?? $;
    }
  });

  return closePortalHandler;
};

const pullActions = (columns) => {
  const actionObject = columns.filter(({ dataKey }) => dataKey === "__action");
  const actions = actionObject[0].actions;

  return extract(actions);
};

const addMods = (rows) => {
  const [foo, setFoo] = rows;
  setFoo(addDefaultStateIfNeeded(foo));

  return [foo, setFoo];
};

const addColMods = (cols) => {
  const [col, setCol] = cols;
  col.forEach((cl) => {
    if (cl.inputValidator === undefined) {
      cl.inputValidator = () => ({ isValid: true, message: "" });
    }
  });
  setCol(col);
  return [col, setCol];
};

// Default sort comparator
const defaultSortComaprator = (valueA, valueB) =>
  valueA > valueB ? 1 : valueA === valueB ? 0 : -1;

// Get the column's sort comparator
const getColumnSortComparator = (cols, colKey) => {
  let comparator = defaultSortComaprator;
  cols.forEach((col) => {
    if (col.dataKey === colKey) {
      if (typeof col.sortComparator === "function") {
        comparator = col.sortComparator;
      }
    }
  });
  return comparator;
};

// Get count for quick actions
const getMaxQuickActionCount = (columns) => {
  return (
    columns.filter((col) => col.dataKey === "__action")[0].maxActionsLimit ?? 2
  );
};

// checkBoxColumn
export const checkBoxCol = {
  headerName: "Checkbox",
  JSXElement: <Checkbox />,
  dataKey: "isChecked",
  type: "checkbox",
  minWidth: 50,
  flexWidth: 0,
  headerAlignment: "center",
  contentAlignment: "center",
  sortable: false,
  filterable: false,
  sortComparator: (valueA, valueB, rowA, rowB) => {
    return valueA > valueB ? 1 : valueA === valueB ? 0 : -1;
  },
};

// Initialize table columns
const initColumns = ([state, setState], config) => {
  if (config.allowMultipleRowSelection) {
    setState((oldState) => [checkBoxCol, ...state]);
  }

  return [state, setState];
};

const IFVDataGrid = forwardRef((props, ref) => {
  /* *************************************************************** */
  const { config: tableConfig, loadingData } = props;
  const { cols: columns, data: rows } = props;
  const { subconscious } = props;
  /* *************************************************************** */
  const [loading, setLoading] = loadingData;

  const [gridConfig, setGridConfig] = tableConfig;
  const [gridSubconscious, setGridSubconscious] = subconscious;

  const [gridCols, setGridCols] = addColMods(columns);

  const [rowStruct, setRowStruct] = useState({});

  const [parentRows, setParentRows] = useState([]);
  const [gridContent, setGridContent] = useState([]);
  const [dirtyRows, setDirtyRows] = useState([]);
  const [asyncedRows, setAsyncedRows] = useState([]);
  const [gridAllRows, setGridAllRows] = addMods(rows);

  const [isPortal, setIsPortal] = useState(false);
  const [isAddRow, setIsAddRow] = useState(false);
  const [dontClosePopup, setDontClosePopup] = useState(true);
  const [isEditModeHost, setIsEditModeHost] = useState(false);
  const [isCustomPopup, setCustomPopup] = useState(false);
  const [customActionType, setCustomActionType] = useState("");
  const [validationHandler, setValidationHandler] = useState({});
  const [inputHelpersText, setInputHelpersText] = useState({});
  const [modifiedRows, setModifiedRows] = useState([]);
  const [filteredRowsLength, setFilteredRowsLength] = useState(0);
  const [toggleActionIcons, setToggleActionIcons] = useState(() =>
    extractIcons(gridCols),
  );
  const maxQuickActions = getMaxQuickActionCount(gridCols);
  const [isEditClosed, setIsEditClosed] = useState(false);
  const [selectAllRows, setSelectAllRows] = useState(initSelectAllRows);
  const [checkedRows, setCheckedRows] = useState([]);
  const [search, setSearch] = useState(() => initSearch());
  const [dummyFlag, setDummyFlag] = useState(true);
  const tableHeadRef = useRef();
  const TriggerValidationReset = useState({ key: "", value: "" });
  const ResetForm = useState({ isReset: false });
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  /* *************************************************************** */

  // Keeping parent rows and checked rows in sync
  useEffect(() => {
    setParentRows((oldState) => {
      const newState = oldState.map((row) => {
        return (
          checkedRows.filter((r) => r.id === row.id)[0] || {
            ...row,
            isChecked: false,
          }
        );
      });

      return newState;
    });
  }, [checkedRows]);

  // Set parent rows only one time
  useEffect(() => {
    if (dummyFlag && gridAllRows.length) {
      setParentRows(gridAllRows);
      setDummyFlag(false);
    }
  }, [dummyFlag, gridAllRows]);

  // If any row is in edit mode will disable all checkbox
  useEffect(() => {
    setSelectAllRows((oldState) => {
      return {
        ...oldState,
        disabled: isEditModeHost || !Boolean(modifiedRows.length),
      };
    });
  }, [isEditModeHost, modifiedRows.length]);

  // Header Checkbox state
  useEffect(() => {
    const isAnyChecked = modifiedRows.filter((row) => {
      return row.isChecked;
    });

    if (!isAnyChecked.length) {
      setSelectAllRows((oldState) => ({
        ...oldState,
        checked: false,
        indeterminate: false,
      }));
    }

    if (
      isAnyChecked.length === modifiedRows.length &&
      modifiedRows.length !== 0
    ) {
      setSelectAllRows((oldState) => ({
        ...oldState,
        checked: true,
        indeterminate: false,
      }));
    }

    if (isAnyChecked.length && isAnyChecked.length !== modifiedRows.length) {
      setSelectAllRows((oldState) => ({
        ...oldState,
        checked: false,
        indeterminate: true,
      }));
    }
  }, [
    checkedRows,
    checkedRows.length,
    gridAllRows,
    gridAllRows.length,
    modifiedRows,
    modifiedRows.length,
  ]);

  // toggle select row
  const toggleSelectRow = useCallback(
    (rowID, checked) => {
      setGridAllRows((oldState) => {
        const newState = oldState.map((row) => {
          if (row.id === rowID) {
            setCheckedRows((oldState) => {
              return checked
                ? [...oldState, { ...row, isChecked: checked }]
                : oldState.filter(({ id }) => id !== rowID);
            });

            return { ...row, isChecked: checked };
          } else {
            return row;
          }
        });

        return newState;
      });
    },
    [setGridAllRows],
  );

  // toggle select all row
  const toggleSelectAllRows = useCallback(
    (checked) => {
      setSelectAllRows((oldState) => ({
        ...oldState,
        checked: checked,
        indeterminate: !checked,
      }));

      setGridAllRows((oldState) => {
        const unTouchedRows = oldState.filter((row) => {
          return !Boolean(modifiedRows.filter((r) => r.id === row.id).length);
        });

        const touchedRows = oldState.filter((row) => {
          return Boolean(modifiedRows.filter((r) => r.id === row.id).length);
        });

        const checkedRows = touchedRows.map(({ isChecked, ...row }) => ({
          isChecked: checked,
          ...row,
        }));

        setCheckedRows((oldState) => {
          const newState = oldState.filter((row) => {
            return !Boolean(checkedRows.filter((r) => r.id === row.id).length);
          });

          return checked ? [...checkedRows, ...newState] : [...newState];
        });

        const truthy = [...unTouchedRows, ...checkedRows];
        const falsy = [...unTouchedRows, ...checkedRows];

        return checked ? truthy : falsy;
      });
    },
    [modifiedRows, setGridAllRows],
  );

  // fallback
  useEffect(() => {
    setGridConfig((oldState) => ({
      ...oldState,
      allowMultipleRowSelection: oldState.allowMultipleRowSelection ?? false,
    }));
  }, []);

  const getRowPosition = (row) => {
    let rowPos = 0;

    modifiedRows.map((r, index) => {
      if (r.id === row.id) {
        rowPos = index + 1;
      }
    });

    return rowPos;
  };

  // # creates validation handlers for each columns
  useEffect(() => {
    gridCols.map((column) =>
      setValidationHandler((oldState) => ({
        ...oldState,
        [column.dataKey]: column.inputValidator,
      })),
    );
  }, []);

  // # Opens portal
  useEffect(() => isCustomPopup && setIsPortal(true), [isCustomPopup]);

  // # addHandler subject to remove after spec standards
  const { editMode, noDataMessage, addHandler } = gridConfig;
  const {
    handleEdit,
    handleSave,
    handleDiscard,
    handleDelete,
    handleDownload,
    handleView,
    handleViewFilterRulesConfig,
    handleFilterRulesConfig,
    handleUpgradeRemoteFirmware,
    handleToggle,
    handleClearFilterRules,
    handleRestore,
    handleExport,
  } = pullActions(gridCols);
  const handlersTooltip = extractHandlerNames(gridCols);
  const handlersActionToggle = extractActionsToggle(gridCols);
  const handlersPrompt = extractPrompts(gridCols);
  const handlersHref = extractHrefs(gridCols);
  const handlers = extractHandlers(gridCols);

  const { name: tableName } = gridSubconscious;
  const closeDownloadLogsPortal = extractPortalState(gridCols);
  /**********************************************************************/

  /* Grid Subconscious Activities Here */
  // Watch subconscious state to update table
  useEffect(() => {
    // Fill missing or bad values if any
    let changed = false;
    let newSubconscious = {
      ...gridSubconscious,
      chunk: gridSubconscious.chunk ?? 0,
      handleLoadMoreData: gridSubconscious.handleLoadMoreData ?? undefined,
    };

    if (typeof newSubconscious.pageSizeOptions !== "object") {
      newSubconscious.pageSizeOptions = [5, 10, 20, 50, 100];
      changed = true;
    }

    if (
      typeof newSubconscious.pageSize !== "number" ||
      newSubconscious.pageSizeOptions.indexOf(newSubconscious.pageSize) === -1
    ) {
      newSubconscious.pageSize = newSubconscious.pageSizeOptions[0];
      changed = true;
    }

    if (typeof newSubconscious.sort !== "object") {
      newSubconscious.sort = {
        column: gridCols.length > 0 ? gridCols[0].dataKey : "",
        inverse: false,
      };

      changed = true;
    } else {
      if (typeof newSubconscious.sort.column !== "string") {
        newSubconscious.sort.column =
          gridCols.length > 0 ? gridCols[0].dataKey : "";

        changed = true;
      }

      if (typeof newSubconscious.sort.inverse !== "boolean") {
        newSubconscious.sort.inverse = false;

        changed = true;
      }
    }

    let offset = 1; // Default

    if (typeof newSubconscious.page !== "number") {
      newSubconscious.page = 1;
      offset = (newSubconscious.page - 1) * newSubconscious.pageSize + 1;

      changed = true;
    } else {
      offset = (newSubconscious.page - 1) * newSubconscious.pageSize + 1;
      // Selected page can't be loaded as there are not enough rows
      if (gridAllRows.length > 0 && offset > gridAllRows.length) {
        newSubconscious.page = 1;

        changed = true;
      }
    }

    if (newSubconscious.totalRows !== gridAllRows.length) {
      newSubconscious.totalRows = gridAllRows.length;

      changed = true;
    }

    if (
      newSubconscious.totalPages !==
      Math.ceil(gridAllRows.length / newSubconscious.pageSize)
    ) {
      newSubconscious.totalPages = Math.ceil(
        gridAllRows.length / newSubconscious.pageSize,
      );

      changed = true;
    }

    // * Appending filters object to the subconcious
    if (!newSubconscious.filters) {
      const filters = {};

      gridCols.map((col) => {
        if (col.dataKey !== "__action") {
          filters[col.dataKey] = {
            text: {
              contains: "",
            },
          };
        }
      });

      newSubconscious.filters = filters;
      changed = true;
    } else {
      const filters = { ...newSubconscious.filters };

      gridCols.map((col) => {
        if (col.dataKey !== "__action" && !Boolean(filters[col.dataKey])) {
          filters[col.dataKey] = {
            text: {
              contains: "",
            },
          };
        } else if (
          filters[col.dataKey] &&
          !Boolean(filters[col.dataKey].text)
        ) {
          filters[col.dataKey] = {
            text: {
              contains: "",
            },
          };
        } else if (
          filters[col.dataKey] &&
          !Boolean(filters[col.dataKey].text.contains)
        ) {
          filters[col.dataKey] = {
            text: {
              contains: "",
            },
          };
        }
      });

      newSubconscious.filters = filters;
    }

    newSubconscious.filterShown = newSubconscious.filterShown ?? false;
    newSubconscious.searchText = newSubconscious.searchText || "";

    if (changed) {
      setGridSubconscious(newSubconscious);
      return; // Tasks below to be done on next useEffect call
    }

    let rows = [...gridAllRows];

    // * Filter the array [to apply the filters]
    rows = filterRows(rows, gridCols, newSubconscious.filters);
    rows = SearchTable(rows, newSubconscious.searchText);

    // Sort the array
    let colKey = gridSubconscious.sort.column;
    let sortComparator = getColumnSortComparator(gridCols, colKey);

    rows.sort((rowA, rowB) =>
      sortComparator(rowA[colKey], rowB[colKey], rowA, rowB),
    );

    if (gridSubconscious.sort.inverse) {
      rows.reverse();
    }

    setModifiedRows(rows);
    setFilteredRowsLength(rows.length);

    setGridContent(
      rows.slice(offset - 1, offset + newSubconscious.pageSize - 1),
    );
  }, [gridSubconscious, gridAllRows]);
  /* *************************************************************** */

  /* Watch loading and reset add row when it changes */
  useEffect(() => {
    if (loading === true) {
      setIsAddRow(false);
    }
  }, [loading]);

  const toggleIsEditModeHost = useCallback((booli) => {
    setIsEditModeHost(booli || false);
  }, []);

  // #
  useEffect(() => {
    if (dirtyRows.length === 0) {
      setIsEditModeHost(false);
    }
  }, [dirtyRows]);

  const togglePortal = useCallback((action) => {
    setIsPortal((prevAction) => {
      return action === undefined || action === null ? !prevAction : action;
    });
  }, []);

  // # row structure for addRow
  useEffect(() => {
    const foo = {};
    foo.id = "_newRow";
    foo.__isEditMode = true;
    if (gridConfig.allowMultipleRowSelection) {
      foo.isChecked = false;
    }

    setRowStruct(() => {
      gridCols.map((col) => {
        const fallback = gridConfig?.fallbackRow?.[col.dataKey];

        if (col.dataKey !== "__action") {
          foo[col.dataKey] =
            col.type === ""
              ? fallback ?? ""
              : col.type === "text"
              ? fallback ?? ""
              : col.type === "number"
              ? fallback ?? null
              : col.type === "free-solo-multiple"
              ? fallback ?? ""
              : col.type === "free-solo-single"
              ? fallback ?? ""
              : col.type === "select-single"
              ? fallback ?? ""
              : col.type === "select-multiple"
              ? fallback ?? ""
              : col.type === "multiline"
              ? fallback ?? ""
              : col.type === "toggle"
              ? fallback ?? ""
              : col.type === "ipaddress"
              ? fallback ?? "192.168.0.0/00"
              : col.type === "date"
              ? fallback ?? "1970-01-01"
              : col.type === "time"
              ? fallback ?? "12:30 AM"
              : col.type === "date-time" && (fallback ?? "1970-01-01T00:00");
        }
      });

      return foo;
    });
  }, [gridCols, gridContent]);

  // # Add Row to dirty Rows
  useEffect(() => {
    setDirtyRows((oldState) => {
      const newState = [...oldState];

      const checkDuplicates = () => {
        return !!newState.filter((record) => record.id === "_newRow").length;
      };

      return isAddRow
        ? checkDuplicates()
          ? [...newState]
          : [...newState, rowStruct]
        : oldState.filter((r) => r.id !== "_newRow");
    });

    isAddRow && editMode === "popup" && togglePortal();
  }, [editMode, isAddRow, rowStruct, togglePortal]);

  // # add or remove portal element
  useEffect(() => {
    const portalElement = document.getElementById("ifv-portal");

    if (!isPortal && isAddRow) {
      setIsAddRow(false);
    }

    if (!isPortal && portalElement) {
      portalElement.remove();
    }
  }, [isPortal]);

  // # default fallback for dirtyRows
  useEffect(() => {
    dirtyRows === undefined && setDirtyRows([]);
  }, [dirtyRows]);

  let [config, setConfig] = useState({
    pageSize: 10,
    currentPage: 1,
  });

  let processedCols = calculateColumnWidth(gridCols);
  processedCols = addDefaultKeys(gridCols);

  useImperativeHandle(ref, () => ({
    getConfig() {
      return config;
    },
  }));

  const provider = {
    addHandler,
    asyncedRows,
    closeDownloadLogsPortal,
    dirtyRows,
    getRowPosition,
    gridAllRows,
    gridCols,
    gridConfig,
    gridContent,
    gridSubconscious,
    handleClearFilterRules,
    handleDelete,
    handleDiscard,
    handleDownload,
    handleEdit,
    handleFilterRulesConfig,
    handleRestore,
    handleExport,
    handlers,
    handlersActionToggle,
    handlersHref,
    handlersPrompt,
    handlersTooltip,
    handleSave,
    handleToggle,
    handleUpgradeRemoteFirmware,
    handleView,
    handleViewFilterRulesConfig,
    inputHelpersText,
    isAddRow,
    isEditClosed,
    isEditModeHost,
    isPortal,
    maxQuickActions,
    modifiedRows,
    parentRows,
    ResetForm,
    rowStruct,
    setAsyncedRows,
    setCustomActionType,
    setCustomPopup,
    setDirtyRows,
    setDontClosePopup,
    setGridAllRows,
    setGridCols,
    setGridContent,
    setGridSubconscious,
    setInputHelpersText,
    setIsAddRow,
    setIsEditClosed,
    setIsPortal,
    setModifiedRows,
    setParentRows,
    setValidationHandler,
    tableHeadRef,
    toggleActionIcons,
    toggleIsEditModeHost,
    togglePortal,
    TriggerValidationReset,
    validationHandler,
  };

  return (
    <ThemeProvider theme={{ fontMontserrat: "Montserrat" }}>
      <DataGridContext.Provider value={provider}>
        <SelectedRows.Provider value={[checkedRows, setCheckedRows]}>
          <SelectAllRowsContext.Provider
            value={[selectAllRows, setSelectAllRows]}
          >
            <HandlersContext.Provider
              value={{ toggleSelectRow, toggleSelectAllRows }}
            >
              <IsSelectMultipleRows.Provider
                value={gridConfig.allowMultipleRowSelection}
              >
                <IsPopupEditClosed.Provider
                  value={[isEditClosed, setIsEditClosed]}
                >
                  <IFVDataGridRoot
                    className={"IFV-DataGrid-root"}
                    table-name={tableName}
                  >
                    {/* Action bar: Add button, Import button, Global Search, Bulk Edit/Actions */}
                    <IFVDataGridActionBar
                      leftPaneIcons={
                        gridConfig.globalSearch
                          ? [<Search SearchState={[search, setSearch]} />]
                          : []
                      }
                      rightPaneIcons={[
                        <MoreishActions
                          allRows={gridAllRows}
                          setAllRows={setGridAllRows}
                          selectedRows={checkedRows}
                          setSelectedRows={setCheckedRows}
                          disableButton={
                            isEditModeHost
                              ? true
                              : !Boolean(checkedRows.length > 1)
                          }
                          display={gridConfig.allowMultipleRowSelection}
                          bulkActions={gridConfig.bulkActions}
                        />,
                        <AddRecord
                          id={`${gridSubconscious.name}-add-record-button`}
                          isAddRow={isAddRow}
                          disabled={loadingData[0]}
                          setIsAddRow={setIsAddRow}
                          toggleIsEditModeHost={toggleIsEditModeHost}
                          tableName={gridSubconscious.name}
                          visibility={
                            (tableName === "ba-identity-config" &&
                              gatewayConfig.chassis_model === "5010") ||
                            tableName === "ba-settings-configuration"
                              ? "hidden"
                              : "visible"
                          }
                        />,
                        <CsvExport
                          id={`${gridSubconscious.name}-csv-export-button`}
                          disabled={loadingData[0]}
                          gridSubconscious={gridSubconscious}
                          visibility={
                            tableName === "ba-identity-config" &&
                            gatewayConfig.chassis_model === "5010"
                              ? "hidden"
                              : "visible"
                          }
                        />,
                      ]}
                    />
                    {/* The Table */}

                    {
                      <IFVDataGridTable
                        cols={processedCols}
                        loadingData={loading}
                        data={gridContent}
                        config={gridConfig}
                      />
                    }
                    {/* - Table Pagination Bar: Page size selection, Pagination buttons, Page info */}
                    {/* <IFVDataGridTablePagination>{[<IFVDataGridDummyItem />, <IFVDataGridDummyItem />, <IFVDataGridDummyItem />, <IFVDataGridDummyItem />, <IFVDataGridDummyItem />, <IFVDataGridDummyItem />]}</IFVDataGridTablePagination> */}
                    <IFVDataGridTablePagination
                      id={`${gridSubconscious.name}-pager`}
                      dgRef={ref}
                      loadingData={loading}
                      subconscious={[gridSubconscious, setGridSubconscious]}
                      TableRows={[gridAllRows, setGridAllRows]}
                      filteredRowsLength={filteredRowsLength}
                      checkedRowsLength={checkedRows.length}
                      handleLoadMoreData={gridSubconscious.handleLoadMoreData}
                    />
                    {isPortal ? (
                      <GridPortal
                        toggleIsEditModeHost={toggleIsEditModeHost}
                        dontClosePopup={dontClosePopup}
                        setIsPortal={setIsPortal}
                        dirtyRow={dirtyRows[0]}
                        dirtyRows={dirtyRows}
                        setDirtyRows={setDirtyRows}
                        IsEditClosed={[isEditClosed, setIsEditClosed]}
                      >
                        <EditPopup
                          toggleIsEditModeHost={toggleIsEditModeHost}
                          dontClosePopup={dontClosePopup}
                          closePortal={togglePortal}
                          editMode={editMode}
                          isAddRow={isAddRow}
                          rowStruct={rowStruct}
                          gridCols={gridCols}
                          gridRows={gridAllRows}
                          dirtyRow={dirtyRows[0]}
                          dirtyRows={dirtyRows}
                          setDirtyRows={setDirtyRows}
                          IsEditClosed={[isEditClosed, setIsEditClosed]}
                        />
                      </GridPortal>
                    ) : null}
                  </IFVDataGridRoot>
                </IsPopupEditClosed.Provider>
              </IsSelectMultipleRows.Provider>
            </HandlersContext.Provider>
          </SelectAllRowsContext.Provider>
        </SelectedRows.Provider>
      </DataGridContext.Provider>
    </ThemeProvider>
  );
});

export default IFVDataGrid;
