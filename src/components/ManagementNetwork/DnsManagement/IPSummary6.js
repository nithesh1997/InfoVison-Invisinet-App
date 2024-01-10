import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/IPSummary6.style";

export const IPSummary6 = (props) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <React.Fragment>
      <Styled.StyledBox>
        <Styled.StyledTitle>
          {t("page.configure.dnsTacMode.ipSummaryWidget.title", { version: 6 })}
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
              {Object.keys(props.networkdataMapTwo).map((key) => {
                if (props.networkData[key] === undefined) {
                  return "";
                }

                return (
                  <>
                    <Styled.StyledBoxItem id={"dsh-sw-network-list"}>
                      <Styled.StyledImage
                        src={props.networkdataMapTwo[key].img}
                        alt={props.networkdataMapTwo[key].name}
                        title={props.networkdataMapTwo[key].tooltip}
                        width={"22"}
                        height={"22"}
                      />
                      <Styled.StyledlistItem>
                        {" "}
                        {props.networkData[key]}{" "}
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
