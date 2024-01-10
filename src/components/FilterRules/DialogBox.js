import { Box, Button, Typography } from "@material-ui/core";
import styled from "styled-components";

export const DialogBox = ({ model, setModel }) => {
  // const closeModel = (event) => {
  //   if (event.target.id === "backdrop") {
  //     setModel((prev) => ({
  //       ...prev,
  //       dialog: false,
  //     }));
  //   }
  // };
  // const closeModel2 = () => {
  //   setModel((prev) => ({
  //     ...prev,
  //     dialog: false,
  //   }));
  // };
  const cancel = () => {
    setModel((prev) => ({
      ...prev,
      dialog: false,
    }));
    model.cancelHandler(...model.cancelHandlerArgs);
  };
  const continueHandler = () => {
    setModel((prev) => ({
      ...prev,
      dialog: false,
    }));
    model.confirmHandler(...model.confirmHandlerArgs);
  };
  return (
    <Backdrop id="backdrop" dropOff={model.dialog}>
      <StyledDiv>
        <StyledTypography>
          The filter rule will be deleted before saving with new information. If
          save fails after delete, this rule will no longer be accessible. Are
          you sure you want to proceed ??
        </StyledTypography>
        <StyledButton>
          <BtnContinue
            variant="outlined"
            color="primary"
            onClick={continueHandler}
          >
            Continue
          </BtnContinue>
          <BtnCancel variant="outlined" color="primary" onClick={cancel}>
            Cancel
          </BtnCancel>
        </StyledButton>
      </StyledDiv>{" "}
    </Backdrop>
  );
};

const Backdrop = styled(Box)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  display: ${(props) => (props.dropOff ? "grid" : "none")};
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
`;
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 500px;
  border-radius: 0.5em;
  padding: 1.5em;
`;
const StyledTypography = styled(Typography)`
  /* font-family: Montserrat; */
  text-align: center;
  font-weight: 300;
  font-size: 1em;
`;
const StyledButton = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: space-evenly;
  padding: 0.8em;
`;
const BtnContinue = styled(Button)`
  width: 100px;
  background: #0094fd;
  /* font-family: Montserrat; */
  color: #fff;
  font-weight: 500;
  &:hover {
    background: #0094fd;
  }
`;
const BtnCancel = styled(Button)`
  width: 100px;
  margin-left: 2em;
  border-color: crimson;
  color: crimson;
  &:hover {
    background: none;
    border-color: crimson;
  }
`;
