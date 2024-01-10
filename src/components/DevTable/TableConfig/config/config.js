import { bulkActions } from "./bulkActions/bulkActions";
import { addHandler } from "./addHandler/addHandler";

export const config = {
  addHandler,
  allowMultipleRowSelection: true,
  bulkActions,
  editMode: "",
  globalSearch: true,
  noDataMessage: "Hey There! Howz-it hangin?",
  fallbackRow: { "date-time": "1970-01-01T00:00" },
};
