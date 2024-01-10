import { Box } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseButton } from "../styled-materials/CloseButton";
import { Popup } from "../styled-materials/Popup";
import { PopupContent } from "../styled-materials/PopupContent";
import { PopupHeader } from "../styled-materials/PopupHeader";
import { Renderer } from "../TableComponents/Renderer";

export const EditPopup = React.memo(
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
    IsEditClosed,
  }) => {
    const { t, i18n } = useTranslation();

    const [rowIndex, setRowIndex] = useState(0);
    const [infected, setInfected] = useState([]);
    const [validateAll, setValidateAll] = useState(false);
    const [isErrorCheckCompleted, setIsErrorCheckCompleted] = useState(false);
    const [isSaveRowsFlag, setIsSaveRowsFlag] = useState([]);
    const [isEditClosed, setIsEditClosed] = IsEditClosed;
    const row = React.useMemo(() => {
      return dirtyRow ? gridRows.filter((row) => row.id === dirtyRow.id) : {};
    }, [dirtyRow, gridRows]);

    useEffect(() => {
      if (dirtyRows.length) {
        const flag = dirtyRows.map((r) => {
          const rowFlag = {};
          const [orgRow] = gridRows.filter((row) => row.id === r.id);
          const keys = Object.keys(r).filter((key) => {
            return key !== "id" && key !== "__isEditMode";
          });

          keys.map(
            (key) =>
              (rowFlag[key] =
                r[key] === (r.id === "_newRow" ? rowStruct[key] : orgRow[key])),
          );

          return { ...rowFlag, id: r.id };
        });

        setIsSaveRowsFlag(flag);
      }
    }, [dirtyRows, gridRows, rowStruct]);

    useEffect(() => {
      gridRows.map((r, index) => {
        setRowIndex(r.id === row.id ? index : 0);
      });
    }, [gridRows, row]);

    const renderColumns = gridCols.filter((col) => col.dataKey !== "isChecked");

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
              color: "rgba(2, 147, 254, 1)",
            }}
          >
            {isAddRow
              ? t(`commons.table.modal.addRecord`)
              : t(`commons.table.modal.editRecord`)}
          </h6>
          <CloseButton
            onClick={(event) => {
              if (dontClosePopup) {
                setDirtyRows((prevRows) =>
                  prevRows.filter((r) => r.id !== dirtyRow.id),
                );
                closePortal(false);
                toggleIsEditModeHost(dirtyRows.length === 0 ? false : true);
                setIsEditClosed(false);
              }
            }}
          >
            <CloseSharp fontSize="medium" />
          </CloseButton>
        </PopupHeader>
        <PopupContent>
          {renderColumns.map((col, index) => {
            return (
              <Box
                style={{
                  display: col.hideColumn ? "none" : "auto",
                  width: "100%",
                }}
              >
                <Renderer
                  alignment={col.contentAlignment}
                  col={col}
                  colIndex={index}
                  customWrapper={col.renderViewState}
                  dataKey={col.dataKey}
                  editOnPopup={true}
                  headerName={col.headerName}
                  Infected={[infected, setInfected]}
                  IsErrorCheckCompleted={[
                    isErrorCheckCompleted,
                    setIsErrorCheckCompleted,
                  ]}
                  options={col.options || []}
                  row={isAddRow ? rowStruct : { ...row[0] }}
                  rowIndex={rowIndex}
                  type={col.type}
                  ValidateAll={[validateAll, setValidateAll]}
                  isSaveRowsFlag={isSaveRowsFlag}
                />
              </Box>
            );
          })}
        </PopupContent>
      </Popup>
    );
  },
);
