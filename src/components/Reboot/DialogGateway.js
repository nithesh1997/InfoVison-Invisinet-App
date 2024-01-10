import { Box, Button, Typography } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";

const DialogGateway = ({
  gatewayType,
  handleClose,
  onContinuehandler,
  confirm,
}) => {
  const { gatewayConfig } = useSelector((state) => state);
  const [isTACServer, setIsTACServer] = useState(
    gatewayConfig.chassis_model === "5010",
  );

  useEffect(() => {
    setIsTACServer(gatewayConfig.chassis_model === "5010");
  }, [gatewayConfig.chassis_model]);

  return (
    <Fragment>
      {dialogBox(
        gatewayType,
        confirm,
        handleClose,
        onContinuehandler,
        isTACServer,
      )}
    </Fragment>
  );
};

export default DialogGateway;

function dialogBox(
  gatewayType,
  confirm,
  handleClose,
  onContinuehandler,
  isTACServer,
  zAxis,
) {
  if (confirm === "load") {
    return (
      <StyledBox>
        <ClipLoader size="10em" color="#0094FD" overlay="z-index" />
        <StyledTypography>{gatewayType.gatewayName}</StyledTypography>
      </StyledBox>
    );
  } else if (confirm === "alertSuccess") {
    return (
      <StlBoxConfirm>
        <StyledTypographyConfrim>
          Successfully {gatewayType.gatewayConfirm}ed{" "}
          {isTACServer ? "controller" : "invisigate"}
        </StyledTypographyConfrim>
        <StyledBtnOkay variant="outlined" onClick={handleClose}>
          Okay{" "}
        </StyledBtnOkay>
      </StlBoxConfirm>
    );
  } else if (confirm === "failure") {
    return (
      <StlBoxConfirm>
        <StyledTypographyConfrim>
          Sorry, couldn't {gatewayType.gatewayConfirm}{" "}
          {isTACServer ? "controller" : "invisigate"}. Please try again.
        </StyledTypographyConfrim>
        <StyledBtnOkay variant="outlined" onClick={handleClose}>
          Okay{" "}
        </StyledBtnOkay>
      </StlBoxConfirm>
    );
  } else {
    return;
  }
}

const StyledBox = styled(Box)`
  background-color: #fff;
  border-radius: 0.3em;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
  width: 500px;
  min-width: 30em;
`;

const StlBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 500px;
  border-radius: 0.5em;
  padding: 1.5em;
`;

const StlBoxConfirm = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 400px;
  border-radius: 0.5em;
  padding: 1.5em;
`;

const StyledTypography = styled(Typography)`
  font-size: 1em;
  padding: 0.4em;
  margin-top: 1em;
`;

const StyledTypographyConfrim = styled(Typography)`
  font-size: 1em;
  margin: auto;
  & .hdr {
    font-size: 1.5em;
  }
`;
const StyledButtonGrp = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;
const StyledBtnCancel = styled(Button)`
  width: 100px;
  margin-left: 2em;
  border-color: crimson;
  color: crimson;
  &:hover {
    background: none;
    border-color: crimson;
  }
`;
const StyledBtnOkay = styled(Button)`
  width: 100px;
  background: #0094fd;
  /* font-family: Montserrat; */
  color: #fff;
  margin-top: 1em;
  font-weight: 500;
  &:hover {
    background: #0094fd;
  }
`;
const StyledBtnContinue = styled(Button)`
  width: 100px;
  background: #0094fd;
  /* font-family: Montserrat; */
  color: #fff;
  font-weight: 500;
  &:hover {
    background: #0094fd;
  }
`;
