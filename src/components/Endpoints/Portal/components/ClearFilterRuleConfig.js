import { Box, Typography } from "@material-ui/core";
import { CloseSharp } from "@material-ui/icons";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styled from "styled-components";
import { CloseButton } from "../../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../../IFVDataGrid/styled-materials/PopupHeader";
import { PopupFilter } from "../components/FilterRulesPopup/PopupFilter";

const payloadAction = { isLoading: true, payload: [], error: "" };

const PopupWrapper = styled(Popup)`
  width: 95vw;
  max-width: 1500px;
  height: 80vh;
  max-height: 800px;
  margin-top: 0em;
`;

const StyledPopupHeader = styled(PopupHeader)`
  border-bottom: 0.2em solid rgba(2, 147, 254, 1);
`;

const CustomPopupContent = styled(Box)`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 1em 1em 0 1em;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;
`;

const PopupTitle = styled(Typography)`
  font-size: 1em;
  line-height: 1.4em;
  font-weight: 700;
  color: rgba(2, 147, 254, 1);
`;

export const ClearFilterRuleConfig = forwardRef(
  (
    {
      portalState,
      setPortalState,
      clearFilterRuleConfig,
      setClearFilterRuleConfig,
      setViewClearFilterRuleConfig,
    },
    ref,
  ) => {
    const [isAsyncDone, setIsAsyncDone] = useState(false);
    const [payloadState, setPayloadState] = useState(payloadAction);

    useImperativeHandle(ref, () => ({
      closePortal: () => {
        cancelHandler();
      },
    }));

    const closePopup = useCallback(() => {
      setPortalState({ type: "", isPortal: false });
      setClearFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [],
        setTaskStatus: () => {},
      });
    }, []);

    const cancelHandler = (event) => {
      if (clearFilterRuleConfig.tableRows === undefined) {
        clearFilterRuleConfig.setTaskStatus({
          inProgress: false,
          error: false,
          message: ``,
        });
      } else {
        const payload = clearFilterRuleConfig.tableRows.map((row) => ({
          ...row,
          isChecked: false,
        }));

        clearFilterRuleConfig.setTaskStatus({
          loading: false,
          payload,
          error: false,
          message: ``,
        });
      }
      closePopup();
    };

    useEffect(() => {
      isAsyncDone === true && closePopup();
    }, [closePopup, isAsyncDone]);

    useEffect(() => {
      const $ = "something";
      if (typeof $ === "string") {
        setPayloadState({
          isLoading: false,
          payload: [],
          error: "",
        });
      } else {
        setPayloadState({
          isLoading: false,
          payload: [],
          error: "Something Went Wrong!",
        });
      }
    }, []);

    useEffect(() => {
      setPortalState((oldState) => ({
        ...oldState,
        isProgressPending: payloadState.isLoading,
      }));
    }, [payloadState.isLoading, setPortalState]);

    return (
      <PopupWrapper>
        <StyledPopupHeader>
          <PopupTitle>Clear Filter Rules</PopupTitle>

          <CloseButton onClick={cancelHandler}>
            <CloseSharp fontSize="medium" />
          </CloseButton>
        </StyledPopupHeader>

        <CustomPopupContent>
          <PopupFilter
            cancelHandler={cancelHandler}
            portalState={portalState}
            setPortalState={setPortalState}
            filterRuleConfig={clearFilterRuleConfig}
            setFilterRuleConfig={setClearFilterRuleConfig}
            setViewClearFilterRuleConfig={setViewClearFilterRuleConfig}
          />
        </CustomPopupContent>
      </PopupWrapper>
    );
  },
);
