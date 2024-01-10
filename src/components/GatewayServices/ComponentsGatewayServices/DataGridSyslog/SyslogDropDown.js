import { Box } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import { updateSyslogResponder } from "../../../../apis/responders/SyslogGetResponder";
import Utility from "../../../../redux/actions/Utility";
import { gatewayServices } from "../../../../utils/GeneralComponentNames";
import WidthFillerSkeleton from "../../../General/WidthFillerSkeleton";
import { GenericButton } from "../../../../style/GenericButton/GenericButton";
import AlertDialogGw from "../../Utils/AlertDialogGw";
import { useTranslation } from "react-i18next";

const initAlertContent = {
  contentTitle: "",
  contentText: "",
  contentInfo: "",
  callback: () => {},
};

function SyslogDropDown({ setIsTableSetup, context, ...props }) {
  const translationPath = `page.gatewayServer.services.context.remoteSysLog.dropdown`;

  const { t, i18n } = useTranslation();

  const { init, init1, gatewayIP, ConfigLoading } = props;

  const [data, setData] = useState();
  const [syslogFormat, setSyslogFormat] = useState();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertContent, setAlertContent] = useState(initAlertContent);
  const [oldData, setOldData] = useState({ data1: null, data2: null });

  const format = syslogFormat === "WELF" ? 0 : 1;
  const debug = data === "Enabled" ? 1 : 0;

  const handleSave = (event) => {
    if (syslogFormat === oldData.data1 && oldData.data2 === data) {
      setOpenAlertDialog(true);

      setAlertContent({
        contentTitle: t(`${translationPath}.save.warn.title`),
        contentText: <>{t(`${translationPath}.save.warn.info`)}</>,
        contentInfo: "",
      });
    } else {
      callAPI({
        path: "updateSyslogConfig",
        params: { gatewayIP, context },
        data: { format, debug },
        responder: updateSyslogResponder,
        onComplete: (response) => {
          if (response.state === "UPDATE_SUCCESS") {
            setOpenAlertDialog(true);

            setAlertContent({
              contentTitle: t(`${translationPath}.save.success.title`),
              contentText: <>{t(`${translationPath}.save.success.info`)}</>,
              contentInfo: "",
            });

            setTimeout(() => {
              props.setFlag(false);
            }, 1000);
          } else {
            setOpenAlertDialog(true);
            setAlertContent({
              contentTitle: `${t(`${translationPath}.save.error.title`)}..!`,
              contentText: (
                <>
                  {t(`${translationPath}.save.error.info.0`)}
                  <br />
                  <br />
                  {t(`${translationPath}.save.error.info.1`)}
                  <br />
                  {Utility.getErrorsFromResponse(response)}
                </>
              ),
              contentInfo: "",
            });
          }
        },
      });
    }
  };

  const handleCancel = (event) => {
    setIsTableSetup(false);
    props.setFlag(false);
  };

  useEffect(() => {
    setSyslogFormat(init ? "LEEF" : "WELF");
    setData(init1 ? "Enabled" : "Disabled");
    setOldData((oldState) => ({
      data1: init ? "LEEF" : "WELF",
      data2: init1 ? "Enabled" : "Disabled",
    }));
  }, [init, init1]);

  return (
    <Box>
      {ConfigLoading ? (
        <div style={{ padding: "2em 2em" }}>
          <WidthFillerSkeleton height="380" />
        </div>
      ) : (
        <StyledBox style={{ visibility: props.flag ? "visible" : "hidden" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "4em",
            }}
          >
            <div>
              <StyledFormControlComponent
                variant="outlined"
                style={{ width: "350px" }}
              >
                <InputLabel id={`${gatewayServices}-syslog-setup-format-label`}>
                  {t(`${translationPath}.syslogFormat.text`)}
                </InputLabel>

                <Select
                  labelId={`${gatewayServices}-syslog-setup-format-label`}
                  id={`${gatewayServices}-syslog-setup-format`}
                  value={syslogFormat}
                  onChange={(e) => setSyslogFormat(e.target.value)}
                  label={t(`${translationPath}.syslogFormat.text`)}
                  class="select-dd"
                  style={{ fontWeight: "400" }}
                >
                  <MenuItem style={{ fontWeight: "400" }} value={"WELF"}>
                    WELF (Invisigate Default)
                  </MenuItem>

                  <MenuItem style={{ fontWeight: "400" }} value={"LEEF"}>
                    LEEF
                  </MenuItem>
                </Select>
              </StyledFormControlComponent>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2em",
            }}
          >
            <div style={{ marginTop: "1em" }} />

            <div>
              <StyledFormControlComponent
                variant="outlined"
                style={{ width: "350px" }}
              >
                <InputLabel
                  id={`${gatewayServices}-syslog-setup-enabled-label`}
                >
                  {t(`${translationPath}.syslogDebugMode.text`)}
                </InputLabel>

                <Select
                  labelId={`${gatewayServices}-syslog-setup-enabled-label`}
                  id={`${gatewayServices}-syslog-setup-enabled`}
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                  label={t(`${translationPath}.syslogDebugMode.text`)}
                  class="select-dd"
                  style={{ fontWeight: "400" }}
                >
                  <MenuItem style={{ fontWeight: "400" }} value={"Enabled"}>
                    {t(`${translationPath}.enabledText`)}
                  </MenuItem>

                  <MenuItem style={{ fontWeight: "400" }} value={"Disabled"}>
                    {t(`${translationPath}.disabledText`)}
                  </MenuItem>
                </Select>
              </StyledFormControlComponent>
            </div>
          </div>

          <StyledButton>
            <GenericButton
              id={`${gatewayServices}-syslog-setup-cancel-btn`}
              buttonName={t("commons.cancelText")}
              disabled={false}
              onClick={handleCancel}
              backgroundColor="secondary"
            />

            <GenericButton
              backgroundColor="primary"
              id={`${gatewayServices}-syslog-setup-save-btn`}
              buttonName={t("commons.saveText")}
              disabled={false}
              onClick={handleSave}
            />
          </StyledButton>
        </StyledBox>
      )}

      <AlertDialogGw
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        contentTitle={alertContent.contentTitle}
        contentText={alertContent.contentText}
        contentInfo={alertContent.contentInfo}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setOpenAlertDialog(false)}
        handleDisagree={() => setOpenAlertDialog(true)}
      />
    </Box>
  );
}

export default SyslogDropDown;

const StyledBox = styled(Box)`
  height: 500px;
  width: 100%;
  margin: auto;
`;

const StyledFormControlComponent = styled(FormControl)`
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #018ff6;
  }

  .Mui-focused {
    color: #018ff6;
  }

  margin: 1em 0 0 0;
`;

const StyledButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3em;
  gap: 10px;
`;
