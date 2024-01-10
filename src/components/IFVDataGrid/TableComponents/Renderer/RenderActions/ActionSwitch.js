import { Fade, IconButton, Menu, Tooltip } from "@material-ui/core";
import { MoreVertRounded } from "@material-ui/icons";
import { Box } from "@mui/system";
import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { DataGridContext, IsPopupEditClosed } from "../../../IFVDataGrid";
import { Action } from "./Action";
import { CancelAction } from "./CancelAction";
import { ClearFilterRulesAction } from "./ClearFilterRulesAction";
import { DeleteAction } from "./DeleteAction";
import { RestoreAction } from "./RestoreAction";
import { ExportAction } from "./ExportAction";
import { DoneAction } from "./DoneAction";
import { DownloadLogsAction } from "./DownloadLogsAction";
import { EditAction } from "./EditAction";
import { FilterRuleConfigAction } from "./FilterRuleConfigAction";
import { TogglerAction } from "./TogglerAction";
import { UpgradeRemoteFirmwareAction } from "./UpgradeRemoteFirmwareAction";
import { ViewFilterRuleConfigAction } from "./ViewFilterRuleConfigAction";
import { ViewLogsAction } from "./ViewLogsAction";
import { Trans, useTranslation } from "react-i18next";

export const ActionSwitch = ({
  actionPayloadState,
  row,
  editOnPopup,
  startAsync,
  setStartAsync,
  rowIndex,
  Infected,
  inputRef,
  ValidateAll,
  IsErrorCheckCompleted,
  IsEditEnabled,
  isSaveRowsFlag,
  pageName = "",
}) => {
  const {
    handleEdit,
    handleSave,
    handleDiscard,
    handleDelete,
    handleDownload,
    handleView,
    handleViewFilterRulesConfig,
    handleFilterRulesConfig,
    handleUpgradeRemoteFirmware,
    handleToggle,
    handleClearFilterRules,
    handleRestore,
    handleExport,
    toggleActionIcons,
    maxQuickActions = 3,
    gridConfig,
    handlersActionToggle: isEnabled,
    isAddRow,
    closeDownloadLogsPortal,
    handlersPrompt,
    handlersHref,
    handlers,
    gridSubconscious,
  } = useContext(DataGridContext);

  const [isEditClosed, setIsEditClosed] = useState(false);

  const { t } = useTranslation();

  const isModeEdit =
    (row.__isEditMode && gridConfig.editMode !== "popup") ||
    editOnPopup === true;

  const switchEl = (element, handlerProps = {}, quickActionsCount) => {
    switch (element) {
      case "doneEl":
        return doneEl;
      case "cancelEl":
        return cancelEl;
      case "editEl":
        return editEl;
      case "deleteEl":
        return deleteEl;
      case "downloadLogsEl":
        return downloadLogsEl;
      case "viewLogsEl":
        return viewLogsEl;
      case "ViewFilterRuleConfigEl":
        return ViewFilterRuleConfigEl;
      case "FilterRuleConfigEl":
        return FilterRuleConfigEl;
      case "UpgradeRemoteFirmwareEl":
        return UpgradeRemoteFirmwareEl;
      case "togglerEl":
        return togglerEl;
      case "clearFilterRulesEl":
        return clearFilterRulesEl;
      case "restoreEl":
        return restoreEl;
      case "exportEl":
        return exportEl;
      case "_handler_":
        return (
          <Action
            {...handlerProps}
            isInMenu={quickActionsCount > 1}
            currentRow={row}
            currentRowIndex={rowIndex}
            pageName={pageName}
          />
        );

      default:
        return null;
    }
  };

  const isRemoteKeying = row.roles === "Remote Keying";

  // After task move to up
  const [actionsState, setActionsState] = useState(() => {
    const customHandlers = handlers.map(($) => ({
      element: "_handler_",
      handler: true,
      handlerProps: { ...$ },
    }));

    const actionElements = [
      {
        element: "editEl",
        handler: handleEdit,
        elementName: "Edit",
      },
      {
        element: "exportEl",
        handler: handleExport,
        elementName: "Export",
      },
      {
        element: "restoreEl",
        handler: handleRestore,
        elementName: "Restore",
      },
      {
        element: "deleteEl",
        handler: handleDelete,
        elementName: "Delete",
      },
      {
        element: "downloadLogsEl",
        handler: handleDownload,
        elementName: "Download Logs",
      },
      {
        element: "viewLogsEl",
        handler: handleView,
        elementName: "View Logs",
      },
      {
        element: "ViewFilterRuleConfigEl",
        handler: handleFilterRulesConfig,
        elementName: "View Filter Rules",
      },
      {
        element: "FilterRuleConfigEl",
        handler: handleFilterRulesConfig,
        elementName: "Filter Rule Configuration",
      },
      {
        element: "UpgradeRemoteFirmwareEl",
        handler: handleUpgradeRemoteFirmware,
        elementName: "Upgrade Remote Firmware",
      },
      {
        element: "togglerEl",
        handler: handleToggle,
        elementName: "Toggle",
      },
      {
        element: "clearFilterRulesEl",
        handler: handleClearFilterRules,
        elementName: "Clear Filter Rules",
      },

      ...customHandlers,
    ];

    const logFilesActions = [
      {
        element: "deleteEl",
        handler: handleDelete,
        elementName: "Delete",
      },
      {
        element: "viewLogsEl",
        handler: handleView,
        elementName: "View Logs",
      },
    ];

    const filteredActions = actionElements.filter(
      ({ handler }) => handler !== undefined && handler !== null,
    );

    const _maxQuickActions =
      pageName === "ba-settings-configuration"
        ? maxQuickActions + 1
        : maxQuickActions;
    const quickActions =
      pageName === "ba-logFiles-config"
        ? logFilesActions
        : filteredActions.splice(0, _maxQuickActions);

    const menuActions = filteredActions.slice(0);

    return { quickActions, menuActions };
  });

  const [childActions, setChildActions] = useState([
    {
      element: "doneEl",
      handler: handleSave,
      elementName: "Done",
    },
    {
      element: "cancelEl",
      handler: handleDiscard,
      elementName: "Save",
    },
  ]);

  const initViewMoreState = () => ({ anchorEl: null });
  const [viewMore, setViewMore] = useState(initViewMoreState);
  const isViewMoreOpen = Boolean(viewMore.anchorEl);
  const [showChildrens, setShowChildrens] = useState(false);
  const [isAnyActionInProgress, setIsAnyActionInProgress] = useState(false);
  const [quickActions, setQuickActions] = useState(actionsState.quickActions);
  const [isPopupEditClosed, setIsPopupEditClosed] =
    useContext(IsPopupEditClosed);
  const [isHideMenu, setIsHideMenu] = useState(false);
  const menuActions = actionsState.menuActions;

  const handleMenuClick = (event) => {
    setViewMore(($) => ({ ...$, anchorEl: event.currentTarget }));
  };

  const handleMenuClose = (event) => {
    setViewMore(($) => ({ ...$, anchorEl: null }));
  };

  const handleMenuHide = () => {
    setIsHideMenu(true);
  };

  const handleMenuUnhide = () => {
    setIsHideMenu(false);
  };

  const IsEditClosedState = useMemo(() => {
    return gridConfig.editMode === "popup"
      ? [isPopupEditClosed, setIsPopupEditClosed]
      : [isEditClosed, setIsEditClosed];
  }, [
    gridConfig.editMode,
    isEditClosed,
    isPopupEditClosed,
    setIsPopupEditClosed,
  ]);

  const doneEl = (
    <DoneAction
      id={`${gridSubconscious.name}-save-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleSave}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleSave}
      Infected={Infected}
      inputRef={inputRef}
      ValidateAll={ValidateAll}
      IsErrorCheckCompleted={IsErrorCheckCompleted}
      IsEditEnabled={IsEditEnabled}
      isSaveRowsFlag={isSaveRowsFlag}
      IsEditClosed={IsEditClosedState}
      isInMenu={false}
      prompt={handlersPrompt["handleSave"]}
    />
  );

  const cancelEl = (
    <CancelAction
      id={`${gridSubconscious.name}-discard-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleDiscard}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleDiscard}
      inputRef={inputRef}
      IsEditEnabled={IsEditEnabled}
      IsEditClosed={IsEditClosedState}
      isInMenu={false}
      prompt={handlersPrompt["handleDiscard"]}
    />
  );

  const editEl = (
    <EditAction
      id={`${gridSubconscious.name}-edit-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleEdit}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleEdit}
      inputRef={inputRef}
      IsEditEnabled={IsEditEnabled}
      IsEditClosed={IsEditClosedState}
      isInMenu={false}
      allowBulkActions={true}
      prompt={handlersPrompt["handleEdit"]}
    />
  );

  const deleteEl = (
    <DeleteAction
      id={`${gridSubconscious.name}-delete-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleDelete}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleDelete}
      inputRef={inputRef}
      isInMenu={false}
      prompt={handlersPrompt["handleDelete"]}
    />
  );

  const restoreEl = (
    <RestoreAction
      id={`${gridSubconscious.name}-restore-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleRestore}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleRestore}
      inputRef={inputRef}
      isInMenu={false}
      prompt={handlersPrompt["handleRestore"]}
    />
  );

  const exportEl = (
    <ExportAction
      id={`${gridSubconscious.name}-export-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      onClick={handleExport}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleExport}
      inputRef={inputRef}
      isInMenu={false}
      prompt={handlersPrompt["handleExport"]}
    />
  );

  const downloadLogsEl = (
    <DownloadLogsAction
      id={`${gridSubconscious.name}-download-logs-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleDownload}
      inputRef={inputRef}
      onClick={handleDownload}
      isInMenu={true}
      closePortal={closeDownloadLogsPortal}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleDownload"]}
      href={handlersHref["handleDownload"]}
    />
  );

  const viewLogsEl = (
    <ViewLogsAction
      id={`${gridSubconscious.name}-view-logs-button-${rowIndex}`}
      editOnPopup={editOnPopup}
      isModeEdit={isModeEdit}
      actionPayloadState={actionPayloadState}
      row={row}
      rowIndex={rowIndex}
      startAsync={startAsync}
      setStartAsync={setStartAsync}
      isEnabled={isEnabled.handleView}
      inputRef={inputRef}
      onClick={handleView}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      pageName={pageName}
      prompt={handlersPrompt["handleView"]}
      href={handlersHref["handleView"]}
    />
  );

  const ViewFilterRuleConfigEl = (
    <ViewFilterRuleConfigAction
      id={`${gridSubconscious.name}-view-filter-rule-button-${rowIndex}`}
      actionPayloadState={actionPayloadState}
      editOnPopup={editOnPopup}
      inputRef={inputRef}
      isModeEdit={isModeEdit}
      row={row}
      rowIndex={rowIndex}
      setStartAsync={setStartAsync}
      startAsync={startAsync}
      isEnabled={isEnabled.handleViewFilterRulesConfig}
      onClick={handleViewFilterRulesConfig}
      isInView={handleViewFilterRulesConfig !== undefined}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleViewFilterRulesConfig"]}
    />
  );

  const FilterRuleConfigEl = (
    <FilterRuleConfigAction
      id={`${gridSubconscious.name}-configure-filter-rule-button-${rowIndex}`}
      actionPayloadState={actionPayloadState}
      editOnPopup={editOnPopup}
      inputRef={inputRef}
      isModeEdit={isModeEdit}
      row={row}
      rowIndex={rowIndex}
      setStartAsync={setStartAsync}
      startAsync={startAsync}
      isEnabled={isEnabled.handleFilterRulesConfig}
      onClick={handleFilterRulesConfig}
      isInView={handleFilterRulesConfig !== undefined}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleFilterRulesConfig"]}
    />
  );

  const UpgradeRemoteFirmwareEl = (
    <UpgradeRemoteFirmwareAction
      id={`${gridSubconscious.name}-upgrade-remote-firmware-button-${rowIndex}`}
      actionPayloadState={actionPayloadState}
      editOnPopup={editOnPopup}
      inputRef={inputRef}
      isModeEdit={isModeEdit}
      row={row}
      rowIndex={rowIndex}
      setStartAsync={setStartAsync}
      startAsync={startAsync}
      isEnabled={isEnabled.handleUpgradeRemoteFirmware}
      onClick={handleUpgradeRemoteFirmware}
      isInView={Boolean(handleUpgradeRemoteFirmware)}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleUpgradeRemoteFirmware"]}
    />
  );

  const togglerEl = (
    <TogglerAction
      id={`${gridSubconscious.name}-toggle-switch-button-${rowIndex}`}
      actionPayloadState={actionPayloadState}
      editOnPopup={editOnPopup}
      inputRef={inputRef}
      isModeEdit={isModeEdit}
      row={row}
      rowIndex={rowIndex}
      setStartAsync={setStartAsync}
      startAsync={startAsync}
      isEnabled={isEnabled.handleToggle}
      onClick={handleToggle}
      icons={toggleActionIcons.icons || []}
      icon={toggleActionIcons.icon || 0}
      isInView={handleToggle !== undefined}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleToggle"]}
    />
  );

  const clearFilterRulesEl = (
    <ClearFilterRulesAction
      id={`${gridSubconscious.name}-clear-filter-rule-button-${rowIndex}`}
      actionPayloadState={actionPayloadState}
      editOnPopup={editOnPopup}
      inputRef={inputRef}
      isModeEdit={isModeEdit}
      row={row}
      rowIndex={rowIndex}
      setStartAsync={setStartAsync}
      startAsync={startAsync}
      isEnabled={isEnabled.handleClearFilterRules}
      onClick={handleClearFilterRules}
      isInView={handleClearFilterRules !== undefined}
      isInMenu={true}
      handleMenuClose={handleMenuClose}
      handleMenuHide={handleMenuHide}
      handleMenuUnhide={handleMenuUnhide}
      prompt={handlersPrompt["handleClearFilterRules"]}
    />
  );

  const handleOnClose = () => {
    return !Boolean(isAnyActionInProgress) && handleMenuClose();
  };

  useEffect(() => {
    if ((isEditClosed || isAddRow || editOnPopup) && row.__isEditMode) {
      setQuickActions(childActions);
      setShowChildrens(true);
    } else {
      setQuickActions(actionsState.quickActions);
      setShowChildrens(false);
    }
  }, [
    actionsState.quickActions,
    childActions,
    editOnPopup,
    isAddRow,
    isEditClosed,
    row.__isEditMode,
  ]);

  useEffect(() => {
    if (row.__isEditMode) {
    }
  });

  return (
    <WRAPPER>
      {quickActions.map(({ element, handlerProps }) => {
        return switchEl(element, handlerProps, quickActions.length);
      })}

      {menuActions.length &&
      !isAddRow &&
      !editOnPopup &&
      !showChildrens &&
      pageName !== "ba-logFiles-config" ? (
        <Fragment>
          <Tooltip
            title={
              isRemoteKeying
                ? "Remote Keying will show this option as disabled."
                : ""
            }
            arrow
            trigger="hover"
            onMouseleave="hide"
          >
            <ACTION_BUTTON_WRAPPER>
              <ACTION_BUTTON
                id={`view-more-actions-${rowIndex}`}
                aria-controls="fade-menu"
                aria-haspopup="true"
                aria-expanded={isViewMoreOpen ? "true" : undefined}
                onClick={(e) => handleMenuClick(e)}
                theme={{ colorState: "#058FE7", display: true }}
                disabled={showChildrens || isAnyActionInProgress}
              >
                <MoreVertRounded />
              </ACTION_BUTTON>

              <VIEW_MORE
                id="fade-menu"
                anchorEl={viewMore.anchorEl}
                open={isViewMoreOpen}
                onClose={handleOnClose}
                TransitionComponent={Fade}
                MenuListProps={{ "aria-labelledby": "fade-button" }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                theme={{ display: isHideMenu ? "none" : "auto" }}
              >
                {menuActions.map(({ element, handlerProps }) => (
                  <MENU_BUTTON_WRAPPER>
                    {switchEl(element, handlerProps, quickActions.length)}
                  </MENU_BUTTON_WRAPPER>
                ))}
              </VIEW_MORE>
            </ACTION_BUTTON_WRAPPER>
          </Tooltip>
        </Fragment>
      ) : null}
    </WRAPPER>
  );
};

const WRAPPER = styled(Box)`
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ACTION_BUTTON_WRAPPER = styled(Box)`
  border-radius: 4px;
`;

const ACTION_BUTTON = styled(IconButton)`
  padding: 0.35em;
  margin: 0.35em 0.15em;

  &:hover {
    background-color: #d6eeff80;
  }

  & svg {
    width: 0.75em;
    height: 0.75em;
    color: #0282ff;
  }
`;

const MENU_BUTTON_WRAPPER = styled(Box)`
  width: 100%;
`;

const VIEW_MORE = styled(Menu)`
  display: ${({ theme }) => theme.display};

  & .MuiPaper-root {
    box-sizing: border-box;
    min-width: 15em;
    max-width: 30em;
  }

  & .MuiMenu-list {
    padding: 0em;
  }

  & .MuiButton-text {
    padding: 0.75em 1em;
  }
`;
