import { IconButton } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ExitToAppRounded, Person } from "@material-ui/icons";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";
import { MenuItem, Select, Tooltip } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Styled from "./MaterialComponents/AppContentHeaderToolBar.style";
import callAPI from "../../apis/callAPI";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import {
  getAllNotificationResponder,
  getNotificationResponder,
  updateNotificationResponder,
} from "../../apis/responders/notification-api-responder";
import Config from "../../Config";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import Auth from "../../redux/actions/Auth";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "./AppOverlayContext";
import NotificationAlertModal from "./NotificationAlertModal/NotificationAlertModal";
import AppNotifications from "./Notifications/AppNotifications";
import MoreAppNotifications from "./Notifications/MoreAppNotifications";
import styled from "styled-components";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppMenuContext from "./AppMenuContext";
import ToolerTip from "../IFVDataGrid/styled-materials/ToolerTip";
import { useTranslation, Trans } from "react-i18next";
import { SaveGatewayConfigAPIResponder } from "../../apis/responders/config-managment-api-responder";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";

const initAction = { disable: true, failApi: false, msgFlg: false };

const langs = {
  en: { nativeName: "English" },
  es: { nativeName: "Spanish" },
};

const asUTC = (param) => {
  const _ = (d) => (d.toString().length === 1 ? "0" + d : d);
  const date = _(param.getUTCDate());
  const month = _(param.getUTCMonth() + 1);
  const year = _(param.getUTCFullYear());
  const hour = _(param.getUTCHours());
  const minutes = _(param.getUTCMinutes());
  const seconds = _(param.getUTCSeconds());

  return new Date(`${year}-${month}-${date} ${hour}:${minutes}:${seconds}`);
};

const captailizer = (user) => {
  let Check = user;
  Check = !!!Check ? "unknown" : Check;
  return Check.split(" ")
    .map((_) => _[0].toUpperCase() + _.slice(1, _.length))
    .join(" ");
};

const HeaderToolBar = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { gatewayConfig } = useSelector((state) => state);
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const { role } = useSelector((state) => state.userProfile);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [logspin, setLogSpin] = useState(true);
  const [notifyLoading, setNotifyLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [bellIcon, setBellIcon] = useState(true);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState(initAction);
  const [show, setShow] = useState([]);

  const [runEffect, setRunEffect] = useState("");
  const [markAsReadDelay, setMarkAsReadDelay] = useState(1000 * 10);
  const [notificationData, setNotificationData] = useState([]);

  const [notificationModal, setNotificationModal] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", text: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);

  const [allNotificationData, setAllNotificationData] = useState([]);
  const [allNotifmessage, setAllNotifMessage] = useState("");
  const [allNotifAction, setAllNotifAction] = useState(initAction);
  const [allNotifShow, setAllNotifShow] = useState([]);
  const [runEffectLoding, setRunEffectLoding] = useState("NEUTRAL");
  const [saveIcon, setSaveIcon] = useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [errorResponse, setErrorResponse] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const MenuContext = useContext(AppMenuContext);

  let sessionName = sessionStorage.getItem("sessionName");

  const markAsLoading = () => {
    setNotifyLoading(true);
  };

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  /* Logout Function */
  const logOut = () => {
    callAPI({
      path: "logout",
      params: {},
      data: {},
      responder: logoutApiResponder,
      onComplete: onCompleteLogoutHandler,
    });

    setLogSpin(false);
  };

  const setRecentGatewayAddress = useCallback(() => {
    dispatch(setRecentGateway({ address: gatewayIP }));
  }, [dispatch, gatewayIP]);

  const onCompleteLogoutHandler = (responder) => {
    if (responder.state === "LOGOUT_SUCESS") {
      setTimeout(() => {
        Auth.logOut(
          props,
          AppConfig,
          props.setShowSignIn,
          AppOverlayContext,
          props.RunEffect,
          props.isLoggedOut,
          setRecentGatewayAddress,
        );
      }, AppConfig.app.signOutDelay);
    } else {
      setLogSpin(true);
      alert(t(`header.logout.action.error.logoutFailed`));
    }
  };

  const cformatDate = (param) => {
    const _ = (d) => (d.toString().length === 1 ? "0" + d : d);
    const date = _(param.getDate());
    const month = _(param.getMonth() + 1);
    const year = _(param.getFullYear());
    const hour = _(param.getHours());
    const minutes = _(param.getMinutes());
    const seconds = _(param.getSeconds());

    return `${month}/${date}/${year} ${hour}:${minutes}:${seconds}`;
  };

  const timeDiff = useCallback((date) => {
    var seconds = Math.floor((asUTC(new Date()) - date) / 1000);

    var interval = seconds / 86400;

    if (isNaN(interval)) {
      return "" + date;
    }

    if (interval < 0) {
      return "" + cformatDate(date);
    }

    if (interval > 1) {
      return "" + cformatDate(date);
    }

    interval = seconds / 3600;

    if (interval === 1) {
      return Math.floor(interval) + " hour ago";
    } else if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }

    interval = seconds / 60;

    if (interval === 1) {
      return Math.floor(interval) + " minute ago";
    } else if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
  }, []);

  /* Get More Notifications */
  const onCompleteAllNotification = useCallback(
    (responder) => {
      let data = [];
      data = responder.data;

      if (responder.state === "GET_ALL_NOTIFICATION_SUCESS") {
        if (!!data.length) {
          setAllNotificationData((oldState) => {
            const newState = data.map((row) => {
              return {
                ...row,
                created_date: timeDiff(new Date(row.created_date)),
              };
            });

            return newState;
          });

          setAllNotifShow(data.filter(({ isviewed }) => !!!isviewed));
          setRunEffect("markAsReadForMoreAlerts");
        } else {
          setAllNotifAction((oldState) => ({
            ...oldState,
            failApi: false,
            msgFlg: true,
          }));
          setAllNotifMessage(
            `${t("header.notification.prompt.noNotifications")}!`,
          );
        }
      } else {
        setAllNotifAction((oldState) => ({
          ...oldState,
          failApi: true,
          msgFlg: true,
        }));
        setAllNotifMessage(
          <>
            {t("header.notification.prompt.action.fetch.error.0")}!
            <br />
            <br />
            {t("header.notification.prompt.action.fetch.error.1")}:
            <br />
            {Utility.getErrorsFromResponse(responder)}
          </>,
        );
      }

      setAlertLoading(false);
    },
    [timeDiff],
  );

  const openMoreNotificationsPanel = () => {
    setIsModalOpen(true);

    if (
      !!!allNotificationData.length ||
      allNotificationData.map(({ isviewed }) => isviewed).includes(0)
    ) {
      setRunEffect("getMoreNotifications");
    }
  };

  useEffect(() => {
    if (runEffect === "getMoreNotifications" && gatewayIP) {
      setAlertLoading(true);
      callAPI({
        path: "getallnotifications",
        params: { gatewayIP },
        data: {},
        responder: getAllNotificationResponder,
        onComplete: onCompleteAllNotification,
      });
    }
  }, [gatewayIP, onCompleteAllNotification, runEffect]);

  /* Get Minimal Notifications */
  const onCompleteNotification = useCallback(
    (responder) => {
      let data = [];
      data = responder.data;
      setBellIcon(true);
      setTimeout(() => {
        setRunEffectLoding("RECURSE");
      }, 1000 * 10);
      if (
        responder.state === "GET_NOTIFICATION_SUCESS" &&
        responder.data !== ""
      ) {
        if (!!data.length) {
          setNotificationData((oldState) => {
            const newState = data.map((row) => {
              return {
                ...row,
                created_date: timeDiff(new Date(row.created_date)),
              };
            });

            return newState;
          });
          setShow(data.filter(({ isviewed }) => !!!isviewed));
          setAction((oldState) => ({
            ...oldState,
            failApi: false,
            msgFlg: false,
          }));
        } else {
          setAction((oldState) => ({
            ...oldState,
            failApi: false,
            msgFlg: true,
          }));
          setNotificationData((oldState) => {
            return [];
          });
          setShow(data.filter(({ isviewed }) => !!!isviewed));
          setMessage(`${t("header.notification.prompt.noNotifications")}!`);
        }
      } else {
        setAction((oldState) => ({ ...oldState, failApi: true, msgFlg: true }));
        setMessage(
          <>
            {t("header.notificaiton.prompt.action.fetch.error.0")}!
            <br />
            <br />
            {t("header.notificaiton.prompt.action.fetch.error.1")}:
            <br />
            {Utility.getErrorsFromResponse(responder)}
          </>,
        );
      }
    },
    [timeDiff],
  );

  const handleNotificationClick = (event) => {
    const $ = notificationData.filter(({ isviewed }) => !!!isviewed).length;

    setIsOpen((oldState) => {
      !oldState && !!$ && setRunEffect("markAsRead");
      return !oldState;
    });
  };

  /* RESPONSE HANDLER FOR UPDATE NOTIFICATION */
  const onCompleteUpdateNotification = useCallback(
    (response, isMoreAlerts = false) => {
      if (response.state === "UPDATE_NOTIFICATION_SUCESS") {
        isMoreAlerts
          ? setAllNotificationData((oldState) => {
              const newState = oldState.map((row) => {
                return {
                  ...row,
                  isviewed: row.isviewed === 0 ? 1 : row.isviewed,
                };
              });

              setAllNotifShow(() => {
                return oldState
                  .filter(({ isviewed }) => !!!isviewed)
                  .map(({ id }) => id);
              });

              setNotifyLoading(false);

              return newState;
            })
          : setNotificationData((oldState) => {
              const newState = oldState.map((row) => {
                return {
                  ...row,
                  isviewed: row.isviewed === 0 ? 1 : row.isviewed,
                };
              });

              setShow(() => {
                return oldState
                  .filter(({ isviewed }) => !!!isviewed)
                  .map(({ id }) => id);
              });

              setNotifyLoading(false);

              return newState;
            });
      }
      setRunEffect("");
    },
    [],
  );

  //30 second interval to update new notifications
  useEffect(() => {
    if (gatewayIP) {
      if (runEffectLoding === "NEUTRAL" || runEffectLoding === "RECURSE") {
        setRunEffectLoding("");
        setBellIcon(false);
        callAPI({
          path: "getnotifications",
          params: { gatewayIP },
          data: {},
          responder: getNotificationResponder,
          onComplete: onCompleteNotification,
        });
      }
    }
  }, [runEffectLoding, gatewayIP, onCompleteNotification]);

  /* MARK AS READ */
  useEffect(() => {
    const isAnyUnreadAlerts = notificationData
      .map(({ isviewed }) => isviewed)
      .includes(0);

    const isAnyUnreadAlerts2 = allNotificationData
      .map(({ isviewed }) => isviewed)
      .includes(0);

    if (isAnyUnreadAlerts && runEffect === "markAsRead") {
      const ids = notificationData
        .filter(({ isviewed }) => !!!isviewed)
        .map(({ id }) => id);

      /* fix isviewed */
      const isviewed = notificationData
        .filter(({ isviewed }) => !!!isviewed)
        .map(({ isviewed }) => isviewed)
        .includes(1)
        ? Number(false)
        : Number(true);

      setTimeout(() => {
        callAPI({
          path: "updatenotifications",
          params: { gatewayIP },
          data: { ids, isviewed: 1 },
          responder: updateNotificationResponder,
          onComplete: onCompleteUpdateNotification,
        });
      }, markAsReadDelay);
    }

    if (isAnyUnreadAlerts2 && runEffect === "markAsReadForMoreAlerts") {
      const ids = allNotificationData
        .filter(({ isviewed }) => !!!isviewed)
        .map(({ id }) => id);

      /* fix isviewed */
      const isviewed = notificationData
        .filter(({ isviewed }) => !!!isviewed)
        .map(({ isviewed }) => isviewed)
        .includes(1)
        ? Number(false)
        : Number(true);

      setTimeout(() => {
        callAPI({
          path: "updatenotifications",
          params: { gatewayIP },
          data: { ids, isviewed },
          responder: updateNotificationResponder,
          onComplete: onCompleteUpdateNotification,
          onCompleteArguments: [true],
        });
      }, markAsReadDelay);
    }

    return () => setRunEffect("");
  }, [
    AppOverlayContext.selectedGateway.address,
    allNotificationData,
    isOpen,
    markAsReadDelay,
    notificationData,
    onCompleteUpdateNotification,
    runEffect,
    gatewayIP,
  ]);

  const SaveConfigOnCompleteHandler = (response, id) => {
    if (response.state === "GATEWAY_CONFIG_SUCESS") {
      setDialogOpen(true);
      setResponseMessage(t("commons.successMessages.configuration"));
      setSaveIcon(true);
    } else {
      setDialogOpen(true);
      setErrorResponse(true);
      setResponseMessage(
        <>
          {t("commons.errorMessages.configuration")}
          <br />
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );
    }
    setSaveIcon(false);
  };

  const handleSaveConfig = () => {
    callAPI({
      path: "save-config",
      params: { gatewayIP },
      data: {},
      responder: SaveGatewayConfigAPIResponder,
      onComplete: SaveConfigOnCompleteHandler,
      onCompleteArguments: [],
    });
  };
  const console =
    gatewayConfig.chassis_model === "5010" ? "Controller" : "Invisigate";

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <StyledWrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledSelect
            style={{ display: "none" }}
            labelId="language-select-label"
            id="language-select"
            value={i18n.resolvedLanguage}
            variant={`filled`}
            label=""
          >
            {Object.keys(langs).map((lang) => {
              return (
                <MenuItem
                  key={lang}
                  style={{
                    fontWeight:
                      i18n.resolvedLanguage === lang ? "bold" : "normal",
                  }}
                  type="submit"
                  onClick={() => i18n.changeLanguage(lang)}
                  value={lang}
                >
                  {langs[lang]["nativeName"]}
                </MenuItem>
              );
            })}
          </StyledSelect>
          <Styled.Divider orientation="vertical" flexItem />

          <ToolerTip
            title={t("header.Savebutton.tooltip", { console: console })}
          >
            <Styled.IconWrapper>
              <Styled.SaveButton disabled={saveIcon} onClick={handleSaveConfig}>
                <Styled.SaveOutlinedIcon />
              </Styled.SaveButton>
            </Styled.IconWrapper>
          </ToolerTip>

          <Styled.Divider orientation="vertical" flexItem />

          <Styled.IconWrapper
            key={`${window.location.pathname}${AppOverlayContext.selectedGateway.address}`}
          >
            <Tooltip
              title={t("header.notification.button.tooltip")}
              style={{ zIndex: "3000" }}
            >
              <Styled.NotificationButton
                id={`alerts-button`}
                onClick={handleNotificationClick}
                theme={{ isPanel: isOpen }}
                disabled={!bellIcon}
              >
                {action.failApi ? (
                  <NotificationImportantOutlinedIcon
                    style={{ fontSize: "1.3em", fill: "#ff4a4a" }}
                  />
                ) : (
                  <>
                    {isOpen ? (
                      <Styled.TouchedIcon
                        theme={{ isPanel: isOpen, disabled: !bellIcon }}
                      />
                    ) : (
                      <Styled.UntouchedIcon theme={{ isPanel: isOpen }} />
                    )}
                  </>
                )}

                <Styled.NotificationBadge
                  theme={{ display: !action.failApi ? "inline-flex" : "none" }}
                  badgeContent={
                    bellIcon ? (
                      notificationData.filter(({ isviewed }) => !!!isviewed)
                        .length
                    ) : (
                      <Styled.Spinner
                        style={{ width: "10px", height: "10px" }}
                      />
                    )
                  }
                />
              </Styled.NotificationButton>
            </Tooltip>

            <AppNotifications
              NotificationData={[notificationData, setNotificationData]}
              AlertModal={[notificationModal, setNotificationModal]}
              AlertContent={[alertContent, setAlertContent]}
              RunEffect={[runEffect, setRunEffect]}
              IsModalOpen={[isModalOpen, setIsModalOpen]}
              Show={[show, setShow]}
              action={action}
              Message={[message, setMessage]}
              isOpens={[isOpen, setIsOpen]}
              openMoreNotificationsPanel={openMoreNotificationsPanel}
              isDialogOpened={isOpen}
              closeDialog={() => setIsOpen(false)}
            />

            <MoreAppNotifications
              AllNotificationData={[
                allNotificationData,
                setAllNotificationData,
              ]}
              AlertLoading={[alertLoading, setAlertLoading]}
              AlertModal={[notificationModal, setNotificationModal]}
              AlertContent={[alertContent, setAlertContent]}
              IsModalOpen={[isModalOpen, setIsModalOpen]}
              action={allNotifAction}
              Show={[allNotifShow, setAllNotifShow]}
              Message={[allNotifmessage, setAllNotifMessage]}
              isDialogOpened={isOpen}
              closeDialog={() => setIsOpen(false)}
            />

            <NotificationAlertModal
              divider={false}
              open={notificationModal}
              setOpen={setNotificationModal}
              contentTitle={alertContent.title}
              contentText={alertContent.text}
              contentInfo={""}
              agreeTitle={t("commons.okayText")}
              handleAgree={() => setNotificationModal(false)}
              handleDisagree={() => setNotificationModal(false)}
            />
          </Styled.IconWrapper>

          <Styled.Divider orientation="vertical" flexItem />

          <StyledBox>
            <Styled.User>
              <h5>
                {captailizer(sessionName)}
                <span class="header_user_position">{captailizer(role)}</span>
              </h5>

              <div class="loginuser mx-3">
                <IconButton
                  id={`profile-preferences-button`}
                  style={{ backgroundColor: "#ddd", padding: "0.35em" }}
                >
                  <Person style={{ fontSize: "0.85em" }} />
                </IconButton>
              </div>

              <i class="bi bi-chevron-down"></i>
            </Styled.User>
            <Styled.Divider orientation="vertical" flexItem />
            <ToolerTip title={t("header.logout.button.tooltip")}>
              <Box
                display={"flex"}
                justifyContent={"flex-end"}
                alignContent={"center"}
              >
                <IconButton id={`logout-button`} onClick={logOut}>
                  {logspin ? <ExitToAppRounded /> : <ClipLoader size="1em" />}
                </IconButton>
              </Box>
            </ToolerTip>
          </StyledBox>
        </div>

        <StyledBoxHam
          onClick={() => {
            MenuContext.setShow(!MenuContext.show);
            MenuContext.setBackdrop(true);
            if (!MenuContext.collapsed) {
              Object.values(MenuContext.setSubMenuCollapsed).forEach((fn) => {
                fn(true);
              });
            }
            MenuContext.setCollapsed(false);
          }}
        >
          <MenuRoundedIcon style={{ color: "#203865" }} />
        </StyledBoxHam>
      </StyledWrapper>

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        contentTitle={
          errorResponse
            ? t("commons.errorAlertTitle")
            : t("commons.TaskCompleted")
        }
        contentText={responseMessage}
        handleAgree={handleDialogClose}
        agreeTitle={t("commons.okayText")}
      />
    </>
  );
};

export default withRouter(withCookies(HeaderToolBar));

const StyledBox = styled(Box)`
  @media (max-width: 320px) {
    display: none;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledWrapper = styled(Box)`
  @media (min-width: 321px) and (max-width: 640px) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    width: 88%;
  }

  @media (max-width: 320px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 40%;
  }
`;

const StyledBoxHam = styled(Box)`
  display: none;

  @media (max-width: 320px) {
    display: flex;
  }

  @media (min-width: 321px) and (max-width: 640px) {
    display: flex;
  }
`;

const StyledSelect = styled(Select)`
  &.MuiFilledInput-root {
    height: 32px;
    padding-bottom: 16px;
    border-radius: 8px;
    margin: 0 1rem 0 0;
  }

  &.MuiFilledInput-root::before {
    border-bottom: none;
  }

  &.MuiInputBase-root
    .MuiFilledInput-root
    .MuiSelect-root:hover
    :not(.Mui-disabled)::before {
    border-bottom: none;
  }
`;
