import React from "react";
import styled from "styled-components";
import Styled from "./MaterialComponents/RestoreConfigurationModal.style";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Box } from "@mui/material";
import zip_2 from "../../images/zip_2.svg";

const DropOrChooseFile = ({
  accept,
  onChange,
  onDrop,
  onDragOver,
  fileName,
  dragged,
  filesFlag,
  filesTypename,
  filesChangeText,
  filesError,
  buttonName,
  filesSize,
  fileSize,
}) => {
  return (
    <Styled.Rectangle id="drop_zone" onDrop={onDrop} onDragOver={onDragOver}>
      <Styled.IconBox>
        <Styled.IconWrapper>
          {filesFlag ? (
            <Styled.ImageBanner src={zip_2} />
          ) : (
            <CloudDownloadIcon style={{ color: "#0094fd", fontSize: 55 }} />
          )}
        </Styled.IconWrapper>
        <Box>
          <Styled.Typography>{filesTypename}</Styled.Typography>
          {filesChangeText ? (
            <>
              <Styled.Typography>
                Select configuration to upload{" "}
              </Styled.Typography>
              <Styled.Typography>(.tgz or tar bal) </Styled.Typography>
              <Styled.Typography>Max size:60 MB </Styled.Typography>
              <Styled.OrTypography>Or</Styled.OrTypography>
            </>
          ) : null}

          {filesSize ? (
            <Styled.StyledTypographySize>
              <Styled.FileSizeText>{fileSize}</Styled.FileSizeText>
            </Styled.StyledTypographySize>
          ) : null}
          <p
            style={{
              margin: "1em auto",
              textAlign: "center",
              fontSize: "12px",
              color: "crimson",
            }}
          >
            {filesError}
          </p>
        </Box>
      </Styled.IconBox>
      <Styled.FileBtnBox>
        <input
          type="file"
          style={{ display: "none" }}
          id="contained-button"
          accept={accept}
          onChange={onChange}
        />
        <Styled.FileBtn
          style={{
            display: "inline-block",
            textAlign: "center",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.3rem",
            fontSize: "14px",
            cursor: "pointer",
          }}
          htmlFor="contained-button"
        >
          {buttonName}
        </Styled.FileBtn>
      </Styled.FileBtnBox>
      {dragged ? (
        <>
          <Styled.SuccessResponse> Selected file: </Styled.SuccessResponse>
          <div style={{ color: "green", fontWeight: "bold" }}>{fileName}</div>
        </>
      ) : null}
    </Styled.Rectangle>
  );
};

export default DropOrChooseFile;
