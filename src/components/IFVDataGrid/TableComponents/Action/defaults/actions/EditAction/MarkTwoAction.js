import { AddAlarmRounded, AddBoxRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";

export const MarkTwoAction = {
  id: "mark-two-action-button",
  name: "Mark Two Action",
  className: "markTwoActionButton",
  propertyName: "markTwoAction",
  colorState: "#21A366",
  icon: <AddAlarmRounded />,
  display: true,
  syncArgs: defaultSyncArgs,
  asyncArgs: defaultAsyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
};
