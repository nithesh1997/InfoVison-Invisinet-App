import { Fade, Tooltip } from "@material-ui/core";
import React from "react";

const ToolerTip = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <Tooltip
        arrow
        disableFocusListener
        // disableTouchListener
        enterDelay={100}
        enterNextDelay={100}
        leaveDelay={0}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        {...props}
      >
        {children}
      </Tooltip>
    </React.Fragment>
  );
};

export default ToolerTip;
