import React from "react";
import * as Mat from "@mui/material";
import { GenericSwitch } from "./Toggle.style";
const initProps = {
  disbaled: false,
};
export const Toggle = ({
  labelName = "",
  toggleName = "",
  backgroundcolor = "",
  ...props
}) => {
  return (
    <Mat.FormControl>
      <Mat.FormLabel component="legend">{labelName}</Mat.FormLabel>
      <Mat.Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <GenericSwitch
          backgroundcolor={!!!backgroundcolor ? "#0094FD" : backgroundcolor}
          {...initProps}
          {...props}
        />
        <Mat.Typography>{toggleName}</Mat.Typography>
      </Mat.Box>
    </Mat.FormControl>
  );
};
