import { Box, CircularProgress, IconButton } from "@mui/material";
import React from "react";
import styled from "styled-components";
import ToolTip from "../../../../../../../utils/Tooltip/Tooltip";

export const IconButtonX = ({
  payload,
  icon,
  disabled,
  setRunEffect,
  hyperLinkAddress,
  override,
  ToolTip,
}) => {
  return (
    <Styled.Tip title={ToolTip.message} arrow>
      <Styled.Button
        disabled={disabled}
        onClick={() => setRunEffect("READY")}
        {...hyperLinkAddress}
        {...override}
      >
        <Styled.IconWrapper>
          {payload.loading ? (
            <CircularProgress style={{ width: "1.5rem", height: "1.5rem" }} />
          ) : (
            icon
          )}
        </Styled.IconWrapper>
      </Styled.Button>
    </Styled.Tip>
  );
};

const Styled = {
  Button: styled(IconButton)`
    &.MuiButton-root {
      /* font-family: "Montserrat"; */
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: capitalize;
      display: flex;
      box-sizing: border-box;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
    }
  `,
  IconWrapper: styled(Box)`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    overflow: hidden;
  `,
  Tip: styled(ToolTip)``,
};
