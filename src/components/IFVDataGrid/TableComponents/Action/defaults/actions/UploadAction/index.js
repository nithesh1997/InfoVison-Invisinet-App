import { ArrowUpwardRounded } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";
import { CancelAction } from "./CancelAction";
import { SaveAction } from "./SaveAction";

export const UploadAction = {
  id: "upload-action-button",
  name: "Upload Action",
  className: "uploadActionButton",
  propertyName: "uploadAction",
  colorState: "#058FE7",
  icon: <ArrowUpwardRounded />,
  display: true,
  asyncArgs: defaultAsyncArgs,
  syncArgs: defaultSyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
  childActions: [SaveAction, CancelAction],
};
