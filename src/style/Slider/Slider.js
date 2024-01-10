import * as React from "react";
import * as Mat from "@mui/material";

export function Slider() {
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Mat.Box sx={{ width: 450 }}>
      <Mat.Grid container spacing={2} alignItems="center">
        <Mat.Grid item xs>
          <Mat.Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
          />
        </Mat.Grid>
        <Mat.Grid item>{value}</Mat.Grid>
      </Mat.Grid>
    </Mat.Box>
  );
}
