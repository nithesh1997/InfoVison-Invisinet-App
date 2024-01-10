import { AddBoxRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";

export const MarkOneAction = {
  id: "mark-one-action-button",
  name: "Mark One Action",
  className: "markOneActionButton",
  propertyName: "markOneAction",
  colorState: "#21A366",
  icon: <AddBoxRounded />,
  display: true,
  syncArgs: defaultSyncArgs,
  asyncArgs: defaultAsyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
};
