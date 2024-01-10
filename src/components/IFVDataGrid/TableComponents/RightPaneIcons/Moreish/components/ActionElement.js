import { Box, Button } from "@material-ui/core";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";

const initTaskStatus = {
  inProgress: false,
  payload: [],
  error: false,
  message: "",
};

export const ActionElement = ({
  id,
  className,
  icon,
  name,
  allRows,
  selectedRows,
  payload,
  handleBulkAction,
  handleSetPayload,
  handleSetLoading,
  isAnyInProgress,
  handleClose,
  handleSetModal,
}) => {
  const [runAsync, setRunAsync] = useState(false);
  const [taskStatus, setTaskStatus] = useState(initTaskStatus);

  const handleClick = (event) => {
    setRunAsync(true);
    handleSetLoading(className);
    setTaskStatus((oldState) => ({ ...oldState, inProgress: true }));
  };

  useEffect(() => {
    if (runAsync && payload.loading && taskStatus.inProgress) {
      handleClose();
      handleBulkAction(allRows, selectedRows, setTaskStatus);
      setRunAsync(false);
    }
  }, [
    allRows,
    className,
    handleBulkAction,
    handleClose,
    handleSetPayload,
    payload.loading,
    runAsync,
    selectedRows,
    taskStatus,
    taskStatus.inProgress,
  ]);

  useEffect(() => {
    if (!runAsync && payload.loading && !taskStatus.inProgress) {
      handleSetPayload(className, taskStatus, handleSetModal);
    }
  }, [
    className,
    handleSetModal,
    handleSetPayload,
    payload.loading,
    runAsync,
    taskStatus,
  ]);

  return (
    <Styled.MenuButtonWrapper>
      <Styled.MenuButton
        id={id}
        className={className}
        onClick={handleClick}
        disabled={payload.loading || isAnyInProgress}
        startIcon={
          payload.loading ? (
            <Styled.Spinner style={{ width: "1rem", height: "1rem" }} />
          ) : (
            icon
          )
        }
      >
        {name}
      </Styled.MenuButton>
    </Styled.MenuButtonWrapper>
  );
};

const Styled = {
  MenuButtonWrapper: styled(Box)`
    width: 100%;
  `,
  MenuButton: styled(Button)`
    /* font-family: "Montserrat"; */
    text-transform: capitalize;
    /* height: 2.4rem; */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1rem;
    word-wrap: break-word;
    text-align: left;

    &:hover {
      background: #0293fe20;
      /* color: #f9f9f9; */
    }

    &.MuiButton-root.Mui-disabled {
      background: #fff;
      border: 0px solid #30303020;
    }

    & .MuiButton-startIcon .MuiSvgIcon-root {
      color: rgb(2, 147, 254);
      width: 0.85em;
      height: 0.85em;
    }

    &.MuiButton-root.Mui-disabled .MuiButton-startIcon .MuiSvgIcon-root {
      color: rgba(2, 147, 254, 0.2);
    }
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #0094fd;
    }
  `,
};
