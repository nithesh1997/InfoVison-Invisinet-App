import React, { useContext } from "react";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";

const handleCustomAction = (row, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    payload: { ...row },
    isError: false,
    message:
      "This action is still in development as it has not been configured.",
  });
};

export const CustomAction = ({
  actionPayloadState,
  editOnPopup,
  icon,
  name,
  onClick,
  row,
  setStartAsync,
  startAsync,
  type,
}) => {
  const { componentsShown } = React.useContext(OverlayContext);
  const { setComponentsShown } = React.useContext(OverlayContext);
  const { setDontClosePopup, setCustomActionType } =
    useContext(DataGridContext);
  const { togglePortal, gridConfig } = React.useContext(DataGridContext);
  const { isAddRow, setCustomPopup } = React.useContext(DataGridContext);
  const [rowActionState, setRowActionState] = actionPayloadState;
  const [toggleViewState, setToggleViewState] = React.useState(false);

  React.useEffect(() => {
    if (!onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick]);

  if (onClick === null) {
    onClick = handleCustomAction;
  }

  React.useEffect(() => {
    if (isAddRow) {
      setToggleViewState(false);
    }
    if (!isAddRow) {
      setToggleViewState(true);
    }
  }, [isAddRow]);

  React.useEffect(() => {
    if (startAsync.isCustom[type] === true) {
      setCustomActionType(type);
      setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState);
    }
  }, [startAsync]);

  React.useEffect(() => {
    if (
      rowActionState.inProgress === false &&
      startAsync.isCustom[type] === true
    ) {
      setStartAsync((prev) => {
        const prevCustom = { ...prev.isCustom };
        return { ...prev, isCustom: { ...prevCustom, [type]: false } };
      });
      setDontClosePopup(true);
      if (rowActionState.error) {
        alert(rowActionState.message);
      } else {
        rowActionState.message && alert(rowActionState.message);
        const rowPayload = rowActionState.payload;
      }
    }
  }, [rowActionState]);

  const calcToggle = toggleViewState && !editOnPopup ? true : false;

  return (
    <React.Fragment>
      <ActionIconButton
        isDisplay={calcToggle}
        name={name}
        hoverBg="rgba(2, 147, 254, 0.2)"
        onClick={(event) => {
          setStartAsync((prev) => {
            const prevCustom = { ...prev.isCustom };
            return { ...prev, isCustom: { ...prevCustom, [type]: true } };
          });
        }}
      >
        {icon}
      </ActionIconButton>
    </React.Fragment>
  );
};
