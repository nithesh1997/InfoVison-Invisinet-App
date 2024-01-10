import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Fragment, useContext, useEffect, useState } from "react";
import { ArrowDown } from "react-bootstrap-icons";
import styled from "styled-components";
import {
  DataGridContext,
  HandlersContext,
  SelectAllRowsContext,
} from "../IFVDataGrid";
import ToolTip from "../../../utils/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";

const colors = {
  labelColor: "#6c757d",
  borderColor: "#6c757d",
  backgroundColor: "#FFF",

  labelColorOnHover: "#3B82F6",
  borderColorOnHover: "#3B82F6",
  backgroundColorOnHover: "#FFF",

  labelColorOnFocus: "#3B82F6",
  borderColorOnFocus: "#3B82F6",
  backgroundColorOnFocus: "#FFF",
};

const handleFilterRows = (
  props,
  filterInput,
  setGridSubconscious,
  setIsEvent,
) => {
  setGridSubconscious((oldState) => {
    const newState = {
      ...oldState,
      filters: {
        ...oldState.filters,
        [props.heading.dataKey]: {
          ...oldState.filters[props.heading.dataKey],
          text: {
            ...oldState.filters[props.heading.dataKey].text,
            contains: filterInput.value,
          },
        },
      },
    };

    return newState;
  });

  setIsEvent({ isBlur: false, isFocus: false, isChange: false });
};

const setTimeoutClosure = () => {
  let timeout = undefined;

  return {
    resetTimeout: () => {
      window.clearTimeout(timeout);
    },
    updateTimeout: (callback, time) => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        callback();
      }, time);
    },
  };
};

const IFVDataGridTableHeaderCellContainerButton = styled(ButtonBase)`
  &.MuiButtonBase-root {
    display: ${(props) =>
      props.isHide && props.tableEditMode === "popup" ? "none" : "flex"};
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-grow: 1;
    width: ${(props) => props.calcWidth};
    min-width: ${(props) => (props.minWidth ? props.minWidth + "px" : "auto")};
    cursor: pointer;
    overflow: hidden;
    font-weight: 600;
    background: #fff;
    color: #212529;
    width: 100%;

    &:hover {
      background: rgba(240, 247, 255, 1);
    }

    &.selected {
      text-decoration: underline;
    }

    &.disabled {
      cursor: default;
      pointer-events: none;
    }
  }
`;

const IFVDataGridTableHeaderCellValue = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "flex-end"
      : "flex-start"};
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  padding: 1em 1em 1em 1em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  /* text-align: ${(props) => props.alignment}; */
  text-align: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "right"
      : "left"};
`;

const IFVDataGridTableHeaderCellActionBar = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  /* flex-grow: 1; */
  padding: 0.5em 0.25em;
`;

const IFVDataGridTableHeaderCellActionButton = styled(IconButton)`
  margin: 0.1em;
  padding: 0.25em;
  cursor: pointer;
  pointer-events: all;

  &.disabled {
    cursor: default;
    pointer-events: none;
  }

  &:hover {
    background-color: #0094fd;
  }

  &.selected {
    background-color: rgba(2, 147, 254, 1);
  }

  &.selected:hover {
    background-color: #0074c7;
  }

  & svg {
    width: 0.6em;
    height: 0.6em;
    fill: #121212;
  }

  &.selected svg {
    fill: rgba(2, 147, 254, 1);
    fill: #fff;
  }
`;

const IFVDataGridTableHeaderCellSortButton = styled(
  IFVDataGridTableHeaderCellActionButton,
)`
  transform: rotate(180deg);
  &.descending {
    transform: rotate(0deg);
  }
`;

const IFVDataGridTableHeaderCellFilterButton = styled(
  IFVDataGridTableHeaderCellActionButton,
)`
  color: #303030;
`;

const StyledAscendingSortIcon = styled(ArrowDown)``;

const StyledFilterIcon = styled(FilterAltIcon)``;

const initialIsEvent = { isBlur: false, isFocus: false, isChange: false };

const initialFilterInput = { id: "", label: "", value: "" };

const IFVDataGridTableHeaderCell = (props) => {
  const { t } = useTranslation();

  const { gridSubconscious, setGridSubconscious } = useContext(DataGridContext);
  const { gridConfig, isEditModeHost } = useContext(DataGridContext);
  const [isFilterCell, setIsFilterCell] = useState(false);
  const [checkBox, setCheckBox] = useContext(SelectAllRowsContext);
  const { toggleSelectAllRows } = useContext(HandlersContext);
  const [revealFilterBox, setRevealFilterBox] = props.RevealFilterBox;
  const [filterInput, setFilterInput] = useState(initialFilterInput);
  const [isEvent, setIsEvent] = useState(initialIsEvent);
  const [dummyFlag, setDummyFlag] = useState(false);
  const [value, setValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(setTimeoutClosure());

  const isFilter = props.heading.filterable;
  const caseReveal =
    revealFilterBox &&
    (gridConfig.editMode === "popup" ? !props.heading.hideInViewState : true);

  const handleFilterInputFocus = (event) => {
    setIsEvent({ isBlur: false, isFocus: true, isChange: false });
  };

  const handleFilterInputBlur = (event) => {
    setIsEvent({ isBlur: true, isFocus: false, isChange: false });
  };

  const handleFilterInputChange = (event) => {
    setValue(event.target.value);
    setIsEvent({ isBlur: false, isFocus: true, isChange: true });
    setFilterInput((oldState) => ({
      ...oldState,
      value: event.target.value,
    }));
  };

  const handleClearInput = (event) => {
    setIsEvent({ isBlur: false, isFocus: true, isChange: true });
    setFilterInput((oldState) => ({
      ...oldState,
      value: "",
    }));
  };

  // Resets the pagination to 1
  useEffect(() => {
    if (value) {
      setGridSubconscious((oldState) => {
        const newState = { ...oldState, page: 1 };

        return oldState.page === 1 ? oldState : newState;
      });
    }
  }, [setGridSubconscious, value]);

  // Acts as element value for performance reasons
  useEffect(() => {
    setValue((oldState) =>
      value === filterInput.value ? oldState : filterInput.value,
    );
  }, [filterInput.value, value]);

  // Initialize input value state with subconscious.filters
  useEffect(() => {
    const inputName = props.heading.headerName;
    if (
      typeof inputName === "string" &&
      inputName.trim().toLowerCase() !== "action" &&
      !dummyFlag
    ) {
      setFilterInput((oldState) => {
        const id = inputName
          .trim()
          .split(" ")
          .map((item, index) => {
            return index === 0
              ? item[0].toLowerCase() + item.slice(1)
              : item[0].toUpperCase() + item.slice(1);
          })
          .join("");
        const label = inputName;
        const value = () => {
          const keys = Object.keys(gridSubconscious.filters || {});
          if (keys.includes(props.heading.dataKey)) {
            return gridSubconscious.filters[props.heading.dataKey]?.text
              ?.contains;
          } else {
            return "";
          }
        };

        setDummyFlag(true);

        return { id, label, value: value() };
      });
    }
  }, [
    dummyFlag,
    gridSubconscious,
    gridSubconscious.filters,
    props.heading.dataKey,
    props.heading.headerName,
  ]);

  // determines is a cell is filterable
  useEffect(() => {
    const arr = props.isFilterSelected;

    arr.map((_) => {
      if (props.heading.dataKey === Object.keys(_)[0]) {
        setIsFilterCell(_[props.heading.dataKey]);
      }
    });
  }, [props.heading.dataKey, props.isFilterSelected]);

  // set state with macro task
  useEffect(() => {
    if (!isEvent.isBlur && isEvent.isFocus && isEvent.isChange) {
      searchTimeout.updateTimeout(() => {
        handleFilterRows(props, filterInput, setGridSubconscious, setIsEvent);
      }, 300); // Reduce to decrease latency between typing and actual filtering
    }
  }, [
    filterInput,
    isEvent.isBlur,
    isEvent.isChange,
    isEvent.isFocus,
    props,
    searchTimeout,
    setGridSubconscious,
  ]);

  return (
    <Fragment>
      {props.heading.dataKey === "isChecked" ? (
        <Styled.CheckBoxWrapper
          theme={{
            calcWidth: props.heading.__calcWidth,
            minWidth: props.heading.minWidth,
            isHide: props.heading.hideInViewState,
            isEditMode: isEditModeHost,
            tableEditMode: gridConfig.editMode,
          }}
        >
          <ToolTip
            title={t("commons.table.header.checkbox.tooltip", {
              isSelected: checkBox.checked
                ? t(`commons.deselectText`)
                : t(`commons.selectText`),
              isIncluded: checkBox.checked
                ? t(`commons.excludeFrom`)
                : t(`commons.includeIn`),
            })}
          >
            <Styled.CheckBox
              {...checkBox}
              onChange={(event) => toggleSelectAllRows(event.target.checked)}
            />
          </ToolTip>
        </Styled.CheckBoxWrapper>
      ) : (
        <Styled.HeaderCellWrapper
          tableEditMode={gridConfig.editMode}
          calcWidth={props.heading.__calcWidth}
          minWidth={props.heading.minWidth}
          theme={{
            isActionSticky: props.heading.dataKey === "__action",
            hideInViewState:
              props.heading.hideInViewState && gridConfig.editMode === "popup",
            hideColumn: props.heading.hideColumn,
          }}
        >
          <IFVDataGridTableHeaderCellContainerButton
            id={`column-${filterInput.id.toLowerCase()}-quick-sort-button`}
            isHide={props.heading.hideInViewState}
            isEditMode={isEditModeHost}
            tableEditMode={gridConfig.editMode}
            calcWidth={props.heading.__calcWidth}
            minWidth={props.heading.minWidth}
            className={
              "IFV-DataGrid-table-header-cell" +
              (((gridSubconscious.sort || { column: "" }).column || "") ===
              props.heading.dataKey
                ? " selected"
                : "") +
              (props.heading.sortable !== false ? "" : " disabled")
            }
            onClick={(event) => {
              let className = event.target.className;
              if (typeof className !== "string") {
                return;
              }
              let tgt = event.target;
              while (
                tgt.className.match(/IFV-DataGrid-table-header-cell/) !== null
              ) {
                if (
                  event.target.className.match(
                    /IFV-DataGrid-table-header-cell-filtering-icon/,
                  ) !== null
                ) {
                  return;
                } else {
                  tgt = tgt.parentNode;
                }
              }
              setGridSubconscious((subcon) => {
                let newSubcon = { ...subcon };
                if (newSubcon.sort.column === props.heading.dataKey) {
                  newSubcon.sort.inverse = !newSubcon.sort.inverse;
                } else {
                  newSubcon.sort.column = props.heading.dataKey;
                }
                return newSubcon;
              });
            }}
            theme={{
              isActionSticky: props.heading.dataKey === "__action",
              showFilterInput: caseReveal,
            }}
          >
            <IFVDataGridTableHeaderCellValue
              alignment={props.heading.headerAlignment}
            >
              {props.heading.headerName}
            </IFVDataGridTableHeaderCellValue>

            <IFVDataGridTableHeaderCellActionBar>
              {props.heading.sortable ? (
                <IFVDataGridTableHeaderCellSortButton
                  id={`column-${filterInput.id.toLowerCase()}-sort-button`}
                  className={
                    (gridSubconscious.sort.column === props.heading.dataKey
                      ? " selected"
                      : "") +
                    (gridSubconscious.sort.inverse === true
                      ? " descending"
                      : "")
                  }
                  onClick={() => {
                    setGridSubconscious((subcon) => {
                      let newSubcon = { ...subcon };
                      if (newSubcon.sort.column === props.heading.dataKey) {
                        newSubcon.sort.inverse = !newSubcon.sort.inverse;
                      } else {
                        newSubcon.sort.column = props.heading.dataKey;
                      }
                      return newSubcon;
                    });
                  }}
                >
                  <ToolTip
                    title={t(
                      `commons.table.header.sort.tooltip.${
                        gridSubconscious.sort.inverse === true
                          ? "descendingText"
                          : "ascendingText"
                      }`,
                    )}
                  >
                    <StyledAscendingSortIcon />
                  </ToolTip>
                </IFVDataGridTableHeaderCellSortButton>
              ) : (
                ""
              )}

              {(isFilter || isFilter === undefined) &&
              props.heading.dataKey !== "__action" ? (
                <IFVDataGridTableHeaderCellFilterButton
                  id={`column-${filterInput.id.toLowerCase()}-filter-button`}
                  className={isFilterCell ? ` selected` : ""}
                  onClick={(e) => {
                    setGridSubconscious((oldState) => {
                      setRevealFilterBox(() => !oldState.filterShown);
                      return {
                        ...oldState,
                        filterShown: !oldState.filterShown,
                      };
                    });
                  }}
                >
                  <StyledFilterIcon />
                </IFVDataGridTableHeaderCellFilterButton>
              ) : null}
            </IFVDataGridTableHeaderCellActionBar>
          </IFVDataGridTableHeaderCellContainerButton>

          {caseReveal ? (
            <Styled.FilterTextFieldWrapper
              isHide={props.heading.hideInViewState}
              isEditMode={isEditModeHost}
              tableEditMode={gridConfig.editMode}
              calcWidth={props.heading.__calcWidth}
              minWidth={props.heading.minWidth}
            >
              {props.heading.dataKey !== "__action" &&
              (isFilter || isFilter === undefined) ? (
                <Styled.FilterTextField
                  id={`column-${filterInput.id.toLowerCase()}-filter-field`}
                  label={t("commons.table.header.filter.label", {
                    labelName: filterInput.label,
                  })}
                  value={value}
                  variant="outlined"
                  disabled={!(isFilter || isFilter === undefined)}
                  onFocus={handleFilterInputFocus}
                  onBlur={handleFilterInputBlur}
                  onChange={handleFilterInputChange}
                  theme={{ ...colors }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <Styled.CancelButton
                          id={`column-${filterInput.id.toLowerCase()}-filter-cancel-button`}
                          onClick={handleClearInput}
                          theme={{
                            visibility:
                              filterInput.value &&
                              (isFilter || isFilter === undefined),
                          }}
                        >
                          <Styled.CancelIcon />
                        </Styled.CancelButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <></>
              )}
            </Styled.FilterTextFieldWrapper>
          ) : (
            <></>
          )}
        </Styled.HeaderCellWrapper>
      )}
    </Fragment>
  );
};

export default IFVDataGridTableHeaderCell;

const Styled = {
  CheckBoxWrapper: styled(Box)`
    display: ${({ theme }) => {
      return theme.isHide && theme.tableEditMode === "popup" ? "none" : "flex";
    }};
    font-size: 1em;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-shrink: 0;
    width: ${({ theme }) => theme.calcWidth};
    min-width: ${({ theme }) => {
      return theme.minWidth ? theme.minWidth + "px" : "auto";
    }};
    overflow: hidden;
    background-color: #eff2f7;
    background-color: #fff;
    color: #212529;
    padding: 0.4rem 0 0 0;

    &.selected {
      text-decoration: underline;
    }

    &.disabled {
      cursor: default;
      pointer-events: none;
    }

    & .MuiSvgIcon-root {
      fill: #2d7ee9;
    }

    & .MuiCheckbox-root {
    }

    & .Mui-checked .MuiSvgIcon-root {
      fill: #2d7ee9;
    }

    & .Mui-disabled .MuiSvgIcon-root {
      fill: #3b475c20;
    }

    & .MuiCheckbox-indeterminate {
    }

    & .MuiCheckbox-colorPrimary {
    }

    & .MuiCheckbox-colorSecondary {
    }
  `,
  HeaderCellWrapper: styled(Box)`
    display: ${({ theme }) => {
      return theme.hideInViewState || theme.hideColumn ? "none" : "flex";
    }};
    font-size: 1em;
    /* font-family: "Montserrat", sans-serif; */
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    flex-wrap: nowrap;
    flex-shrink: 0;
    width: ${(props) => props.calcWidth};
    min-width: ${(props) => (props.minWidth ? props.minWidth + "px" : "auto")};
    overflow: hidden;
    font-weight: 600;
    background-color: #fff;
    color: #212529;
    border-left: ${({ theme }) => {
      return theme.isActionSticky ? null : "0.1em solid rgba(2, 147, 254, 0.2)";
    }};

    &.disabled {
      cursor: default;
      pointer-events: none;
      background-color: #fff;
    }

    ${({ theme }) => {
      return theme.isActionSticky
        ? `
        position: -webkit-sticky;
        position: sticky;
        z-index: 2;
        right: -0.1%;
        background: #FEFEFE !important;
        height: 100%;
        /* box-shadow: -0.25em 0em 0.5em 0em rgb(0 0 0 / 20%); */
        box-shadow: -0.2em 0em 0.1em 0em rgb(0 0 0 / 10%);
      `
        : `
        position: inherit;
        position: inherit;
        z-index: auto;
        right: auto;
        background: auto;
        box-shadow: none;
      `;
    }}
  `,
  FilterTextFieldWrapper: styled(Box)`
    display: flex;
    font-size: 1em;
    /* font-family: "Montserrat", sans-serif; */
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    /* border-left: 0.1em solid rgba(2, 147, 254, 0.2); */
    overflow: hidden;
    font-weight: 600;
    background-color: #fff;
    color: #212529;
    box-sizing: border-box;
    padding: 0.75em 0.85em 0.25em 0.85em;
  `,
  FilterTextField: styled(TextField)`
    &.MuiFormControl-root {
      width: 100%;
    }

    & .MuiOutlinedInput-input {
      /* padding: 0.8rem 1rem; */
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      border-radius: 4px;
      background: ${({ theme }) => theme.backgroundColor};
      /* font-family: "Montserrat"; */
      font-size: 0.8rem;
    }

    & .MuiOutlinedInput-input:hover {
      /* padding: 0.8rem 1rem; */
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      border-radius: 4px;
      background: ${({ theme }) => theme.backgroundColorOnHover};
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
      /* padding: 0.8rem 1rem; */
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      border-radius: 4px;
      background: ${({ theme }) => theme.backgroundColorOnFocus};
    }

    & .MuiFormLabel-root {
      color: ${({ theme }) => theme.labelColor};
    }

    & .MuiInputLabel-root {
      color: ${({ theme }) => theme.labelColor};
    }

    /* todo: Unable to apply these styles */
    & .MuiFormLabel-root:hover {
      color: ${({ theme }) => theme.labelColorOnHover};
    }

    & .MuiInputLabel-root:hover {
      color: ${({ theme }) => theme.labelColorOnHover};
    }
    /* todo: Unable to apply these styles */

    & .MuiFormLabel-root.Mui-focused {
      color: ${({ theme }) => theme.labelColorOnFocus};
    }

    & .MuiInputLabel-root.Mui-focused {
      border-color: ${({ theme }) => theme.labelColorOnFocus};
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: ${({ borderColor }) => borderColor};
      border-width: 1px;
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.borderColorOnHover};
      border-width: 1px;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${({ theme }) => theme.borderColorOnFocus};
      border-width: 1px;
    }

    & .MuiInputLabel-outlined {
      transform: translate(0.5em, 0.7em) scale(0.9);
      background: #fff;
      width: min-content;
      max-width: 100%;
      border-radius: 0.1rem;
      padding: 0.1rem 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .MuiInputLabel-outlined.MuiInputLabel-shrink {
      transform: translate(0.7em, -0.4em) scale(0.75);
      background: #fff;
      width: min-content;
      max-width: 100%;
      border-radius: 0.1rem;
      padding: 0.1rem 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .MuiOutlinedInput-adornedEnd {
      padding-right: 0;
    }
  `,
  CheckBox: styled(Checkbox)`
    padding: 0.25em;

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }
    &.Mui-checked:hover {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: rgba(2, 147, 254, 1);
    }
  `,
  FilterButton: styled(Button)``,
  CancelButton: styled(IconButton)`
    visibility: ${({ theme }) => (theme.visibility ? "visible" : "hidden")};
    width: 1rem;
    height: 1rem;
    margin: 0.4rem;

    &:hover {
      background: #e83b4620;
    }

    & .MuiTouchRipple-child {
      background: #e83b4640;
    }

    &.MuiIconButton-root.Mui-disabled {
      background: #30303010;
      cursor: default;

      .MuiSvgIcon-root {
        fill: #616161;
      }
    }
  `,
  CancelIcon: styled(CancelRounded)`
    &.MuiSvgIcon-root {
      width: 0.9rem;
      height: 0.9rem;
      fill: #e83b46;
    }
  `,
};
