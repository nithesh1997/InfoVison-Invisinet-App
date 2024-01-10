import { Fade, Tooltip } from "@material-ui/core";

const ToolTip = ({ children, ...props }) => {
  return (
    <>
      <Tooltip
        arrow
        disableFocusListener
        // disableTouchListener
        enterDelay={100}
        enterNextDelay={100}
        leaveDelay={0}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        title={props.label}
        {...props}
      >
        {children}
      </Tooltip>
    </>
  );
};

export default ToolTip;
