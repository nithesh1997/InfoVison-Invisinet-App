import { Box } from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  StyledSkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 0em 0em 0em;
  `,
  StyledBox: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    width: 100%;

    & .IFV-DataGrid-root {
      margin-top: -2.5em;
    }

    & .IFV-DataGrid-table-content-row-cell .MuiOutlinedInput-input {
      padding: 2em 1.2em 1.4em 1.2em !important;
    }
  `,
};

export default Styled;
