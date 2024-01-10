import callAPI from "../../../apis/callAPI";
import Utility from "../../../redux/actions/Utility";
import { Trans, useTranslation } from "react-i18next";

const MAX_IN_ONE_BATCH = 5;

export const batcher = (
  path,
  params,
  responder,
  unSelectedTableRows,
  selectedTableRows,
  setTaskStatus,
  taskName,
  // handleSetModal
) => {
  let result = {};
  let pointer = 0,
    endOfQueue = selectedTableRows.length;
  let maxInBatch =
    endOfQueue < MAX_IN_ONE_BATCH ? endOfQueue : MAX_IN_ONE_BATCH;

  const onComplete = (response, row) => {
    const condition = response.state === "DELETE_CONFIG_FAILURE";
    let error = false;
    let message = "";

    if (response.state === "DELETE_CONFIG_SUCCESS") {
      error = false;
      message = `Already ${taskName}d.`;
    } else if (condition) {
      error = true;
      message = (
        <>
          <Trans
            i18nKey={"commons.errorMessages.task"}
            values={{
              taskName: taskName,
            }}
          ></Trans>
          <br />
          <br />
          <Trans i18nKey={"commons.errorMessages.errorDetails"}></Trans>
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>
      );
    } else {
      error = false;
      message = `${
        taskName[0].toUpperCase() + taskName.slice(1)
      }d successfully.`;
    }
    if (row.id !== undefined)
      result[row.id] = { error, message, rowNumber: row.id };

    if (pointer !== endOfQueue) {
      const isDeleting =
        "delete-config" && selectedTableRows[pointer].id === Number;

      if (isDeleting) {
        pointer += 1;

        onComplete(
          { state: "DELETE_CONFIG_SUCCESS" },
          selectedTableRows[pointer - 1],
        );
      } else {
        callAPI({
          path,
          params,
          data: parseInt(selectedTableRows[pointer].id),
          responder,
          onCompleteArguments: [selectedTableRows[pointer]],
          onComplete,
        });

        pointer += 1;
      }
    } else {
      let error = false;
      let message = result;

      const responseRows = (selectedTableRows) => {
        return selectedTableRows.map((row) => ({
          ...row,
          isChecked: false,
          deleted: row.id ? result[row.id].error : path === "delete-config",
        }));
      };

      setTimeout(() => {
        setTaskStatus({
          inProgress: false,
          payload: [...unSelectedTableRows, ...responseRows(selectedTableRows)],
          error,
          message,
        });
      }, 0);

      return;
    }
  };

  while (pointer < maxInBatch) {
    const isDeleting =
      "delete-config" && selectedTableRows[pointer].id === Number;

    if (isDeleting) {
      const payload = { state: "DELETE_CONFIG_SUCCESS" };

      pointer += 1;

      onComplete(payload, selectedTableRows[pointer - 1]);
    } else {
      callAPI({
        path,
        params,
        data: parseInt(selectedTableRows[pointer].id),
        responder,
        onCompleteArguments: [selectedTableRows[pointer]],
        onComplete,
      });

      pointer += 1;
    }
  }
};
