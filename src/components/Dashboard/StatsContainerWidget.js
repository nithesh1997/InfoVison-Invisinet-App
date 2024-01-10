import { Box, Button, IconButton, Typography } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React, { useContext, useEffect, useState } from "react";
import Scroll from "react-scroll";
import styled from "styled-components";
import Config from "../../Config";
import OverlayContext from "../AppContent/AppOverlayContext";
import ScrollContext from "../AppContent/AppScrollContext";
import ImageBanner from "../General/ImageBanner";
import Style from "../../style";
import { dashboard } from "../../utils/GeneralComponentNames";
import { useDispatch, useSelector } from "react-redux";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import { useTranslation } from "react-i18next";

let Element = Scroll.Element;
let scroller = Scroll.scroller;

const StatsContainerWidget = (props) => {
  const { t, i18n } = useTranslation();

  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const AppScrollContext = useContext(ScrollContext); // Not being used, but to be removed later upon full testing.
  const AppOverlayContext = useContext(OverlayContext);

  const { chassis_model } = useSelector(($) => $.gatewayConfig);

  let contentContainerId = props.id;
  // let contentContainerId = _uniqueId("dsh-sw-");
  let pageScrollDuration = AppConfig.dashboard.statWidget.pageTransitionDelay;
  let cardsInView = props.cardsInView;
  let totalCards = props.data.length;
  let cardWidth = Math.floor(
    100 / (totalCards < cardsInView ? totalCards : cardsInView),
  );
  let totalPages = Math.ceil(totalCards / cardsInView);
  let [pageCount, setPageCount] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    scroller.scrollTo(
      contentContainerId + "-item-" + ((pageCount - 1) * cardsInView + 1),
      {
        smooth: true,
        duration: 0,
        containerId: contentContainerId,
        horizontal: true,
        isDynamic: true,
      },
    );
  }, [props.loading]);

  useEffect(() => {
    if (AppScrollContext.scrollInfo[contentContainerId] === undefined) {
      AppScrollContext.setScrollInfo({
        ...AppScrollContext.scrollInfo,
        [contentContainerId]: {
          pageCount: pageCount,
          cardsInView: cardsInView,
        },
      });
    } else {
      setPageCount(AppScrollContext.scrollInfo[contentContainerId].pageCount);
    }
  }, [AppScrollContext.scrollInfo]);

  const prevPage = () => {
    scroller.scrollTo(
      contentContainerId + "-item-" + ((pageCount - 2) * cardsInView + 1),
      {
        smooth: "easeInOutQuart",
        duration: pageScrollDuration,
        containerId: contentContainerId,
        horizontal: true,
        isDynamic: true,
      },
    );
    setPageCount(pageCount - 1);
  };

  const nextPage = () => {
    scroller.scrollTo(
      contentContainerId + "-item-" + (pageCount * cardsInView + 1),
      {
        smooth: "easeInOutQuart",
        duration: pageScrollDuration,
        containerId: contentContainerId,
        horizontal: true,
        isDynamic: true,
      },
    );
    setPageCount(pageCount + 1);
  };

  let itemCount = 0;
  let totalItems = props.data.length;

  return (
    <>
      <StyledContentContainer>
        <Styled.ContentContainerWithNoPadding id={contentContainerId}>
          {totalCards > 0 ? (
            props.data.map((item) => {
              function convertToInternationalCurrencySystem(labelValue) {
                // Fifteen Zeroes for Quadrillions
                return Math.abs(Number(labelValue)) >= 1.0e15
                  ? (Math.abs(Number(labelValue)) / 1.0e15).toFixed(2) + "T"
                  : // Twelve Zeroes for Trillions
                  Math.abs(Number(labelValue)) >= 1.0e12
                  ? (Math.abs(Number(labelValue)) / 1.0e12).toFixed(2) + "T"
                  : // Nine Zeroes for Billions
                  Math.abs(Number(labelValue)) >= 1.0e9
                  ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
                  : // Six Zeroes for Millions
                  Math.abs(Number(labelValue)) >= 1.0e6
                  ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
                  : // Three Zeroes for Thousands
                  Math.abs(Number(labelValue)) >= 1.0e3
                  ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
                  : Math.abs(Number(labelValue));
              }

              let valueinK = convertToInternationalCurrencySystem(item.count);

              itemCount += 1;

              let filler = undefined;

              if (itemCount === totalItems) {
                filler = [];
                filler.length =
                  (totalCards < cardsInView ? totalCards : cardsInView) -
                  (totalItems % cardsInView);
                filler.fill(0);

                filler = filler.map((value) => {
                  return (
                    <Styled.ContentItem
                      borderColor={
                        AppTheme.__default.dashboardStatWidgetItem.borderColor
                      }
                      className={" no-border"}
                      width={cardWidth}
                    />
                  );
                });
              }

              return (
                <>
                  <Styled.ContentItem
                    name={contentContainerId + "-item-" + itemCount}
                    borderColor={
                      AppTheme.__default.dashboardStatWidgetItem.borderColor
                    }
                    className={
                      pageCount * cardsInView + 1 === itemCount ||
                      (pageCount - 1) * cardsInView + 1 === itemCount
                        ? " no-border"
                        : ""
                    }
                    width={cardWidth}
                  >
                    <Styled.ContentItemImage
                      src={
                        //props.hasOwnProperty(props.dataMap)
                        //? //?
                        // item.name
                        props.dataMap.hasOwnProperty(item.name)
                          ? props.dataMap[item.name].img
                          : props.dataMap["def"].img
                        //// : ""
                      }
                      alt={
                        //// props.hasOwnProperty(props.dataMap)
                        ////   ?
                        props.dataMap.hasOwnProperty(item.name)
                          ? props.dataMap[item.name].name
                          : item.name
                        // : item.name
                      }
                      width={"50%"}
                    />
                    <Styled.ContentItemLabel
                      color={AppTheme.__default.dashboardStatWidgetItem.color}
                      component={"h4"}
                    >
                      {
                        //props.hasOwnProperty(props.dataMap)
                        //  ?
                        props.dataMap.hasOwnProperty(item.name)
                          ? props.dataMap[item.name].name
                          : item.name
                        //: item.name
                      }
                    </Styled.ContentItemLabel>
                    <Styled.ContentItemValue
                      color={AppTheme.__default.dashboardStatWidgetItem.color}
                      component={"h2"}
                    >
                      {valueinK}
                    </Styled.ContentItemValue>
                  </Styled.ContentItem>
                  {filler === undefined ? "" : filler}
                </>
              );
            })
          ) : (
            <Styled.ContentItem
              name={contentContainerId + "-item-" + 1}
              borderColor={
                AppTheme.__default.dashboardStatWidgetItem.borderColor
              }
              className={" no-border"}
              width={100}
            >
              <Styled.ContentItemLabel
                color={AppTheme.__default.dashboardStatWidgetItem.color}
                component={"h4"}
              >
                {t("page.home.dashboard.widget.noContentText")}
              </Styled.ContentItemLabel>
            </Styled.ContentItem>
          )}
        </Styled.ContentContainerWithNoPadding>
      </StyledContentContainer>

      <Styled.WidgetContentToolBar
        borderColor={AppTheme.__default.dashboardStatWidgetItem.borderColor}
        className={props.data.length <= cardsInView ? " invisible" : ""}
      >
        <Styled.WidgetContentNavigationBar>
          <Styled.IconButton
            id={`${dashboard}-stats-prev-button`}
            color={AppTheme.__default.dashboardStatWidgetNavigationIcon.color}
            hoverBg={
              AppTheme.__default.dashboardStatWidgetNavigationIcon.hoverBg
            }
            disabled={pageCount <= 1 ? true : false}
            onClick={prevPage}
          >
            <ChevronLeftIcon />
          </Styled.IconButton>

          <Styled.PageCount
            component={"span"}
            color={AppTheme.__default.dashboardStatWidgetNavigationInfo.color}
          >
            {pageCount} / {totalPages}
          </Styled.PageCount>

          <Styled.IconButton
            id={`${dashboard}-stats-next-button`}
            color={AppTheme.__default.dashboardStatWidgetNavigationIcon.color}
            hoverBg={
              AppTheme.__default.dashboardStatWidgetNavigationIcon.hoverBg
            }
            disabled={pageCount >= totalPages ? true : false}
            onClick={nextPage}
          >
            <ChevronRightIcon />
          </Styled.IconButton>
        </Styled.WidgetContentNavigationBar>

        <Styled.WidgetContentButtonBar>
          <Style.GenericButton
            id={`${dashboard}-statistics-button-view-more`}
            backgroundColor="primary"
            style={{
              display: props.name !== "Identities" ? "auto" : "none",
            }}
            width="8.5em"
            buttonName={t("page.home.dashboard.widget.portal.viewMoreText")}
            Icon={
              <OpenInFullOutlinedIcon
                style={{ width: "0.8em", height: "0.8em" }}
              />
            }
            disabled={false}
            onClick={() => {
              props.openModal();
              AppOverlayContext.setWidgetData({
                name: props.name,
                payload: props.isStatistics
                  ? chassis_model === "5010"
                    ? [...props.statsData].map(($) => ({
                        groupid: $.groupid,
                        name: $.name,
                        unTrustedData: $.unTrustedData,
                      }))
                    : props.statsData
                  : props.data,
                isStats: props.isStatistics ?? false,
                statsData:
                  chassis_model === "5010" && props.name !== "Identities"
                    ? [...props.statsData].map(($) => ({
                        groupid: $.groupid,
                        name: $.name,
                        unTrustedData: $.unTrustedData,
                      }))
                    : props.statsData,
                display: true,
              });
            }}
          />
        </Styled.WidgetContentButtonBar>
      </Styled.WidgetContentToolBar>
    </>
  );
};

export default StatsContainerWidget;

const StyledContentContainer = styled(Element)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  flex: 1 0 auto;
  width: 100%;
  overflow: hidden;
  padding: 1em 1em 0em 1em;
  min-height: 200px;
`;

const Styled = {
  ContentContainerWithNoPadding: styled(StyledContentContainer)`
    padding: 0em;
    overflow: hidden;
  `,

  ContentItem: styled(Element)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    width: ${(props) => props.width}%;
    padding: 1em 0.5em 0.5em 0.5em;
    border-left: 0.1em solid ${(props) => props.borderColor};

    &.no-border {
      border-left-width: 0em;
    }
  `,

  ContentItemImage: styled(ImageBanner)`
    max-width: 64px;
    margin-bottom: 2.5em;
  `,

  ContentItemLabel: styled(Typography)`
    max-width: 100%;

    font-weight: 500;
    font-size: 1em;
    line-height: 1.25em;
    text-align: center;
    word-break: break-word;
    margin-bottom: 0em;
    color: ${(props) => props.color};
    letter-spacing: 0.02rem;
  `,

  ContentItemValue: styled(Typography)`
    max-width: 100%;

    font-weight: 600;
    font-size: 2em;
    line-height: 2em;
    text-align: center;
    word-break: break-all;
    margin-bottom: 0em;
    color: ${(props) => props.color};
  `,

  WidgetContentToolBar: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex: 1 0 auto;
    overflow: hidden;
    margin: 0em 1em;
    padding: 0.5em 0em;
    border-top: 0.1em solid ${(props) => props.borderColor};
  `,

  WidgetContentNavigationBar: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex: 0 0 auto;
  `,

  WidgetContentButtonBar: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
    flex: 1 0 auto;
  `,

  IconButton: styled(IconButton)`
    color: ${(props) => props.color};
    margin: 0em 0.15em;
    padding: 0em;

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,

  PageCount: styled(Typography)`
    font-size: 1em;
    line-height: 1em;
    text-align: center;

    font-weight: 400;
    color: ${(props) => props.color};
  `,

  ViewMoreButton: styled(Button)`
    float: right;
    font-size: 0.85em;
    line-height: 0.85em;
    text-align: center;

    font-weight: 600;
    text-transform: capitalize;
    margin-right: 0.5em;
    margin-bottom: 0.25em;
    padding: 0.75em 1em;
    color: ${(props) => props.color};
    background-color: ${(props) => props.bg};

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};
