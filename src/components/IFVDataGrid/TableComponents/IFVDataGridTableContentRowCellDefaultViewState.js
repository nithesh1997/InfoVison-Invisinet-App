import { Box } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

const IFVDataGridTableContentRowCellDefaultViewStateContainer = styled(Box)`
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
  padding: 1em 1em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  text-align: ${(props) =>
    props.alignment === "center"
      ? "center"
      : props.alignment === "right"
      ? "right"
      : "left"};
`;

const IFVDataGridTableContentRowCellDefaultViewState = (props) => {
  return (
    <IFVDataGridTableContentRowCellDefaultViewStateContainer
      className={"IFV-DataGrid-table-content-row-cell-default-view-state"}
      alignment={props.heading.contentAlignment}
      // key={props.heading.dataKey}
    >
      {props.data[props.heading.dataKey]}
    </IFVDataGridTableContentRowCellDefaultViewStateContainer>
  );
};

export default IFVDataGridTableContentRowCellDefaultViewState;
