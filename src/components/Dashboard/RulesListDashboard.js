import React from "react";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/DashboardSkeletonHolder.style";
import StatsContainerWidget from "./StatsContainerWidget";

const TokensListDashboard = (props) => {
  return (
    <React.Fragment>
      {props.loading ? (
        <Styled.SkeletonHolder>
          <WidthFillerSkeleton />
        </Styled.SkeletonHolder>
      ) : (
        <StatsContainerWidget
          id={"dsh-sw-rules-list"}
          cardsInView={3}
          loading={props.loading}
          data={props.rulesData}
          dataMap={props.rulesDataMap}
        />
      )}
    </React.Fragment>
  );
};

export default TokensListDashboard;
