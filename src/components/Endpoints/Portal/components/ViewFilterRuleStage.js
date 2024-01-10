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
import { ViewFilterStagePopup } from "./ViewFilterRulesPopup/ViewFilterStagePopup";
import { endpoint } from "../../../../utils/GeneralComponentNames";

const payloadAction = { isLoading: true, payload: [], error: "" };

export const ViewFilterRuleStage = forwardRef(
  (
    {
      portalState,
      setPortalState,
      viewFilterRuleConfig,
      setViewFilterRuleConfig,
      flags,
    },
    ref,
  ) => {
    const [isAsyncDone, setIsAsyncDone] = useState(false);
    const [payloadState, setPayloadState] = useState(payloadAction);
    const { flag, setFlag } = flags;

    useImperativeHandle(ref, () => ({
      closePortal: () => {
        cancelHandler();
      },
    }));

    const closePopup = useCallback(() => {
      setPortalState({ type: "", isPortal: false });
      setViewFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [],
        setTaskStatus: () => {},
      });
    }, []);

    const cancelHandler = (event) => {
      if (viewFilterRuleConfig.tableRows === undefined) {
        viewFilterRuleConfig.setTaskStatus({
          inProgress: false,
          error: false,
          message: ``,
        });
        viewFilterRuleConfig.setDontClosePopup(true);
      } else {
        viewFilterRuleConfig.setTaskStatus({
          loading: false,
          payload: [...viewFilterRuleConfig.tableRows],
          error: false,
          message: ``,
        });
        viewFilterRuleConfig.setDontClosePopup(true);
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
      <Styled.PopupWrapper id={`${endpoint}-view-filter-rule-modal`}>
        <Styled.PopupHeader>
          <Styled.PopupTitle>Stagged Filter Rules</Styled.PopupTitle>
          <CloseButton
            id={`${endpoint}-view-filter-rule-modal-close-button`}
            onClick={cancelHandler}
          >
            <CloseSharp fontSize="medium" />
          </CloseButton>
        </Styled.PopupHeader>

        <Styled.CustomPopupContent>
          <ViewFilterStagePopup
            cancelHandler={cancelHandler}
            setPortalState={setPortalState}
            viewFilterRuleConfig={viewFilterRuleConfig}
            setFilterRuleConfig={setViewFilterRuleConfig}
            flag={flag}
            setFlag={setFlag}
          />
        </Styled.CustomPopupContent>
      </Styled.PopupWrapper>
    );
  },
);

const Styled = {
  PopupWrapper: styled(Popup)`
    width: 95vw;
    max-width: 1500px;
    height: 80vh;
    max-height: 800px;
    margin-top: 0em;
  `,

  PopupHeader: styled(PopupHeader)`
    /* width: auto; */
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
  `,

  CustomPopupContent: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    padding: 1em 1em 0 1em;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    /* gap: 0.4rem; */
    overflow: auto;
    /* overflow-y: scroll; */
    /* &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none; */
  `,

  PopupTitle: styled(Typography)`
    font-size: 1em;
    line-height: 1.4em;
    font-weight: 700;
    color: rgba(2, 147, 254, 1);
  `,
};
