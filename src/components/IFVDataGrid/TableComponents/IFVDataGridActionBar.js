import styled from "styled-components";
import { Box } from "@material-ui/core";

const IFVDataGridActionBarRoot = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: 100%;
  margin: 0.25em 0em 0.75em 0em;
`;

const IFVDataGridActionBarLeftPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  width: 100%;
`;

const IFVDataGridActionBarRightPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  gap: 1rem;
`;

const IFVDataGridActionBar = (props) => {
  return (
    <IFVDataGridActionBarRoot className={"IFV-DataGrid-action-bar"}>
      <IFVDataGridActionBarLeftPane
        className={"IFV-DataGrid-action-bar-left-pane"}
      >
        {props.leftPaneIcons}
      </IFVDataGridActionBarLeftPane>
      <IFVDataGridActionBarRightPane
        className={"IFV-DataGrid-action-bar-right-pane"}
      >
        {props.rightPaneIcons}
      </IFVDataGridActionBarRightPane>
    </IFVDataGridActionBarRoot>
  );
};

export default IFVDataGridActionBar;
