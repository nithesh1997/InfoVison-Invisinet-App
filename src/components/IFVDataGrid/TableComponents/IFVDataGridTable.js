import { Box } from "@material-ui/core";
import { TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Element } from "react-scroll";
import { ScrollSync } from "react-scroll-sync";
import styled from "styled-components";
import IFVDataGridTableContent from "./IFVDataGridTableContent.js";
import IFVDataGridTableHeader from "./IFVDataGridTableHeader.js";

const IFVDataGridTableContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  flex-grow: 1;
  position: relative;
  width: 100%;
  font-size: 1em;
  line-height: 1.25em;
  font-weight: 500;
  /* font-family: Montserrat; */
  color: #212121;
`;

const IFVDataGridTableDataContainerScrollable = styled(Box)`
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
  /* overflow-x: auto;
  overflow-y: auto; */
`;

const IFVDataGridTable = (props) => {
  const { t, i18n } = useTranslation();
  const noDataMessage =
    props.config.noDataMessage || t(`commons.table.content.noContentMessage`);

  return (
    <ScrollSync proportional={false}>
      <IFVDataGridTableContainer className={"IFV-DataGrid-table"}>
        <Element id="ifv-data-grid-table-616">
          <IFVDataGridTableDataContainerScrollable
            className={"IFV-DataGrid-table-data-container-scrollable"}
          >
            {/* - Table Header */}
            <IFVDataGridTableHeader
              cols={props.cols}
              loadingData={props.loadingData}
            />

            {/* - Table Contents */}
            <IFVDataGridTableContent
              cols={props.cols}
              loadingData={props.loadingData}
              data={props.data}
              noDataMessage={noDataMessage}
            />
          </IFVDataGridTableDataContainerScrollable>
        </Element>
      </IFVDataGridTableContainer>
    </ScrollSync>
  );
};

export default IFVDataGridTable;

const Styled = {
  HeaderWrapper: styled(Box)``,
  FilterInput: styled(TextField)``,
  ActionWrapper: styled(Box)`
    position: absolute;
    z-index: 1;
    background: #fff;
    width: 8rem;
    height: 100%;
    right: -0%;
    border-top-right-radius: 0.4rem;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
  `,
  Table: styled.table`
    height: 100%;
    width: 100%;
    border-collapse: collapse;
  `,
  TableHead: styled.thead`
    height: 42px;
  `,
  TableBody: styled.tbody``,
  TableRow: styled.tr``,
  TableCell: styled.td`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1rem;
    width: 100%;
    height: 100%;
    border: 1px solid #dddddd;
  `,
};
