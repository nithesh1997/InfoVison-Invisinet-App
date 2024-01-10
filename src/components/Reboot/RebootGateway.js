import { Button, Paper, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Styled from "./RebootGateway.style";
import callAPI from "../../../src/apis/callAPI";
import { rebootGatewayResponders } from "../../apis/responders/haltGatewayResponders";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import Config from "../../Config";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import RebootImage from "../../images/reboot_img1.png";
import Portal from "../../Portal";
import { usePortalState } from "../../Portal/hooks/usePortalState";
import Auth from "../../redux/actions/Auth";
import OverlayContext from "../AppContent/AppOverlayContext";
import DialogGateway from "./DialogGateway";
import { reboot } from "../../utils/GeneralComponentNames";
import Style from "../../style";
import { Box } from "@mui/material";
import Prompt from "../DeletePrompt/Prompt";
import { useTranslation } from "react-i18next";
import * as common from "../../common";

const initGatewayType = {
  gatewayName: "Rebooting invisigate...",
  gatewayConfirm: "reboot",
};
const initServerType = {
  gatewayName: "Rebooting controller...",
  gatewayConfirm: "reboot",
};

const RebootGateway = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [portalState, setPortalState] = usePortalState();

  let [confirm, setConfirm] = useState("");
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [gatewayType, setGatewayType] = useState(
    props.gatewayConfig ? initServerType : initGatewayType,
  );
  const [zAxisState, setzAxisState] = useState(1);
  const [prompt, setPrompt] = useState(false);

  const console =
    props.gatewayConfig.chassis_model === "5010"
      ? t("commons.serverText")
      : t("commons.gatewayText", {
          GATEWAY: common.GATEWAY,
        });

  const onCompleteRebootGatewayHandler = (response) => {
    if (response.state === "REBOOT_GATEWAY_SUCESS" && response.code === 200) {
      setzAxisState(1);
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
    if (typeof gatewayAddress === "string") {
      setzAxisState(100);
      setConfirm("load");
      callAPI({
        path: "rebootGateway",
        params: { gatewayIP },
        data: {},
        responder: rebootGatewayResponders,
        onComplete: onCompleteRebootGatewayHandler,
      });
    }
    setPrompt(false);
    setConfirm("load");
    setzAxisState(100);
  };

  useEffect(() => {
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

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
    }
  }, [AppOverlayContext.selectedGateway]);

  const handleClose = () => {
    setPrompt(false);
    setPortalState({ isPortal: false });
  };

  const handleClosePortal = (event, setPortalState) => {
    if (confirm === "load") {
      setPortalState({ isPortal: true });
    } else {
      setPortalState({ isPortal: false });
    }
  };

  return (
    <>
      <Styled.Paper>
        <Styled.StyledInnerDiv>
          <img
            src={RebootImage}
            alt={t("page.maintainance.reboot.rebootGateway.rebootText", {
              console,
            })}
          />

          <Styled.Typography>
            {t("page.maintainance.reboot.rebootGateway.title", { console })}
          </Styled.Typography>

          <Styled.Div>
            <Styled.TypographyGateway>
              {t("page.maintainance.reboot.rebootGateway.description", {
                console,
              })}
            </Styled.TypographyGateway>
          </Styled.Div>

          <Style.GenericButton
            id={`${reboot}-gateway-button`}
            width={i18n.language === "es" ? "11rem" : "10rem"}
            backgroundColor="primary"
            buttonName={t("page.maintainance.reboot.rebootGateway.buttonName", {
              console,
            })}
            disabled={false}
            onClick={openPortal}
          />
        </Styled.StyledInnerDiv>

        <Styled.ParentTypo>
          <Styled.TypographyGatewayDesc>
            {t("page.maintainance.reboot.rebootGateway.description", {
              console,
            })}
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
            "page.maintainance.reboot.rebootGateway.action.prompt.confirm.text",
            {
              console,
              type:
                gatewayType.gatewayConfirm === "reboot"
                  ? "fully"
                  : "physically",
            },
          )}
          contentText={
            <>
              <p>
                {t(
                  "page.maintainance.reboot.rebootGateway.action.prompt.confirm.description",
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
            "page.maintainance.reboot.rebootGateway.action.prompt.confirm.continueButton",
            {
              console,
            },
          )}
          disagreeTitle={t(
            "page.maintainance.reboot.rebootGateway.action.prompt.confirm.cancelButton",
            {
              console,
            },
          )}
          handleAgree={onContinuehandler}
          handleDisagree={handleClose}
        />
      </Portal>
    </>
  );
};
export default RebootGateway;
