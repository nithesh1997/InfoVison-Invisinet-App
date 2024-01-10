export const deleteRow = {
  type: "__delete",
  name: "Delete Action",
  isEnabled: (row) => true,
  handleDelete: (row, setTaskStatus) => {
    setTaskStatus({
      inProgress: false,
      error: false,
      message: `DELETED ROW WITH ID: ${row.id} SUCCESSFULLY`,
    });
  },
};
