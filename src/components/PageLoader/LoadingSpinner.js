/* eslint-disable no-whitespace-before-property */

import React from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const LoadingSpinner = (props) => {
  const override = css`
    border-width: ${props.borderWidth};
  `;

  return (
    <ClipLoader
      color={props.color}
      loading={props.loading}
      speedMultiplier={props.speedMultiplier}
      css={override}
      size="35vh"
    />
  );
};

export default LoadingSpinner;
