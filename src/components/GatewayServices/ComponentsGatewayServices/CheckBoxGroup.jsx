import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

function CheckBoxGroup({
  CheckBoxValue,
  setCheckBoxValue,
  checkChangePub,
  setCheckChangePub,
  checkChangeSub,
  setCheckChangeSub,
  checkBoxValueTwo,
  setCheckBoxValueTwo,
  setPublisherHelperText,
  isSpinner,
  publisherIP,
}) {
  return (
    <div style={{ display: "flex" }}>
      <FormControlLabel
        label="Publisher"
        value="Publisher IP"
        disabled={isSpinner}
        control={
          <StyledCheckBox
            checked={checkChangePub}
            value="Publisher IP"
            onChange={() => {
              setCheckChangePub(!checkChangePub);
            }}
          />
        }
      />

      <FormControlLabel
        label="Subscriber"
        value="Subscriber"
        disabled={isSpinner}
        control={
          <StyledCheckBox
            checked={checkChangeSub}
            value="Subscriber"
            onChange={(e) => {
              if (!e.target.checked) {
                setPublisherHelperText((oldState) => {
                  return oldState && publisherIP !== "Not Configured" ? (
                    <>
                      <p>
                        Enable <b>subcriber</b> and provide a valid IPv4 Address
                        with an optional prefix to configure <b>pub/sub</b>
                      </p>
                    </>
                  ) : (
                    ""
                  );
                });
              }
              setCheckBoxValue(e.target.value);
              setCheckChangeSub((oldState) => !oldState);
            }}
          />
        }
      />
    </div>
  );
}
export default CheckBoxGroup;

const StyledCheckBox = styled(Checkbox)`
  padding: 0.25em;

  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }

  &.Mui-checked:hover {
    background: rgba(2, 147, 254, 0.2);
  }

  & .MuiTouchRipple-child {
    background: rgba(2, 147, 254, 0.2);
  }

  & .MuiSvgIcon-root {
    width: 0.85em;
    height: 0.85em;
  }

  & .MuiSvgIcon-root {
    fill: rgba(2, 147, 254, 1);
  }
`;
