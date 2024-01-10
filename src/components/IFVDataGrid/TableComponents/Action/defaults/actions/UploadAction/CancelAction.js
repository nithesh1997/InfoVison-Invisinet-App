import { ClearRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";

export const CancelAction = {
  id: "cancel-action-button",
  name: "Cancel Action",
  className: "cancelActionButton",
  propertyName: "cancelAction",
  colorState: "#DF594D",
  icon: <ClearRounded />,
  display: true,
  syncArgs: defaultSyncArgs,
  asyncArgs: defaultAsyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
};
