import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ToolTip from "../../../../../../../utils/Tooltip/Tooltip";
import React from "react";
import styled from "styled-components";

export const TextButton = ({
  payload,
  icon,
  disabled,
  setRunEffect,
  hyperLinkAddress,
  override,
  name,
  ToolTip,
}) => {
  return (
    <Styled.Tip title={ToolTip.message} arrow>
      <Styled.Button
        variant="outlined"
        startIcon={
          <Styled.IconWrapper>
            {payload.loading ? (
              <CircularProgress style={{ width: "1.5rem", height: "1.5rem" }} />
            ) : (
              icon
            )}
          </Styled.IconWrapper>
        }
        disabled={disabled}
        onClick={() => setRunEffect("READY")}
        {...hyperLinkAddress}
        {...override}
      >
        <Styled.Text>{name}</Styled.Text>
      </Styled.Button>
    </Styled.Tip>
  );
};

const Styled = {
  Button: styled(Button)`
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
  Text: styled(Typography)``,
  Tip: styled(ToolTip)``,
};
