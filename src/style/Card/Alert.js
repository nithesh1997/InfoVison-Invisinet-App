import React, { useState } from "react";
import { Alert } from "@mui/material";
import { Collapse } from "@mui/material";
import { Box } from "@mui/material";
export const GlobalAlert = ({ alertType, title, ...props }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert severity={alertType} onClose={handleClose} {...props}>
          {title}
        </Alert>
      </Collapse>
    </Box>
  );
};
