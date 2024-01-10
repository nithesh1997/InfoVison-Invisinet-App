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
import { StyledMat } from "../ClearFilterRuleAction/StyledMat";
import { PopupFilter } from "../components/FilterRulesPopup/PopupFilter";
import { endpoint } from "../../../../utils/GeneralComponentNames";
import loadingText from "../../../../images/right.svg";
import { Trans, useTranslation } from "react-i18next";

const payloadAction = { isLoading: true, payload: [], error: "" };

export const FilterRuleConfig = forwardRef(
  (
    {
      portalState,
      setPortalState,
      filterRuleConfig,
      setFilterRuleConfig,
      setViewFilterRuleConfig,
      endpointsRolesCheck,
    },
    ref,
  ) => {
    const [isAsyncDone, setIsAsyncDone] = useState(false);
    const [payloadState, setPayloadState] = useState(payloadAction);
    const [loadingState, setLoadingState] = useState("fetching");

    const { t } = useTranslation();

    useImperativeHandle(ref, () => ({
      closePortal: () => {
        cancelHandler();
      },
    }));

    const closePopup = useCallback(() => {
      setPortalState({ type: "", isPortal: false });
      setFilterRuleConfig({
        tableRows: undefined,
        selectedRows: [],
        setTaskStatus: () => {},
      });
    }, []);

    const cancelHandler = (event) => {
      if (filterRuleConfig.tableRows === undefined) {
        filterRuleConfig.setTaskStatus({
          inProgress: false,
          error: false,
          message: ``,
        });
        filterRuleConfig.setDontClosePopup(true);
      } else {
        const payload = filterRuleConfig.tableRows.map((row) => ({
          ...row,
          isChecked: false,
        }));

        filterRuleConfig.setTaskStatus({
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
          error: t(
            "page.Endpoint.Configure.configureFilterRulesModal.somethingWentWrong",
          ),
        });
      }
    }, []);

    useEffect(() => {
      setPortalState((oldState) => ({
        ...oldState,
        isProgressPending: payloadState.isLoading,
      }));
    }, [payloadState.isLoading, setPortalState]);

    const states = ["fetching", "validating"];
    const isSpinner = states.includes(loadingState);

    return (
      <>
        <Styled.PopupWrapper
          id={`${endpoint}-configure-filter-rule-modal`}
          isSpinner={isSpinner}
        >
          <Styled.StyledPopupHeader>
            <Styled.PopupTitle>
              {t("page.Endpoint.Configure.configureFilterRulesModal.title")}
            </Styled.PopupTitle>

            <CloseButton
              id={`${endpoint}-configure-filter-rule-modal-close-button`}
              onClick={cancelHandler}
            >
              <CloseSharp fontSize="medium" />
            </CloseButton>
          </Styled.StyledPopupHeader>

          <Styled.CustomPopupContent>
            <PopupFilter
              cancelHandler={cancelHandler}
              portalState={portalState}
              setPortalState={setPortalState}
              filterRuleConfig={filterRuleConfig}
              setFilterRuleConfig={setFilterRuleConfig}
              setViewFilterRuleConfig={setViewFilterRuleConfig}
              loadingState={loadingState}
              setLoadingState={setLoadingState}
              endpointsRolesCheck={endpointsRolesCheck}
            />
          </Styled.CustomPopupContent>
        </Styled.PopupWrapper>

        <StyledMat.Wrapper
          isSpinner={isSpinner}
          style={{ display: isSpinner ? "grid" : "none" }}
        >
          {loadingState === "fetching" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <StyledMat.LoadingText src={loadingText} />
              <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                {t("page.Endpoint.Configure.configureFilterRulesModal.loading")}
              </Typography>
            </div>
          ) : loadingState === "validating" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <StyledMat.LoadingText src={loadingText} />
              <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                {t(
                  "page.Endpoint.Configure.configureFilterRulesModal.validating",
                )}
              </Typography>
            </div>
          ) : null}
        </StyledMat.Wrapper>
      </>
    );
  },
);

const Styled = {
  PopupWrapper: styled(Popup)`
    width: 95vw;
    height: 80vh;
    margin-top: 0em;
    max-width: ${({ isSpinner }) => (isSpinner ? "500px" : "95vw")};
    max-height: ${({ isSpinner }) => (isSpinner ? "300px" : "800px")};
    display: ${({ isSpinner }) => (isSpinner ? "none" : "auto")};
    place-items: ${({ isSpinner }) => (isSpinner ? "center" : "auto")};
  `,

  StyledPopupHeader: styled(PopupHeader)`
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
    /* font-family: "", sans-serif; */
    font-size: 1em;
    line-height: 1.4em;
    font-weight: 700;
    color: rgba(2, 147, 254, 1);
  `,
};
