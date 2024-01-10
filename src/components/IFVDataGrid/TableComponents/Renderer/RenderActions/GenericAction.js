import React, { useContext } from "react";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";

const handleGeneric = (row, setRowActionState) => {
  setTimeout(() => {
    setRowActionState({
      inProgress: false,
      payload: { ...row },
      isError: false,
      message: "DEFAULT GENERIC REQUEST MADE SUCCESSFULLY",
    });
  }, 1500);
};

export const GenericAction = ({
  actionPayloadState,
  row,
  startAsync,
  setStartAsync,
  type,
  icon,
  handleClick,
}) => {
  const renderCount = React.useRef(0);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const { setDontClosePopup } = useContext(DataGridContext);
  const { togglePortal, gridConfig } = useContext(DataGridContext);
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const { setGridAllRows, toggleIsEditModeHost } = useContext(DataGridContext);
  const [toggleViewState, setToggleViewState] = React.useState(false);

  if (handleClick === null) {
    handleClick = handleGeneric;
  }

  React.useEffect(() => {
    if (startAsync.isCustom[type] === true) {
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      handleClick(row, setRowActionState);
    }
  }, [startAsync.isCustom[type]]);

  React.useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isCustom[type] === true
    ) {
      setStartAsync((prev) => ({
        ...prev,
        isCustom: {
          downloadLogs: type !== "downloadLogs",
          viewLogs: type !== "viewLogs",
        },
      }));
      setDontClosePopup(true);
      if (rowActionState.error) {
        alert(rowActionState.message);
      } else {
        rowActionState.message && alert(rowActionState.message);
      }
    }
  }, [rowActionState]);

  return (
    <React.Fragment>
      <ActionIconButton
        isDisplay={true}
        hoverBg="rgba(2, 147, 254, 0.2)"
        onClick={(event) => {
          setStartAsync((prev) => ({
            ...prev,
            isCustom: {
              downloadLogs: type === "downloadLogs",
              viewLogs: type === "viewLogs",
            },
          }));
        }}
      >
        {icon}
      </ActionIconButton>
    </React.Fragment>
  );
};
