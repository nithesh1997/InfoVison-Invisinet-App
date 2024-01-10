import { Box, Button, Menu } from "@material-ui/core";
import { MoreVertRounded } from "@material-ui/icons";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import ActionButton from "./components/ActionButton";

const initActionsState = (actions, cap) => ({
  quick: actions.slice(0, cap),
  menu: actions.slice(cap),
});

const initViewMoreState = () => ({ anchorEl: null });

const child$ = (propertyNames, initialValue) => {
  const initialState = {};
  propertyNames.map((property) => (initialState[property] = initialValue));
  return initialState;
};

const checkForStatus = (props, params, param) => {
  return Boolean(props.filter((prop) => params[prop] === param).length);
};

const getPropertyNames = (param) =>
  param.map(({ propertyName }) => propertyName);

const Action = ({ actions, quickActionsCap = 0 }) => {
  const objNames = useMemo(() => getPropertyNames(actions), [actions]);
  const [statuses, setStatuses] = useState(() => child$(objNames, "neutral"));
  const [actionsState, setActionsState] = useState(() => {
    return initActionsState(actions, quickActionsCap);
  });
  const [viewMore, setViewMore] = useState(initViewMoreState);
  const isViewMoreOpen = Boolean(viewMore.anchorEl);
  const [gridColRepeat, setGridColRepeat] = useState(
    actionsState.menu.length ? quickActionsCap + 1 : quickActionsCap,
  );
  const [showChildrens, setShowChildrens] = useState(false);
  const [childrens, setChildrens] = useState([]);

  const handleMenuClick = (event) => {
    setViewMore(($) => ({ ...$, anchorEl: event.currentTarget }));
  };

  const handleMenuClose = (event) => {
    setViewMore(($) => ({ ...$, anchorEl: null }));
  };

  const isAnyActionInNeutral = useCallback(() => {
    return checkForStatus(objNames, statuses, "neutral");
  }, [objNames, statuses]);

  const isAnyActionInProgress = useCallback(() => {
    return checkForStatus(objNames, statuses, "progress");
  }, [objNames, statuses]);

  const isAnyActionInComplete = useCallback(() => {
    return checkForStatus(objNames, statuses, "complete");
  }, [objNames, statuses]);

  // reveal child actions
  useEffect(() => {
    setActionsState((oldState) => {
      showChildrens
        ? setGridColRepeat(
            actionsState.menu.length ? childrens.length + 1 : childrens.length,
          )
        : setGridColRepeat(
            actionsState.menu.length ? quickActionsCap + 1 : quickActionsCap,
          );

      return showChildrens
        ? { ...oldState, quick: [...childrens] }
        : initActionsState(actions, quickActionsCap);
    });
  }, [
    actions,
    actionsState.menu.length,
    childrens,
    quickActionsCap,
    showChildrens,
  ]);

  return (
    <ACTION_WRAPPER theme={{ gridColRepeat }}>
      {actionsState.quick.map(({ reactKey, icon, ...props }) => (
        <ActionButton
          key={props.propertyName}
          setStatuses={setStatuses}
          isAnyActionInNeutral={isAnyActionInNeutral}
          isAnyActionInProgress={isAnyActionInProgress}
          isAnyActionInComplete={isAnyActionInComplete}
          isInMenu={false}
          ShowChildrens={[showChildrens, setShowChildrens]}
          Childrens={[childrens, setChildrens]}
          {...props}
        >
          {icon}
        </ActionButton>
      ))}

      {actionsState.menu.length ? (
        <Fragment>
          <ACTION_BUTTON_WRAPPER>
            <ACTION_BUTTON
              id="view-more-actions"
              className="viewMoreActions"
              name="view more actions"
              aria-controls="view-more-actions-menu"
              aria-haspopup="true"
              aria-expanded={isViewMoreOpen ? "true" : undefined}
              onClick={(e) => handleMenuClick(e)}
              theme={{ colorState: "#058FE7", display: true }}
              disabled={showChildrens || isAnyActionInProgress()}
            >
              <MoreVertRounded />
            </ACTION_BUTTON>

            <VIEW_MORE
              id="view-more-actions"
              aria-labelledby="view-more-actions"
              anchorEl={viewMore.anchorEl}
              open={isViewMoreOpen}
              onClose={() => {
                if (!Boolean(isAnyActionInProgress())) {
                  handleMenuClose();
                }
              }}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {actionsState.menu.map(({ reactKey, icon, ...props }) => (
                <ActionButton
                  key={props.propertyName}
                  setStatuses={setStatuses}
                  isAnyActionInNeutral={isAnyActionInNeutral}
                  isAnyActionInProgress={isAnyActionInProgress}
                  isAnyActionInComplete={isAnyActionInComplete}
                  isInMenu={true}
                  handleMenuClose={handleMenuClose}
                  ShowChildrens={[showChildrens, setShowChildrens]}
                  Childrens={[childrens, setChildrens]}
                  {...props}
                >
                  {icon}
                </ActionButton>
              ))}
            </VIEW_MORE>
          </ACTION_BUTTON_WRAPPER>
        </Fragment>
      ) : null}
    </ACTION_WRAPPER>
  );
};

const ACTION_WRAPPER = styled(Box)`
  background: #e5e5e5;
  border-radius: 4px;
  box-sizing: border-box;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ theme }) => {
    return `repeat(${theme.gridColRepeat}, 1fr)`;
  }};
  padding: 1rem;
  place-items: center;
  position: relative;
`;

const ACTION_BUTTON_WRAPPER = styled(Box)`
  border-radius: 4px;
`;

const ACTION_BUTTON = styled(Button)`
  &.MuiButton-root {
    display: ${({ theme }) => (theme.display ? "inherit" : "none")};
    min-width: 32px;
    max-width: 32px;
    min-height: 32px;
    max-height: 32px;
    box-sizing: border-box;
    border-radius: 50%;
    background: ${({ theme }) => theme.colorState}00;
    background: ${({ theme }) =>
      theme.isSpinner ? `${theme.colorState}30` : `${theme.colorState}00`};
    border: 1px solid ${({ theme }) => theme.colorState}00;
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

const VIEW_MORE = styled(Menu)`
  & .MuiMenu-paper {
    box-sizing: border-box;
    min-width: min-content;
    height: min-content;
    display: grid;
    padding: 0.4rem;
    grid-template-columns: 1fr;
    place-items: center;
  }
`;

export default Action;
