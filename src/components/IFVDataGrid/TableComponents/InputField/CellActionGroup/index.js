import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import React from "react";
import { ActionButtonGroup } from "./styled-materials/ActionButtonGroup";
import { IconBtn } from "./styled-materials/IconBtn";

const CellActionGroup = ({
  heading,
  data,
  memoHeads,
  editHandler,
  deleteHandler,
  doneHandler,
  cancelHandler,
}) => {
  return (
    <ActionButtonGroup>
      {data.__isEditMode ? (
        <>
          <IconBtn onClick={(event) => doneHandler(data, heading, event)}>
            <DoneSharpIcon />
          </IconBtn>
          <IconBtn>
            <ClearSharpIcon
              onClick={(event) => cancelHandler(data, heading, event)}
            />
          </IconBtn>
        </>
      ) : (
        <>
          <IconBtn
            onClick={(event) => {
              editHandler(heading, data, event, memoHeads);
            }}
          >
            <EditSharpIcon style={{ fontSize: "1.25rem" }} />
          </IconBtn>
          <IconBtn onClick={(event) => deleteHandler(data, heading, event)}>
            <DeleteOutlinedIcon />
          </IconBtn>
        </>
      )}
    </ActionButtonGroup>
  );
};

export default CellActionGroup;
