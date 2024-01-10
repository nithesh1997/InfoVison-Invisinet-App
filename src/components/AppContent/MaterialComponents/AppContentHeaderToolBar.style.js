import { Badge, CircularProgress, IconButton } from "@material-ui/core";
import { Bell, BellFill } from "react-bootstrap-icons";
import Box from "@material-ui/core/Box";
import styled from "styled-components";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import { Divider } from "@mui/material";

const Styled = {
  IconWrapper: styled(Box)`
    box-sizing: border-box;
    position: relative;
    display: grid;
    place-items: center;
  `,
  NotificationButton: styled(IconButton)`
    padding: 0.3em;
    margin: 0.16em 0.4em;

    &.MuiIconButton-root {
      background: ${({ theme }) => {
        return theme.isPanel ? "rgba(2, 147, 254, 0.2)" : null;
      }};
    }

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    & .MuiTouchRipple-child {
      background: #0271ff;
    }
  `,
  NotificationBadge: styled(Badge)`
    &.MuiBadge-root {
      display: ${({ theme }) => theme.display};
      position: absolute;
      flex-shrink: 0;
      vertical-align: middle;
      top: 20%;
      right: 20%;
    }

    & .MuiBadge-badge {
      background: #0074c7;
      color: #fff;
    }
  `,
  UntouchedIcon: styled(Bell)`
    fill: ${({ theme }) => {
      return theme.isPanel ? "#0271ff" : "#0094FD";
    }};
  `,
  TouchedIcon: styled(BellFill)`
    fill: ${({ theme }) => {
      return theme.isPanel ? "#0271ff" : "#0094FD";
    }};
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-root {
      color: #fff;
    }
  `,

  User: styled(Box)`
    text-align: right;
    margin-left: 1.5rem !important;
    display: flex;
    float: right !important;

    & .loginuser {
      width: 35px;
      margin-right: 1rem !important;
      margin-left: 1rem !important;
    }

    & img {
      width: 100%;
      vertical-align: middle;
      border-radius: 50% !important;
    }

    & h5 {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      margin: 0px;
    }

    & .header_user_position {
      color: #a6a6a6;
      font-weight: 600;
      font-size: 12px;
      display: block;
    }
  `,
  SaveButton: styled(IconButton)`
    padding: 0.3em;
    margin: 0.16em 0.4em;

    &.MuiIconButton-root {
      background: ${({ theme }) => {
        return theme.isPanel ? "rgba(2, 147, 254, 0.2)" : null;
      }};
    }

    & .MuiTouchRipple-child {
      background: #0271ff;
    }
  `,
  SaveOutlinedIcon: styled(SaveOutlinedIcon)`
    &.MuiSvgIcon-root {
      font-size: 28px;
      color: #0094fd;
    }
  `,
  SaveSharpIcon: styled(SaveSharpIcon)`
    &.MuiSvgIcon-root {
      font-size: 28px;
      color: #0094fd;
    }
  `,
  Divider: styled(Divider)`
    &.MuiDivider-root {
      margin-top: 12px;
      margin-bottom: 12px;
    }
  `,
};

export default Styled;
