import { Box } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";
import { CloseButton } from "../styled-materials/CloseButton";
import { Popup } from "../styled-materials/Popup";
import { PopupHeader } from "../styled-materials/PopupHeader";

export const CustomPopup = React.memo(
  ({
    closePortal,
    gridCols,
    gridRows,
    isAddRow,
    editMode,
    dirtyRow,
    setDirtyRows,
    rowStruct,
    dontClosePopup,
    toggleIsEditModeHost,
    dirtyRows,
    customActionType,
  }) => {
    const customActions = React.useCallback((columns) => {
      const actionObject = columns.filter(
        ({ dataKey }) => dataKey === "__action",
      );
      const actions = actionObject[0].actions; // 😂

      return actions.filter((action) => action.type === customActionType)[0];
    }, []);

    const customAction = customActions(gridCols);

    return (
      <Popup>
        <PopupHeader>
          <h6
            class="modal-title fw-bold"
            id="staticBackdropLabel"
            style={{
              fontSize: "1rem",
              marginTop: 0,
              marginBottom: 0,
              fontWeight: 700,
              lineHeight: 1.5,
              // fontFamily: "'Montserrat', sans-serif",
              color: "rgba(2, 147, 254, 1)",
            }}
          >
            {customAction.name}
          </h6>
          <CloseButton
            onClick={(event) => {
              if (dontClosePopup) {
                setDirtyRows((prevRows) =>
                  prevRows.filter((r) => r.id !== dirtyRow.id),
                );
                closePortal(event);
                toggleIsEditModeHost(dirtyRows.length === 0 ? false : true);
              }
            }}
          >
            <CloseSharp fontSize="medium" />
          </CloseButton>
        </PopupHeader>
        <CustomPopupContent>{/* <DownloadLogs /> */}</CustomPopupContent>
      </Popup>
    );
  },
);

const CustomPopupContent = styled(Box)`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 3em 3em;
  flex-direction: column;
  align-items: center;
  gap: 0em;
  overflow-y: scroll;
`;
