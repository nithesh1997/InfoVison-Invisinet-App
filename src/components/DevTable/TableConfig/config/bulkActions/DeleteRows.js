import { DeleteRounded } from "@material-ui/icons";

export const DeleteRows = {
  name: "Delete Rows",
  icon: <DeleteRounded />,
  handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
    const unSelectedTableRows = tableRows.filter((row) => {
      return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
    });

    setTimeout(() => {
      setTaskStatus({
        loading: false,
        payload: [...unSelectedTableRows],
        error: false,
        message: "",
      });
    }, 0);
  },
};
