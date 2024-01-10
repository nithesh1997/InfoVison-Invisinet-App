import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { Dialog } from "@mui/material";
import styled from "styled-components";

const Styled = {
  NoAlertTextWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 600px;
    height: 100%;
    @media (max-width: 768px) {
      width: 320px;
    }
    @media (max-width: 1024px) {
      width: 450px;
    }
    @media (max-width: 1200px) {
      width: 450px;
    }
  `,
  NoAlertText: styled(Typography)`
    font-size: 1em;
  `,
  PsuedoWrapper: styled(Box)`
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
      width: 0.5em;
      height: 0.5em;
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
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */
  `,
  NotificationModal: styled(Dialog)`
    & .MuiDialog-paper {
      width: 600px;
       &::-webkit-scrollbar-thumb {
        display: none;
      }
        &::-webkit-scrollbar-track {
          display: none;
        }
    }
    @media (max-width: 768px) {
      & .MuiDialog-paper {
        width: 320px;
         &::-webkit-scrollbar-thumb {
        display: none;
      }
        &::-webkit-scrollbar-track {
          display: none;
        }
      }
    @media (max-width: 1024px) {
      & .MuiDialog-paper {
          width: 450px;
           &::-webkit-scrollbar-thumb {
        display: none;
      }
        &::-webkit-scrollbar-track {
          display: none;
        }
      }
    @media (max-width: 1200px) {
      & .MuiDialog-paper {
            width: 450px;
             &::-webkit-scrollbar-thumb {
        display: none;
      }
        &::-webkit-scrollbar-track {
          display: none;
        }
      }
  `,
  NotificationPopupTitle: styled(Typography)`
    font-size: 1rem;
    line-height: 1.4em;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
    border-bottom: 1px solid rgba(2, 147, 254, 1);
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
  `,
  NotificationPopupContent: styled(Box)`
    display: flex;
    width: 100%;
    height: 500px;
    @media (max-width: 768px) {
      width: 100%;
      height: 280px;
    }
    @media (max-width: 1024px) {
      width: 100%;
      height: 400px;
    }
    @media (max-width: 1200px) {
      width: 100%;
      height: 400px;
    }
  `,
  CloseButton: styled(IconButton)`
    position: absolute;
    top: 1.8%;
    right: 1.8%;
    padding: 0.4rem;

    &:hover {
      background: #d6eeff60;
    }
  `,
};
export default Styled;
