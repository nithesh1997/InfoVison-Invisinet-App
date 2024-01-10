import { CloseSharp } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import Styled from "./MaterialComponents/MoreAppNotifications.style";
import callAPI from "../../../apis/callAPI";
import { deleteNotificationResponder } from "../../../apis/responders/notification-api-responder";
import { useSelector } from "react-redux";
import Config from "../../../Config";
import Utility from "../../../redux/actions/Utility";
import OverlayContext from "../AppOverlayContext";
import NotificationCard from "./NotificationCard/NotificationCard";
import { useTranslation } from "react-i18next";

function MoreAppNotifications({
  action,
  AlertModal,
  AlertContent,
  closeDialog,
  isDialogOpened,
  IsModalOpen,
  AllNotificationData,
  RunEffect,
  Show,
  Message,
  AlertLoading,
}) {
  const { t, i18n } = useTranslation();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const [isHovered, setIsHovered] = useState(false);
  const [alertLoading, setAlertLoading] = AlertLoading;
  const [notificationModal, setNotificationModal] = AlertModal;
  const [alertContent, setAlertContent] = AlertContent;
  const [isModalOpen, setIsModalOpen] = IsModalOpen;
  const [message, setMessage] = Message;
  const [allNotificationData, setAllNotificationData] = AllNotificationData;

  useEffect(() => {
    handleClickOpen();
  }, []);

  /* Notification Function */
  const handleClickOpen = () => {};

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const DeleteNotificationOnCompleteHandler = (
    response,
    id,
    setLoading,
    setAnimate,
  ) => {
    if (response.state === "DELETE_NOTIFICATION_SUCCESS") {
      setAllNotificationData(allNotificationData.filter((es) => es.id !== id));
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
        open={isModalOpen}
        onClose={isModalOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Styled.NotificationPopupTitle id="alert-dialog-title">
          {t("header.notification.portal.title")}
        </Styled.NotificationPopupTitle>

        <Styled.CloseButton
          id={`view-more-alerts-close-button`}
          onClick={handleClose}
        >
          <CloseSharp fontSize="medium" />
        </Styled.CloseButton>

        <Styled.NotificationPopupContent>
          <Styled.PsuedoWrapper
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            theme={{ isHovered }}
          >
            {alertLoading ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>
                  {t("commons.loadingText")}...
                </Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : action.msgFlg ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>{message}</Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : !!!allNotificationData.length ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>
                  {t("header.notification.prompt.noNotifications")}!
                </Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : (
              allNotificationData.map((card) => {
                return (
                  <NotificationCard
                    key={card.id}
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
      </Styled.NotificationModal>
    </>
  );
}

export default MoreAppNotifications;
