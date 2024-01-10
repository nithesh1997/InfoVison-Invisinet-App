import * as Mat from "@mui/material";
import styled from "styled-components";

export const Radio = ({
  labelName = "",
  backgroundColor = "",
  value = "",
  disabled = false,
  ...props
}) => {
  return (
    <>
      {" "}
      <Mat.FormControlLabel
        label={labelName}
        value={value}
        control={
          <StyledRadio
            disabled={disabled}
            style={{ color: disabled ? "#BABABA" : backgroundColor }}
            {...props}
          />
        }
      />
    </>
  );
};

const StyledRadio = styled(Mat.Radio)``;
