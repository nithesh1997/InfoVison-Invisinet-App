import { Typography } from "@material-ui/core";
import styled from "styled-components";

export const ErrorCell = styled(Typography)`
  display: ${({ type }) => (type === "error" ? "flex" : "none")};
  /* font-family: montserrat; */
  color: crimson;
  background: #dc143c10;
  font-size: 0.8rem;
  font-weight: 600;
  display: grid;
  place-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  padding: 1em 1em;
`;
