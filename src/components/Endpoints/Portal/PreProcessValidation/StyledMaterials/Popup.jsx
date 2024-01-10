import { Box } from "@material-ui/core";
import styled from "styled-components";
import { preProcessValidation } from "../../../../../utils/GeneralComponentNames";

export const Popup = ({ children }) => {
  return (
    <Styled.Wrapper id={`${preProcessValidation}-modal`}>
      {children}
    </Styled.Wrapper>
  );
};

const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  `,
};
