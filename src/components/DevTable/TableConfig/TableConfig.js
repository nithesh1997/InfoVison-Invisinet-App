import { config } from "./config/config";
import { editPopup } from "./config/editPopup/editPopup";
import { loadingData } from "./config/loadingData/loadingData";
import { subconscious } from "./config/subconscious/subconscious";
import { columns } from "./columns/columns";
import { rows } from "./rows/rows";

const tablePayload = {
  columns,
  config,
  editPopup,
  loadingData,
  rows,
  subconscious,
};

export default tablePayload;
