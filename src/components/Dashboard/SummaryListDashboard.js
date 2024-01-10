import { Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/SummaryListDashboard.style";
import { useSelector } from "react-redux";
import * as common from "../../common";

const SummaryListDashboard = (props) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  return (
    <>
      {props.loading ? (
        <Styled.SkeletonHolder>
          <WidthFillerSkeleton />
        </Styled.SkeletonHolder>
      ) : (
        <Styled.ScrollContainer
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          theme={{ isHovered }}
        >
          <Styled.List id={"dsh-sw-summary-list"}>
            {Object.keys(props.summaryDataMap).map((key) => {
              if (
                props.summaryData === undefined ||
                props.summaryData[key] === undefined
              ) {
                return "";
              }

              let color = " ";
              let expirymsg = "";
              let expy = props.summaryData["gwExpiryDays"];

              if (key === "gwcertexpiryUTC") {
                expirymsg =
                  expy <= 0
                    ? t(`page.home.dashboard.summary.certExpiryInfo.0`, {
                        GATEWAY: common.GATEWAY,
                      })
                    : t(`page.home.dashboard.summary.certExpiryInfo.1`, {
                        number: expy,
                        GATEWAY: common.GATEWAY,
                      });

                color =
                  expy <= 30
                    ? "red"
                    : expy <= 60
                    ? "amber"
                    : expy <= 90
                    ? "green"
                    : "black";
              }

              return (
                <Styled.ListItem>
                  {
                    <Styled.ListItemImage
                      src={props.summaryDataMap[key].img}
                      alt={props.summaryDataMap[key].name}
                      title={props.summaryDataMap[key].tooltip}
                      width={"22"}
                    />
                  }

                  <Tooltip title={expirymsg} arrow>
                    <Styled.ListItemText className={key + " " + color}>
                      {key === "ipv4" &&
                      props.summaryData["ipv4_prefix"] !== null &&
                      props.summaryData["ipv4_prefix"] !== undefined &&
                      props.summaryData["ipv4"] === 0
                        ? `${props.summaryData[key]}/${props.summaryData["ipv4_prefix"]}`
                        : props.summaryData[key] &&
                          key === "ipv6" &&
                          props.summaryData["ipv6_prefix"] !== null &&
                          props.summaryData["ipv6_prefix"] !== undefined &&
                          props.summaryData["ipv6"] !== "not configured" &&
                          props.summaryData["ipv6"] !== 0
                        ? `${props.summaryData[key]}/${props.summaryData["ipv6_prefix"]}`
                        : key === "modal"
                        ? gatewayConfig["chassis_model"] === "5010"
                          ? "Controller"
                          : "Invisigate"
                        : props.summaryData[key]}
                    </Styled.ListItemText>
                  </Tooltip>
                </Styled.ListItem>
              );
            })}
          </Styled.List>
        </Styled.ScrollContainer>
      )}
    </>
  );
};

export default SummaryListDashboard;
