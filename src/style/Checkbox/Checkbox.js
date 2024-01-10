import * as Mat from "@mui/material";
import { Square, SquareFill } from "react-bootstrap-icons";
import styled from "styled-components";

export const CheckBox = ({
  labelname = "",
  type = "",
  backgroundColor = "#0094FD",
  disabled = true,
  ...props
}) => {
  return (
    <div>
      {type === "squareFilled" ? (
        <StyledCheckBox
          icon={<Styled.StyledSquare />}
          checkedIcon={
            <Styled.StyledBoxOuter>
              <SquareFill />
            </Styled.StyledBoxOuter>
          }
        />
      ) : (
        <StyledCheckBox
          disabled={disabled}
          style={{ color: disabled ? "#F0F0F0" : backgroundColor }}
          backgroundColor={backgroundColor}
          //   {...initprops}
          {...props}
        />
      )}
    </div>
  );
};

const StyledCheckBox = styled(Mat.Checkbox)``;

const Styled = {
  StyledSquare: styled(Square)`
    height: 20px;
    width: 20px;
    color: #0074c7;
  `,
  SquareFilled: styled(SquareFill)`
    height: 0.7em;
    width: 0.7em;
    padding: 0;
    color: #0074c7;
    margin: 2.5px 2px 2px 2.5px;
  `,
  StyledBoxOuter: styled(Mat.Box)`
    height: 20px;
    width: 20px;
    border: 1px solid #0074c7;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0074c7;
    border-radius: 1.8px;
  `,
};
