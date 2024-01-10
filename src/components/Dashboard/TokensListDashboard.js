import React from "react";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/DashboardSkeletonHolder.style";
import StatsContainerWidget from "./StatsContainerWidget";

const TokensListDashboard = (props) => {
  const statsData = props.statsData.trustedData.map(
    ({ name, groupid, count }, index) => {
      return {
        name,
        groupid,
        trustedData: count ?? 0,
        unTrustedData: props?.statsData?.unTrustedData[index]?.count ?? 0,
      };
    },
  );

  return (
    <>
      {props.loading ? (
        <Styled.SkeletonHolder>
          <WidthFillerSkeleton />
        </Styled.SkeletonHolder>
      ) : (
        <StatsContainerWidget
          id={"dsh-sw-tokens-list"}
          cardsInView={3}
          loading={props.loading}
          data={props.tokenData}
          isStatistics
          statsData={statsData}
          name="Statistics"
          dataMap={props.tokensDataMap}
          openModal={props.openModal}
        />
      )}
    </>
  );
};

export default TokensListDashboard;
