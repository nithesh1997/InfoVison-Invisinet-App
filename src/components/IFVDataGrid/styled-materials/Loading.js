import { Box } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export const Loading = ({ children }) => {
  return <LoaderWrapper>{children}</LoaderWrapper>;
};

const LoaderWrapper = styled(Box)`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`;
