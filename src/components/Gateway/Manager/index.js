import React, { useState } from "react";
import { ManageGatewayModal } from "./ManageGatewayModal";
import { initManagerState } from "./InitialState/initManagerState";
import { initAddGatewayForm } from "./InitialState/initAddGatewayForm";

const Manager = () => {
  const [state, setState] = useState(initManagerState);
  const [searchText, setSearchText] = useState("");
  const [addGatewayForm, setAddGatewayForm] = useState(initAddGatewayForm);

  return (
    <ManageGatewayModal
      ManagerState={[state, setState]}
      SearchState={[searchText, setSearchText]}
      AddGatewayForm={[addGatewayForm, setAddGatewayForm]}
    />
  );
};

export default Manager;
