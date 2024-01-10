import { DeleteRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";

export const DeleteAction = {
  id: "delete-action-button",
  name: "Delete Action",
  className: "deleteActionButton",
  propertyName: "deleteAction",
  colorState: "#EF4444",
  icon: <DeleteRounded />,
  display: true,
  // syncArgs: defaultSyncArgs,
  // asyncArgs: defaultAsyncArgs,
  // syncHandler: defaultSyncHandler,
  // asyncHandler: defaultAsyncHandler,
};
