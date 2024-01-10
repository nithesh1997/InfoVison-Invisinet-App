export const editRow = {
  type: "__edit",
  name: "Edit Action",
  isEnabled: (row) => true,
  handleEdit: (row, setTaskStatus) => {
    setTaskStatus({
      inProgress: false,
      error: false,
      message: ``,
      payload: { ...row },
      inputHelpersText: {
        name: "name Input Field",
        group: "group Input Field",
        trustlevel: "trustlevel Input Field",
        ipaddress: "ipaddress Input Field",
        comment: "comment Input Field",
        tcptagging: "tcptagging Input Field",
        remotekey: "remotekey Input Field",
        enabled: "enabled Input Field",
        date: "date Input Field",
        time: "time Input Field",
        "date-time": "date-time Input Field",
      },
    });
  },
  handleSave: (dirtyRow, setTaskStatus, row) => {
    setTaskStatus({
      inProgress: false,
      payload: { ...dirtyRow },
      error: false,
      message: dirtyRow.name.split(" ").join("").toLowerCase().includes("kelly")
        ? "That's what she said... 😂"
        : `SAVE ACTION EXECUTED SUCCESSFULLY`,
      deleteRow: dirtyRow.name
        .split(" ")
        .join("")
        .toLowerCase()
        .includes("kelly"),
    });
  },
  handleDiscard: (row, setTaskStatus) => {
    setTaskStatus({
      inProgress: false,
      error: false,
      message: "CANCEL REQUEST MADE TO SERVER SUCCESSFULLY",
    });
  },
};
