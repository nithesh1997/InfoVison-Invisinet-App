import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import React, { useContext, useEffect, useState } from "react";
import AlertDialog from "../../../GridPortal/AlertDialog";
import Prompt from "../../../GridPortal/Prompt";
import { DataGridContext } from "../../../IFVDataGrid";
import { ActionIconButton } from "../../../styled-materials/ActionIconButton";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import OverlayContext from "../../../../AppContent/AppOverlayContext";
import { useTranslation } from "react-i18next";

const handleExport = (row, setRowActionState) => {
  setRowActionState({
    inProgress: false,
    isError: false,
    message: "Configuration exported successfully.",
  });
};

export const ExportAction = ({
  onClick,
  row,
  rows,
  rowIndex,
  actionPayloadState,
  isModeEdit,
  startAsync,
  setStartAsync,
  isEnabled = () => true,
  allowBulkActions = false,
  prompt,
  id,
}) => {
  const AppOverlayContext = useContext(OverlayContext);

  const { setDontClosePopup, gridSubconscious } = useContext(DataGridContext);
  const { gridAllRows, setGridAllRows } = useContext(DataGridContext);
  const { handlersTooltip } = useContext(DataGridContext);

  const [rowActionState, setRowActionState] = actionPayloadState;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleViewState, setToggleViewState] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [runEffect, setRunEffect] = useState("");
  const [prompter, setPrompter] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    setIsDisabled(!isEnabled(row));
  }, [gridSubconscious.page, isEnabled, row, setIsDisabled]);

  useEffect(() => {
    if (!onClick) {
      setToggleViewState(false);
    } else {
      setToggleViewState(true);
    }
  }, [onClick]);

  if (onClick === null) {
    onClick = handleExport;
  }

  useEffect(() => {
    if (startAsync.isExport === true) {
      setPrompter(false);
      !prompt.contentTextGen &&
        setRowActionState((prev) => ({ ...prev, inProgress: true }));
      setDontClosePopup(false);
      onClick(row, setRowActionState, setGridAllRows);
    }
  }, [startAsync.isExport]);

  useEffect(() => {
    if (rowActionState.inProgress === false && startAsync.isExport === true) {
      setStartAsync((prev) => ({ ...prev, isExport: false }));
      setDontClosePopup(true);

      if (rowActionState.error) {
        setDialogOpen(rowActionState.message);
      } else {
        rowActionState.message && setDialogOpen(rowActionState.message);
      }
    }
  }, [rowActionState]);

  useEffect(() => {
    if (runEffect === "completeAction" && !rowActionState.error) {
      //   const fallFunc = (prevRows) => prevRows.filter((r) => r.id !== row.id);
      //   const setFunc = rowActionState?.callback ?? fallFunc;
      //   setGridAllRows(setFunc);

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

    setRunEffect("");
  }, [
    row.id,
    rowActionState.callback,
    rowActionState.error,
    runEffect,
    setGridAllRows,
  ]);

  return (
    <React.Fragment>
      <ToolTip title={handlersTooltip.handleExport}>
        <ActionIconButton
          id={id}
          isDisplay={toggleViewState && !isModeEdit}
          onClick={(event) => {
            prompt.contentTextGen &&
              setRowActionState((prev) => ({ ...prev, inProgress: true }));
            // setPrompter(true);
            setStartAsync((prev) => ({ ...prev, isExport: true }));
          }}
          hoverBg="#D6EEFF"
          disabled={isDisabled}
        >
          {/* <SystemUpdateAltOutlinedIcon style={{ color: !isDisabled ? "#0094fd" : "#0094fd60" }} />
           */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3043 7.825H14.1925V12.5375C14.1925 13.35 13.5466 14 12.7391 14H3.45342C2.64596 14 2 13.35 2 12.5375V3.19375C2 2.38125 2.64596 1.73125 3.45342 1.73125H8.13665V2.625H3.45342C3.13044 2.625 2.96895 2.86874 2.96895 3.11249V12.4563C2.96895 12.7813 3.21118 12.9437 3.45342 12.9437H12.7391C13.0621 12.9437 13.2236 12.7 13.2236 12.4563V7.825H13.3043ZM7.16771 10.3438L8.0559 10.425L8.13665 8.47499C8.21739 7.09373 8.86336 5.875 9.8323 5.0625C10.6398 4.4125 11.6087 4.08749 12.6584 4.08749H13.2236L11.7702 5.54999L12.4161 6.2L15 3.6L12.4161 1L11.7702 1.64999L13.2236 3.11249H12.6584C11.4472 3.11249 10.236 3.51875 9.26708 4.25C8.0559 5.225 7.32919 6.6875 7.24844 8.3125L7.16771 10.3438Z"
              fill="#0094fd"
              stroke="#0094fd"
              stroke-width="0.25"
            />
          </svg>
        </ActionIconButton>
      </ToolTip>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={
          rowActionState.error
            ? t("commons.errorAlertTitle")
            : t("commons.TaskCompleted")
        }
        contentText={rowActionState.message}
        contentInfo={rowActionState.error ? `` : ``}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          setRunEffect("completeAction");
        }}
      />

      <Prompt
        open={prompter}
        setOpen={setPrompter}
        contentTitle={prompt.contentTitle || "Export Confirmation"}
        contentText={
          prompt.contentTextGen
            ? prompt.contentTextGen(row)
            : prompt.contentText || (
                <>
                  <p>
                    Please click on Confirm to restore the configuration,
                    otherwise click Cancel.
                  </p>
                </>
              )
        }
        contentInfo={``}
        agreeTitle={"Confirm"}
        disagreeTitle={"Cancel"}
        handleAgree={() => {
          setStartAsync((prev) => ({ ...prev, isExport: true }));
        }}
        handleDisagree={() => {
          setRowActionState((prev) => ({ ...prev, inProgress: false }));
          setDontClosePopup(false);
          setPrompter(false);
        }}
      />
    </React.Fragment>
  );
};
