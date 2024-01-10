import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { EditRounded } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";
import styled from "styled-components";

const Styled = {
  DoneIcon: styled(DoneIcon)`
    fill: rgba(2, 147, 254, 8);
  `,
  EditRounded: styled(EditRounded)`
    fill: rgba(2, 147, 254, 8);
  `,
  StyledSkeletonHolder: styled(Box)`
    padding: 1em 0em;
  `,
  StyledWrapper: styled(Box)`
    padding: 1em 1em 3em 1.5em;
    margin: 1em 0em;
  `,
  Styledtable: styled.table`
    /* font-family: Montserrat; */
    border-collapse: collapse;
    width: 100%;
  `,
  StyledBoxHead: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  StyledButton: styled(Button)`
    /* font-family: Montserrat; */
    font-weight: bold;
    background: #018ff6;
    color: #ffffff;
    width: 92px;
    text-transform: capitalize;

    &:hover {
      background: #0b5ed7;
    }
    &:disabled {
      color: white;
      opacity: 0.6;
    }
  `,
  StyledButtonEdit: styled(IconButton)`
    border-radius: 100%;
    margin: 0em 0.1em;
    padding: 0.35em;

    &:hover {
      background: rgba(2, 147, 254, 0.1);
    }
  `,
  StyledButtonDelete: styled(IconButton)`
    border-radius: 100%;
    margin: 0em 0.1em;
    padding: 0.35em;
    color: rgb(237, 20, 61);

    &:hover {
      background: rgb(237, 20, 61, 0.1);
    }
  `,
  StyledText: styled(Typography)`
    font-weight: 600;
    /* font-family: Montserrat; */
  `,
  StyleTableContainer: styled(Box)`
    padding: 1em 0 0 0;
  `,
  BtnGroup: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  StyledTdAddress: styled.td`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px 16px;
  `,
  StyledTdBtn: styled.td`
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px 16px;
  `,
  StyledTh: styled.th`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 1em;
    background: #eff2f7;
    width: 90%;
  `,
  StyledThAction: styled.th`
    border: 1px solid #dddddd;
    padding: 1em;
    background: #eff2f7;
    text-align: center;
  `,
  StyledTextField: styled(TextField)`
    margin: 0.5em 0;
  `,
  StyledClipLoaderContainer: styled(Box)`
    margin: 0.5em 0em;
  `,
  ErrorMsg: styled(Box)`
    color: #dc143c;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 2em;
  `,
};

export default Styled;
