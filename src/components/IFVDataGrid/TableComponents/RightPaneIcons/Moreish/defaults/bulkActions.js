import {
  DeleteRounded,
  EditRounded,
  RadioButtonUncheckedRounded,
} from "@material-ui/icons";

export const bulkActions = [
  {
    name: "Uncheck Rows",
    icon: <RadioButtonUncheckedRounded />,
    handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
      const unSelectedTableRows = tableRows.filter((row) => {
        return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
      });

      const selectedTableRows = tableRows.filter((row) => {
        return Boolean(selectedRows.filter((r) => r.id === row.id).length);
      });

      setTimeout(() => {
        setTaskStatus({
          loading: false,
          payload: [
            ...unSelectedTableRows,
            ...selectedTableRows.map((row) => ({
              ...row,
              isChecked: false,
            })),
          ],
          error: false,
          message: "",
        });
      }, 5000);
    },
  },
  {
    name: "Update Rows",
    icon: <EditRounded />,
    handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
      const unSelectedTableRows = tableRows.filter((row) => {
        return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
      });

      const selectedTableRows = tableRows.filter((row) => {
        return Boolean(selectedRows.filter((r) => r.id === row.id).length);
      });

      setTaskStatus({
        loading: false,
        payload: [
          ...unSelectedTableRows,
          ...selectedTableRows,
          // ...selectedTableRows.map((row) => ({ ...row, isChecked: false })),
        ],
        error: false,
        message: "",
      });
    },
  },
  {
    name: "Delete Rows",
    icon: <DeleteRounded />,
    handleBulkAction: (tableRows, selectedRows, setTaskStatus) => {
      const unSelectedTableRows = tableRows.filter((row) => {
        return !Boolean(selectedRows.filter((r) => r.id === row.id).length);
      });

      // const selectedTableRows = tableRows.filter((row) => {
      //   return Boolean(selectedRows.filter((r) => r.id === row.id).length);
      // });

      setTimeout(() => {
        setTaskStatus({
          loading: false,
          payload: [
            ...unSelectedTableRows,
            // ...selectedTableRows,
            // ...selectedTableRows.map((row) => ({ ...row, isChecked: false })),
          ],
          error: false,
          message: "",
        });
      }, 5000);
    },
  },
];
