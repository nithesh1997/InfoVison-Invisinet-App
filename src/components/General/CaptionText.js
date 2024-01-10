/* eslint-disable no-whitespace-before-property */

import React from "react";
/*import styled from "styled-components";*/
import Typography from "@material-ui/core/Typography";

const NormalText = (props) => {
  return (
    <Typography
      className={props.className}
      align={"left"}
      color={props.color}
      display={"block"}
      noWrap={true}
      variant={"caption"}
    >
      {props.text}
    </Typography>
  );
};

export default NormalText;
