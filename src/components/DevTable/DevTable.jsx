import { useContext, useRef, useState } from "react";
import Config from "../../Config";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import IFVDataGrid from "../IFVDataGrid/IFVDataGrid";
import { Styled } from "./Styled";
import tablePayload from "./TableConfig/TableConfig";

const tableKey = "developement-table-key";

const DevTable = () => {
  const tableRef = useRef();

  const appConfig = useContext(Config);

  const title = appConfig.pages.dev.title;
  const breadcrumb = appConfig.pages.dev.breadcrumb;

  const [loading, setLoading] = useState(false);
  const [tableConfig, setTableConfig] = useState(tablePayload.config);
  const [subconscious, setSubconscious] = useState(tablePayload.subconscious);
  const [columns, setColumns] = useState(tablePayload.columns);
  const [rows, setRows] = useState(tablePayload.rows);

  return (
    <Styled.Wrapper component={"section"}>
      <AppInContentHeader title={title} breadcrumb={breadcrumb} />
      <Styled.TableWrapper>
        <IFVDataGrid
          key={tableKey}
          tableKey={tableKey}
          ref={tableRef}
          config={[tableConfig, setTableConfig]}
          subconscious={[subconscious, setSubconscious]}
          loadingData={[loading, setLoading]}
          cols={[columns, setColumns]}
          data={[rows, setRows]}
        />
      </Styled.TableWrapper>
    </Styled.Wrapper>
  );
};

export default DevTable;
