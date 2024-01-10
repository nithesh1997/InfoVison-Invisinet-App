import styled from "styled-components";
import Switch from "@material-ui/core/Switch";

let StyledAttrs = {
  root: "root",
  switchBase: "switchBase",
  thumb: "thumb",
  track: "track",
  checked: "checked",
  focusVisible: "focusVisible",
  disabled: "disabled",
};

export const GenericSwitch = styled(Switch).attrs(() => ({
  classes: StyledAttrs,
  disableRipple: true,
  focusVisibleClassName: "focusVisible",
}))`
  &.root {
    width: 28px;
    height: 16px;
    padding: 0;
    border-radius: 10px;
  }
  .switchBase {
    padding: 2px;
    color: #747474;
    &.checked {
      &.MuiSwitch-colorSecondary.Mui-disabled {
        color: #ffffff;
      }
      transform: translateX(12px);
      color: #ffffff;
      & + .track {
        background-color: ${(props) => props.backgroundcolor};
        opacity: 1;
        border: none;
      }
    }

    &.focusVisible &.thumb {
      color: red;
      border: 6x sold #fff;
    }
  }

  .thumb {
    width: 12px;
    height: 12px;
  }

  & .track {
    border: 1px solid #747474;
    border-radius: 2rem;
    opacity: 1;
    color: #747474;
    background-color: #e3e3e3;
  }

  .checked {
  }
  .focusVisible {
  }
  .disabled {
    &.MuiSwitch-colorSecondary.Mui-disabled {
      color: #f0f0f0;
    }
    &.MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track {
      background-color: #bababa;
    }
  }
`;
