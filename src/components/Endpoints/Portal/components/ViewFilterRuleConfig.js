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
import { ViewFilterPopup } from "../components/ViewFilterRulesPopup/ViewFilterPopup";
import { ViewFilterStagePopup } from "./ViewFilterRulesPopup/ViewFilterStagePopup";
import { endpoint } from "../../../../utils/GeneralComponentNames";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@mui/material/Tab";
import { TabContext } from "@material-ui/lab";
import { TabPanel } from "@material-ui/lab";
import { TabList } from "@material-ui/lab";
import { Trans, useTranslation } from "react-i18next";

const payloadAction = { isLoading: true, payload: [], error: "" };

export const ViewFilterRuleConfig = forwardRef(
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
    const [value, setValue] = useState("1");
    const { t } = useTranslation();

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
          error: t("page.Endpoint.Configure.viewFilterRulesModal.loadingError"),
        });
      }
    }, []);

    useEffect(() => {
      setPortalState((oldState) => ({
        ...oldState,
        isProgressPending: payloadState.isLoading,
      }));
    }, [payloadState.isLoading, setPortalState]);

    const handleChangeTab = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Styled.PopupWrapper id={`${endpoint}-view-filter-rule-modal`}>
        <TabContext value={value}>
          <Styled.PopupHeader>
            <Styled.TabsList
              onChange={handleChangeTab}
              aria-label={t(
                "page.Endpoint.Configure.viewFilterRulesModal.apiFilterRules",
              )}
            >
              <Styled.TabTitle
                label={t(
                  "page.Endpoint.Configure.viewFilterRulesModal.titleCurrent",
                )}
                value="1"
                selected
              />
              <Styled.TabTitle
                label={t(
                  "page.Endpoint.Configure.viewFilterRulesModal.titleStaged",
                )}
                value="2"
              />
            </Styled.TabsList>

            <CloseButton
              id={`${endpoint}-view-filter-rule-modal-close-button`}
              onClick={cancelHandler}
            >
              <CloseSharp fontSize="medium" />
            </CloseButton>
          </Styled.PopupHeader>

          <TabPanel value="1">
            <ViewFilterPopup
              cancelHandler={cancelHandler}
              setPortalState={setPortalState}
              viewFilterRuleConfig={viewFilterRuleConfig}
              setFilterRuleConfig={setViewFilterRuleConfig}
              flag={flag}
              setFlag={setFlag}
            />
          </TabPanel>
          <TabPanel value="2">
            <ViewFilterStagePopup
              cancelHandler={cancelHandler}
              setPortalState={setPortalState}
              viewFilterRuleConfig={viewFilterRuleConfig}
              setFilterRuleConfig={setViewFilterRuleConfig}
              flag={flag}
              setFlag={setFlag}
            />
          </TabPanel>
        </TabContext>
      </Styled.PopupWrapper>
    );
  },
);
const Styled = {
  TabsList: styled(TabList)`
    & .MuiTabs-indicator {
      color: #0094fd;
      background: #0094fd;
      height: 3px;
    }
  `,
  TabTitle: styled(Tab)`
    &.MuiTab-root {
      font-size: 1em;
      line-height: 1.4em;
      font-weight: 700;
      color: rgba(2, 147, 254, 1);
      text-transform: capitalize;
      padding: 1.5em;
    }

    & .MuiTabs-indicator {
      color: black;
      background: black;
    }
  `,

  PopupWrapper: styled(Popup)`
    width: 95vw;
    max-width: 1500px;
    height: 80vh;
    max-height: 580px;
    margin-top: 0em;
    overflow-y: hidden;
  `,

  PopupHeader: styled(Box)`
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
    /* overflow: auto; */
    /* overflow-y: scroll; */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `,

  PopupTitle: styled(Typography)`
    font-size: 1em;
    line-height: 1.4em;
    font-weight: 700;
    color: rgba(2, 147, 254, 1);
  `,
};
