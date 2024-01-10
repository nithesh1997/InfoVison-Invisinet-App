import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";
import ErrorLogo from "../../images/page_error_v2.svg";
function SelfContainedErrorComponent(props) {
  return (
    <StyledBox
      minHeight={props.minHeight === undefined ? "200px" : props.minHeight}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={ErrorLogo} alt={"Error"} width={"80px"} height={"80px"} />
      </div>
      <StyledText>
        <StyledTypography>{props.errorHeading}</StyledTypography>
        <StyledTypographyTwo>{props.errorMessage}</StyledTypographyTwo>
      </StyledText>
    </StyledBox>
  );
}

export default SelfContainedErrorComponent;

const StyledBox = styled(Box)`
  min-height: ${(props) => props.minHeight};
  width: 100%;
  border-radius: 0.5em;
  box-shadow: 0em 0em 1em 0em rgba(240, 40, 80, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5em;
`;
const StyledTypography = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  padding: 1em 0;
  text-align: center;
`;
const StyledTypographyTwo = styled(Typography)`
  font-size: 12px;
  text-align: center;
`;
const StyledText = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
