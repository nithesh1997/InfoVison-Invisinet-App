import { Box, Divider, FormControlLabel, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Radio } from "../../../style/Radio/Radio";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import { useSelector } from "react-redux";

export const ContextToggle = ({
  toggleTitle,
  selectedValue,
  handleChange,
  isSwitchDisabled,
}) => {
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  return gatewayConfig.chassis_model !== "5010" ? (
    <>
      <Styled.Wrapper>
        <Styled.ToggleTitleWrapper>
          <Styled.ToggleTitle children={toggleTitle} />
        </Styled.ToggleTitleWrapper>

        <Styled.ToggleWrapper>
          <Radio
            labelName="bump0"
            value="bump0"
            id={`${gatewayServices}-context-bump-toggle-switch`}
            checked={selectedValue === "bump0"}
            onChange={handleChange}
            name="radio-buttons"
            inputProps={{ "aria-label": "BUMP0" }}
            disabled={isSwitchDisabled}
          />

          <Radio
            labelName="mgt"
            value="mgt"
            id={`${gatewayServices}-context-mgt-toggle-switch`}
            checked={selectedValue === "mgt"}
            onChange={handleChange}
            name="radio-buttons"
            inputProps={{ "aria-label": "MGT" }}
            disabled={isSwitchDisabled}
          />
        </Styled.ToggleWrapper>
      </Styled.Wrapper>

      <Styled.Divider />
    </>
  ) : null;
};

const Styled = {
  Wrapper: styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 1em;
    height: 52px;
  `,
  ToggleTitleWrapper: styled(Box)`
    margin: 0 1rem 0 0;
  `,
  ToggleTitle: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-weight: 600;
  `,
  ToggleWrapper: styled(Box)``,
  BUMP0: styled(Radio)`
    &.MuiRadio-root {
    }

    &.MuiRadio-root:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    &.MuiRadio-colorSecondary.Mui-checked {
      color: #0293f3;
    }

    & .Mui-disabled {
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.4);
    }
  `,
  MGT: styled(Radio)`
    &.MuiRadio-root {
    }

    &.MuiRadio-root:hover {
      background: rgba(2, 147, 254, 0.1);
    }

    &.MuiRadio-colorSecondary.Mui-checked {
      color: #0293f3;
    }

    & .Mui-disabled {
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0.4);
    }
  `,
  Divider: styled(Divider)``,
};
