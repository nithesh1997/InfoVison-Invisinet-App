import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/IPSummary4.style";

export const IPSummary4 = (props) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <React.Fragment>
      <Styled.StyledBox>
        <Styled.StyledTitle>
          {t("page.configure.dnsTacMode.ipSummaryWidget.title", { version: 4 })}
        </Styled.StyledTitle>

        {props.load ? (
          <Styled.StyledSkeletonHolder>
            <WidthFillerSkeleton height="200" />
          </Styled.StyledSkeletonHolder>
        ) : (
          <Styled.ScrollContainer
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            theme={{ isHovered }}
          >
            <>
              {Object.keys(props.networkdataMap).map((key) => {
                if (props.networkData[key] === undefined) {
                  return "";
                }

                return (
                  <>
                    <Styled.StyledBoxItem id={"dsh-sw-network-list"}>
                      <Styled.StyledImage
                        src={props.networkdataMap[key].img}
                        alt={props.networkdataMap[key].name}
                        title={props.networkdataMap[key].tooltip}
                      />

                      <Styled.StyledlistItem>
                        {props.networkData[key]}
                      </Styled.StyledlistItem>
                    </Styled.StyledBoxItem>
                  </>
                );
              })}
            </>
          </Styled.ScrollContainer>
        )}
      </Styled.StyledBox>
    </React.Fragment>
  );
};
