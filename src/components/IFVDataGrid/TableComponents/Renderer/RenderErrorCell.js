import React from "react";
import { ErrorCell } from "../../styled-materials/ErrorCell";

export const RenderErrorCell = ({ className = "", value, type = "error" }) => {
  return (
    <ErrorCell type={type} className={className}>
      {value}
    </ErrorCell>
  );
};
