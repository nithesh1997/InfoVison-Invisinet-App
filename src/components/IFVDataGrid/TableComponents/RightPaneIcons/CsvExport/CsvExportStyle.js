import { Box, Typography, CircularProgress } from "@material-ui/core";
import styled from "styled-components";
// import * as Mat from "@material-ui/core";

const Styled = {
  UploadFileModalContainer: styled(Box)`
    min-width: 550px;
    min-height: 320px;
  `,
  UploadFileModalBody: styled(Box)`
    width: 100%;
    display: grid;
    place-items: center;
  `,
  UploadFileModalHeader: styled(Box)`
    width: 100%;
    padding: 1rem;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    display: flex;
    justify-content: space-between;
  `,
  FileUplaodStatusTable: styled(Box)`
    width: 100%;
    padding: 1rem;
    display: grid;
    place-items: center;
  `,
  UploadFileSpinner: styled(Box)`
    width: 100%;
    display: grid;
    place-items: center;
    padding: 4.5rem;
  `,
  Spinner: styled(CircularProgress)`
    width: 180px !important;
    height: 180px !important;

    & .MuiCircularProgress-circleIndeterminate {
      stroke-width: 1;
    }

    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
  UploadFileSpinnerLogo: styled(Box)`
    width: 100%;
  `,
  UploadFileSpinnerText: styled(Box)`
    width: 100%;
  `,
  ModalContainer: styled(Box)`
    min-width: 500px;
    min-height: 480px;
    border-radius: 1em;
  `,
  ModalHeader: styled(Box)`
    width: 100%;
    padding: 1rem;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    display: flex;
    justify-content: space-between;
  `,
  Title: styled(Typography)`
    font-size: 1rem;
    font-weight: 700;
    color: rgb(2, 147, 254);
  `,
  Icon: styled(Box)`
    cursor: pointer;
  `,
  ModalBody: styled(Box)`
    width: 100%;
    display: grid;
    place-items: center;
    padding: 4.5rem;
  `,
  UploadSection: styled(Box)`
    width: 400px;
    min-height: 280px;
    border-style: dotted;
    border-radius: 0.5em;
    border-color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    row-gap: 30px;
  `,
  UploadIcon: styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(0, 0, 0, 0.87);
    font-size: 0.875rem;
    font-weight: 600;
  `,
  UploadFileDescription: styled(Box)`
    width: 80%;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
  `,
  SelectFile: styled(Box)`
    display: flex;

    input {
      width: 70%;
      margin: 0 auto;
      display: none;
    }
  `,
  UploadFileStatus: styled(Box)`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    p {
      font-size: 0.875rem;
      font-weight: 400;
      color: rgb(220, 20, 60);
    }
  `,
  FileBtn: styled.label`
    color: #ffffff;
    font-weight: bold;
    background: #0094fd;
    text-align: center;
    color: white;
    padding: 0.5rem 1.8rem 0.5rem 1.8rem;
    border-radius: 0.3rem;
    font-size: 0.875rem;
    cursor: pointer;
    display: block;
    &:hover {
      background: #0074c7;
    }
  `,
  UploadFileSection: styled(Box)`
    width: 100%;
    text-align: center;

    p {
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }
  `,
  UploadFile: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 2rem;
  `,

  FileErrorMessage: styled(Box)`
    font-size: 0.75rem;
    font-weight: 400;
    color: rgb(220, 20, 60);
  `,

  ErrorHandling: styled(Box)`
    width: 100%;
    /* display: grid;
    place-items: center; */
    padding: 2rem;
    color: rgb(220, 20, 60);
  `,
  TitleWrraper: styled(Box)`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    justify-content: center;
    align-items: flex-start;
    gap: 0.4rem;
    width: 100%;
    background: #ebf7ff;
    border-left: 0.2em solid #0094fd;
    border-radius: 0.25em;
    padding: 0.5em 1em;
  `,
  NameBox: styled(Box)``,
  NameText: styled(Typography)`
    font-size: 0.9rem;
    font-weight: 700;
  `,
};

export default Styled;
