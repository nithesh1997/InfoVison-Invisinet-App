import { EditRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";
import { CancelAction } from "./CancelAction";
import { SaveAction } from "./SaveAction";
import { MarkOneAction } from "./MarkOneAction";
import { MarkTwoAction } from "./MarkTwoAction";

export const EditAction = {
  id: "edit-action-button",
  name: "Edit Action",
  className: "editActionButton",
  propertyName: "editAction",
  colorState: "#058FE7",
  icon: <EditRounded />,
  display: true,
  asyncArgs: defaultAsyncArgs,
  syncArgs: defaultSyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
  childActions: [SaveAction, CancelAction, MarkOneAction, MarkTwoAction],
};
