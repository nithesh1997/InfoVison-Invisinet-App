import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { GlobalModal } from "../../../../../style/Card/Modal";
import useCSVtoJSON from "../../../../../utils/CSVtoJSON/useCSVtoJSON";
import GenericButton from "../MaterialComponents/GenericButton";
import Styled from "./CsvExportStyle";
import upload from "../../../../../images/upload blue.svg";
import zip_2 from "../../../../../images/zip_2.svg";
import callAPI from "../../../../../apis/callAPI";
import { FileStatusTable } from "./FileStatusTable";
import Utility from "../../../../../redux/actions/Utility";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { saveAs } from "file-saver";
import { Trans, useTranslation } from "react-i18next";

export const CsvExport = ({ id, disabled, gridSubconscious, visibility }) => {
  const { t, i18n } = useTranslation();

  const line0 = `Name,Group,Trust Level,IPv4 Address,IPv6 Address,MAC,Comments,TCP Tagging,Remote Key,Enabled,UDP`;
  const { address: gatewayIP } = useSelector(($) => $.activeGateway);

  const [uploadFile, setUploadFile] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [displayFileStatusModal, setDisplayFileStatusModal] = useState(false);
  const [displayFileUploadModal, setDisplayFileUploadModal] = useState(false);

  const [uploadText, setUploadText] = useState(null);
  const [modalHeaderText, setModalHeaderText] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState(null);
  const [fileProgressError, setFileProgressError] = useState(null);
  const [unprocessedFileId, setUnprocessedFileId] = useState(null);
  const [fileInProgressList, setFileInProgressList] = useState(null);
  const [fileProgressStatus, setFileProgressStatus] = useState(null);

  const { convertedJSON, handleFileUpload, fileErrorHandling, fileState } =
    useCSVtoJSON(displayFileUploadModal);

  let res;
  var byte = 1024;
  var decimal = 2;
  var kiloBytes = byte;
  var megaBytes = byte * byte;
  var gigaBytes = byte * byte * byte;

  function ValidateSize(file) {
    if (file < kiloBytes) {
      return (res = file + " B");
    } else if (file < megaBytes) {
      return (res = (file / kiloBytes).toFixed(decimal) + " KB");
    } else if (file < gigaBytes) {
      return (res = (file / megaBytes).toFixed(decimal) + " MB");
    } else {
      return (res = (file / gigaBytes).toFixed(decimal) + " GB");
    }
  }

  const sortFileUploadDate = (fileDetails) => {
    const sortedFileDateInDescOrder = fileDetails.sort((f_File, s_File) => {
      const fDate = new Date(f_File.uploaded_date);
      const sDate = new Date(s_File.uploaded_date);
      return sDate.getTime() - fDate.getTime();
    });
    return sortedFileDateInDescOrder;
  };

  const handleModalState = (response) => {
    if (response.state === "FETCH_SUCCESS") {
      const fileProgressStatusList = sortFileUploadDate(response?.data);

      const showFileInProgress =
        response.fileType === "all"
          ? true
          : fileProgressStatusList?.some(
              (uploadStatus) =>
                uploadStatus.status.toLowerCase() !== "processed",
            );

      if (showFileInProgress) {
        if (response.fileType !== "all") {
          const unprocessedfile = fileProgressStatusList?.filter(
            (file) => file.status.toLowerCase() !== "processed",
          );
          const unprocessedfileId = unprocessedfile[0]?.id;
          setFileInProgressList(unprocessedfile[0]);
          setUnprocessedFileId(unprocessedfileId);
          setFileProgressStatus("success");
        } else {
          setFileInProgressList(
            fileProgressStatusList.map((rec) => {
              const uploadedDate = rec.uploaded_date.split(" ")[0].split("-");
              const startDate = rec.start_date.split(" ")[0].split("-");
              const endDate = rec.end_date.split(" ")[0].split("-");

              const uploadedDateMod = `${uploadedDate[1]}/${uploadedDate[2]}/${uploadedDate[0]}`;
              const startDateMod = `${startDate[1]}/${startDate[2]}/${startDate[0]}`;
              const endDateMod = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;

              const uploaded_date = `${uploadedDateMod} ${
                rec.uploaded_date.split(" ")[1]
              }`;
              const start_date = `${startDateMod} ${
                rec.start_date.split(" ")[1]
              }`;
              const end_date = `${endDateMod} ${rec.end_date.split(" ")[1]}`;

              return {
                ...rec,
                start_date,
                end_date,
                uploaded_date,
              };
            }),
          );
          setFileProgressStatus("success");
        }
      } else {
        setDisplayFileStatusModal(false);
        setDisplayFileUploadModal(true);
      }
    } else {
      setFileProgressStatus("fail");
      setFileProgressError(
        <>
          {t("commons.errorMessages.errorFetchingFile")}
          <br />
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );
    }
  };

  const handleModal = (fetchFileType) => {
    setDisplayFileStatusModal(true);

    callAPI({
      path: "getStgIdAuditList",
      params: { gatewayIP },
      data: {},
      responder: (res, onComplete, onCompleteArgs) => {
        const responder = {
          state: "UPLOAD_FAILURE",
          data: undefined,
          fileType: fetchFileType,
        };

        if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
          responder.state = "FETCH_SUCCESS";
          responder.data = res.response.body;
        } else {
          responder.catchError = res.error;
          responder.error = res.response.error;
          responder.errorFromJSON = res.response.errorFromJSON;
        }

        onComplete(responder, ...onCompleteArgs);
      },
      onComplete: handleModalState,
    });
  };

  const handleClose = () => {
    setDisplayFileStatusModal(false);
    setFileProgressStatus(null);
    setFileProgressError(null);
    setFileInProgressList(null);
    setDisplayFileUploadModal(false);
    setUploadFile(false);
    setFileError(false);
    setFileUploadStatus(null);
    setUploadText(null);
    setModalHeaderText(null);
    setUnprocessedFileId(null);
  };

  const onCompleteUploadHandler = (response) => {
    if (response.state === "UPLOAD_SUCCESS") {
      setFileUploadStatus(
        t("page.manage.identities.Upload FileModal.successResponse"),
      );
      setTimeout(() => {
        handleClose();
      }, 5000);
    } else {
      setTimeout(() => {
        setFileError(true);
        setUploadFile(false);
        setFileUploadStatus(
          <>
            {t("commons.errorMessages.errorImportingFile")}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>,
        );
      }, 1000);
    }
  };

  const uploadHandler = () => {
    setFileUploadStatus(
      t("page.manage.identities.Upload FileModal.Upload Progress"),
    );
    const formData = new FormData();
    let total;
    let loaded;

    // formData.append("file", convertedJSON);
    formData.append("file", fileState);

    callAPI({
      path: "importIdentity",
      params: { gatewayIP },
      data: formData,
      onUploadProgress: (data) => {
        loaded = ValidateSize(data.loaded);
        total = ValidateSize(data.total);
        setFileUploadStatus(" ");
        setUploadText({ data1: loaded, data2: total });
      },
      responder: (res, onComplete, onCompleteArgs) => {
        const responder = {
          state: "UPLOAD_FAILURE",
          data: undefined,
        };

        if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
          responder.state = "UPLOAD_SUCCESS";
          responder.data = res.response.body;
        } else {
          responder.catchError = res.error;
          responder.error = res.response.error;
          responder.errorFromJSON = res.response.errorFromJSON;
        }

        onComplete(responder, ...onCompleteArgs);
      },
      onComplete: onCompleteUploadHandler,
    });
  };

  const handleViewAllFileUploadStatus = () => {
    setDisplayFileUploadModal(false);
    setDisplayFileStatusModal(true);
    handleModal("all");
  };

  useEffect(() => {
    if (convertedJSON) {
      setFileUploadStatus(null);
      setUploadFile(true);
      setFileError(false);
    }
  }, [convertedJSON]);

  useEffect(() => {
    if (fileErrorHandling) {
      setFileUploadStatus(null);
      setFileError(true);
    }
  }, [fileErrorHandling]);

  const fileData = [line0];

  const blob = new Blob(fileData, {
    type: "text/plain;charset=utf-8",
  });

  return (
    <div
      style={{
        display:
          gridSubconscious.name === "ba-identity-config" ? "auto" : "none",
      }}
    >
      <GlobalModal
        open={displayFileStatusModal}
        Content={
          <Styled.UploadFileModalContainer>
            <Styled.UploadFileModalBody>
              {fileProgressStatus ? (
                <>
                  <Styled.UploadFileModalHeader>
                    {modalHeaderText ? (
                      <Styled.Title>
                        {t(
                          "page.manage.identities.Import In Progress Modal.Title",
                        )}
                      </Styled.Title>
                    ) : (
                      !unprocessedFileId && (
                        <Styled.Title>
                          {t(
                            "page.manage.identities.File Upload Status Modal.Title",
                          )}
                        </Styled.Title>
                      )
                    )}
                    <Styled.Icon onClick={handleClose}>
                      <CloseOutlined fontSize="medium" />
                    </Styled.Icon>
                  </Styled.UploadFileModalHeader>

                  {fileProgressStatus === "fail" ? (
                    <Styled.ErrorHandling>
                      <>{fileProgressError}</>
                    </Styled.ErrorHandling>
                  ) : (
                    <Styled.FileUplaodStatusTable>
                      {modalHeaderText ? (
                        <Styled.TitleWrraper>
                          <Styled.NameBox>
                            <Styled.NameText>
                              <b>
                                {t(
                                  "page.manage.identities.Import In Progress Modal.File Name",
                                  {
                                    fileState: modalHeaderText?.fileName ?? "",
                                  },
                                )}
                              </b>{" "}
                              {/* {modalHeaderText?.fileName ?? ""} */}
                            </Styled.NameText>
                          </Styled.NameBox>

                          <Styled.NameBox>
                            <Styled.NameText>
                              <b>
                                {t(
                                  "page.manage.identities.Import In Progress Modal.Uploaded On",
                                )}
                              </b>{" "}
                              {modalHeaderText?.uploadDate ?? ""}{" "}
                              {modalHeaderText?.uploadTime ?? ""}
                            </Styled.NameText>
                          </Styled.NameBox>
                        </Styled.TitleWrraper>
                      ) : null}

                      <FileStatusTable
                        rows={fileInProgressList}
                        updateModalHeaderText={setModalHeaderText}
                        unProcessedFileId={unprocessedFileId}
                      />
                    </Styled.FileUplaodStatusTable>
                  )}
                </>
              ) : (
                <Styled.UploadFileSpinner>
                  <Styled.Spinner />

                  <Typography paragraph={true} style={{ paddingTop: "1rem" }}>
                    {t(
                      "page.manage.identities.Upload FileModal.Loading Message",
                    )}
                  </Typography>
                </Styled.UploadFileSpinner>
              )}
            </Styled.UploadFileModalBody>
          </Styled.UploadFileModalContainer>
        }
      />

      <GlobalModal
        open={displayFileUploadModal}
        Content={
          <Styled.ModalContainer>
            <Styled.ModalHeader>
              <Styled.Title>
                {t("page.manage.identities.Upload FileModal.Title")}
              </Styled.Title>
              <Styled.Icon onClick={handleClose}>
                <CloseOutlined fontSize="medium" />
              </Styled.Icon>
            </Styled.ModalHeader>

            <Styled.ModalBody>
              <Styled.UploadSection>
                <Styled.UploadIcon>
                  {fileError ? (
                    <>
                      <img src={zip_2} alt={"zip"} />
                      <br />
                      <p>{fileState.name}</p>
                    </>
                  ) : (
                    <img src={upload} alt={"upload"} />
                  )}
                </Styled.UploadIcon>
                {fileError ? (
                  <Styled.FileErrorMessage>
                    {fileUploadStatus === null ? fileErrorHandling : null}
                  </Styled.FileErrorMessage>
                ) : (
                  <Styled.UploadFileDescription>
                    {uploadFile ? (
                      t(
                        "page.manage.identities.Import In Progress Modal.File Name",
                        { fileState: fileState.name },
                      )
                    ) : (
                      <>
                        {t("page.manage.identities.Upload FileModal.Line1")}
                        <br />{" "}
                        {t("page.manage.identities.Upload FileModal.Line2")}
                        <br />
                        {t("page.manage.identities.Upload FileModal.Line3")}
                      </>
                    )}
                  </Styled.UploadFileDescription>
                )}

                <Styled.SelectFile>
                  {uploadFile ? (
                    <Styled.UploadFileSection>
                      {fileUploadStatus && (
                        <p
                          style={{
                            width: "80%",
                            margin: "0 auto",
                            textAlign: "center",
                          }}
                        >
                          {fileUploadStatus}
                        </p>
                      )}
                      {uploadText && fileUploadStatus === " " ? (
                        <p
                          style={{
                            textAlign: "center",
                            margin: "-2em 1em 1em 1em",
                            fontSize: "14px",
                          }}
                        >{`Uploaded ${uploadText.data1} of ${uploadText.data2}...`}</p>
                      ) : null}

                      {fileUploadStatus !== "File imported successfully." && (
                        <Styled.UploadFile>
                          <GenericButton
                            id={id}
                            backgroundColor="secondary"
                            buttonName={t(
                              "page.manage.identities.Table Button.Cancel",
                            )}
                            disabled={fileUploadStatus ? true : false}
                            onClick={handleClose}
                          />

                          <GenericButton
                            id={id}
                            backgroundColor="primary"
                            buttonName={t(
                              "page.manage.identities.Table Button.Upload",
                            )}
                            disabled={fileUploadStatus ? true : false}
                            onClick={uploadHandler}
                          />
                        </Styled.UploadFile>
                      )}
                    </Styled.UploadFileSection>
                  ) : (
                    <Styled.UploadFileStatus>
                      {fileUploadStatus && <p>{fileUploadStatus}</p>}
                      <input
                        type="file"
                        id="contained-button"
                        accept={".csv"}
                        onChange={handleFileUpload}
                        multiple
                      />
                      <Styled.FileBtn htmlFor="contained-button">
                        {fileError
                          ? t(
                              "page.manage.identities.Upload FileModal.Select Error Button",
                            )
                          : t(
                              "page.manage.identities.Upload FileModal.Select Button",
                            )}
                      </Styled.FileBtn>

                      <Styled.FileBtn
                        onClick={() => saveAs(blob, "identities.csv")}
                      >
                        {t(
                          "page.manage.identities.Upload FileModal.Download Button",
                        )}
                      </Styled.FileBtn>
                    </Styled.UploadFileStatus>
                  )}
                </Styled.SelectFile>
              </Styled.UploadSection>
            </Styled.ModalBody>
          </Styled.ModalContainer>
        }
      />
      <div style={{ display: "flex", gap: "15px" }}>
        <GenericButton
          id={id}
          style={{ fontWeight: "500", marginRight: "0.8em" }}
          backgroundColor="primary"
          width={"12.5em"}
          buttonName={t(`page.manage.identities.bulkImport.text`)}
          Icon={
            <FileUploadRoundedIcon
              style={{ width: "0.8em", height: "0.8em" }}
            />
          }
          startIcon={<FileUploadRoundedIcon />}
          disabled={disabled}
          onClick={() => handleModal("unprocessed")}
          visibility={visibility}
        />

        {"               "}

        <GenericButton
          id={id}
          buttonName={t(`page.manage.identities.bulkImportStatus.text`)}
          Icon={
            <VisibilityRoundedIcon
              style={{ width: "0.8em", height: "0.8em" }}
            />
          }
          startIcon={<VisibilityRoundedIcon />}
          backgroundColor="primary"
          width={"17em"}
          disabled={disabled}
          onClick={handleViewAllFileUploadStatus}
          style={{ fontWeight: "500", width: "17em" }}
          visibility={visibility}
        />
      </div>
    </div>
  );
};
