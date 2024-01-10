import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import React, { useContext, useRef, useState } from "react";
import Config from "../../Config";
import Portal from "../../Portal";
import { usePortalState } from "../../Portal/hooks/usePortalState";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import UploadFile from "../FirmwareVersion/UploadFile";
import FirmwareTable from "./FirmwareTable";
import { Styled } from "./MaterialComponents/Firmware.style";
import { Trans, useTranslation } from "react-i18next";

function Firmware(props) {
  const AppConfig = useContext(Config);
  const childRef = useRef();

  const [portalState, setPortalState] = usePortalState();
  const [showInput, setShowInput] = useState(false);
  let [gridRows, setGridRows] = useState([]);

  const { t } = useTranslation();

  const toggleOpen = () => {
    setPortalState((prev) => {
      return { ...prev, isPortal: true };
    });
  };

  const handleClosePortal = (event, setPortalState) => {
    setPortalState((prev) => {
      return {
        ...prev,
        isPortal: true,
      };
    });

    // childRef.current.getAlert();
    // setShowInput(true);
  };

  const handleClose = () => {
    setPortalState({ isPortal: false });
  };

  return (
    <>
      <AppInContentHeader
        title={AppConfig.pages.mfw.title}
        breadcrumb={AppConfig.pages.mfw.breadcrumb}
      />
      {/* <Box
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          padding: "0 16em",
        }}
      >
        < Styled.StyledButton onClick={toggleOpen}>
          <FileUploadOutlinedIcon />
          Upload
        </ Styled.StyledButton>
      </Box> */}
      <Styled.StyledBoxFirm>
        <Styled.StyledUploadButton
          buttonName={t("page.Endpoint.Manage Firmware.Upload Button")}
          Icon={
            <FileUploadRoundedIcon
              style={{ width: "0.8em", height: "0.8em" }}
            />
          }
          startIcon={<FileUploadRoundedIcon />}
          onClick={toggleOpen}
          disabled={false}
          width={"17em"}
        />

        <FirmwareTable firmware={[gridRows, setGridRows]} />
      </Styled.StyledBoxFirm>

      <Portal
        PortalState={[portalState, setPortalState]}
        handleClosePortal={handleClosePortal}
      >
        <UploadFile
          handleClose={handleClose}
          showInputs={[showInput, setShowInput]}
          firmware={[gridRows, setGridRows]}
          ref={childRef}
        />
      </Portal>
    </>
  );
}

export default Firmware;
