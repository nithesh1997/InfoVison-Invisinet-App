import { Box } from "@material-ui/core";
import lodash from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import IFVDataGridTableContentRowCell from "./IFVDataGridTableContentRowCell";

const IFVDataGridTableContentRowContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: 100%;
  background-color: rgba(254, 254, 254, 1);
  /* border-bottom: 0.1em solid #eee; */
  font-size: 1em;
  line-height: 1.25em;
  font-weight: 400;
  /* font-family: Montserrat; */
  color: #212121;

  & > *:last-child {
    min-width: ${(props) => props.lastChildMinWidth};
    flex-grow: 1;
  }
`;

const IFVDataGridTableContentRow = React.memo(
  (props) => {
    const [infected, setInfected] = useState([]);
    const [validateAll, setValidateAll] = useState(false);
    const [isErrorCheckCompleted, setIsErrorCheckCompleted] = useState(false);

    return (
      <IFVDataGridTableContentRowContainer
        className={"IFV-DataGrid-table-content-row"}
        lastChildMinWidth={props.cols[props.cols.length - 1].minWidth + "px"}
      >
        {props.cols.map((col, colIndex) => {
          return (
            <IFVDataGridTableContentRowCell
              heading={col}
              data={props.data}
              dirtyRowHandler={props.dirtyRowHandler}
              heads={col.dataKey === "__action" ? props.cols : ""}
              rowIndex={props.rowIndex}
              colIndex={colIndex}
              Infected={[infected, setInfected]}
              ValidateAll={[validateAll, setValidateAll]}
              isSaveRowsFlag={props.isSaveRowsFlag}
              IsErrorCheckCompleted={[
                isErrorCheckCompleted,
                setIsErrorCheckCompleted,
              ]}
              isEvenRow={props.isEvenRow}
            />
          );
        })}
      </IFVDataGridTableContentRowContainer>
    );
  },
  (prevProps, nextProps) => lodash.isEqual(prevProps, nextProps),
);

export default IFVDataGridTableContentRow;
