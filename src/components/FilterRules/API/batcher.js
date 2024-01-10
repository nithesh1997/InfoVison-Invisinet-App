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
    const condition = response.state === "TOGGLE_FILTER_FAILURE";
    let error = false;
    let message = "";

    if (response.state === "TOGGLE_FILTER_REDUNDANT") {
      error = false;
      message = `Already ${taskName}d.`;
    } else if (condition) {
      error = true;
      message = (
        <>
          <Trans
            i18nKey={"commons.errorMessages.errorTaskName"}
            values={{ taskName: taskName }}
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
    if (row.ruleNum !== undefined)
      result[row.ruleNum] = { error, message, ruleNumber: row.ruleNum };

    if (pointer !== endOfQueue) {
      const isEnabled =
        path === "enableFilterRule" &&
        selectedTableRows[pointer].enabled === "True";

      const isDisabled =
        path === "disableFilterRule" &&
        selectedTableRows[pointer].enabled === "False";

      if (isEnabled || isDisabled) {
        pointer += 1;

        onComplete(
          { state: "TOGGLE_FILTER_REDUNDANT" },
          selectedTableRows[pointer - 1],
        );
      } else {
        callAPI({
          path,
          params,
          data: `${selectedTableRows[pointer].ruleNum}`,
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
          enabled:
            row.ruleNum !== undefined
              ? result[row.ruleNum].error
                ? row.enabled
                : path === "enableFilterRule"
                ? "True"
                : "False"
              : "False",
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
    const isEnabled =
      path === "enableFilterRule" &&
      selectedTableRows[pointer].enabled === "True";

    const isDisabled =
      path === "disableFilterRule" &&
      selectedTableRows[pointer].enabled === "False";

    if (isEnabled || isDisabled) {
      const payload = { state: "TOGGLE_FILTER_REDUNDANT" };

      pointer += 1;

      onComplete(payload, selectedTableRows[pointer - 1]);
    } else {
      callAPI({
        path,
        params,
        data: `${selectedTableRows[pointer].ruleNum}`,
        responder,
        onCompleteArguments: [selectedTableRows[pointer]],
        onComplete,
      });

      pointer += 1;
    }
  }
};
