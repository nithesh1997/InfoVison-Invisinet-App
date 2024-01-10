import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#8fdc6a",
        border: "1px solid rgba(0,0,0,.25)",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: "1px solid rgba(0,0,0,.25)",
    borderRadius: "2rem",
    opacity: 1,
    backgroundColor: "#C1C4CE",
  },
  checked: {},
}))(Switch);

export default function CustomizedSwitches(props) {
  return (
    <Typography component="div">
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>
          <AntSwitch {...props} />
        </Grid>
      </Grid>
    </Typography>
  );
}
