import React, { Fragment, useState } from "react";
import { useActionPayloadState } from "../../../hooks";
import { ActionWrapper } from "../../../styled-materials/ActionWrapper";
import { AsyncIcon } from "../../../styled-materials/AsyncIcon";
import { ActionSwitch } from "./ActionSwitch";

const initialAsyncOpState = {
  isEdit: false,
  isDelete: false,
  isDone: false,
  isCancel: false,
  isDownloadLogs: false,
  isViewLogs: false,
  isRestore: false,
};

export const RenderActionsInCell = ({
  row,
  editOnPopup,
  rowIndex,
  Infected,
  inputRef,
  ValidateAll,
  IsErrorCheckCompleted,
  isSaveRowsFlag,
  pageName = "",
  elementId,
}) => {
  const [startAsync, setStartAsync] = useState(() => initialAsyncOpState);
  const [isEditEnabled, setIsEditEnabled] = useState(true);
  const actionPayloadState = useActionPayloadState();

  return (
    <Fragment>
      <AsyncIcon inProgress={actionPayloadState[0].inProgress}>
        <ActionWrapper>
          <ActionSwitch
            startAsync={startAsync}
            setStartAsync={setStartAsync}
            actionPayloadState={actionPayloadState}
            row={row}
            rowIndex={rowIndex}
            editOnPopup={editOnPopup}
            Infected={Infected}
            inputRef={inputRef}
            ValidateAll={ValidateAll}
            IsErrorCheckCompleted={IsErrorCheckCompleted}
            IsEditEnabled={[isEditEnabled, setIsEditEnabled]}
            isSaveRowsFlag={isSaveRowsFlag}
            pageName={pageName}
            elementId={elementId}
          />
        </ActionWrapper>
      </AsyncIcon>
    </Fragment>
  );
};
