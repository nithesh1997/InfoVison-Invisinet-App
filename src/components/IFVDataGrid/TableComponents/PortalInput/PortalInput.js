/* Component Modules */
import { Box, IconButton } from "@material-ui/core";
import SettingsBackupRestoreSharpIcon from "@material-ui/icons/SettingsBackupRestoreSharp";
import React from "react";
import styled from "styled-components";
import ToolerTip from "../../styled-materials/ToolerTip";
import { key } from "./defaults/key";
/* Component Modules */
/* Styled Components Wrapped with Material UI */
import { CONTENT_WRAPPER } from "./styled-materials/CONTENT_WRAPPER";
import { HELPER } from "./styled-materials/HELPER";
import { HELPER_CONTAINER } from "./styled-materials/HELPER_CONTAINER";
import { HELPER_WRAPPER } from "./styled-materials/HELPER_WRAPPER";
import { INPUT_WRAPPER } from "./styled-materials/INPUT_WRAPPER";
import { AbstractSwitch } from "./variants/AbstractSwitch";

/* Default Values incase they don't provide any */

const Input = (props) => {
  /****************************************************************************/
  const [keyPress, setKeyPress] = React.useState({ key: "" });
  /****************************************************************************/
  const [inputState, setInputState] = props.InputState;
  const [inputColorState, setInputColorState] = props.InputColorState;
  const [inputFlagState, setInputFlagState] = props.InputFlagState;
  const [
    handleHoverEnter,
    handleHoverLeave,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    handlerClear,
    handleOk,
    handleValidation,
  ] = props.InputHandlerState;
  /****************************************************************************/
  const [helperState, setHelperState] = props.HelperState;
  const [helperColorState, setHelperColorState] = props.HelperColorState;
  /****************************************************************************/
  const [savePoint, setSavePoint] = props.SavePoint;
  const [dirtyRow, setDirtyRow] = props.DirtyRow;
  const [keyProp, setKeyProp] = props.KeyProp;
  /****************************************************************************/

  const setStore = {
    setKeyProp,
    setKeyPress,
    setInputState,
    setInputColorState,
    setInputFlagState,
    setHelperState,
    setHelperColorState,
    setSavePoint,
    setDirtyRow,
  };

  React.useEffect(() => {
    setInputState((prevState) => ({
      ...prevState,
      dirtyValue: prevState.value,
    }));
  }, []);

  return (
    <CONTENT_WRAPPER>
      <INPUT_WRAPPER>
        <AbstractSwitch
          /* Base Attributes */
          key={keyProp}
          id={inputState.id}
          name={inputState.name}
          className={`${inputState.className}-input`}
          disabled={inputFlagState.isDisabled}
          /* Accessability */
          label={inputState.label}
          /* Type */
          type={inputState.type}
          variant={"outlined"}
          /* Value Manipulation */
          autoComplete={false}
          options={inputState.options}
          // value={inputState.dirtyValue}
          defaultValue={props.defaultValue}
          rawValue={inputState.rawValue}
          dirtyValue={inputState.dirtyValue}
          /* Handlers */
          onMouseOver={(event) =>
            handleHoverEnter(event, setStore, props.inputRef)
          }
          onMouseLeave={(event) =>
            handleHoverLeave(event, setStore, props.inputRef)
          }
          onFocus={(event) => handleFocus(event, setStore, props.inputRef)}
          onBlur={(event) => handleBlur(event, setStore, props.inputRef)}
          onChange={(event) => handleChange(event, setStore, props.inputRef)}
          onSubmit={(event) => handleSubmit(event, setStore, props.inputRef)}
          onValidation={handleValidation}
          setStore={setStore}
          /* Key */
          onKeyPress={(event) => setKeyPress({ key: event.key })}
          /* Ref */
          inputRef={props.inputRef}
          /* Color */
          labelColor={inputColorState.labelColor}
          borderColor={inputColorState.borderColor}
          backgroundColor={inputColorState.backgroundColor}
          /* Color on Hover */
          labelColorOnHover={inputColorState.labelColorOnHover}
          borderColorOnHover={inputColorState.borderColorOnHover}
          backgroundColorOnHover={inputColorState.backgroundColorOnHover}
          /* Color on Focus */
          labelColorOnFocus={inputColorState.labelColorOnFocus}
          borderColorOnFocus={inputColorState.borderColorOnFocus}
          backgroundColorOnFocus={inputColorState.backgroundColorOnFocus}
          /* can override everything above and able to add new props */
          // {...override}
        />

        <HELPER_CONTAINER display={helperState.length !== 0}>
          {helperState.map((helperText) => (
            <HELPER_WRAPPER
              key={`HELPER_TEXT_${key}`}
              borderColor={helperColorState.helperBorderColor}
              backgroundColor={helperColorState.helperBackgroundColor}
            >
              <HELPER
                textColor={helperColorState.helperBorderColor}
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                }}
              >
                {helperText}
              </HELPER>
            </HELPER_WRAPPER>
          ))}
        </HELPER_CONTAINER>
      </INPUT_WRAPPER>
      <ToolerTip title={"Restore to Default"}>
        <BUTTON_WRAPPER display={inputState.value !== inputState.dirtyValue}>
          <BUTTON_GROUP>
            <BUTTON
              onClick={(event) => handleReset(event, setStore, props.inputRef)}
            >
              <SettingsBackupRestoreSharpIcon fontSize="small" />
            </BUTTON>
          </BUTTON_GROUP>
        </BUTTON_WRAPPER>
      </ToolerTip>
    </CONTENT_WRAPPER>
  );
};

export default React.memo(Input);

const BUTTON_WRAPPER = styled(Box)`
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background: #fefefe;

  display: ${({ display }) => (display ? "grid" : "none")};
  place-items: center;
`;

const BUTTON_GROUP = styled(Box)`
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.25em;

  display: grid;
  place-items: center;
`;

const BUTTON = styled(IconButton)`
  padding: 0.1em;
  background: #3b82f620;
  color: #3b82f6;

  & svg {
    font-size: 0.7em;
  }

  &:hover {
    background: #3b82f640;
  }
`;
