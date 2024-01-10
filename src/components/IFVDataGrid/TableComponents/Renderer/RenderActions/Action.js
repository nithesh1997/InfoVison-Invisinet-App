import { useContext, useEffect, useMemo, useState } from "react";
import { DataGridContext } from "../../../IFVDataGrid";
import { ABORTED_HANDLER } from "./ActionUtilities/ABORTED_HANDLER";
import { NEW_HANDLER } from "./ActionUtilities/NEW_HANDLER";
import { READY_HANDLER } from "./ActionUtilities/READY_HANDLER";
import { RUNNING_HANDLER } from "./ActionUtilities/RUNNING_HANDLER";
import ConfirmationPrompt from "./ActionUtilities/StyledMaterials/ConfirmationPrompt";
import { IconButtonX } from "./ActionUtilities/StyledMaterials/IconButton";
import { TextButton } from "./ActionUtilities/StyledMaterials/TextButton";
import { TERMINATED_HANDLER } from "./ActionUtilities/TERMINATED_HANDLER";
import { WAITING_HANDLER } from "./ActionUtilities/WAITING_HANDLER";

const initPayload = { loading: false, payload: {}, error: "" };

const confirmText = (
  <>
    <p>
      Please click on <b>Confirm</b> to proceed further, otherwise click{" "}
      <b>Cancel</b>.
    </p>
  </>
);

export const Action = ({
  icon,
  name,
  isEnabled,
  href,
  handler,
  handlerArgs,
  override,
  tooltip,
  prompt,
  resultPopup,
  isInMenu,
  currentRow,
  currentRowIndex,
  pageName,
}) => {
  const { dirtyRows, setDirtyRows } = useContext(DataGridContext);
  const { gridAllRows, setGridAllRows } = useContext(DataGridContext);
  const { gridContent, setGridContent } = useContext(DataGridContext);
  const { gridConfig, setGridConfig } = useContext(DataGridContext);
  const { gridSubconscious, setGridSubconscious } = useContext(DataGridContext);

  const [runEffect, setRunEffect] = useState("NEW");
  const [payload, setPayload] = useState(initPayload);
  const [disabled, setDisabled] = useState(() => isEnabled(currentRow));

  const [promptState, setPromptState] = useState(false);

  const hyperLink = useMemo(
    () => href(currentRow)?.address ?? undefined,
    [currentRow, href],
  );
  const hyperLinkAddress = hyperLink ? { href: hyperLink } : {};

  const params = useMemo(() => {
    return [
      currentRow,
      [payload, setPayload],
      [runEffect, setRunEffect],
      { Disabled: [disabled, setDisabled], handler, handlerArgs },
      {
        DirtyRows: [dirtyRows, setDirtyRows],
        GridAllRows: [gridAllRows, setGridAllRows],
        GridContent: [gridContent, setGridContent],
        GridConfig: [gridConfig, setGridConfig],
        GridSubconscious: [gridSubconscious, setGridSubconscious],
        PromptState: [promptState, setPromptState],
      },
    ];
  }, [
    currentRow,
    dirtyRows,
    disabled,
    gridAllRows,
    gridConfig,
    gridContent,
    gridSubconscious,
    handler,
    handlerArgs,
    payload,
    promptState,
    runEffect,
    setDirtyRows,
    setGridAllRows,
    setGridConfig,
    setGridContent,
    setGridSubconscious,
  ]);

  const promptAgreeHandler = () => {};

  const promptDisagreeHandler = () => {
    setPromptState(false);
    setRunEffect("ABORTED");
  };

  useEffect(() => {
    if (runEffect === "NEW") NEW_HANDLER(...params);

    if (runEffect === "READY") READY_HANDLER(...params);

    if (runEffect === "RUNNING") RUNNING_HANDLER(...params);

    if (runEffect === "WAITING") WAITING_HANDLER(...params);

    if (runEffect === "TERMINATED") TERMINATED_HANDLER(...params);

    if (runEffect === "ABORTED") ABORTED_HANDLER(...params);
  }, [currentRow, isEnabled, params, runEffect]);

  return (
    <>
      {isInMenu ? (
        <TextButton
          payload={payload}
          icon={icon}
          disabled={disabled}
          setRunEffect={setRunEffect}
          hyperLinkAddress={hyperLinkAddress}
          override={override}
          name={name}
          ToolTip={tooltip}
        />
      ) : (
        <IconButtonX
          payload={payload}
          icon={icon}
          disabled={disabled}
          setRunEffect={setRunEffect}
          hyperLinkAddress={hyperLinkAddress}
          override={override}
          name={name}
          ToolTip={tooltip}
        />
      )}

      <ConfirmationPrompt
        open={promptState}
        setOpen={setPromptState}
        contentTitle={prompt.contentTitle || "Delete Confirmation"}
        contentText={prompt.contentText || confirmText}
        contentInfo={``}
        agreeTitle={"Confirm"}
        disagreeTitle={"Cancel"}
        handleAgree={promptAgreeHandler}
        handleDisagree={promptDisagreeHandler}
      />
    </>
  );
};
