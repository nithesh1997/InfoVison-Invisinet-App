import React, { useContext } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import ImageBanner from "../General/ImageBanner";
import ErrorLogo from "../../images/page_error_v2.svg";
import { ErrorContext } from "../../components/AppContent/ErrorOverlayContext";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { Images } from "../../NamedImages/NamedImages";

const ErrorBoundaryDiv = () => {
  const { errorText, errorDescription } = useContext(ErrorContext);

  return (
    <StyledBox>
      <StyledImages>
        <ImageBanner src={Images.invisinetLogo} alt={"InvisiNet"} height={36} />
        <StyledErrorLogo src={ErrorLogo} alt={"Error"} width={"130"} />
      </StyledImages>
      <StyledTextBox>
        <StyledErrorText>{errorText}</StyledErrorText>
        <StyledErrorDescription>{errorDescription}</StyledErrorDescription>
        <div style={{ padding: "1.6em 0 0 0" }}>
          <GenericButton
            disabled={false}
            width={"9em"}
            backgroundColor={"primary"}
            buttonName={"Get Support"}
            onClick={() => {
              window.open("mailto:support@invisinet.net");
            }}
          />
        </div>
      </StyledTextBox>
    </StyledBox>
  );
};
export default ErrorBoundaryDiv;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10em 0 0 0;
  box-sizing: border-box;
`;
const StyledTextBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledErrorLogo = styled(ImageBanner)`
  padding: 4em 0 0 0;
  margin: 0 0 0 1em;
`;
const StyledImages = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledErrorText = styled(Typography)`
  font-size: 2em;
  /* font-family: Montserrat; */
  font-weight: 700;
`;
const StyledErrorDescription = styled(Typography)`
  /* font-family: Montserrat; */
  font-size: 12px;
  font-weight: 500;
  color: black;
  padding: 2em 0 0 0;
  text-align: center;
  max-width: 90%;
`;
const StyledButton = styled(Button)`
  /* font-family: Montserrat; */
  background: #018ff6;
  color: #ffffff;
  width: 150px;
  margin: 3em 0 0 0;
  text-transform: capitalize;
  padding: 0.75em 1em;
  font-size: 0.85em;
  &:hover {
    background: #0b5ed7;
  }
`;
