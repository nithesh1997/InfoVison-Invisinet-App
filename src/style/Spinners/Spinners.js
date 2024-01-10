import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Styled } from "./spinners.style";
import { Typography } from "@material-ui/core";

function Spinners({ size = 20, label = "Loading..." }) {
  return (
    <Styled.BoxWrapper
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Styled.Wrapper>
        <CircularProgress
          variant="determinate"
          style={{
            color: "#E3E3E3",
          }}
          size={size}
          thickness={4}
          value={100}
        />
        <Styled.CircularProgressInner
          variant="indeterminate"
          disableShrink
          size={size}
          thickness={4}
        />
      </Styled.Wrapper>
      <Styled.Typo>
        <Typography>{label}</Typography>
      </Styled.Typo>
    </Styled.BoxWrapper>
  );
}

export default Spinners;
