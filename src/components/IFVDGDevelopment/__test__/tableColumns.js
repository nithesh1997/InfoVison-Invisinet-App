import React from "react";
import CircularProgressWithLabel from "../../PageLoader/CircularProgressWithLabel";

export const TrustLevel = (props) => {
  const minLevel = 0;
  const maxLevel = 7;
  return (
    <CircularProgressWithLabel
      size={36}
      value={(100 * props.level) / (maxLevel - minLevel)}
      displayValue={props.level}
      style={{
        margin: "0.5em",
      }}
    />
  );
};

export const columns = [
  {
    headerName: "Name",
    dataKey: "name",
    type: "",
    options: [],
    minWidth: 200,
    flexWidth: 1.25,
    headerAlignment: "right",
    contentAlignment: "right",
    sortable: true,
    // isDisableEdit: false, // By Default
    // isDisableAdd: false, // By Default
    // filterable: false,
    // filterExecutioner: (filter, value) => true,
    sortComparator: (valueA, valueB, rowA, rowB) => {
      return valueA > valueB ? 1 : valueA === valueB ? 0 : -1;
    },
    inputValidator: (event, row) => {
      const value = row.name;
      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : value.length <= 4
          ? {
              isValid: false,
              message: `* Required more than 4 characters`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Group",
    dataKey: "group",
    type: "free-solo-multiple",
    options: [
      "Regional Manager",
      "Co-Regional Manager",
      "Salesman",
      "Shareholder",
      "Telemarketer",
    ],
    minWidth: 250 * 1,
    flexWidth: 1,
    headerAlignment: "left",
    contentAlignment: "left",

    sortable: true,
    isDisableEdit: false,
    isDisableAdd: false,
    filterable: true,
    filterExecutioner: (filter, value) => {
      try {
        return String(value)
          .toLowerCase()
          .includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
      // return true;
    },
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !value.length
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }

      if (event._customName === "onChange") {
        return (
          value.length && {
            isValid: true,
            message: ``,
          }
        );
      }
    },
  },
  {
    headerName: "Trust Level",
    dataKey: "trustlevel",
    type: "free-solo-single",
    options: [0, 1, 2, 3, 4, 5, 6, 7],
    minWidth: 200,
    flexWidth: 0.5,
    headerAlignment: "left",
    contentAlignment: "center",
    sortable: true,
    isDisableEdit: false,
    // isDisableAdd: true,
    filterable: true,
    filterExecutioner: (filter, value) => {
      try {
        return String(value)
          .toLowerCase()
          .includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
    },
    renderViewState: (columns, row, value) => {
      return <TrustLevel level={value} />;
    },
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "IP Address / MAC",
    dataKey: "ipaddress",
    type: "text",
    options: [],
    minWidth: 250 * 1,
    flexWidth: 1,
    headerAlignment: "left",
    contentAlignment: "left",
    sortable: true,
    isDisableEdit: false,
    isDisableAdd: false,
    filterable: true,
    filterExecutioner: (filter, value) => {
      try {
        return String(value)
          .toLowerCase()
          .includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
    },
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Comments",
    dataKey: "comment",
    type: "multiline",
    options: [],
    minWidth: 250 * 1.25,
    flexWidth: 1.25,
    headerAlignment: "left",
    contentAlignment: "left",
    sortable: true,
    isDisableEdit: true,
    isDisableAdd: true,
    filterable: false,
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }

      if (event._customName === "onChange") {
        return (
          Boolean(Object.keys(value).length) &&
          !value.length <= 4 && {
            isValid: true,
            message: ``,
          }
        );
      }
    },
  },
  {
    headerName: "TCP Tagging",
    dataKey: "tcptagging",
    type: "free-solo-single",
    options: ["SEQ", "FIN", "SYN", "ACK"],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    hideInViewState: true,
    sortable: true,
    isDisableEdit: false,
    isDisableAdd: false,
    filterable: true,
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return value.length === 0
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Remote Key",
    dataKey: "remotekey",
    type: "select-single",
    options: ["❌", "✔️"],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    sortable: true,
    isDisableEdit: false,
    isDisableAdd: false,
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Enabled",
    dataKey: "enabled",
    type: "select-single",
    options: ["False", "True"],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    sortable: true,
    isDisableEdit: false,
    isDisableAdd: false,
    filterExecutioner: (filter, value) => {
      try {
        return String(value)
          .toLowerCase()
          .includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
    },
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Date",
    dataKey: "date",
    type: "date",
    options: [],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    hideInViewState: true,
    sortable: true,
    isDisableEdit: false,
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Time",
    dataKey: "time",
    type: "time",
    options: [],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    hideInViewState: true,
    sortable: true,
    isDisableEdit: false,
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Date Time",
    dataKey: "date-time",
    type: "date-time",
    options: [],
    minWidth: 200,
    flexWidth: 0.6,
    headerAlignment: "left",
    contentAlignment: "left",
    sortable: true,
    isDisableEdit: false,
    filterExecutioner: (filter, value) => {
      try {
        return String(value)
          .toLowerCase()
          .includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
    },
    inputValidator: (event, row) => {
      const value = event.target.value;

      if (event._customName === "onBlur") {
        return !Boolean(Object.keys(value).length)
          ? {
              isValid: false,
              message: `* Input is Required`,
            }
          : {
              isValid: true,
              message: ``,
            };
      }
    },
  },
  {
    headerName: "Action",
    dataKey: "__action",
    type: "actions",
    options: [],
    minWidth: 240 * 0.6,
    flexWidth: 0.6,
    headerAlignment: "center",
    contentAlignment: "left",
    sortable: false,
    filterable: true,
    filterExecutioner: (filter, value) => {
      try {
        value = value.toString();
        return value.toLowerCase().includes(filter.text.contains.toLowerCase());
      } catch (error) {
        console.warn(
          "Skipping default filter for value, filter: ",
          value,
          filter,
        );
        return true;
      }
    },
    actions: [
      {
        type: "__edit",
        name: "Edit Action",
        isEnabled: (row) => {
          // return row.trustlevel !== 3;
          return true;
        },
        handleEdit: (row, setTaskStatus) => {
          setTimeout(
            () =>
              setTaskStatus({
                inProgress: false,
                error: false,
                message: ``,
                payload: { ...row },
                inputHelpersText: {
                  name: "name Input Field 👆",
                  group: "group Input Field 👆",
                  trustlevel: "trustlevel Input Field 👆",
                  ipaddress: "ipaddress Input Field 👆",
                  comment: "comment Input Field 👆",
                  tcptagging: "tcptagging Input Field 👆",
                  remotekey: "remotekey Input Field 👆",
                  enabled: "enabled Input Field 👆",
                  date: "date Input Field 👆",
                  time: "time Input Field 👆",
                  "date-time": "date-time Input Field 👆",
                },
              }),
            300,
          );
        },
        handleSave: (dirtyRow, setTaskStatus, row) => {
          setTimeout(() => {
            setTaskStatus({
              inProgress: false,
              payload: { ...dirtyRow },
              error: false,
              message: dirtyRow.name
                .split(" ")
                .join("")
                .toLowerCase()
                .includes("kelly")
                ? "That's what she said... 😂"
                : `SAVE ACTION EXECUTED SUCCESSFULLY`,
              deleteRow: dirtyRow.name
                .split(" ")
                .join("")
                .toLowerCase()
                .includes("kelly"),
            });
          }, 0);
        },
        handleDiscard: (row, setTaskStatus) => {
          setTimeout(() => {
            setTaskStatus({
              inProgress: false,
              error: false,
              message: "CANCEL REQUEST MADE TO SERVER SUCCESSFULLY",
            });
          }, 0);
        },
      },
      {
        type: "__delete",
        name: "Delete Action",
        isEnabled: (row) => {
          return true;
        },
        handleDelete: (row, setTaskStatus) => {
          setTimeout(() => {
            setTaskStatus({ inProgress: false, error: false, message: "" });
          }, 0);
        },
      },
    ],
  },
];
