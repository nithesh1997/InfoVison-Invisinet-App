import { Box } from "@material-ui/core";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import styled from "styled-components";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import { checkBoxCol, DataGridContext } from "../IFVDataGrid";
import IFVDataGridTableContentRow from "./IFVDataGridTableContentRow";

const IFVDataGridTableContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-grow: 1;
  position: relative;
  width: 100%;
  background-color: #fff;
  border-left: 0.1em solid rgba(2, 147, 254, 0.2);
  border-right: 0.1em solid rgba(2, 147, 254, 0.2);
`;

const IFVDataGridTableContentContainerScrollable = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  position: absolute;
  left: 0em;
  top: 0em;
  width: 100%;
  height: 100%;

  & > div:nth-child(2n) > div {
    background-color: rgba(2, 147, 254, 0.1);
    background-color: rgba(235, 247, 255, 0.4);
    border-left: 0.1em solid rgba(2, 147, 254, 0.1);
    border-top: 0.1em solid rgba(2, 147, 254, 0.2);
    border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
  }

  overflow-y: scroll;
  overflow-y: overlay;

  /* Firefox */
  scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
  scrollbar-width: thin !important;
  /* Firefox */

  /* Chrome & Edge */
  &::-webkit-scrollbar {
    width: 0.7em;
    height: 0.7em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 73, 122, 0);
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track:hover {
    background: rgba(0, 73, 122, 0);
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.isHovered ? "rgba(119, 119, 119, 0.8)" : "rgba(119, 119, 119, 0)"};
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) =>
      theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
  }
  /* Chrome & Edge */

  /*
  &::-webkit-scrollbar {
    display: none;
  }


  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
`;

const StyledSkeletonHolder = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 1em 1em 1em 1em;
`;

const StyledNoDataMessageHolder = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1em;
  text-align: center;
  font-size: 1.25em;
`;

const IFVDataGridTableContent = (props) => {
  const {
    gridAllRows,
    gridContent,
    gridCols,
    gridConfig,
    modifiedRows,
    tableHeadRef,
  } = useContext(DataGridContext);
  const { rowStruct, isAddRow } = useContext(DataGridContext);
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const [isSaveRowsFlag, setIsSaveRowsFlag] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const tableBodyRef = useRef();

  const tableColumns = [
    ...(gridConfig.allowMultipleRowSelection ? [checkBoxCol] : []),
    ...gridCols,
  ];

  useEffect(() => {
    if (dirtyRows.length) {
      const flag = dirtyRows.map((r) => {
        const rowFlag = {};
        const [orgRow] = gridAllRows.filter((row) => row.id === r.id);
        const keys = Object.keys(r).filter((key) => {
          return key !== "id" && key !== "__isEditMode";
        });

        keys.map(
          (key) =>
            (rowFlag[key] =
              r[key] === (r.id === "_newRow" ? rowStruct[key] : orgRow[key])),
        );

        return { ...rowFlag, id: r.id };
      });

      setIsSaveRowsFlag(flag);
    }
  }, [dirtyRows, gridAllRows, rowStruct]);

  useEffect(() => {
    if (
      (modifiedRows.length || isAddRow) &&
      tableBodyRef.current.scrollLeft !== tableHeadRef.current.scrollLeft
    ) {
      tableBodyRef.current.scrollLeft = tableHeadRef.current.scrollLeft;
    }
  }, [isAddRow, modifiedRows.length, tableHeadRef]);

  return (
    <IFVDataGridTableContentContainer
      className={"IFV-DataGrid-table-content"}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ScrollSyncPane>
        <IFVDataGridTableContentContainerScrollable
          className={"IFV-DataGrid-table-content-scrollable"}
          ref={tableBodyRef}
          theme={{ isHovered }}
        >
          {props.loadingData ? (
            <StyledSkeletonHolder>
              <WidthFillerSkeleton height="100%" />
            </StyledSkeletonHolder>
          ) : gridContent.length === 0 && !isAddRow ? (
            <StyledNoDataMessageHolder>
              {props.noDataMessage}
            </StyledNoDataMessageHolder>
          ) : (
            <React.Fragment>
              <React.Fragment>
                {isAddRow && (
                  <IFVDataGridTableContentRow
                    cols={tableColumns}
                    data={rowStruct}
                    rowIndex={gridAllRows.length}
                    isSaveRowsFlag={isSaveRowsFlag}
                  />
                )}
              </React.Fragment>

              <React.Fragment>
                {gridContent.map((row, rowIndex) => {
                  const isEvenRow = !Boolean((rowIndex + 1) % 2);
                  return (
                    <Fragment>
                      <IFVDataGridTableContentRow
                        // cols={gridCols}
                        cols={tableColumns}
                        data={row}
                        rowIndex={rowIndex}
                        isSaveRowsFlag={isSaveRowsFlag}
                        isEvenRow={isEvenRow}
                      />
                    </Fragment>
                  );
                })}
              </React.Fragment>
            </React.Fragment>
          )}
        </IFVDataGridTableContentContainerScrollable>
      </ScrollSyncPane>
    </IFVDataGridTableContentContainer>
  );
};

export default IFVDataGridTableContent;
