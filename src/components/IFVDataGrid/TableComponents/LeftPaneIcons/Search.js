import { Box, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { CancelRounded, SearchRounded } from "@material-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import Config from "../../../../Config";
import { DataGridContext } from "../../IFVDataGrid";
import { useTranslation } from "react-i18next";

const initialEvent = { onFocus: false, onBlur: false, onChange: false };

const setTimeoutClosure = () => {
  let timeout = undefined;

  return {
    resetTimeout: () => {
      window.clearTimeout(timeout);
    },
    updateTimeout: (callback, time) => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        callback();
      }, time);
    },
  };
};

export const Search = ({ SearchState }) => {
  const inputRef = useRef("");
  const [state, setState] = SearchState;
  const [value, setValue] = useState("");
  const [event, setEvent] = useState(initialEvent);
  const { setGridSubconscious } = useContext(DataGridContext);
  const [searchTimeout, setSearchTimeout] = useState(setTimeoutClosure());
  const navigate = useLocation();
  const AppConfig = useContext(Config);
  const isRoute = navigate.pathname == AppConfig.pages.flr.path;
  const { isCollapsed } = useSelector(($) => $.navigationMenu);

  const { t } = useTranslation();

  const handleFocus = (event) => {
    setEvent({ onFocus: true, onBlur: false, onChange: false });
  };

  const handleBlur = (event) => {
    setEvent({ onFocus: false, onBlur: true, onChange: false });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    setEvent({ onFocus: true, onBlur: false, onChange: true });
  };

  const handleSearchInput = (event) => {};

  const handleClearInput = (event) => {
    setEvent({ onFocus: true, onBlur: false, onChange: true });
    inputRef.current.value = "";

    setTimeout(() => {
      setEvent({ onFocus: false, onBlur: false, onChange: false });
    }, 300);
  };

  useEffect(() => {
    setValue((oldState) =>
      value === inputRef.current.value ? oldState : inputRef.current.value,
    );
  }, [state.value, value]);

  useEffect(() => {
    if (event.onFocus && !event.onBlur && event.onChange) {
      searchTimeout.updateTimeout(() => {
        setGridSubconscious((oldState) => {
          return { ...oldState, searchText: inputRef.current.value };
        });
      }, 500);
    } // Reduce to decrease latency between typing and actual filtering
  }, [event, state.value, searchTimeout, setGridSubconscious]);

  return (
    <Styled.Wrapper>
      <Styled.TextField
        isRoute={isRoute}
        isCollapsed={isCollapsed}
        variant="outlined"
        label={t("commons.SearchText")}
        // value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <Styled.CancelButton
                onClick={handleClearInput}
                theme={{ visibility: Boolean(inputRef.current.value) }}
              >
                <Styled.CancelIcon />
              </Styled.CancelButton>

              <Styled.SearchButton onClick={handleSearchInput}>
                <Styled.SearchIcon />
              </Styled.SearchButton>
            </InputAdornment>
          ),
        }}
        inputRef={inputRef}
      />
    </Styled.Wrapper>
  );
};

const Styled = {
  Wrapper: styled(Box)`
    display: flex;
    font-size: 1em;
    /* font-family: "Montserrat", sans-serif; */
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    overflow: hidden;
    font-weight: 600;
    background-color: #fff;
    color: #212529;
    box-sizing: border-box;
    padding: 0.4rem 0;
  `,
  TextField: styled(TextField)`
    &.MuiFormControl-root {
      width: 100%;
      @media (min-width: 769px) and (max-width: ${(props) =>
          !props.isCollapsed ? "1320px" : "1100px"}) {
        width: ${(props) => (props.isRoute ? "325px" : "100%")};
      }
      @media (max-width: 768px) {
        width: ${(props) => (props.isRoute ? "325px" : "100%")};
      }
    }

    & .MuiOutlinedInput-input {
      padding: 0.74rem 0.9rem;
      border-radius: 4px;
      background: ${({ backgroundColor }) => backgroundColor};
      /* font-family: "Montserrat"; */
      font-size: 0.8rem;
    }

    & .MuiOutlinedInput-input:hover {
      padding: 0.74rem 0.9rem;
      border-radius: 4px;
      background: #fff;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
      padding: 0.74rem 0.9rem;
      border-radius: 4px;
      background: #fff;
    }

    & .MuiFormLabel-root {
      color: #6c757d;
    }

    & .MuiInputLabel-root {
      color: #6c757d;
    }

    /* todo: Unable to apply these styles */
    & .MuiFormLabel-root:hover {
      color: #0094fd;
    }

    & .MuiInputLabel-root:hover {
      color: #0094fd;
    }
    /* todo: Unable to apply these styles */

    & .MuiFormLabel-root.Mui-focused {
      color: #0094fd;
    }

    & .MuiInputLabel-root.Mui-focused {
      border-color: #0094fd;
    }

    & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: ${({ borderColor }) => borderColor};
      border-width: 1px;
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: #0094fd;
      border-width: 1px;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #0094fd;
      border-width: 1px;
    }

    & .MuiInputLabel-outlined {
      transform: translate(0.5em, 0.7em) scale(0.9);
      background: #f0f0f000;
      width: min-content;
      max-width: 100%;
      border-radius: 0.1rem;
      padding: 0.1rem 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .MuiInputLabel-outlined.MuiInputLabel-shrink {
      transform: translate(0.7em, -0.5em) scale(0.75);
      background: #fff;
      width: min-content;
      max-width: 100%;
      border-radius: 0.1rem;
      padding: 0.1rem 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .MuiOutlinedInput-adornedEnd {
      padding-right: 0;
    }
  `,
  SearchButton: styled(IconButton)`
    width: 1rem;
    height: 1rem;
    margin: 0 0.2rem;
    pointer-events: none;

    &:hover {
      background: rgba(2, 147, 254, 0);
    }

    & .MuiTouchRipple-child {
      background: rgba(2, 147, 254, 0);
    }
  `,
  SearchIcon: styled(SearchRounded)`
    width: 0.9rem;
    height: 0.9rem;
    fill: rgba(2, 147, 254, 1);
  `,
  CancelButton: styled(IconButton)`
    visibility: ${({ theme }) => (theme.visibility ? "visible" : "hidden")};
    width: 1rem;
    height: 1rem;
    margin: 0 0.2rem;

    &:hover {
      background: #e83b4620;
    }

    & .MuiTouchRipple-child {
      background: #e83b4640;
    }

    &.MuiIconButton-root.Mui-disabled {
      background: #30303010;
      cursor: default;

      .MuiSvgIcon-root {
        fill: #616161;
      }
    }
  `,
  CancelIcon: styled(CancelRounded)`
    &.MuiSvgIcon-root {
      width: 0.9rem;
      height: 0.9rem;
      fill: #e83b46;
    }
  `,
};
