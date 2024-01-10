/* eslint-disable no-whitespace-before-property */

import { useContext } from "react";
import Styled from "./MaterialComponents/WidthFillerSkeleton.style";
import Config from "../../Config";

const WidthFillerSkeleton = (props) => {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];

  return (
    <Styled.Skeleton
      animation={props.animation === undefined ? "pulse" : props.animation}
      variant={props.variation === undefined ? "rect" : props.variation}
      bg={props.bg === undefined ? AppTheme.__default.skeleton.bg : props.bg}
      width={"100%"}
      className={props.className === undefined ? "" : props.className}
      height={
        props.height === "100%"
          ? "100%"
          : props.height === undefined
          ? "auto"
          : props.height + "px"
      }
    >
      <Styled.SkeletonFiller
        height={
          props.height === undefined
            ? "270px"
            : props.height.toString().match(/[+-]?\d+(\.\d+)?/) !== null
            ? props.height
            : props.height + "px"
        }
      />
    </Styled.Skeleton>
  );
};

export default WidthFillerSkeleton;
