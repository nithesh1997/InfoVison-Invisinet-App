import { ArrowDownwardRounded, CloudDownload } from "@material-ui/icons";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../..";
import { CancelAction } from "./CancelAction";
import { SaveAction } from "./SaveAction";

export const DownloadAction = {
  id: "download-action-button",
  name: "Download Action",
  className: "downloadActionButton",
  propertyName: "downloadAction",
  colorState: "#058FE7",
  icon: <ArrowDownwardRounded />,
  display: true,
  asyncArgs: defaultAsyncArgs,
  syncArgs: defaultSyncArgs,
  syncHandler: defaultSyncHandler,
  asyncHandler: defaultAsyncHandler,
  childActions: [SaveAction, CancelAction],
};
