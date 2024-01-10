import { Box } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { DataGridContext } from "../IFVDataGrid";
import { Renderer } from "./Renderer";

const IFVDataGridTableContentRowCellContainer = styled(Box)`
  display: ${(props) =>
    (props.isHide && props.tableEditMode === "popup") || props.theme.hideColumn
      ? "none"
      : "flex"};
  padding: 0.5em 1em;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "flex-end"
      : "flex-start"};
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: ${(props) => props.calcWidth};
  min-width: ${(props) => (props.minWidth ? props.minWidth + "px" : "auto")};
  max-width: ${({ isCheckbox }) => (isCheckbox ? "32px" : "auto")};
  background-color: rgba(254, 254, 254, 1);
  border-left: 0.1em solid #f1f1f1;
  border-bottom: 0.1em solid #f1f1f1;
  border-top: 0.1em solid #f1f1f1;

  ${({ theme }) => {
    if (theme.isActionSticky) {
      return `
        background: ${
          theme.isEvenRow ? "#EFF6FF !important" : "#FEFEFE !important"
        }};
        position: ${theme.isActionSticky ? "-webkit-sticky" : "inherit"};
        position: ${theme.isActionSticky ? "sticky" : "inherit"};
        z-index: ${theme.isActionSticky ? "1" : "auto"};
        right: ${theme.isActionSticky ? "-0.1%" : "auto"};
        border: ${theme.isActionSticky ? "0.1em solid #F1F1F1" : "auto"};
        box-shadow: ${
          theme.isActionSticky
            ? /* ? `-0.25em 0em 0.5em 0em rgb(0 0 0 / 20%)` */
              `-0.2em 0em 0.1em 0em rgb(0 0 0 / 10%)`
            : "none"
        };
      `;
    }
  }}
`;

const IFVDataGridTableContentRowCell = (props) => {
  const { isEditModeHost, gridConfig } = React.useContext(DataGridContext);

  if (props.heading.type === "actions" && props.heading.hideAction === true) {
    return <></>;
  }

  return (
    <IFVDataGridTableContentRowCellContainer
      className={"IFV-DataGrid-table-content-row-cell"}
      calcWidth={props.heading.__calcWidth}
      flexWidth={props.heading.flexWidth}
      minWidth={props.heading.minWidth}
      isCheckbox={props.heading.dataKey === "isChecked"}
      alignment={props.heading.contentAlignment}
      isHide={props.heading.hideInViewState}
      isEditMode={isEditModeHost}
      tableEditMode={gridConfig.editMode}
      theme={{
        isActionSticky: props.heading.dataKey === "__action",
        isEvenRow: props.isEvenRow,
        hideColumn: props.heading.hideColumn,
      }}
    >
      <Renderer
        alignment={props.heading.contentAlignment}
        col={props.heading}
        colIndex={props.colIndex}
        customWrapper={props.heading.renderViewState}
        dataKey={props.heading.dataKey}
        editOnPopup={false}
        headerName={props.heading.headerName}
        Infected={props.Infected}
        IsErrorCheckCompleted={props.IsErrorCheckCompleted}
        options={props.heading.options || []}
        row={props.data}
        rowIndex={props.rowIndex}
        type={props.heading.type}
        ValidateAll={props.ValidateAll}
        isSaveRowsFlag={props.isSaveRowsFlag}
      />
    </IFVDataGridTableContentRowCellContainer>
  );
};

export default IFVDataGridTableContentRowCell;
