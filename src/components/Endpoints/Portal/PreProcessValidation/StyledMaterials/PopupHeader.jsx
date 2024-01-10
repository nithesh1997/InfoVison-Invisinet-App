import React from "react";
import { CloseRounded } from "@material-ui/icons";
import { Box, IconButton, Typography } from "@material-ui/core";
import styled from "styled-components";
import { preProcessValidation } from "../../../../../utils/GeneralComponentNames";

export const PopupHeader = ({ title, onClose }) => {
  return (
    <>
      <Styled.Wrapper>
        <Styled.TitleWrapper>
          <Styled.Title>{title}</Styled.Title>
        </Styled.TitleWrapper>

        <Styled.ClosePopupWrapper>
          <Styled.ClosePopupButton
            id={`${preProcessValidation}-close-button`}
            children={<CloseRounded />}
            onClick={onClose}
          />
        </Styled.ClosePopupWrapper>
      </Styled.Wrapper>
      <Styled.BottomBorder />
    </>
  );
};

const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    min-height: 68px;
    max-height: 68px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2em;
  `,
  TitleWrapper: styled(Box)``,
  Title: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
    color: #0295fe;
  `,
  ClosePopupWrapper: styled(Box)``,
  ClosePopupButton: styled(IconButton)``,
  BottomBorder: styled(Box)`
    border: 1px solid #0295fe;
  `,
};
