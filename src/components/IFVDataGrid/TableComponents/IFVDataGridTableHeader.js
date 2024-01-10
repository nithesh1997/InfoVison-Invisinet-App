import { Box } from "@material-ui/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import styled from "styled-components";
import { checkBoxCol, DataGridContext } from "../IFVDataGrid";
import IFVDataGridTableHeaderCell from "./IFVDataGridTableHeaderCell";

const IFVDataGridTableHeaderContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  flex-shrink: 0;
  position: relative;
  width: 100%;
  border-radius: 0.5em 0.5em 0em 0em;
  background-color: #fff;
  border: 0.1em solid rgba(2, 147, 254, 0.2);
  border-bottom: 0.2em solid rgba(2, 147, 254, 0.8);
  font-size: 1em;
  line-height: 1.25em;
  font-weight: 700;
  /* font-family: Montserrat; */
  color: #212121;

  & > *:last-child {
    /* min-width: ${(props) => props.lastChildMinWidth}; */
    flex-grow: 1;
  }
  */ &.disabled {
    cursor: default;
    pointer-events: none;
  }

  /* Force show scrollbar in header so width is same as in content but make the scrollbar invisible so it can't be seen. */
  /* Without this, width of header is greater than width of content row by the amount that equals width of scrollbar. */
  overflow-x: auto;
  overflow-y: scroll;

  /* &::-webkit-scrollbar {
    width: 0.35em;
    height: 0em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track {
    background: #FFF;
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track:hover {
    background: #FFF;
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb {
    background: #777;
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  } */

  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const IFVDataGridTableHeader = (props) => {
  const { gridConfig, gridSubconscious, tableHeadRef } =
    useContext(DataGridContext);
  const [isFilterSelected, setIsFilterSelected] = useState([]);
  const [revealFilterBox, setRevealFilterBox] = useState(false);
  const filters = gridSubconscious.filters;
  const filterKeys = useMemo(() => {
    return Object.keys(gridSubconscious?.filters || []);
  }, []);

  const tableColumns = [
    ...(gridConfig.allowMultipleRowSelection ? [checkBoxCol] : []),
    ...props.cols,
  ];

  useEffect(() => {
    const $ = filterKeys.map((filterKey) => {
      const bool = Boolean(filters[filterKey]?.text?.contains) ? true : false;

      return {
        [filterKey]: bool ?? false,
      };
    });

    setIsFilterSelected($);
  }, [filterKeys, filters]);

  useEffect(() => {
    setRevealFilterBox(gridSubconscious.filterShown ?? false);
  }, []);

  return (
    <ScrollSyncPane>
      <IFVDataGridTableHeaderContainer
        className={
          "IFV-DataGrid-table-header" + (props.loadingData ? " disabled" : "")
        }
        ref={tableHeadRef}
      >
        {tableColumns.map((col) => {
          if (col.type === "actions" && col.hideAction === true) {
            return <></>;
          }

          return (
            <IFVDataGridTableHeaderCell
              RevealFilterBox={[revealFilterBox, setRevealFilterBox]}
              isFilterSelected={isFilterSelected}
              heading={col}
            />
          );
        })}
      </IFVDataGridTableHeaderContainer>
    </ScrollSyncPane>
  );
};

export default IFVDataGridTableHeader;
