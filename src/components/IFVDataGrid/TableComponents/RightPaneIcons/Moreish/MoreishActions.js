import { Box, Button, CircularProgress, Fade, Menu } from "@material-ui/core";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ToolTip from "../../../../../utils/Tooltip/Tooltip";
import { ActionElement } from "./components/ActionElement";
import { defaults } from "./defaults";
import GenericButton from "../MaterialComponents/GenericButton";
import { useTranslation } from "react-i18next";

const makeIdFromName = (param = " Some Name ") => {
  return param.toLowerCase().trim().split(" ").join("-");
};

const makeClassNameFromName = (param = "") => {
  return param
    .trim()
    .split(" ")
    .map((v, i) => (i === 0 ? v[0].toLowerCase() + v.slice(1) : v))
    .join("");
};

const initPayload = () => {
  return {
    loading: false,
    payload: [],
    error: false,
    message: "",
  };
};

const initModal = () => {
  return {
    display: false,
    title: "Task Results",
    error: false,
    message: "Following Items failed while processing the task!",
    messageBody: {},
    accept: false,
    acceptText: "Okay",
    onAcceptArgs: [],
    onAccept: () => {},
    reject: false,
    rejectText: "Nope",
    onRejectArgs: [],
    onReject: () => {},
    close: true,
    closeText: "Close",
    onCloseArgs: [],
    onClose: () => {},
  };
};

export function MoreishActions({
  allRows,
  setAllRows,
  selectedRows,
  setSelectedRows,
  disableButton,
  display,
  bulkActions = defaults.bulkActions,
  visibility,
}) {
  const { t, i18n } = useTranslation();

  const [disabled, setDisabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [payload, setPayload] = useState({});
  const [startCleanUp, setStartCleanup] = useState(false);
  const [menuDisplay, setMenuDisplay] = useState(true);

  const open = Boolean(anchorEl);
  const keys = Object.keys(payload);
  const payloads = keys.map((key) => payload[key]);
  const isAnyLoading = payloads.filter(({ loading }) => loading);
  const isAnyInProgress = Boolean(isAnyLoading.length);

  const handleClick = (event) => {
    setMenuDisplay(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuDisplay(false);
    !isAnyInProgress && setAnchorEl(null);
  };

  const handleSetLoading = (keyName) => {
    setPayload((oldState) => ({
      ...oldState,
      [keyName]: { ...oldState[keyName], loading: true },
    }));
  };

  const handleSetAllRows = useCallback(
    (payload) => {
      setAllRows([...payload]);
    },
    [setAllRows],
  );

  const handleSetPayload = (keyName, response, handleSetModal) => {
    setPayload((oldState) => {
      handleSetAllRows(response.payload);
      handleSetModal(keyName, response);

      return {
        ...oldState,
        [keyName]: { ...response },
      };
    });

    setAnchorEl(null);
    setStartCleanup(true);
  };

  // Cleanup
  useEffect(() => {
    if (startCleanUp) {
      setSelectedRows((oldState) => {
        const selectedTableRows = allRows
          .filter((row) => {
            return Boolean(oldState.filter((r) => r.id === row.id).length);
          })
          .filter((r) => {
            return r.isChecked;
          });

        return selectedTableRows;
      });

      setStartCleanup(false);
    }
  }, [allRows, selectedRows, setSelectedRows, startCleanUp]);

  // Disabling Button
  useEffect(() => {
    setDisabled(disableButton);
  }, [disableButton]);

  // Creates payload for each action
  useEffect(() => {
    bulkActions.forEach(({ name }) => {
      const className = makeClassNameFromName(name);

      setPayload((oldState) => {
        const oldKeys = Object.keys(oldState);

        return oldKeys.includes(className)
          ? oldState
          : { ...oldState, [className]: initPayload() };
      });
    });
  }, []);

  return (
    <Styled.Wrapper display={display ? "inherit" : "none"}>
      <ToolTip title={"Actions for checked rows"}>
        <GenericButton
          id="more-actions-menu"
          width={"12.5em"}
          backgroundColor="primary"
          buttonName={t("commons.table.MoreActions.bulkActions.text")}
          aria-controls="fade-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          startIcon={
            isAnyInProgress ? (
              <Styled.Spinner style={{ width: "1rem", height: "1rem" }} />
            ) : (
              <AssignmentRoundedIcon
                style={{ width: "1rem", height: "1rem" }}
              />
            )
          }
          Icon={
            isAnyInProgress ? (
              <Styled.Spinner style={{ width: "1rem", height: "1rem" }} />
            ) : (
              <AssignmentRoundedIcon
                style={{ width: "1rem", height: "1rem" }}
              />
            )
          }
          disabled={disabled}
          onClick={handleClick}
        />
      </ToolTip>

      <Styled.Menu
        id="more-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ "aria-labelledby": "fade-button" }}
        theme={{ display: menuDisplay }}
      >
        {bulkActions.map(
          ({
            icon,
            name,
            handleBulkAction = defaults.handleBulkAction,
            handleSetModal = () => null,
          }) => {
            const id = makeIdFromName(name);
            const className = makeClassNameFromName(name);

            return (
              <>
                <ActionElement
                  key={id}
                  id={id}
                  className={className}
                  icon={icon}
                  name={name}
                  allRows={allRows}
                  selectedRows={selectedRows}
                  payload={payload[className]}
                  handleBulkAction={handleBulkAction}
                  handleSetPayload={handleSetPayload}
                  handleSetLoading={handleSetLoading}
                  handleSetModal={handleSetModal}
                  isAnyInProgress={isAnyInProgress}
                  handleClose={handleClose}
                />
              </>
            );
          },
        )}
      </Styled.Menu>
    </Styled.Wrapper>
  );
}

const Styled = {
  Wrapper: styled(Box)``,
  Button: styled(Button)`
    &.MuiButton-root {
      text-transform: capitalize;
      border: 2px solid #0094fd;
      background: #0094fd;
      color: #fff;
      min-width: 38px;
      height: 2.4rem;
      padding: 0 1rem;
    }

    &.MuiButton-root:hover {
      border: 2px solid #0074c7;
      background: #0074c7;
      color: #fff;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }
  `,
  Menu: styled(Menu)`
    & .MuiPaper-root {
      box-sizing: border-box;
      min-width: 15em;
      max-width: 30em;
    }

    &.MuiPopover-root {
      display: ${({ theme }) => (theme.display ? "inherit" : "none")};
    }

    & .MuiMenu-list {
      padding: 0em;
    }

    & .MuiButton-text {
      padding: 0.75em 1em;
    }

    & .MuiButton-startIcon {
      margin-right: 0.75em;
    }
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #fff;
    }
  `,
};
