import {
  Box,
  Button,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";

const Styled = {
  WidgetBox: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    width: 100%;
    background-color: ${(props) => props.bg};
    border-radius: 0.5em;
    box-shadow: 0em 0em 3em ${(props) => props.boxShadow};
    height: 360px;
  `,

  WidgetHeader: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    width: 100%;
    padding: 0.5em 0.75em 0.5em 1.5em;
  `,

  WidgetHeading: styled(Typography)`
    flex: 1 0 auto;
    max-width: 75%;

    font-weight: 600;
    font-size: 1.1em;
    line-height: 1.4em;
    text-align: left;
    word-break: break-all;
    color: ${(props) => props.color};
  `,

  WidgetToolBar: styled(Typography)`
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* margin-left: 1em; */
  `,

  IconButton: styled(IconButton)`
    padding: 0.35em;

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
  ToggleWrapper: styled(Box)`
    margin-right: 1em;
    width: 150px;
    height: 28px;
    border-radius: 0.2em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2em;
    background: #14386840;
    box-shadow: inset 0px 0px 16px -10px;
  `,
  Link: styled(Link)`
    font-family: Inter;
    box-shadow: 0px 0px 16px -10px;
    font-size: 0.8rem;
    border-radius: 0.2em;
    padding: 0.1em 0.4em;
    text-decoration: none;
    cursor: pointer;

    font-weight: 600;
    color: ${({ theme }) => (theme.isToggleActive ? `#333` : `#4B5563`)};
    background: ${({ theme }) =>
      theme.isToggleActive ? `#f9fafb` : `#f9fafb00`};

    &:hover {
      text-decoration: none;
    }
  `,
  Toggle: styled(Button)`
    && {
      font-size: 0.8em;
      height: 28px;
      width: 128px;
      text-transform: capitalize;
      border-color: rgba(2, 147, 254, 1);
    }

    padding: 0.25em;

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    &.Mui-checked:hover {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.2);
    }

    & .MuiSvgIcon-root {
      width: 0.85em;
      height: 0.85em;
    }

    & .MuiSvgIcon-root {
      fill: rgba(2, 147, 254, 1);
    }
  `,
};

export default Styled;
