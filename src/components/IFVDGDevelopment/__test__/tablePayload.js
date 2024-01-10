import {
  DeleteRounded,
  EditRounded,
  RadioButtonUncheckedRounded,
} from "@material-ui/icons";
import { columns } from "./tableColumns";
import { rows } from "./tableRows";

const tablePayload = {
  key: "",
  ref: "",
  name: "",
  loadingData: [],
  columns,
  rows,
  config: {
    editMode: "inline",
    noDataMessage: "Hey There! Howz-it hangin?",
    allowMultipleRowSelection: true,
    globalSearch: true,
    // isStickyAction: false,
    bulkActions: [
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
          }, 20000);
        },
      },
    ],
    addHandler: {
      handleSave: (row, setTaskStatus) => {
        setTimeout(() => {
          setTaskStatus({
            inProgress: false,
            payload: { ...row },
            error: false,
            message: "ADD REQUEST MADE TO SERVER SUCCESSFULLY",
          });
        }, 3000);
      },
      handleDiscard: (row, setTaskStatus) => {
        setTimeout(() => {
          setTaskStatus({
            inProgress: false,
            error: false,
            message: "CANCEL REQUEST MADE TO SERVER SUCCESSFULLY",
          });
        }, 3000);
      },
    },
  },
  editPopup: {
    title: {
      add: "",
      edit: "",
    },
    button: {
      add: ["Discard", "Save"],
      edit: ["Cancel", "Add"],
    },
  },
  subconscious: {
    name: "ba-identities-management",
    filters: {
      name: {
        text: {
          contains: "A",
        },
      },
      // group: {
      //   text: {
      //     contains: "sAlE",
      //   },
      // },
      trustlevel: {
        text: {
          contains: "",
        },
      },
      // ipaddress: {
      //   text: {
      //     contains: "",
      //   },
      // },
      comment: {
        text: {
          contains: "asodufhpqowenfpqfoiasnfpoiasdfjnalksdf",
        },
      },
      tcptagging: {
        text: {
          contains: "",
        },
      },
      // remotekey: {
      //   text: {
      //     contains: "",
      //   },
      // },
      enabled: {
        text: {
          contains: "",
        },
      },
      date: {
        text: {
          contains: "",
        },
      },
      time: {
        text: {
          contains: "",
        },
      },
      "date-time": {
        text: {
          contains: "",
        },
      },
      xyz: {
        text: {
          contains: "something...",
        },
      },
    },
    sort: {
      column: "name",
      inverse: false,
    },
    pageSize: 5, // Must be one of the items below
    pageSizeOptions: [5, 10, 20, 50, 100, 0], // Use `0` to represent the special option to show all rows.
    page: 1,
  },
};

export default tablePayload;
