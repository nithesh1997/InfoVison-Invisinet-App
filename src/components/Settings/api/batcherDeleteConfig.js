import { Trans } from "react-i18next";
import callAPI from "../../../apis/callAPI";
import Utility from "../../../redux/actions/Utility";

const BATCH_COUNT = 5;

export const batcherDeleteConfig = (
  path,
  params,
  responder,
  unSelectedTableRows,
  selectedTableRows,
  setTaskStatus,
) => {
  let result = {};
  let pointer = 0;
  let endOfQueue = selectedTableRows.length;
  let maxInBatch = endOfQueue < BATCH_COUNT ? endOfQueue : BATCH_COUNT;

  const onComplete = (response, row) => {
    const condition = response.state === "DELETE_CONFIG_FAILURE";
    let error = false;
    let message = "";

    if (response.state === "DELETE_CONFIG_REDUNDANT") {
      error = false;
      message = `Already Deleted.`;
    } else if (condition) {
      error = true;
      message = (
        <>
          <Trans i18nKey={"commons.errorMessages.failedDelete"}></Trans>
          <br />
          <br />
          <Trans i18nKey={"commons.errorMessages.errorDetails"}></Trans>
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>
      );
    } else {
      error = false;
      message = `Deleted successfully.`;
    }

    if (row.fileName !== undefined)
      result[row.fileName] = { error, message, fileName: row.fileName };

    if (pointer !== endOfQueue) {
      if (selectedTableRows[pointer]) {
        callAPI({
          path,
          params,
          data: {
            id: selectedTableRows[pointer].id,
            fileName: selectedTableRows[pointer].fileName,
            removeAll: 0,
          },
          responder,
          onCompleteArguments: [selectedTableRows[pointer]],
          onComplete,
        });

        pointer += 1;
      } else {
        pointer += 1;

        onComplete(
          { state: "DELETE_CONFIG_REDUNDANT" },
          selectedTableRows[pointer - 1],
        );
      }
    } else {
      let error = false;
      let message = result;

      const responseRows = (selectedTableRows) => {
        const _ = selectedTableRows.map((row) => ({
          ...row,
          isChecked: false,
        }));

        return _.filter((row) => {
          if (row.message) {
            return row.message === "Deleted successfully.";
          } else {
            return false;
          }
        });
      };

      setTimeout(() => {
        setTaskStatus({
          inProgress: false,
          payload: [...unSelectedTableRows, ...responseRows(selectedTableRows)],
          error,
          message,
        });
      }, pointer * 100);

      return;
    }
  };

  while (pointer < maxInBatch) {
    if (selectedTableRows[pointer]) {
      callAPI({
        path,
        params,
        data: {
          id: selectedTableRows[pointer].id,
          fileName: selectedTableRows[pointer].fileName,
          removeAll: 0,
        },
        responder,
        onCompleteArguments: [selectedTableRows[pointer]],
        onComplete,
      });

      pointer += 1;
    } else {
      const payload = { state: "DELETE_CONFIG_REDUNDANT" };
      pointer += 1;
      onComplete(payload, selectedTableRows[pointer - 1]);
    }
  }
};
