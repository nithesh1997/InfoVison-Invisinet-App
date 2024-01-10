import styled from "styled-components";
import { Box } from "@material-ui/core";

export const PortalContent = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 1200px) {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
