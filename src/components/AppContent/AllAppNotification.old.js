import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import { Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../apis/callAPI";
import { deleteNotificationResponder } from "../../apis/responders/notification-api-responder";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "./AppOverlayContext";
import NotificationCard from "./NotificationCard/NotificationCard";

function AllAppNotification({
  isDialogOpened,
  handleCloseDialog,
  AllNotificationData,
  Show,
  NotificationAlertModal,
  RunEffect,
}) {
  const AppOverlayContext = useContext(OverlayContext);
  const [allNotificationData, setAllNotificationData] = AllNotificationData;

  const [noRowsText, setNoRowsText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [runEffect, setRunEffect] = RunEffect;

  const [notificationModal, setNotificationModal, setAlertContent] =
    NotificationAlertModal;

  const handleAllClose = () => handleCloseDialog(false);

  const DeleteNotificationOnCompleteHandler = (response, card) => {
    if (response.state === "DELETE_NOTIFICATION_SUCESS") {
      setAllNotificationData(
        allNotificationData.filter((es) => es.id !== card),
      );
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

    setTimeout(() => setIsDeleting(false), 500);
  };

  const handleDelete = (card) => {
    setIsDeleting(true);
    callAPI({
      path: "deletenotification",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: { id: card },
      responder: deleteNotificationResponder,
      onComplete: DeleteNotificationOnCompleteHandler,
      onCompleteArguments: [card],
    });
  };

  useEffect(() => {
    setNoRowsText("Loading...");
    setRunEffect("markAsReadForMoreAlerts");
  }, []);

  return (
    <NotificationModal
      open={isDialogOpened}
      onClose={handleAllClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <NotificationPopupTitle id="alert-dialog-title">
        Notifications
      </NotificationPopupTitle>

      <CloseButton onClick={handleAllClose}>
        <CloseSharp fontSize="medium" />
      </CloseButton>

      <NotificationPopupContent>
        <PsuedoWrapper
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          theme={{ isHovered }}
        >
          {noRowsText ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                // fontFamily: "",
              }}
            >
              <p style={{ fontSize: "1em" }}>{noRowsText}</p>
            </div>
          ) : (
            allNotificationData.map((card) => {
              return (
                <NotificationCard
                  key={card.id}
                  type={card.type}
                  message={card.message}
                  created_date={card.created_date}
                  isviewed={card.isviewed}
                  handleRemoveCard={() => handleDelete(card.id)}
                  isDeleting={isDeleting}
                />
              );
            })
          )}
        </PsuedoWrapper>
      </NotificationPopupContent>
    </NotificationModal>
  );
}

export default AllAppNotification;

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

  /*
  &::-webkit-scrollbar {
    display: none;
  }


  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
`;

const NotificationModal = styled(Dialog)`
  & .MuiDialog-paper {
    width: 600px;
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
  width: 100%;
  height: 500px;
  /* margin: 0.5rem 0 0 0; */
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

const NoCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #fff;

  width: 475px;
  padding: 1em;
  &.unread {
    background: #e8e8f2;
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

const NotificationCloseIcon = styled(IconButton)`
  display: inline-block;
  padding: 0.8rem;
  &:hover {
    background: #d6eeff60;
  }
`;
