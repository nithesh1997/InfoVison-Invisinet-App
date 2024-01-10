import { Badge, Box, Button, IconButton } from "@material-ui/core";
import { style, typography } from "@mui/system";
import styled from "styled-components";

export const Styled = {
  StyledContainer: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex-grow: 1;
    flex-wrap: nowrap;
    height: 100%;
    max-height: calc(100vh - 4.25em);
    overflow: auto;
  `,
  StyledButton: styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    font-size: 0.85em;
    line-height: 0.85em;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 1em;
    border-radius: 0.35em;

    & .MuiButton-startIcon > *:first-child {
      font-size: 1.1em;
      line-height: 1.1em;
    }
  `,
  StyledDataGridBox: styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    width: 100%;
    padding: 0.5em 1.25em 0.5em 2.25em;
  `,
  StyledIconBadge: styled(Badge)`
    color: rgb(2, 147, 254);

    & .MuiBadge-root > svg {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiBadge-badge {
      background-color: rgb(2, 147, 254);
      border: 0.15em solid #fff;
      padding: 0.2em;
      width: auto;
      height: auto;
      border-radius: 1em;
      min-width: auto;
      min-height: auto;
      bottom: 0.2em;
      right: 0.1em;
    }

    & .MuiBadge-badge .MuiSvgIcon-root {
      font-size: 0.65em;
      color: white;
    }
  `,
  StyledSkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 1em 1em 0em;
  `,
  IconButton: styled(IconButton)`
    padding: 0.35em;

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};
