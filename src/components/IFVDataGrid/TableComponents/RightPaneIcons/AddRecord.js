import React from "react";
import { Close, Add } from "@material-ui/icons";
import GenericButton from "./MaterialComponents/GenericButton";
import { useTranslation } from "react-i18next";

export const AddRecord = ({
  isAddRow,
  setIsAddRow,
  disabled,
  toggleIsEditModeHost,
  id,
  visibility,
  tableName,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      {tableName !== "ba-view-bulk-records" && (
        <GenericButton
          id={id}
          width={"11.5em"}
          style={{
            display: tableName === "ba-view-bulk-records" ? "none" : "auto",
          }}
          backgroundColor="primary"
          buttonName={
            isAddRow
              ? t(`commons.cancelText`)
              : t(`commons.table.addRecord.name`)
          }
          visibility={visibility}
          startIcon={isAddRow ? <Close /> : <Add />}
          Icon={
            isAddRow ? (
              <Close style={{ width: "0.8em", height: "0.8em" }} />
            ) : (
              <Add style={{ width: "0.8em", height: "0.8em" }} />
            )
          }
          disabled={disabled}
          onClick={(event) => {
            setIsAddRow(!isAddRow);
            toggleIsEditModeHost(!isAddRow);
          }}
        />
      )}
    </>
  );
};
