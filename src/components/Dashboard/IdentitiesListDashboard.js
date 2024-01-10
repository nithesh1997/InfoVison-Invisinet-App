import React from "react";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/DashboardSkeletonHolder.style";
import StatsContainerWidget from "./StatsContainerWidget";

const IdentitiesListDashboard = (props) => {
  return (
    <React.Fragment>
      {props.loading ? (
        <Styled.SkeletonHolder>
          <WidthFillerSkeleton />
        </Styled.SkeletonHolder>
      ) : (
        <StatsContainerWidget
          id={"dsh-sw-identities-list"}
          cardsInView={3}
          loading={props.loading}
          data={props.identityData}
          name="Identities"
          dataMap={props.identiesDataMap}
          openModal={props.openModal}
        />
      )}
    </React.Fragment>
  );
};

export default IdentitiesListDashboard;
