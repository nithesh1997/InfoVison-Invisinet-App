import { Box, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import GridPortal from "../../IFVDataGrid/GridPortal";

export const ManageGatewayModal = (props) => {
  const { ManagerState, SearchState, AddGatewayForm } = props;

  const { isModalOpen } = useSelector(({ gatewayManager }) => gatewayManager);

  const [managerState, setManagerState] = ManagerState;
  const [searchState, setSearchState] = SearchState;
  const [addGatewayForm, setAddGatewayForm] = AddGatewayForm;

  return (
    <Box style={{ width: "100px", height: "100px", background: "#FFF" }} />
  );
};
