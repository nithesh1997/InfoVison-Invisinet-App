import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { Dialog, DialogContent } from "@mui/material";
import styled from "styled-components";

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
      position: absolute;
      top: 4%;
      right: 14.6%;
      &::-webkit-scrollbar-thumb {
        background-color: #fff;
      }
      &::-webkit-scrollbar-track {
        background-color: #fff;
      }
    }
    @media (max-width: 768px) {
      & .MuiDialog-paper {
        position: absolute;
        top: 3%;
        right: 27%;
        &::-webkit-scrollbar-thumb {
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
      }
    }
    @media (max-width: 1024px) {
      & .MuiDialog-paper {
        position: absolute;
        top: 3%;
        right: 20.5%;
        &::-webkit-scrollbar-thumb {
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
      }
    }
    @media (max-width: 1200px) {
      & .MuiDialog-paper {
        position: absolute;
        top: 3%;
        right: 19.5%;
        &::-webkit-scrollbar-thumb {
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
      }
    }
    @media (min-width: 1920px) {
      & .MuiDialog-paper {
        position: absolute;
        top: 2.5%;
        right: 10.4%;
        &::-webkit-scrollbar-thumb {
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
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
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1000;
  `,
  NotificationPopupContent: styled(Box)`
    display: flex;
    width: 500px;
    height: 450px;
    @media (max-width: 768px) {
      width: 350px;
      height: 350px;
    }
    @media (max-width: 1024px) {
      width: 450px;
      height: 400px;
    }
    @media (max-width: 1200px) {
      width: 450px;
      height: 400px;
    }
  `,
  CloseButton: styled(IconButton)`
    position: absolute;
    top: 22.4%;
    right: 1.8%;
    padding: 0.4rem;
    background-color: #fff;
    &:hover {
      background: #d6eeff60;
    }
  `,
  ViewMoreButton: styled(Button)`
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
  `,
  NotificationContentButtonBar: styled(Box)`
    display: flex;
    height: 45px;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
    flex: 1 0 auto;
    border-top: 0.1em solid rgba(2, 147, 254, 0.6);
    position: sticky;
    bottom: 0;
    background-color: #fff;
  `,
};

export default Styled;
