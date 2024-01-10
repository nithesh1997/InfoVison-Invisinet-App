import { Typography } from "@mui/material";
import { Cell } from "../../styled-materials/Cell";

const classNames = `IFV-DataGrid-table-content-row-cell-default-view-state`;

export const RenderCell = ({ className, value, alignment, row, elementId }) => {
  return (
    <Cell
      id={elementId}
      alignment={alignment}
      className={`${classNames} ${className}`}
      // dangerouslySetInnerHTML={{
      //   __html: value ?? value.toString().replace(/\n/g, "<br />"),
      // }}
    >
      <Typography style={{ fontFamily: "Inter" }}>{value ?? ""}</Typography>
    </Cell>
  );
};
