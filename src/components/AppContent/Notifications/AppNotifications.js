import { CloseSharp } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Styled from "./MaterialComponents/AppNotifications.style";
import callAPI from "../../../apis/callAPI";
import { deleteNotificationResponder } from "../../../apis/responders/notification-api-responder";
import { useSelector } from "react-redux";
import Utility from "../../../redux/actions/Utility";
import NotificationCard from "./NotificationCard/NotificationCard";
import { notification } from "../../../utils/GeneralComponentNames";
import Style from "../../../style";
import { useTranslation } from "react-i18next";

function AppNotifications({
  action,
  AlertModal,
  AlertContent,
  closeDialog,
  isDialogOpened,
  IsModalOpen,
  NotificationData,
  RunEffect,
  Show,
  Message,
  openMoreNotificationsPanel,
  isOpens,
}) {
  const { t, i18n } = useTranslation();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const [isHovered, setIsHovered] = useState(false);
  const [notificationModal, setNotificationModal] = AlertModal;
  const [alertContent, setAlertContent] = AlertContent;
  const [notificationData, setNotificationData] = NotificationData;
  const [message, setMessage] = Message;
  const [isOpen, setIsOpen] = isOpens;

  useEffect(() => {
    handleClickOpen();
  }, []);

  /* Notification Function */
  const handleClickOpen = () => {};

  const handleClose = () => {
    closeDialog(false);
  };

  const DeleteNotificationOnCompleteHandler = (
    response,
    id,
    setLoading,
    setAnimate,
  ) => {
    if (response.state === "DELETE_NOTIFICATION_SUCCESS") {
      setNotificationData(notificationData.filter((es) => es.id !== id));
    } else {
      setNotificationModal(true);
      setAlertContent({
        title: `${t("commons.errorText")}!`,
        text: (
          <>
            {t("header.notification.prompt.action.delete.error.0")}!
            <br />
            <br />
            {t("header.notification.prompt.action.delete.error.1")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }
    setLoading(false);
    setAnimate(true);
  };

  const handleDelete = (id, setLoading, isLoading, setAnimate) => {
    callAPI({
      path: "deletenotification",
      params: { gatewayIP },
      data: { id },
      responder: deleteNotificationResponder,
      onComplete: DeleteNotificationOnCompleteHandler,
      onCompleteArguments: [id, setLoading, setAnimate],
    });
  };
  return (
    <>
      <Styled.NotificationModal
        transparent={true}
        open={isDialogOpened}
        onClose={isDialogOpened}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        hideBackdrop={true}
        disableBackdropClick
      >
        <Styled.NotificationPopupTitle id="alert-dialog-title">
          {t("header.notification.portal.title")}
          <Styled.CloseButton
            id="header-alert-panel-close-button"
            onClick={handleClose}
          >
            <CloseSharp fontSize="medium" />
          </Styled.CloseButton>{" "}
        </Styled.NotificationPopupTitle>

        <Styled.NotificationPopupContent>
          <Styled.PsuedoWrapper
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            theme={{ isHovered }}
          >
            {action.msgFlg ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>{message}</Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : !!!notificationData.length ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>
                  {t("header.notification.prompt.noNotifications")}!
                </Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : (
              notificationData.map((card) => {
                return (
                  <NotificationCard
                    id={card.id}
                    type={card.type}
                    message={card.message}
                    created_date={card.created_date}
                    isviewed={card.isviewed}
                    handleRemoveCard={handleDelete}
                  />
                );
              })
            )}
          </Styled.PsuedoWrapper>
        </Styled.NotificationPopupContent>

        {notificationData.length >= 29 && (
          <Styled.NotificationContentButtonBar>
            <Style.GenericButton
              id={`${notification}-bell-icon-button-view-all`}
              style={{ marginRight: "10px" }}
              backgroundColor={"primary"}
              buttonName={t("header.notification.portal.button.viewAll.name")}
              disabled={false}
              onClick={() => {
                openMoreNotificationsPanel();
                setIsOpen(false);
              }}
            />
          </Styled.NotificationContentButtonBar>
        )}
      </Styled.NotificationModal>
    </>
  );
}

export default AppNotifications;
