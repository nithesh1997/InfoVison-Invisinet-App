import React from "react";
import { Line } from "react-chartjs-2";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/TrustLevelsGraphDashboard.style";

const TrustLevelsGraphDashboard = (props) => {
  return (
    <React.Fragment>
      {props.loading ? (
        <Styled.SkeletonHolder>
          <WidthFillerSkeleton />
        </Styled.SkeletonHolder>
      ) : (
        <Styled.Container>
          <Line
            style={{ maxHeight: "302px" }}
            data={props.trustLevelsData}
            options={props.options}
          />
        </Styled.Container>
      )}
    </React.Fragment>
  );
};

export default TrustLevelsGraphDashboard;
