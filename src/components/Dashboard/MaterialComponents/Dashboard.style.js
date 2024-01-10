import { Box } from "@material-ui/core";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

const Styled = {
  Container: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    @media (max-width: 320px) {
      margin-top: 2em;
    }
  `,

  WidgetContainer: styled(Grid)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin: 0em;
    margin-top: 0.25em;
    padding: 0em 1em 1em 1em;
    width: calc(100% + 0px);
  `,
};

export default Styled;
