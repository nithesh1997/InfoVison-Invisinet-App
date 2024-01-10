import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import {
  Box,
  CircularProgress,
  Grow,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import ToolerTip from "../styled-materials/ToolerTip";

const IFVDataGridTablePaginationContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: 100%;
  border-radius: 0em 0em 0.5em 0.5em;
  background-color: #fff;
  border: 0.1em solid rgba(2, 147, 254, 0.2);
`;

const IFVDataGridTablePaginationLeftPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  font-family: Montserrat;
  font-weight: 300;
  font-size: 1em;
  height: 100%;
  padding: 0 1rem;
`;

const IFVDataGridTablePaginationRightPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  font-family: Montserrat;
  font-weight: 3 00;
  font-size: 1em;
`;

const StyledSelect = styled(Select)`
  margin: 0.5em;
  font-size: 1em;

  & .MuiSelect-root {
    padding: 0.5em 2.5em 0.5em 0.75em;
  }
`;

const PaginationButtons = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  margin: 0em 1em;
  padding: 0em 0.5em;
  border-left: 0.1em solid rgba(2, 147, 254, 1);
`;

const StyledIconButton = styled(IconButton)`
  padding: 0.25em;
  cursor: pointer;

  &:hover {
    background-color: rgba(2, 147, 254, 0.1);
  }

  &.MuiIconButton-root.Mui-disabled {
    opacity: 0.4;
  }
`;

const StyledSkeletonHolder = styled(Box)`
  width: 100%;
  padding: 0.5em 0.5em 0.5em 0em;
`;

const StyledNoRecordsMessageHolder = styled(Box)`
  padding: 1em 1em 1em 0em;
`;

const StyledPaginationText = styled(Typography)`
  font-size: 1em;
  margin: 0em 0.5em;
  font-weight: 300;
`;

const initGotoLastButton = { loading: false, disabled: false };

const loadLastPage = (TableRows, Subconscious, LastButton) => {
  const [tableRows, setTableRows] = TableRows;
  const [gridSubconscious, setGridSubconscious] = Subconscious;
  const [gotoLastButton, setGotoLastButton] = LastButton;

  setTimeout(() => {
    setGotoLastButton(initGotoLastButton);
  }, 200);

  setGridSubconscious((oldState) => ({
    ...oldState,
    page: oldState.totalPages,
    // If Some thing bad happens implement this (Not a good practice 🤦🏾)
    // page: gridSubconscious.totalPages,
  }));
};

const IFVDataGridTablePagination = (props) => {
  const { t, i18n } = useTranslation();

  const TableRecords = props.TableRows;
  const loadMoreRecords = props.handleLoadMoreData ?? loadLastPage;

  const [gridSubconscious, setGridSubconscious] = props.subconscious;
  const [gotoLastButton, setGotoLastButton] = useState(initGotoLastButton);
  const [isApicall, setIsApiCall] = useState(false);
  const [nextPageButton, setNextPageButton] = useState({ isDisabled: false });

  const handleMoreDataArgs = [
    TableRecords,
    props.subconscious,
    [gotoLastButton, setGotoLastButton],
  ];

  const handleLastPageClick = () => {
    setGotoLastButton((oldState) => ({
      ...oldState,
      loading: true,
      disabled: true,
    }));
    setIsApiCall(true);
    loadMoreRecords(...handleMoreDataArgs);
  };

  const handleNextPageClick = () => {
    if (gridSubconscious.page !== gridSubconscious.totalPages) {
      setGridSubconscious((oldState) => {
        const newState = { ...oldState, page: oldState.page + 1 };

        if (newState.page === newState.totalPages) {
          setNextPageButton((oldState) => ({ ...oldState, isDisabled: true }));

          setIsApiCall(false);
          setGotoLastButton((oldState) => ({
            ...oldState,
            loading: true,
            disabled: true,
          }));

          loadMoreRecords(...handleMoreDataArgs); // API Call Goes Here...
        }

        return { ...newState };
      });
    } else {
      setNextPageButton((oldState) => ({ ...oldState, isDisabled: true }));

      setIsApiCall(false);
      setGotoLastButton((oldState) => ({
        ...oldState,
        loading: true,
        disabled: true,
      }));

      loadMoreRecords(...handleMoreDataArgs); // API Call Goes Here...
    }
  };

  useEffect(() => {
    if (gridSubconscious.page !== gridSubconscious.totalPages) {
      setNextPageButton((oldState) => ({ ...oldState, isDisabled: false }));
    }
  }, [gridSubconscious]);

  useEffect(() => {
    setGotoLastButton((oldState) => ({ ...oldState, disabled: false }));
    setNextPageButton((oldState) => ({ ...oldState, isDisabled: false }));
  }, [gridSubconscious.pageSize]);

  return (
    <IFVDataGridTablePaginationContainer
      className={"IFV-DataGrid-table-pagination"}
    >
      <IFVDataGridTablePaginationLeftPane
        className={"IFV-DataGrid-table-pagination-left-pane"}
      >
        {props.loadingData ? (
          <StyledSkeletonHolder>
            <WidthFillerSkeleton height="1.5em" />
          </StyledSkeletonHolder>
        ) : props.checkedRowsLength === 0 || props.checkedRowsLength === "" ? (
          ""
        ) : (
          <Styled.SelectedRowsText>
            {props.checkedRowsLength}{" "}
            {t("commons.table.footer.pagination.selectedRows")}
          </Styled.SelectedRowsText>
        )}
      </IFVDataGridTablePaginationLeftPane>

      <IFVDataGridTablePaginationRightPane
        className={"IFV-DataGrid-table-pagination-right-pane"}
      >
        {props.loadingData ? (
          <StyledSkeletonHolder>
            <WidthFillerSkeleton height="1.5em" />
          </StyledSkeletonHolder>
        ) : gridSubconscious.totalRows === 0 ? (
          <StyledNoRecordsMessageHolder>
            <Trans i18nKey={`commons.table.footer.pagination.noPageToPaginate`}>
              Pagination options will appear when there is at least one record
              to show.
            </Trans>
          </StyledNoRecordsMessageHolder>
        ) : (
          <>
            <Styled.Text>
              <Trans
                i18nKey={`commons.table.footer.pagination.paginationInfo.0`}
              >
                Showing
              </Trans>
            </Styled.Text>
            <ToolerTip
              title={t(`commons.table.footer.pagination.pageDropDown`)}
              followCursor
              arrow
              disableFocusListener
              disableHoverListener
              disableTouchListener
              enterDelay={100}
              enterNextDelay={100}
              leaveDelay={0}
              TransitionComponent={Grow}
              TransitionProps={{ timeout: 100 }}
            >
              <StyledSelect
                labelId="ifvdg-page-size-selector-label"
                id="ifvdg-page-size-selector"
                value={gridSubconscious.pageSize || ""}
                onChange={(event) => {
                  setGridSubconscious((subcon) => {
                    let newSubcon = { ...subcon };
                    newSubcon.pageSize = event.target.value;

                    return newSubcon;
                  });
                }}
                variant="outlined"
                size="small"
              >
                {(gridSubconscious.pageSizeOptions || []).map((option) => (
                  <MenuItem value={option}>
                    {option === 0 ? "ALL" : option}
                  </MenuItem>
                ))}
              </StyledSelect>
            </ToolerTip>

            <Styled.Text>
              <Trans
                i18nKey={`commons.table.footer.pagination.paginationInfo.1`}
              >
                records per page
              </Trans>
            </Styled.Text>

            <PaginationButtons>
              <ToolerTip
                TransitionComponent={Grow}
                title={t(
                  `commons.table.footer.pagination.actions.goToFirstPageText`,
                )}
              >
                <StyledIconButton
                  disabled={
                    gotoLastButton.loading || gridSubconscious.page === 1
                  }
                  onClick={() => {
                    setGotoLastButton(initGotoLastButton);
                    setGridSubconscious((subcon) => {
                      let newSubcon = { ...subcon };
                      newSubcon.page = 1;
                      return newSubcon;
                    });
                  }}
                >
                  <FirstPage
                    style={{
                      fontSize: "0.85em",
                      color: "#003152",
                    }}
                  />
                </StyledIconButton>
              </ToolerTip>

              <ToolerTip
                TransitionComponent={Grow}
                title={t(
                  `commons.table.footer.pagination.actions.goToPreviousPageText`,
                )}
              >
                <StyledIconButton
                  disabled={
                    gotoLastButton.loading || gridSubconscious.page === 1
                  }
                  onClick={() => {
                    setGotoLastButton(initGotoLastButton);
                    setGridSubconscious((subcon) => {
                      let newSubcon = { ...subcon };
                      newSubcon.page -= 1;
                      return newSubcon;
                    });
                  }}
                >
                  <NavigateBefore
                    style={{
                      fontSize: "0.85em",
                      color: "rgba(2, 147, 254, 1)",
                    }}
                  />
                </StyledIconButton>
              </ToolerTip>

              <StyledPaginationText>
                {(gridSubconscious.page - 1) * gridSubconscious.pageSize + 1} -{" "}
                {gridSubconscious.totalRows >
                gridSubconscious.pageSize * gridSubconscious.page
                  ? gridSubconscious.pageSize * gridSubconscious.page
                  : props.filteredRowsLength}{" "}
                of {props.filteredRowsLength}
              </StyledPaginationText>

              {!isApicall && gotoLastButton.loading ? (
                <div style={{ padding: "0.28em" }}>
                  <Styled.Spinner style={{ width: "1.5em", height: "1.5em" }} />
                </div>
              ) : (
                <ToolerTip
                  TransitionComponent={Grow}
                  title={t(
                    `commons.table.footer.pagination.actions.goToNextPageText`,
                  )}
                >
                  <StyledIconButton
                    disabled={
                      gotoLastButton.loading ||
                      gotoLastButton.disabled ||
                      nextPageButton.isDisabled
                    }
                    onClick={handleNextPageClick}
                  >
                    <NavigateNext
                      style={{
                        fontSize: "0.85em",
                        color: "rgba(2, 147, 254, 1)",
                      }}
                    />
                  </StyledIconButton>
                </ToolerTip>
              )}

              {gotoLastButton.loading && isApicall ? (
                <div style={{ padding: "0.28em" }}>
                  <Styled.Spinner style={{ width: "1.5em", height: "1.5em" }} />
                </div>
              ) : (
                <ToolerTip
                  TransitionComponent={Grow}
                  title={t(
                    `commons.table.footer.pagination.actions.goToLastPageText`,
                  )}
                >
                  <StyledIconButton
                    disabled={gotoLastButton.disabled}
                    onClick={handleLastPageClick}
                  >
                    <LastPage
                      style={{ fontSize: "0.85em", color: "#003152" }}
                    />
                  </StyledIconButton>
                </ToolerTip>
              )}
            </PaginationButtons>
          </>
        )}
      </IFVDataGridTablePaginationRightPane>
    </IFVDataGridTablePaginationContainer>
  );
};

export default IFVDataGridTablePagination;

const Styled = {
  Text: styled(Typography)`
    font-family: "Montserrat";
  `,
  SelectedRowsText: styled(Typography)`
    display: block;
    background-color: rgba(2, 147, 254, 1);
    color: #fff;
    padding: 0.25em 0.75em;
    border-radius: 0.25em;
    font-size: 1.25em;
    line-height: 1.25em;
    font-family: "Montserrat";
    font-weight: 400;
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
};
