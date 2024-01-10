import React from "react";
import { ActionWrapper } from "./ActionWrapper";
import { Spinner } from "./Spinner";
import styled from "styled-components";
import { Box } from "@material-ui/core";

export const AsyncIcon = ({ inProgress, children }) => {
  return (
    <ActionWrapper>
      <React.Fragment>{children}</React.Fragment>

      <SpinnerWrapper inProgress={inProgress}>
        <Spinner size={20} />
      </SpinnerWrapper>
    </ActionWrapper>
  );
};

const SpinnerWrapper = styled(Box)`
  position: absolute;
  width: calc(100% + 2em);
  height: 100%;
  margin: 0em 0em 1.2em 0em;
  display: flex;
  display: ${({ inProgress }) => (inProgress ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  background: #f7fcff;
`;
