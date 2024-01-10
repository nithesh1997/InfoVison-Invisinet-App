import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import FullViewPortOverlay from "../Containers/FullViewPortOverlay";
import { Box } from "@material-ui/core";
import spinnerLogo from "../../images/spinner_logo.svg";
import outerCircle from "../../images/outer-circle.svg";
import Config from "../../Config";
import { Images } from "../../NamedImages/NamedImages";
import CaptionText from "../General/CaptionText";
import { useTranslation } from "react-i18next";

const StyledLoadingCaption = styled(CaptionText)`
  max-width: 94vw;
  white-space: break-spaces;
  margin-top: 1.5em;
  color: ${(props) => props.color};
  font-weight: 300;
  font-size: 1.6em;
  line-height: 2em;
  text-align: center;

  @media (max-width: ${(props) => props.md}px) {
    font-size: 1.25em;
    line-height: 1.6em;
  }
`;

const PageLoader = (props, ref) => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];

  return (
    <FullViewPortOverlay
      bg={AppTheme.__default.pageLoader.bg}
      className={props.className === undefined ? "" : props.className}
    >
      <Styled.Container>
        {/* <Styled.OuterSpinner>
          <img src={spinnerLogo} alt="spinnerLogo" />
        </Styled.OuterSpinner> */}

        {/* <Styled.CircleContainer /> */}

        <Styled.Deg4>
          <Styled.Logoimg src={spinnerLogo} height={74} alt={"InvisiNet"} />
        </Styled.Deg4>
      </Styled.Container>

      <StyledLoadingCaption
        color={AppTheme.__default.pageLoaderCaption.color}
      />
    </FullViewPortOverlay>
  );
};

export default PageLoader;

const Styled = {
  Logoimg: styled.img`
    color: #ffffff;
    animation: rotate2 2s steps(2) 0s infinite;
    @keyframes rotate2 {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(240deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  Container: styled(Box)`
    position: relative;
    background-color: #ffffff;
    width: 160px;
    height: 160px;
    box-sizing: border-box;
    border-radius: 10%;
  `,
  OuterSpinner: styled(Box)`
    position: absolute;
    top: 0%;
    bottom: 0%;
    left: 0%;
    right: 0%;
    /* padding: 1em; */
    width: 150px;
    height: 150px;
    margin: auto;
    animation: rotate 1s linear infinite;
    border-radius: 100%;
    @keyframes rotate {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }
  `,
  CircleContainer: styled(Box)`
    position: absolute;
    left: 12.5%;
    top: 12.5%;
    width: 120px;
    height: 120px;
    background: conic-gradient(
      #345da1 0deg 30deg,
      #112a5a 30deg 60deg,
      #345da1 60deg 120deg,
      #112a5a 12deg 150deg,
      #345da1 150deg 210deg,
      #112a5a 210deg 240deg,
      #345da1 240deg 300deg,
      #112a5a 300deg 330deg,
      #345da1 330deg 360deg
    );
    -webkit-mask-image: radial-gradient(transparent 65%, black 65%);
    mask-image: radial-gradient(transparent 65%, black 65%);
    border-radius: 50%;
    animation: rotate2 1.5s linear infinite;
    @keyframes rotate2 {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  `,
  Deg4: styled(Box)`
    position: absolute;
    // top: 3%;
    // left: 4%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
  `,
};
