import { filters } from "./filters/filters";
import { sort } from "./sort";

export const subconscious = {
  name: "development-table",
  filters,
  sort,
  page: 1,
  pageSize: 5,
  pageSizeOptions: [5, 10, 20, 50, 100],
};
