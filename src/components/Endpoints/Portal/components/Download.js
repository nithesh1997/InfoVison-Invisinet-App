import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { saveAs } from "@progress/kendo-file-saver";
import { useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import {
  deletefetchlogResponder,
  DownloadLogAPIResponder,
} from "../../../../apis/responders/endpoints-config-api-responder";
import Utility from "../../../../redux/actions/Utility";
import { Spinner } from "../../../IFVDataGrid/styled-materials/Spinner";
import Prompt from "../../../DeletePrompt/Prompt";
import { useTranslation } from "react-i18next";

const SpinnerLoader = styled(Spinner)`
  display: ${(props) => (props.isDownloadLoading ? "flex" : "none")};
  margin: 0.5rem;
`;

export const DownloadLog = ({
  isDownloadingFromParent,
  row,
  rowIndex,
  AppOverlayContext,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [alertDialog, setAlertDialog] = useState("");
  const [prompt, setPrompt] = useState(false);

  const { t } = useTranslation();

  const handleDownloadLog = () => {
    setIsDownloading(true);
    callAPI({
      path: "download-log",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        fileName: row.fileName,
      },
      data: {},
      responder: DownloadLogAPIResponder,
      onComplete: (response, fileName) => {
        if (response.state === "DOWNLOAD_LOG_SUCCESS") {
          if (typeof response.data === "string") {
            saveAs(
              "data:text/plain;base64," + response.data,
              fileName + ".log",
            );
          } else {
            setPrompt(true);
            setAlertDialog(
              <>
                {t("commons.errorMessages.errorDownloadLog")}
                <br />
                {t("commons.errorMessages.errorDetails")}
                <br />
                {t("commons.errorMessages.invalidResponse")}
              </>,
            );
          }
        } else {
          setPrompt(true);
          setAlertDialog(
            <>
              {t("commons.errorMessages.errorDownloadLog")}
              <br />
              <br />
              {t("commons.errorMessages.errorDetails")}
              <br />
              {Utility.getErrorsFromResponse(response, true)}
            </>,
          );
        }
        setIsDownloading(false);
      },
      onCompleteArguments: [row.fileName],
    });
  };

  const onCompleteDeleteHandeler = () => {};

  const handleDelete = (row) => {
    callAPI({
      path: "deletefetchlog",
      params: {},
      data: {},
      responder: deletefetchlogResponder,
      onComplete: onCompleteDeleteHandeler,
    });
  };

  return (
    <>
      {/* <DOWNLOAD_LOG
        onClick={handleDownloadLog}
        isDownloadLoading={isDownloading}
        disabled={row.task_status}
        underline="none"
        // href={`/skylightweb/downloadLog/${row.fileName}`}
        // target={"_blank"}
      > */}
      <DownloadForOfflineRoundedIcon
        isDownloadLoading={isDownloading}
        disabled={row.task_status}
        onClick={handleDownloadLog}
        style={{ color: "#018ff6", display: isDownloading ? "none" : "" }}
      />
      <DeleteOutlineRoundedIcon onClick={() => handleDelete(row)} />
      <SpinnerLoader size={20} isDownloadLoading={isDownloading} />
      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={"Error!"}
        contentText={alertDialog}
        contentInfo={``}
        agreeTitle={"Ok"}
        handleAgree={() => setPrompt(false)}
      />
    </>
  );
};
