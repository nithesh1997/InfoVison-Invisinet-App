export const handleSave = (row, setTaskStatus) => {
  setTaskStatus({
    inProgress: false,
    payload: { ...row },
    error: false,
    message: "ADD REQUEST MADE TO SERVER SUCCESSFULLY",
  });
};
