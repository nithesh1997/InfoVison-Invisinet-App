import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { WarningRounded } from "@material-ui/icons";
import { memo, useEffect, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import styled from "styled-components";
import {
  defaultAsyncArgs,
  defaultAsyncHandler,
  defaultSyncArgs,
  defaultSyncHandler,
} from "../defaults";
import { initialButtonState } from "../defaults/states";

const ActionButton = ({
  children = <WarningRounded />,
  id = "action-button",
  name = "action-button",
  className = "actionButton",
  propertyName = "actionButton",
  colorState = "#FF5679",
  display = true,
  isInMenu = false,
  childActions = [],
  ShowChildrens,
  Childrens,
  syncArgs = defaultSyncArgs,
  asyncArgs = defaultAsyncArgs,
  syncHandler = defaultSyncHandler,
  asyncHandler = defaultAsyncHandler,
  setStatuses,
  isAnyActionInNeutral,
  isAnyActionInProgress,
  isAnyActionInComplete,
  handleMenuClose = () => {},
}) => {
  const [button, setButton] = useState(initialButtonState);
  const [showChildrens, setShowChildrens] = ShowChildrens;
  const [childrens, setChildrens] = Childrens;

  const handleClick = () => {
    setButton(($) => ({
      ...$,
      flag: {
        ...$.flag,
        isSpinner: true,
        isDisabled: true,
        isClicked: true,
        isAsyncTaskCompleted: false,
      },
      asyncTask: {
        ...$.asyncTask,
        isLoading: true,
      },
    }));

    setStatuses((oldState) => ({
      ...oldState,
      [propertyName]: "progress",
    }));
  };

  // Runs Async tasks
  useEffect(() => {
    if (button.flag.isClicked) {
      asyncHandler(...asyncArgs).then((res) => {
        setButton(($) => ({
          ...$,
          flag: {
            ...$.flag,
            isSpinner: false,
            isDisabled: false,
            isClicked: false,
            isAsyncTaskCompleted: true,
          },
          asyncTask: { ...res },
        }));
      });
    }
  }, [asyncArgs, asyncHandler, button]);

  // Runs Synchronous tasks
  useEffect(() => {
    if (button.flag.isAsyncTaskCompleted) {
      syncHandler(...syncArgs, button.asyncTask);
      setButton(($) => ({
        ...$,
        flag: {
          ...$.flag,
          isAsyncTaskCompleted: false,
          isSyncTaskCompleted: true,
        },
      }));
    }
  }, [button, syncArgs, syncHandler]);

  // Runs after both Async & Sync tasks
  useEffect(() => {
    if (button.flag.isSyncTaskCompleted) {
      setButton(($) => ({
        ...$,
        flag: {
          ...$.flag,
          isSyncTaskCompleted: false,
        },
      }));

      setStatuses((oldState) => ({
        ...oldState,
        [propertyName]: "completed",
      }));

      isInMenu && handleMenuClose();

      if (childActions.length && !button.asyncTask.error) {
        setShowChildrens(true);
        setChildrens(childActions);
      } else {
        setShowChildrens(false);
        setChildrens([]);
      }
    }
  }, [
    button,
    childActions,
    handleMenuClose,
    isInMenu,
    propertyName,
    setChildrens,
    setShowChildrens,
    setStatuses,
  ]);

  return (
    <WRAPPER>
      <ACTION_BUTTON
        id={id}
        name={name}
        className={className}
        onClick={handleClick}
        disabled={isAnyActionInProgress() || button.flag.isDisabled}
        theme={{
          colorState,
          isSpinner: button.flag.isSpinner,
          display,
          isInMenu,
        }}
      >
        {button.flag.isSpinner ? (
          <Fragment>
            {isInMenu ? (
              <CHILD_WRAPPER>
                <CircularProgress style={{ width: "1rem", height: "1rem" }} />
                <BUTTON_TEXT>{name}</BUTTON_TEXT>
              </CHILD_WRAPPER>
            ) : (
              <CircularProgress style={{ width: "1rem", height: "1rem" }} />
            )}
          </Fragment>
        ) : (
          <Fragment>
            {isInMenu ? (
              <CHILD_WRAPPER>
                {children}
                <BUTTON_TEXT>{name}</BUTTON_TEXT>
              </CHILD_WRAPPER>
            ) : (
              <CHILD_WRAPPER>{children}</CHILD_WRAPPER>
            )}
          </Fragment>
        )}
      </ACTION_BUTTON>
    </WRAPPER>
  );
};

const ACTION_BUTTON = styled(Button)`
  &.MuiButton-root {
    box-sizing: border-box;
    display: ${({ theme }) => {
      return theme.display ? (theme.isInMenu ? "flex" : "inherit") : "none";
    }};
    justify-content: ${({ theme }) => {
      return theme.isInMenu ? "flex-start" : "inherit";
    }};
    min-width: ${({ theme }) => (theme.isInMenu ? "100%" : "32px")};
    min-height: ${({ theme }) => (theme.isInMenu ? "100%" : "32px")};
    max-width: ${({ theme }) => (theme.isInMenu ? "min-content" : "32px")};
    max-height: ${({ theme }) => (theme.isInMenu ? "min-content" : "32px")};
    border-radius: ${({ theme }) => (theme.isInMenu ? "4px" : "50%")};
    border: 1px solid ${({ theme }) => theme.colorState}00;
    background: ${({ theme }) => {
      return theme.isSpinner
        ? `${theme.colorState}30`
        : `${theme.colorState}00`;
    }};
  }

  &.MuiButton-root.Mui-disabled {
    background: #59595920;
    border: 1px solid #59595900;
  }

  &.MuiButton-root:hover {
    background: ${({ theme }) => theme.colorState}20;
    border: 1px solid ${({ theme }) => theme.colorState};
  }

  &.MuiButton-root.Mui-disabled .MuiSvgIcon-root {
    color: #59595990;
  }

  & .MuiTouchRipple-root {
  }

  & .MuiSvgIcon-root {
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.colorState};
  }

  & .MuiCircularProgress-colorPrimary {
    color: ${({ theme }) => theme.colorState};
  }
`;

const WRAPPER = styled(Box)`
  border-radius: 4px;
`;

const CHILD_WRAPPER = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BUTTON_TEXT = styled(Typography)`
  &.MuiTypography-root {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
    padding: 0 0 0 1rem;
  }
`;

export default memo(ActionButton);
