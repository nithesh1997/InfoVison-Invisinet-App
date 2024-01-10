import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useCSVtoJSON = (modalStatus) => {
  const [convertedJSON, setConvertedJSON] = useState();
  const [fileErrorHandling, setFileErrorHandling] = useState("");
  const [selectedFileName, setSelectedFileName] = useState();
  const [fileState, setFileState] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (modalStatus) {
      setFileErrorHandling("");
    }
  }, [modalStatus]);

  const fromateIntoJSON = (headers, rows, seperator) => {
    const newArray = rows.map((row) => {
      const values = row.split(seperator);

      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];

        return obj;
      }, {});

      return eachObject;
    });

    setConvertedJSON(newArray);
  };

  const convertCsvToJson = (str, seperator = ",") => {
    const headers =
      str.split("\n").length !== 0
        ? str.split("\n")[0].split(seperator)
        : str.split(seperator);

    const fileHeaderStringCheck = headers.map((element) =>
      element.replace(/(\r\n|\n|\r)/gm, ""),
    );

    const getRows = str.slice(str.indexOf("\n") + 1).split("\n");
    const validHeader = [
      "name",
      "group",
      "trust level",
      "ipv4 address",
      "ipv6 address",
      "mac",
      "comments",
      "tcp tagging",
      "remote key",
      "enabled",
      "udp",
    ];
    const fileHeader = fileHeaderStringCheck.map((element) =>
      element.replace(/"/g, "").toLowerCase(),
    );

    const validateHeader = headers.length;

    if (validateHeader === 0) {
      return setFileErrorHandling(
        t("page.manage.identities.Upload FileModal.missingHeader"),
      );
    }

    const isFileHeaderValid = validHeader.every((headerText) =>
      fileHeader.includes(headerText),
    );

    if (isFileHeaderValid === false) {
      return setFileErrorHandling(
        t("page.manage.identities.Upload FileModal.validHeader"),
      );
    }

    const rows = getRows.filter((el) => el !== "");
    const validateRow = rows.length;

    if (validateRow > 1000) {
      return setFileErrorHandling(
        t("page.manage.identities.Upload FileModal.FileMore"),
      );
    } else {
      fromateIntoJSON(headers, rows, seperator);
    }
  };

  const readCSV = (blob) => {
    const blobSizeInBytes = blob?.size;
    const totalSizeMB = Number(blobSizeInBytes / Math.pow(1024, 2)).toFixed(5);

    if (totalSizeMB > 60) {
      return setFileErrorHandling(
        t("page.manage.identities.Upload FileModal.sizeExceeds"),
      );
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const retrievedCSVdata = e.target.result;
      convertCsvToJson(retrievedCSVdata);
    };
    reader.readAsText(blob);
  };

  const handleFileError = () => {
    setFileErrorHandling(
      t("page.manage.identities.Upload FileModal.importSupport"),
    );
  };

  const handleFileUpload = (e) => {
    const blob = e.target.files[0];
    const blobSizeInBytes = blob?.size;
    const totalSizeMB = Number(blobSizeInBytes / Math.pow(1024, 2)).toFixed(5);

    if (totalSizeMB > 60) {
      return setFileErrorHandling(
        t("page.manage.identities.Upload FileModal.sizeExceeds"),
      );
    }

    const fileExtension = blob.name.split(".").pop().toLowerCase();

    setFileState(e.target.files[0]);

    switch (fileExtension) {
      case "csv":
        readCSV(blob);
        break;
      default:
        handleFileError();
        break;
    }
  };

  return {
    convertedJSON,
    handleFileUpload,
    fileErrorHandling,
    selectedFileName,
    fileState,
  };
};

export default useCSVtoJSON;
