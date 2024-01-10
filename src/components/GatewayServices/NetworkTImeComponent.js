import React from "react";
import Style from "../../style";
import { gatewayServices } from "../../utils/GeneralComponentNames";
import { AntSwitch, Styled } from "./ComponentsGatewayServices/AntSwitch";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function NetworkTImeComponent(props) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        background: "",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          background: "",
          width: "35%",
          display: "flex",
          alignItems: "center",
          paddingLeft: "1em",
        }}
      >
        <Typography
          style={{
            fontWeight: "600",
            fontFamily: "Inter",
          }}
        >
          {t(`page.gatewayServer.services.context.networkTimeProtocol.text`)}
        </Typography>
      </div>
      <div
        style={{
          background: "",
          width: "60%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        container
        item
        xs={6}
        direction="row"
      >
        <div
          style={{
            width: "40%",
            background: "",
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <Styled.Spinner
            style={{
              visibility: props.radioIasChecked ? "visible" : "hidden",
              width: "20px",
              height: "20px",
            }}
          />
          <Typography
            style={{
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#6c757d",
            }}
          >
            {props.isNtpChecked
              ? props.radioNTPChecked
                ? t(`commons.enablingText`)
                : t(`commons.enabledText`)
              : props.radioNTPChecked
              ? t(`commons.disablingText`)
              : t(`commons.disabledText`)}
          </Typography>

          <AntSwitch
            id={`${gatewayServices}-ntp-toggle`}
            style={{ cursor: "not-allowed" }}
            checked={props.isNtpChecked}
          />
        </div>

        <div style={{ width: "20%" }}>
          <Style.GenericButton
            id={`${gatewayServices}-network-time-protocol-btn`}
            backgroundColor="primary"
            buttonName={t(`commons.viewText`)}
            Icon={
              <OpenInFullOutlinedIcon
                style={{ width: "0.8em", height: "0.8em" }}
              />
            }
            disabled={false}
            onClick={() => {
              props.networkCall();
              props.setRunEffect1("ntp");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default NetworkTImeComponent;
