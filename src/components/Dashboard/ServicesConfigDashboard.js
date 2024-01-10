import React, { useState } from "react";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/ServicesConfigDashboard.style";
import ServiceCheck from "./ServiceCheck";

const ServicesConfigDashboard = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <React.Fragment>
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
          <Styled.List id={"dsh-sw-services-list"}>
            {Object.keys(props.servicesDataMap).map((key) => {
              if (
                props.servicesData === undefined ||
                props.servicesData[key] === undefined
              ) {
                return "";
              }
              return (
                <Styled.ListItem>
                  <ServiceCheck check={props.servicesData[key]} />
                  <Styled.ListItemText>
                    {props.servicesDataMap[key].name}
                  </Styled.ListItemText>
                </Styled.ListItem>
              );
            })}
          </Styled.List>
        </Styled.ScrollContainer>
      )}
    </React.Fragment>
  );
};

export default ServicesConfigDashboard;
