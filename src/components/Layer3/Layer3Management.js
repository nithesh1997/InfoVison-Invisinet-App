import React, { useCallback, useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import callAPI from "../../apis/callAPI";
import {
  DisableApiResponder,
  EnableApiResponder,
} from "../../apis/responders/enable-api-responder";
import { GetLayerApiResponder } from "../../apis/responders/get-layer-api-responder";
import { networkAPIResponder } from "../../apis/responders/networkAPIResponder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import { GlobalPrompt } from "../../style/Card/Prompt";
import { Radio } from "../../style/Radio/Radio";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Layer3NatManagement from "./Layer3NatManagement";
import { Styled } from "./MaterialComponents/Layer3Management.style";
import RoutesManagementTable from "./RoutesManagementTable";
import Style from "../../style/index";
import { AntSwitch } from "../GatewayServices/ComponentsGatewayServices/AntSwitch";
import { Trans, useTranslation } from "react-i18next";

function DataGridRulesConfig() {
  const { t } = useTranslation();

  const natTableHead = t("page.configure.Layer3.Nats Management Text");
  const routeTableHead = t("page.configure.Layer3.Routes Management Text");
  const toggle = [t("commons.disabledText"), t("commons.enabledText")];
  const status = ["#DC143C", "#10B981"];

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);

  const pageTitle = AppConfig.pages.ly3.title;
  const pageBreadcrumb = AppConfig.pages.ly3.breadcrumb;

  const [loading, setLoading] = useState(true);
  const [runEffect, setRunEffect] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggleState, setToggleState] = useState();
  const [toggleLoading, setToggleLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("nats");
  const [statusText, setStatusText] = useState("");
  const [statusColor, setStatusColor] = useState(status[0]);
  const [colors, setColors] = useState(false);
  const [modeData, setModeData] = useState({ id: 0, mode: "" });
  const [alertDialogTitle, setalertDialogTitle] = useState("ERROR !!");

  const [msg, setMsg] = useState({ disable: false });
  const [ing, setIng] = useState("");

  const tableTitle = selectedValue === "nats" ? natTableHead : routeTableHead;

  const handleSwitch = (event) => {
    const isChecked = event.target.checked;

    setToggleLoading(true);
    setIng(
      isChecked
        ? t("commons.enablingText") + "..."
        : t("commons.disablingText") + "...",
    );
    setToggleState(
      isChecked ? t("commons.enabledText") : t("commons.disabledText"),
    );
    setRunEffect("toggleSwitch");
  };

  const handleChange = (event) => {
    setSelectedValue((oldState) => {
      return event.target.value === oldState ? oldState : event.target.value;
    });
  };

  const onCompleteOfToggleLayer3 = useCallback(
    (response) => {
      if (
        response.state === "ENABLE_LAYER3_SUCCESS" ||
        response.state === "DISABLE_LAYER3_SUCCESS"
      ) {
        setStatusText(
          t(
            "page.configure.Layer3.Fetch Status.Success.Layer3 Service Successfully",
            { toggleState: toggleState.toLowerCase() },
          ),
        );
        setStatusColor(status[1]);
        setToggleLoading(false);
        setDialogOpen(true);
        setRunEffect("");
        setIng("");
        setalertDialogTitle(t("page.configure.Layer3.SUCCESS"));
      } else {
        const messages = response.errorMessage.split("\n");

        setStatusText(() => (
          <>
            <Trans
              i18nKey={
                "page.configure.Layer3.Fetch Status.Error.Error Layer3 Service"
              }
              values={{ layer: ing.toLowerCase().substring(0, ing.length - 3) }}
              components={[<br />]}
            ></Trans>
            {messages.map((message, index) => {
              const text =
                index === 0 ? message.split("Error:").join("") : message;
              return index === 0 ? (
                messages.length > 1 ? (
                  <p style={{ marginTop: "0rem" }}>{text}</p>
                ) : (
                  <p style={{ marginTop: "0 rem" }}>{text}</p>
                )
              ) : (
                <ul style={{ paddingLeft: "1rem" }}>
                  <li style={{ margin: "0.2rem 0" }}>{text}</li>
                </ul>
              );
            })}
          </>
        ));
        setalertDialogTitle(t("page.configure.Layer3.ERROR"));
        setDialogOpen(true);
        setStatusColor(status[0]);
        setToggleLoading(false);
        setRunEffect("");
        setToggleState((oldState) => {
          return oldState === t("commons.disabledText") ? toggle[1] : toggle[0];
        });
        setIng("");
      }
    },
    [ing, toggleState],
  );

  /* Call API: toggleState */
  useEffect(() => {
    const isEnabled = toggleState === "Enabled";

    if (runEffect === "toggleSwitch") {
      callAPI({
        path: isEnabled ? "enableLayer3" : "disableLayer3",
        params: { gatewayIP },
        data: null,
        responder: isEnabled ? EnableApiResponder : DisableApiResponder,
        onComplete: onCompleteOfToggleLayer3,
      });
    }
  }, [
    gatewayIP,
    ing,
    modeData.mode,
    onCompleteOfToggleLayer3,
    runEffect,
    toggleState,
  ]);

  const onCompleteGetLayer = (response) => {
    let data = [];
    if (response.state === "GET_LAYER3_SUCCESS") {
      data = response.data;
      let res =
        data.enabled.toLowerCase() === "true"
          ? t("commons.enabledText")
          : t("commons.disabledText");

      setToggleState(res);
    } else {
      setColors(true);
      setStatusColor(status[0]);
      setRunEffect("");
      setDialogOpen(true);
      setStatusText(() => (
        <>
          <Trans
            i18nKey={
              "page.configure.Layer3.Fetch Status.Error.Fetch Error Layer3"
            }
            components={[<br />]}
          >
            Error fetching information about the Layer3 service. Please try
            again.
            <br />
            <br />
            Error Details:
          </Trans>

          {Utility.getErrorsFromResponse(response)}
        </>
      ));
      setMsg((oldState) => ({ ...oldState, disable: true }));
    }
  };

  /* Call API: layer3 */
  useEffect(() => {
    callAPI({
      path: "layer3",
      params: { gatewayIP },
      data: {},
      responder: GetLayerApiResponder,
      onComplete: onCompleteGetLayer,
    });
  }, [gatewayIP]);

  const onCompleteNetworkHandler = (response) => {
    if (response.state === "NETWORK_SUCESS") {
      setModeData(response.data);
      setRunEffect("toggleSwitch");
    } else {
      setToggleState((old) =>
        old === t("commons.disabledText")
          ? t("commons.enabledText")
          : t("commons.disabledText"),
      );
      setToggleLoading(false);
      setDialogOpen(true);
      setIng("");
      setStatusText(() => (
        <>
          <Trans
            i18nKey={
              "page.configure.Layer3.Fetch Status.Error.Fetch Error Gateway"
            }
            components={[<br />]}
          >
            Error fetching information about the gateway mode. please try again.
            <br />
            <br />
            Error Details:
          </Trans>
          {Utility.getErrorsFromResponse(response)}
        </>
      ));
      setRunEffect("");
    }
  };

  /* Call API: getNetwork */
  useEffect(() => {
    if (runEffect === "getNetwork") {
      callAPI({
        path: "network",
        params: { gatewayIP },
        data: {},
        responder: networkAPIResponder,
        onComplete: onCompleteNetworkHandler,
      });
    }
  }, [gatewayIP, runEffect]);

  return (
    <Styled.Wrapper component={"section"}>
      <Styled.Header>
        <AppInContentHeader title={pageTitle} breadcrumb={pageBreadcrumb} />
      </Styled.Header>

      <Styled.ActionStripe>
        <Styled.StripeSegment>
          {loading ? (
            <Styled.LoadingWrapper>
              <WidthFillerSkeleton height="1.5em" />
            </Styled.LoadingWrapper>
          ) : (
            <Styled.Layer3ServiceWrapper>
              <Styled.Layer3ServiceComponents>
                <Styled.ActionStripeTitle
                  theme={{ color: colors ? statusColor : "" }}
                >
                  {t("page.configure.Layer3.LabelText")}
                </Styled.ActionStripeTitle>

                <Styled.ToggleSwitchWrapper>
                  <AntSwitch
                    disabled={msg.disable || toggleLoading}
                    onChange={handleSwitch}
                    checked={toggleState === "Enabled" ? true : false}
                  />
                  <Styled.ToggleSwitchText
                    theme={{ color: colors ? statusColor : "" }}
                  >
                    {colors ? "Error" : ing || toggleState}
                  </Styled.ToggleSwitchText>
                  <Styled.Spinner
                    style={{
                      visibility: toggleLoading ? "visible" : "hidden",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </Styled.ToggleSwitchWrapper>
              </Styled.Layer3ServiceComponents>
            </Styled.Layer3ServiceWrapper>
          )}

          <Styled.Divider orientation="vertical" variant="middle" flexItem />

          <Styled.RadioGroupWrapper>
            {/* <Styled.LayerLabels
              label="NATS"
              value="NATS"
              control={
                <Styled.RadioButton
                  checked={selectedValue === "nats"}
                  onChange={handleChange}
                  value="nats"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Nat" }}
                />
              }
            /> */}
            <Radio
              labelName={t("page.configure.Layer3.Nats Text")}
              value="nats"
              checked={selectedValue === "nats"}
              onChange={handleChange}
              name="radio-buttons"
              inputProps={{ "aria-label": "Nat" }}
            />

            {/* <Styled.LayerLabels
              label="ROUTES"
              value="ROUTES"
              control={
                <Styled.RadioButton
                  checked={selectedValue === "routes"}
                  onChange={handleChange}
                  value="routes"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "Route" }}
                />
              }
            /> */}

            <Radio
              labelName={t("page.configure.Layer3.Routes Text")}
              value="routes"
              checked={selectedValue === "routes"}
              onChange={handleChange}
              name="radio-buttons"
              inputProps={{ "aria-label": "Route" }}
            />
          </Styled.RadioGroupWrapper>
        </Styled.StripeSegment>
      </Styled.ActionStripe>

      <Styled.TableTitleWrapper>
        <Styled.TableTitle>{tableTitle}</Styled.TableTitle>
      </Styled.TableTitleWrapper>

      <Styled.TableWrapper>
        {selectedValue === "nats" ? (
          <Layer3NatManagement loading={loading} setLoading={setLoading} />
        ) : null}
        {selectedValue === "routes" ? (
          <RoutesManagementTable loading={loading} setLoading={setLoading} />
        ) : null}
      </Styled.TableWrapper>

      {/* <AlertDialog
        open={dialogOpen} //
        setOpen={setDialogOpen}
        divider={false}
        contentTitle={alertDialogTitle} //
        contentText={statusText} //
        agreeTitle={"Okay"} //
        handleAgree={() => setDialogOpen(false)} //
        handleDisagree={() => setDialogOpen(false)}
      /> */}
      {/* <AlertDialog
        openPrompt={dialogOpen}
        title={alertDialogTitle}
        content={statusText}
        primaryBtnText={"Okay"}
        primaryVariant={"outlined"}
        onPrimaryClick={() => setDialogOpen(false)}
        handleClose={() => setDialogOpen(false)}
      /> */}
      <AlertDialog
        open={dialogOpen}
        contentTitle={alertDialogTitle}
        contentText={statusText}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setDialogOpen(false)}
        handleDisagree={() => setDialogOpen(false)}
        divider={false}
      />
    </Styled.Wrapper>
  );
}

export default withRouter(withCookies(DataGridRulesConfig));
