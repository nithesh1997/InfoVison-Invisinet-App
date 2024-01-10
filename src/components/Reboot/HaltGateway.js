import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import callAPI from "../../../src/apis/callAPI";
import Styled from "./HaltGateway.style";
import { haltGatewayResponders } from "../../apis/responders/haltGatewayResponders";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import Config from "../../Config";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import HaltImage from "../../images/reboot_img2.png";
import Portal from "../../Portal";
import { usePortalState } from "../../Portal/hooks/usePortalState";
import Auth from "../../redux/actions/Auth";
import OverlayContext from "../AppContent/AppOverlayContext";
import DialogGateway from "./DialogGateway";
import { reboot } from "../../utils/GeneralComponentNames";
import Style from "../../style";
import Prompt from "../DeletePrompt/Prompt";
import { useTranslation } from "react-i18next";
import * as common from "../../common";

const initGatewayType = () => ({
  gatewayName: "Halting invisigate...",
  gatewayConfirm: "halt",
});

const initServerType = () => ({
  gatewayName: "Halting controller...",
  gatewayConfirm: "halt",
});

function HaltGateway(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [confirm, setConfirm] = useState("");
  const [portalState, setPortalState] = usePortalState();
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [zAxisState, setzAxisState] = useState(1);
  const [prompt, setPrompt] = useState(false);
  const [gatewayType, setGatewayType] = useState(
    props.gatewayConfig ? initServerType : initGatewayType,
  );

  const onCompleteHaltGatewayHandler = (response) => {
    if (response.state === "HALTWAY_GATEWAY_SUCESS" && response.code === 200) {
      setConfirm("alertSuccess");
      setzAxisState(1);
      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: onCompleteLogoutHandler,
      });
    } else {
      setConfirm("failure");
      setzAxisState(1);
    }
  };

  const onCompleteLogoutHandler = (responder) => {
    setTimeout(() => {
      Auth.forcelogOut(props, AppConfig, AppOverlayContext, () =>
        dispatch(setRecentGateway({ address: gatewayIP })),
      );
    }, AppConfig.app.signOutDelay);
  };

  const openPortal = () => {
    setPrompt(true);
    setPortalState((prev) => ({ ...prev, isPortal: true }));
  };

  const onContinuehandler = () => {
    callAPI({
      path: "haltGateway",
      params: { gatewayIP },
      data: {},
      responder: haltGatewayResponders,
      onComplete: onCompleteHaltGatewayHandler,
    });
    setPrompt(false);
    setConfirm("load");
    setzAxisState(100);
  };

  useEffect(() => {
    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      setGatewayAddress(null);
      return;
    }

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
    }
  }, [AppOverlayContext.selectedGateway]);

  const handleClosePortal = (event, setPortalState) => {
    if (confirm === "load") {
      setPortalState({ isPortal: true });
    } else {
      setPortalState({ isPortal: false });
    }
  };

  const handleClose = () => {
    setPrompt(false);
    setPortalState({ isPortal: false });
    setConfirm("");
  };

  const console =
    props.gatewayConfig.chassis_model === "5010"
      ? t("commons.serverText")
      : t("commons.gatewayText", {
          GATEWAY: common.GATEWAY,
        });

  return (
    <>
      <Styled.Paper>
        <Styled.StyledInnerDiv>
          <img
            src={HaltImage}
            alt={t("page.maintainance.reboot.haltGateway.haltText")}
          />
          <Styled.Typography>
            {t("page.maintainance.reboot.haltGateway.title", { console })}
          </Styled.Typography>

          <Styled.Div>
            <Styled.TypographyGateway>
              {t("page.maintainance.reboot.haltGateway.description", {
                console,
              })}
            </Styled.TypographyGateway>
          </Styled.Div>

          <Style.GenericButton
            id={`${reboot}-halt-gateway-button`}
            width={"10rem"}
            backgroundColor="primary"
            buttonName={t("page.maintainance.reboot.haltGateway.buttonName", {
              console,
            })}
            disabled={false}
            onClick={openPortal}
          />
        </Styled.StyledInnerDiv>

        <Styled.ParentTypo>
          <Styled.TypographyGatewayDesc>
            {t("page.maintainance.reboot.haltGateway.description", { console })}
          </Styled.TypographyGatewayDesc>
        </Styled.ParentTypo>
      </Styled.Paper>

      <Portal
        PortalState={[portalState, setPortalState]}
        handleClosePortal={handleClosePortal}
        zAxis={zAxisState}
      >
        <DialogGateway
          handleClose={handleClose}
          onContinuehandler={onContinuehandler}
          gatewayType={gatewayType}
          setGatewayType={setGatewayType}
          setConfirm={setConfirm}
          confirm={confirm}
          gatewayConfig={props.gatewayConfig}
        />

        <Prompt
          open={prompt}
          setOpen={setPrompt}
          contentTitle={t(
            "page.maintainance.reboot.haltGateway.action.prompt.confirm.text",
            {
              console,
            },
          )}
          contentText={
            <>
              <p>
                {t(
                  "page.maintainance.reboot.haltGateway.action.prompt.confirm.description",
                  {
                    console,
                    type:
                      gatewayType.gatewayConfirm === "reboot"
                        ? "fully"
                        : "physically",
                  },
                )}
              </p>
            </>
          }
          contentInfo={``}
          agreeTitle={t(
            "page.maintainance.reboot.haltGateway.action.prompt.confirm.continueButton",
          )}
          disagreeTitle={t(
            "page.maintainance.reboot.haltGateway.action.prompt.confirm.cancelButton",
          )}
          handleAgree={onContinuehandler}
          handleDisagree={handleClose}
        />
      </Portal>
    </>
  );
}

export default HaltGateway;
