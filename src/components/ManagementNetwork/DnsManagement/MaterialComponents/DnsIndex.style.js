import { Box } from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  HeaderWrapper: styled(Box)`
    height: 64px;
    padding: 0rem 0rem;
  `,
  Wrapper: styled(Box)`
    width: 100%;
    height: 100vh;
    padding: 0rem 0.5rem 0rem 0.5rem;
  `,
  SummaryWrapper: styled(Box)`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    flex-direction: row;
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column-reverse;
    }
    @media (max-width: 1024px) {
      display: flex;
      flex-direction: column-reverse;
    }
    @media (max-width: 1200px) {
      display: flex;
      flex-direction: column-reverse;
    }
  `,
};

export default Styled;
