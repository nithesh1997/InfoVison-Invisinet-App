/* eslint-disable no-whitespace-before-property */
import React, { useEffect } from "react";
import styled from "styled-components";
const Banner = (props) => {
  return (
    <img
      className={props.className}
      src={props.src}
      width={props.width}
      height={props.height}
      alt={props.alt}
      title={props.title}
    />
  );
};

export default Banner;
