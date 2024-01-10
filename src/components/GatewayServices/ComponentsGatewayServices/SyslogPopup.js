import { Box } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import React, { useState } from "react";
import SyslogTable from "./DataGridSyslog/SyslogTable";
import { StyledPopUp } from "../GatewayserviceStyling/Syslog/syslog.style";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import { useTranslation } from "react-i18next";

function SyslogPopup(props) {
  const { t, i18n } = useTranslation();
  const [flag, setFlag] = useState(false);

  return (
    <StyledPopUp.StyledBox>
      <StyledPopUp.HeaderWrapper>
        <StyledPopUp.Typo>
          {t("page.gatewayServer.services.context.remoteSysLog.text")}
        </StyledPopUp.Typo>

        <StyledPopUp.StyledCloseRounded
          id={`${gatewayServices}-syslog-close-icon-btn`}
          onClick={props.handleClosePortalnoBackdrop}
        >
          <CloseRounded />
        </StyledPopUp.StyledCloseRounded>
      </StyledPopUp.HeaderWrapper>

      <Box style={{ height: "400px" }}>
        <SyslogTable
          flag={flag}
          setFlag={setFlag}
          sysData={props.sysData}
          Loading={props.Loading}
          setAlertContent={props.setAlertContent}
          setOpenAlertDialog={props.setOpenAlertDialog}
          context={props.context}
        />
      </Box>
    </StyledPopUp.StyledBox>
  );
}

export default SyslogPopup;
