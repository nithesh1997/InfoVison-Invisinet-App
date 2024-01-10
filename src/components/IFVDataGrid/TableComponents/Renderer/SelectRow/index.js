import React from "react";
import { useTranslation } from "react-i18next";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { Styled } from "./Styled";

export const SelectRow = ({
  row,
  rowID = "checkbox",
  isChecked = false,
  disabled = false,
  defaultChecked = false,
  toggleSelectRow,
}) => {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <ToolTip
        title={t("commons.table.header.checkbox.tooltip", {
          isSelected: isChecked ? "Deselect" : "Select",
          isIncluded: isChecked ? "Deselect" : "Select",
        })}
      >
        <Styled.CheckBox
          id={rowID}
          checked={isChecked}
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={(event) => toggleSelectRow(rowID, event.target.checked)}
        />
      </ToolTip>
    </Styled.Wrapper>
  );
};
