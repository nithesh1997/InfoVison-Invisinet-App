import { Typography } from "@material-ui/core";
import styled from "styled-components";

export const HELPER = styled(Typography)`
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  font-weight: 500;
  color: ${({ textColor }) => textColor || "#F9F9F9"};
  /* font-family: "Montserrat"; */
`;
