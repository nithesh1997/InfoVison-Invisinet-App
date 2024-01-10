import { Box } from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  Container: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    position: relative;
    width: 100%;
  `,

  TitleBox: styled(Box)`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 60%;
    padding: 0.5em 1em 0em 1.75em;
    font-weight: 600;
    font-size: 1.25em;
    color: #212529;
  `,

  TitleBreadcrumb: styled(Box)`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 60%;
    padding: 0em 1em 0em 2.25em;
    font-weight: 500;
    font-size: 1em;
    color: #6c757d;
  `,
};

export default Styled;
