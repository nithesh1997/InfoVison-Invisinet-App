import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

export const GlobalNotification = ({ content, ...props }) => {
  const [openModal, setOpenModal] = useState(true);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Styled.Modal
      open={openModal}
      onClose={handleClose}
      transparent={true}
      hideBackdrop={true}
      {...props}
    >
      <Styled.Box>{content}</Styled.Box>
    </Styled.Modal>
  );
};

const Styled = {
  Modal: styled(Modal)``,

  Box: styled(Box)`
    position: absolute;
    top: 8%;
    right: 15.8%;
    width: auto;
    height: auto;
    background-color: #ffffff;
    border: none;
    outline: none;
    border-radius: 2;
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.1),
      0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    @media (min-width: 1920px) {
      position: absolute;
      top: 6%;
      right: 13%;
    }
  `,
};
