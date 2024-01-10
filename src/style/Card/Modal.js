import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

export const GlobalModal = ({ Content, ...props }) => {
  const [openModal, setOpenModal] = useState(true);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <Styled.Modal open={openModal} onClose={handleClose} {...props}>
      <Styled.Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "auto",
          height: "auto",
          backgroundColor: "#FFFFFF",
          border: "none",
          outline: "none",
          borderRadius: 2,
          boxShadow:
            "0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13)",
        }}
      >
        {Content}
      </Styled.Box>
    </Styled.Modal>
  );
};

const Styled = {
  Modal: styled(Modal)``,
  Box: styled(Box)`
    @media (max-width: 768px) {
      background: red;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: auto;
      /* max-height: 400px; */
      background-color: #ffffff;
      border: none;
      outline: none;
      border-radius: 2;
      // overflow:scroll;
      box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.1),
        0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    }

    @media (max-width: 1024px) {
      background: red;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: auto;
      /* max-height: 400px; */
      background-color: #ffffff;
      border: none;
      outline: none;
      border-radius: 2;
      // overflow:scroll;
      box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.1),
        0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    }
  `,
};

const BoxStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#FFFFFF",
  border: "none",
  outline: "none",
  borderRadius: 2,
  boxShadow:
    "0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13)",
};
