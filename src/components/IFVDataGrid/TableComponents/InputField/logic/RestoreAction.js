import React from "react";
import { RestoreButton } from "../styled-materials";
import SettingsBackupRestoreSharpIcon from "@material-ui/icons/SettingsBackupRestoreSharp";

export const RestoreAction = ({
  type,
  sign,
  isRestore,
  handleToggleRestore,
  handleDropDownRestore,
  handleDateTimeRestore,
  handleFreeSoloMultipleRestore,
  handleFreeSoloSingleRestore,
  handleDateRestore,
  handleTimeRestore,
  handleRestore,
}) => {
  return (
    <RestoreButton
      onClick={(event) => {
        switch (type) {
          case "toggle":
            return handleToggleRestore(event);
          case "dropdown":
            return handleDropDownRestore(event);
          case "date":
            return handleDateRestore(event);
          case "time":
            return handleTimeRestore(event);
          case "date-time":
            return handleDateTimeRestore(event);
          case "free-solo-multiple":
            return handleFreeSoloMultipleRestore(event);
          case "free-solo-single":
            return handleFreeSoloSingleRestore(event);

          default:
            return handleRestore(event);
        }
      }}
      sign={sign}
      isRestore={isRestore}
    >
      <SettingsBackupRestoreSharpIcon fontSize="small" />
    </RestoreButton>
  );
};
