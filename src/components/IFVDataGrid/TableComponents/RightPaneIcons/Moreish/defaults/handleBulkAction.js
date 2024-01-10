export const handleBulkAction = (rows) => {
  return {
    loading: false,
    payload: [...rows],
    error: "DEFAULT",
    success: "DEFAULT",
  };
};
