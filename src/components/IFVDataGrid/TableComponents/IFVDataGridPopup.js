import { Box, IconButton } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import React, { useContext } from "react";
import styled from "styled-components";
import OverlayContext from "../../AppContent/AppOverlayContext";
import InputField from "./InputField";

const ClosePortalButton = () => {
  const AppOverlayContext = useContext(OverlayContext);

  const closePopup = () => {
    AppOverlayContext.setComponentsShown(
      AppOverlayContext.componentsShown.replace(
        /(,ifv-portal,)|(,ifv-portal$)/,
        ",",
      ),
    );
  };

  return (
    <ClosePortal onClick={closePopup}>
      <CloseSharp />
    </ClosePortal>
  );
};

const RenderCellInputs = ({ editableRow, swapRow }) => {
  return (
    <>
      {editableRow.memoHeads.map((heading) => {
        return heading.dataKey !== "__action" ? (
          <InputField
            options={heading.options}
            type={heading.type}
            dataId={swapRow.id}
            dataKey={heading.dataKey}
            label={heading.headerName}
            value={swapRow[heading.dataKey]}
          />
        ) : (
          heading.renderViewState({
            heading: heading,
            data: swapRow,
            memoHeads: editableRow.memoHeads,
            editMode: "popup",
          })
        );
      })}
    </>
  );
};

export const IFVDataGridPopup = () => {
  const { editableRow, setEditableRow } = useContext(OverlayContext);
  const { swapRow } = useContext(OverlayContext);

  return (
    <PortalWrapper>
      <PortalContent>
        {editableRow.memoHeads && (
          <RenderCellInputs editableRow={editableRow} swapRow={swapRow} />
        )}
      </PortalContent>

      <ClosePortalButton />
    </PortalWrapper>
  );
};

const PortalWrapper = styled(Box)`
  position: relative;
  background: #f9f9f9;
  border-radius: 1rem;
  width: 500px;
  height: 500px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 2rem;
`;

const PortalContent = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 2rem;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  overflow-x: hidden;
  overflow-y: scroll;
  box-shadow: inset 0px -16px 8px -10px #1d1f2030;
  &::-webkit-scrollbar {
    display: none; /* Chrome  */
  }
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

const ClosePortal = styled(IconButton)`
  position: absolute;
  top: 1.8%;
  right: 1.8%;
  padding: 0.2rem;
  &:hover {
    background: #d6eeff60;
  }
`;
