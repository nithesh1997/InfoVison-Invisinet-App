import { Typography } from "@material-ui/core";
import { Box, LinearProgress, linearProgressClasses } from "@mui/material";
import React from "react";
import styled from "styled-components";

function ProgressIndicator({ variant = "determinate", label = "Description" }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <BorderLinearProgress
          variant={variant}
          value={variant === "determinate" && 40}
        />
        <Typography>{label}</Typography>
      </Box>
    </Box>
  );
}

export default ProgressIndicator;

const BorderLinearProgress = styled(LinearProgress)`
  width: 480px;
  height: 2px;
  background: #e1e1e1;
  "& .${linearProgressClasses.bar}": {
    border-radius: 1;
    background-color: #1a90ff;
  }
`;
