import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl, InputLabel, Select } from "@mui/material";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Widegetdropdown(props) {
  const { t, i18n } = useTranslation();
  const [dropVal, setDropVal] = React.useState("");
  const [dropValTwo, setDropValTwo] = React.useState("");
  const gatewayConfig = useSelector((state) => state.gatewayConfig);

  useEffect(() => {
    if (dropVal == "10") {
      props.toggleHandler();
    } else if (dropVal == "20") {
      props.toggleHandler();
    }
  }, [dropVal]);

  useEffect(() => {
    if (dropValTwo === "bump0" || dropValTwo === "mgt") {
      props.toggleHandlerServices();
    }
  }, [dropValTwo]);

  return (
    <div>
      {props.title === "Statistics" ? (
        <FormControl variant="standard">
          <StyledSelect
            defaultValue={props.toggleShow !== "5010" ? "10" : "20"}
            onChange={(e) => setDropVal(e.target.value)}
            disableUnderline
          >
            {props.toggleShow !== "5010" && (
              <StyledMenuItem value={"10"}>
                {t("page.home.dashboard.statistics.dropdown.trusted")}
              </StyledMenuItem>
            )}
            <StyledMenuItem value={"20"}>
              {t("page.home.dashboard.statistics.dropdown.untrusted")}
            </StyledMenuItem>
          </StyledSelect>
        </FormControl>
      ) : props.title === "Services" ? (
        <>
          {gatewayConfig.chassis_model !== "5010" ? (
            <FormControl variant="standard">
              <StyledSelect
                value={props.serviceToggle}
                onChange={(e) => {
                  setDropValTwo(e.target.value);
                }}
                disableUnderline
              >
                <StyledMenuItem value={"bump0"}>bump0</StyledMenuItem>
                <StyledMenuItem value={"mgt"}>mgt</StyledMenuItem>
              </StyledSelect>
            </FormControl>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default Widegetdropdown;

const StyledMenuItem = styled(MenuItem)`
  font-family: Inter;
`;
const StyledSelect = styled(Select)`
  font-family: Inter;
`;
