import { Trans } from "react-i18next";
import callAPI from "../../../apis/callAPI";
import Utility from "../../../redux/actions/Utility";

const BATCH_COUNT = 5;

export const batcherExportConfig = (
  path,
  params,
  responder,
  unSelectedTableRows,
  selectedTableRows,
  setTaskStatus,
  AppOverlayContext,
) => {
  let result = {};
  let pointer = 0;
  let endOfQueue = selectedTableRows.length;
  let maxInBatch = endOfQueue < BATCH_COUNT ? endOfQueue : BATCH_COUNT;

  const onComplete = (response, row) => {
    const condition = response.state === "EXPORT_CONFIG_FAILURE";
    let error = false;
    let message = "";

    if (response.state === "EXPORT_CONFIG_REDUNDANT") {
      error = false;
      message = `Already Exported.`;
    } else if (condition) {
      error = true;
      message = (
        <>
          <Trans i18nKey={"commons.errorMessages.failedExport"}></Trans>
          <br />
          <br />
          <Trans i18nKey={"commons.errorMessages.errorDetails"}></Trans>
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>
      );
    } else {
      error = false;
      message = `Exported successfully.`;
      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";
      const port = process.env.NODE_ENV === "production" ? `8445` : `8000`;
      const hostAddress = `${window.location.hostname}:${port}`;

      const downloadLink = `${protocol}://${hostAddress}/skylightweb/exportConfig?gatewayIP=${AppOverlayContext.selectedGateway.address}&fileName=${row.fileName}`;

      const downloaderElement = document.createElement("a");
      downloaderElement.href = downloadLink;
      downloaderElement.download = row.fileName;
      downloaderElement.click();
    }

    if (row.fileName !== undefined)
      result[row.fileName] = { error, message, fileName: row.fileName };

    if (pointer !== endOfQueue) {
      if (selectedTableRows[pointer]) {
        callAPI({
          path,
          params: { ...params, fileName: selectedTableRows[pointer].fileName },
          data: {},
          responder,
          onCompleteArguments: [selectedTableRows[pointer]],
          onComplete,
        });

        pointer += 1;
      } else {
        pointer += 1;
        onComplete(
          { state: "EXPORT_CONFIG_REDUNDANT" },
          selectedTableRows[pointer - 1],
        );
      }
    } else {
      let error = false;
      let message = result;

      const responseRows = (selectedTableRows) => {
        return selectedTableRows.map((row) => ({ ...row, isChecked: false }));
      };

      setTimeout(() => {
        setTaskStatus({
          inProgress: false,
          payload: [...unSelectedTableRows, ...responseRows(selectedTableRows)],
          error,
          message,
        });
      }, pointer * 300);

      return;
    }
  };

  while (pointer < maxInBatch) {
    if (selectedTableRows[pointer]) {
      callAPI({
        path,
        params: { ...params, fileName: selectedTableRows[pointer].fileName },
        data: {},
        responder,
        onCompleteArguments: [selectedTableRows[pointer]],
        onComplete,
      });
      pointer += 1;
    } else {
      const payload = { state: "EXPORT_CONFIG_REDUNDANT" };
      pointer += 1;
      onComplete(payload, selectedTableRows[pointer - 1]);
    }
  }
};
