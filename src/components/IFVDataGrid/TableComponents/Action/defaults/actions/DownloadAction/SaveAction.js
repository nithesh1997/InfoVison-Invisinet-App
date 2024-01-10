import { DoneRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";

export const SaveAction = {
  id: "save-action-button",
  name: "Done Action",
  className: "doneActionButton",
  propertyName: "doneAction",
  colorState: "#21A366",
  icon: <DoneRounded />,
  display: true,
  syncArgs: defaultSyncArgs,
  asyncArgs: defaultAsyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
};
