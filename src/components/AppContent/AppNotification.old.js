import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import { Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../apis/callAPI";
import { DeleteNotificationAPIResponder } from "../../apis/responders/delete-notification-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "./AppOverlayContext";
import NotificationCard from "./NotificationCard/NotificationCard";

const Styled = {
  NoAlertTextWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  `,
  NoAlertText: styled(Typography)`
    font-size: 1em;
  `,
};

const PsuedoWrapper = styled(Box)`
  overflow-x: hidden;
  height: 100%;
  width: 100%;

  overflow-y: scroll;
  overflow-y: overlay;

  /* Firefox */
  scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
  scrollbar-width: thin !important;
  /* Firefox */

  /* Chrome & Edge */
  &::-webkit-scrollbar {
    width: 0.35em;
    height: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 73, 122, 0);
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-track:hover {
    background: rgba(0, 73, 122, 0);
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.isHovered ? "rgba(119, 119, 119, 0.8)" : "rgba(119, 119, 119, 0)"};
    border-radius: 0.35em;
    opacity: 1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) =>
      theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
  }
  /* Chrome & Edge */
`;

const NotificationModal = styled(Dialog)`
  & .MuiDialog-paper {
    position: absolute;
    top: 4%;
    right: 15.5%;
  }
`;

const NotificationPopupTitle = styled(Typography)`
  font-size: 1em;
  line-height: 1.4em;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1.5em;
  border-bottom: 1px solid rgba(2, 147, 254, 1);
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
`;

const NotificationPopupContent = styled(Box)`
  display: flex;
  width: 500px;
  height: 500px;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 1.8%;
  right: 1.8%;
  padding: 0.4rem;

  &:hover {
    background: #d6eeff60;
  }
`;

const StyledViewMoreButton = styled(Button)`
  float: right;
  font-size: 0.85em;
  line-height: 0.85em;
  text-align: center;
  font-weight: 600;
  text-transform: capitalize;
  margin-right: 0.5em;
  margin-bottom: 0.25em;
  padding: 0.75em 1em;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }
`;

const StyledNotificationContentButtonBar = styled(Box)`
  display: flex;
  height: 45px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  flex: 1 0 auto;
  border-top: 0.1em solid rgba(2, 147, 254, 0.6);
`;

function AppNotification({
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
}) {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const AppOverlayContext = useContext(OverlayContext);

  const [alertLoading, setAlertLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [notificationModal, setNotificationModal] = AlertModal;
  const [alertContent, setAlertContent] = AlertContent;

  const [notificationData, setNotificationData] = NotificationData;

  const [isModalOpen, setIsModalOpen] = IsModalOpen;
  const [message, setMessage] = Message;

  useEffect(() => {
    handleClickOpen();
  }, []);

  /* Notification Function */
  const handleClickOpen = () => {};

  const handleClose = () => {
    closeDialog(false);
  };

  const DeleteNotificationOnCompleteHandler = (response, id, setLoading) => {
    if (response.state === "DELETE_NOTIFICATION_SUCESS") {
      setNotificationData(notificationData.filter((es) => es.id !== id));
    } else {
      setNotificationModal(true);
      setAlertContent({
        title: "ERROR!",
        text: (
          <>
            Error fetching notifications!
            <br />
            <br />
            Error Details:
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleDelete = (id, setLoading) => {
    callAPI({
      path: "",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: { id },
      responder: DeleteNotificationAPIResponder,
      onComplete: DeleteNotificationOnCompleteHandler,
      onCompleteArguments: [id, setLoading],
    });
  };

  return (
    <>
      <NotificationModal
        transparent={true}
        open={isDialogOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        hideBackdrop={true}
      >
        <NotificationPopupTitle id="alert-dialog-title">
          Notifications
        </NotificationPopupTitle>

        <CloseButton onClick={handleClose}>
          <CloseSharp fontSize="medium" />
        </CloseButton>

        <NotificationPopupContent>
          <PsuedoWrapper
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            theme={{ isHovered }}
          >
            {alertLoading ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>Loading...</Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : action.msgFlg ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>{message}</Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : !!!notificationData.length ? (
              <Styled.NoAlertTextWrapper>
                <Styled.NoAlertText>
                  Currently there are no notifcations!
                </Styled.NoAlertText>
              </Styled.NoAlertTextWrapper>
            ) : (
              notificationData.map((card) => {
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
          </PsuedoWrapper>
        </NotificationPopupContent>

        {notificationData.length > 10 && (
          <StyledNotificationContentButtonBar>
            <StyledViewMoreButton
              variant={"contained"}
              color={AppTheme.__default.dashboardStatWidgetViewMore.color}
              bg={AppTheme.__default.dashboardStatWidgetViewMore.bg}
              hoverBg={AppTheme.__default.dashboardStatWidgetViewMore.hoverBg}
              onClick={() => setIsModalOpen(true)}
            >
              View More
            </StyledViewMoreButton>
          </StyledNotificationContentButtonBar>
        )}
      </NotificationModal>
    </>
  );
}

export default AppNotification;
