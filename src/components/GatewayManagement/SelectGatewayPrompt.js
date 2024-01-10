import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import OverlayContext from "../AppContent/AppOverlayContext";

const SelectGatewayPrompt = () => {
  const [promptOpened, setPromptOpened] = useState(true);
  const AppOverlayContext = useContext(OverlayContext);

  useEffect(() => {
    window.sessionStorage.getItem("ba-selected-gateway") !== null &&
      setPromptOpened(false);
  }, [window.sessionStorage.getItem("ba-selected-gateway")]);

  const closePrompt = () => {
    setPromptOpened(false);
  };

  const PromptWrapper = styled.div`
    position: absolute;
    z-index: 29;
    background: rgba(0, 0, 0, 0.4);
    width: 100vw;
    height: 100vh;
    display: grid;
    visibility: ${promptOpened ? "visible" : "hidden"};
  `;

  const Prompt = styled(Box)`
    position: absolute;
    bottom: 20%;
    right: 10%;
    z-index: 30;
    background: #f9f9f9;
    width: 400px;
    height: 200px;
    border-radius: 12px;
    padding: 12px 16px;
  `;

  const PromptHeader = styled(Box)`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: calc(1px / 10) solid grey;
  `;

  const PromptCloseIcon = styled(HighlightOffRoundedIcon)`
    color: #e11d48;
    cursor: pointer;
  `;

  const PromptText = styled(Typography)`
    /* font-family: "Courier New", Courier, monospace; */
    font-weight: 600;
    margin: 12px 0px;
  `;

  return (
    <PromptWrapper>
      <Prompt>
        <PromptHeader>
          <PromptText>Note! </PromptText>
          <PromptCloseIcon onClick={closePrompt} />
        </PromptHeader>
        <PromptText>Please select a gateway to view this data.</PromptText>
        <PromptText>
          If you have already selected one, please try refreshing the page.
        </PromptText>
      </Prompt>
    </PromptWrapper>
  );
};

export default SelectGatewayPrompt;
