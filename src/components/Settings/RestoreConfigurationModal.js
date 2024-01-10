import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloseOutlined, CloseRounded } from "@mui/icons-material";
import {
  Box,
  DialogActions,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@mui/material";
import Styled from "./MaterialComponents/RestoreConfigurationModal.style";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { GlobalTextField } from "../../style/TextField/TextField";
import upload from "../../images/upload blue.svg";
import Prompt from "../DeletePrompt/Prompt";
import DropOrChooseFile from "./DropDragFiles";
import Utility from "../../redux/actions/Utility";
import callAPI from "../../apis/callAPI";
import {
  configListResponder,
  restoreConfigResponder,
  importConfigResponder,
} from "../../apis/responders/config-managment-api-responder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { Typography } from "@material-ui/core";
import edit from "../../images/Edit.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useContext } from "react";
import Config from "../../Config";
import OverlayContext from "../AppContent/AppOverlayContext";
import { logoutApiResponder } from "../../apis/responders/logoutApiResponder";
import Auth from "../../redux/actions/Auth";
import { setRecentGateway } from "../../Gateway/recentGatewaySlice";
import { Trans, useTranslation } from "react-i18next";

const byte = 1024;
const decimal = 2;
const kiloBytes = byte;
const megaBytes = kiloBytes * byte;
const gigaBytes = megaBytes * byte;

const TarExtensions = [
  ".tar.gz",
  ".tgz",
  // ".tar.bz2",
  // ".tar.lz",
  // ".tar.lzma",
  // ".tar.lzo",
  // ".tar.xz",
  // ".tar.Z",
  // ".tar.zst",
  // ".tar",
  // ".taz",
  // ".taZ",
  // ".tb2",
  // ".tbz",
  // ".tbz2",
  // ".tlz",
  // ".txz",
  // ".tZ",
  // ".tz2",
  // ".tzst",
];

const TarMimeTypes = [
  "application/gzip",
  "application/lzip",
  "application/tar",
  "application/tar+gzip",
  "application/x-bzip2",
  "application/x-compress",
  "application/x-compressed",
  "application/x-gtar",
  "application/x-gzip",
  "application/x-lzip",
  "application/x-lzma",
  "application/x-tar",
  "application/x-xz",
  "application/zstandard",
  "application/zstd",
];

const initFiles = () => ({
  typename: "",
  size: "",
  disable: true,
  mimeType: "",
  flag: false,
  error: "",
  changeText: true,
  initial: false,
});

const RestoreConfiguration = React.forwardRef(
  ({
    open,
    setOpen,
    handleAgree,
    agreeTitle,
    handleDisagree,
    disagreeTitle,
  }) => {
    const { address: gatewayIP } = useSelector((state) => state.activeGateway);
    const { chassis_model } = useSelector((state) => state.gatewayConfig);
    const gatewayConfig = useSelector((state) => state.gatewayConfig);

    const model = chassis_model === "5010";
    const controller = "Controller";
    const invisigate = "Invisigate";

    const [
      isDisabledImportRestorePromptActions,
      setIsDisabledImportRestorePromptActions,
    ] = useState(false);
    const [toggleType, setToggleType] = React.useState("saved");
    const [configList, setConfigList] = React.useState([]);
    const [configListStatus, setConfigListStatus] = React.useState("");
    const [selectedConfigFileId, setSelectedConfigFileId] = React.useState("");
    const [selectedConfigFileName, setSelectedConfigFileName] =
      React.useState("");
    const [savedFilesComments, setSavedFilesComments] = React.useState("");
    const [isSavedFileCommentsError, setIsSavedFilesCommentsError] =
      React.useState(false);
    const [savedFilesCommentsHelperText, setSavedFilesCommentsHelperText] =
      React.useState("");
    const [savedFilePrompt, setSavedFilePrompt] = React.useState(false);

    const [rescueRestoreComments, setRescueRestoreComments] =
      React.useState("");
    const [disableField, setDisableField] = useState(false);
    const [showInput, setShowInput] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [dragged, setDragged] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [isFileNameError, setIsFileNameError] = useState(false);
    const [fileNameHelperText, setFileNameHelperText] = useState("");
    const [error, setError] = React.useState();
    const [rescueRestorePrompt, setRescueRestorePrompt] = React.useState(false);
    const [isRescueRestoreCommentsError, setIsCommentsError] =
      React.useState(false);
    const [rescueRestoreCommentsHelperText, setCommentsHelperText] =
      React.useState("");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [files, setFiles] = React.useState(initFiles);
    const [messages, setMessages] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState([]);
    const [singleValueState, setSingleValueState] = React.useState("");
    const [commentImport, setCommentImport] = React.useState("");
    const [errorResponse, setErrorResponse] = React.useState(false);
    const [passPhrase, setPassPhrase] = useState("");
    const [passPhraseRestore, setPassPhraseRestore] = useState("");
    const [passPhraseImport, setPassPhraseImport] = useState("");
    const [showPassPhrase, setShowPassPhrase] = useState(false);
    const [isPassPhraseError, setIsPassPhraseError] = useState(false);
    const [passPhraseHelperText, setPassPhraseHelperText] = useState("");
    const [isPassPhraseRestoreError, setIsPassPhraseRestoreError] =
      useState(false);
    const [passPhraseRestoreHelperText, setPassPhraseRestoreHelperText] =
      useState("");
    const [isPassPhraseImportError, setIsPassPhraseImportError] =
      useState(false);
    const [passPhraseImportHelperText, setPassPhraseImportHelperText] =
      useState("");
    const [isImportCommentError, setIsImportCommentError] =
      React.useState(false);
    const [importCommentHelperText, setImportCommentHelperText] =
      React.useState("");
    const [importRestorePrompt, setImportRestorePrompt] = React.useState(false);
    const [uploadText, setUploadText] = useState({ data1: "", data2: "" });
    const [isDisableSubmit, setIsDisableSubmit] = useState(false);

    const { t } = useTranslation();

    let res;

    function ValidateSize(file) {
      if (file < kiloBytes) {
        return (res = file + " B");
      } else if (file < megaBytes) {
        return (res = (file / kiloBytes).toFixed(decimal) + " KB");
      } else if (file < gigaBytes) {
        return (res = (file / megaBytes).toFixed(decimal) + " MB");
      } else {
        return (res = (file / gigaBytes).toFixed(decimal) + " GB");
      }
    }

    const markAsLoading = () => {
      setFiles(() => {
        return {
          typename: "",
          size: "",
          disable: true,
          mimeType: "",
          flag: false,
          error: "",
          changeText: true,
          initial: false,
        };
      });
      setMessages("");
      setFileName("");
      setError("");
      setSingleValueState("");
    };

    const onChanging = (e) => {
      const fileOpen = e.target.files[0];
      setSelectedFile(e.target.files);

      if (e.target.files.length === 0) {
        // TODO: Reset the file dialog.
        markAsLoading();
        // Keep the return statement below. DO NOT remove.
        return;
      }

      let configurationName = fileOpen.name;
      let fileSize = fileOpen.size;
      let filetype = fileOpen.type;
      let val;
      let mimeTar;

      ValidateSize(fileSize);

      val = TarExtensions.map((ext) => configurationName.endsWith(ext)).some(
        (match) => match === true,
      );

      mimeTar = TarMimeTypes.includes(filetype);
      let filename = fileOpen.name.split(".");
      setFileName(filename[0]);
      setDisableField(true);
      //setFileName(configurationName);
      if (val !== true) {
        setFiles(() => {
          return {
            typename: configurationName,
            error: t(
              "page.configure.Configuration.Restore Configuration Moal.Tar",
            ),
            size: res,
            disable: true,
            changeText: false,
            initial: false,
          };
        });
      } else if (fileSize > megaBytes * 60) {
        setFiles(() => {
          return {
            typename: configurationName,
            size: res,
            error: t(
              "page.configure.Configuration.Restore Configuration Moal.Size",
            ),
            disable: true,
            changeText: false,
            initial: false,
          };
        });
      } else if (!mimeTar) {
        setFiles(() => {
          return {
            typename: configurationName,
            error: t(
              "page.configure.Configuration.Restore Configuration Moal.Type",
            ),
            size: res,
            disable: true,
            changeText: false,
            initial: false,
          };
        });
      } else {
        setShowInput(true);

        setFiles(() => {
          return {
            typename: configurationName,
            size: res,
            disable: false,
            changeText: false,
          };
        });
      }

      setFiles((prev) => ({ ...prev, flag: true, changeText: false }));
    };

    const onSave = () => {
      setShowInput(false);
      setSuccess(true);
    };

    const validateFileName = (value) => {
      const regex = new RegExp(/^[a-zA-Z0-9-_]+$/);
      const regexTest = !Boolean(regex.test(value));

      if (value.length < 1) {
        setIsFileNameError(true);
        setFileNameHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Import Configuration.File Name Helper Text1",
          ),
        );
        return true;
      } else if (regexTest) {
        setIsFileNameError(true);
        setFileNameHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Import Configuration.File Name Helper Text2",
          ),
        );
        return true;
      } else if (
        value.endsWith("-") ||
        value.endsWith("_") ||
        value.startsWith("-") ||
        value.startsWith("_")
      ) {
        setIsFileNameError(true);
        setFileNameHelperText("Please provide valid Filename");
        return true;
      } else {
        setIsFileNameError(false);
        setFileNameHelperText("");
        return false;
      }
    };

    const fileNameChangeHandler = (event) => {
      setFileName(event.target.value);
    };

    const fileNameBlurHandler = (event) => {
      validateFileName(event.target.value);
    };

    const toggleRestoreType = (event) => {
      setToggleType(event.target.value);
    };

    const onDropHandler = (e) => {
      setDragged(true);
      e.preventDefault();
      let file = "";
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        file = [...e.dataTransfer.items]
          .find((item) => item.kind === "file")
          .getAsFile();
      } else {
        // Use DataTransfer interface to access the file(s)
        file = e.dataTransfer.files[0];
      }
      setFiles([...files, file]);
      setFileName(file.name);
      setTimeout(() => {
        setShowInput(true);
      }, 5000);
    };

    const onDragOver = (ev) => ev.preventDefault();

    /**  import a configuration and restore comment validation */
    const validateImportComment = (value) => {
      if (!value.length) {
        setIsImportCommentError(false);
        setImportCommentHelperText("");
        return false;
      } else if (value.length >= 64) {
        setIsImportCommentError(true);
        setImportCommentHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Comment Helper Text",
          ),
        );
        return true;
      } else {
        setIsImportCommentError(false);
        setImportCommentHelperText("");
        return false;
      }
    };
    const onChangeComment = (e) => {
      setCommentImport(e.target.value);
    };
    const importCommentsBlurHandler = (event) => {
      validateImportComment(event.target.value);
    };
    /**  import a configuration and restore comment validation */

    const handleDialogClose = () => {
      setDialogOpen(false);

      if (errorResponse) {
        handleDisagree();
      } else {
        handleAgree();
      }
    };

    const restoreConfigOnCompleteHandler = (response, isRestoreFromRescue) => {
      setIsDisabledImportRestorePromptActions(false);

      if (response.state === "RESTORE_CONFIG_SUCCESS") {
        setDialogOpen(true);
        setMessage(
          <>
            <p>
              {gatewayConfig.chassis_model === "5010"
                ? "Controller"
                : "Invisigate"}{" "}
              configuration "{response.data.fileName || selectedConfigFileName}"
              restored successfully.
            </p>

            <p style={{ color: "crimson" }}>
              <b>
                User will be logged out and{" "}
                {gatewayConfig.chassis_model === "5010"
                  ? "Controller"
                  : "Invisigate"}{" "}
                will be restarted.
              </b>
            </p>
          </>,
        );
      } else {
        setDialogOpen(true);
        setErrorResponse(true);
        setMessage(
          <>
            {t("commons.errorMessages.restoreConfiguration", {
              isRestoreFromRescue: isRestoreFromRescue
                ? t("commons.errorMessages.rescue")
                : t("commons.errorMessages.saved"),
            })}
            <br />
            <br />
            {t("commons.errorMessages.errorDetails")}
            <br />
            {Utility.getErrorsFromResponse(response)}
          </>,
        );
      }
    };

    const validateSavedFileComments = (value) => {
      const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
      const regexTest = !Boolean(regex.test(value));

      if (!value.length) {
        setIsSavedFilesCommentsError(false);
        setSavedFilesCommentsHelperText("");
        return false;
      } else if (value.length >= 64) {
        setIsSavedFilesCommentsError(true);
        setSavedFilesCommentsHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Comment Helper Text",
          ),
        );
        return true;
      } else {
        setIsSavedFilesCommentsError(false);
        setSavedFilesCommentsHelperText("");
        return false;
      }
    };

    const toggleConfigFileSelection = (event) => {
      setSelectedConfigFileId(event.target.value);
      setSelectedConfigFileName(event.target.name);
    };

    const savedFilesCommentsChangeHandler = (event) => {
      setSavedFilesComments(event.target.value);
    };

    const savedFilesCommentsBlurHandler = (event) => {
      validateSavedFileComments(event.target.value);
    };

    const restoreSavedFileHandler = () => {
      setSavedFilePrompt(false);

      callAPI({
        path: "restore-config",
        params: { gatewayIP },
        data: {
          isRescue: 0,
          fileName: selectedConfigFileName,
          comments: savedFilesComments,
          passPhrase: btoa(passPhrase),
        },
        responder: restoreConfigResponder,
        onComplete: restoreConfigOnCompleteHandler,
        onCompleteArguments: [],
      });
    };

    const validateRescueRestoreComments = (value) => {
      if (!value.length) {
        setIsCommentsError(false);
        setCommentsHelperText("");
        return false;
      } else if (value.length >= 64) {
        setIsCommentsError(true);
        setCommentsHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Comment Helper Text",
          ),
        );
        return true;
      } else {
        setIsCommentsError(false);
        setCommentsHelperText("");
        return false;
      }
    };

    const rescueRestoreCommentsChangeHandler = (event) => {
      setRescueRestoreComments(event.target.value);
    };

    const rescueRestoreCommentsBlurHandler = (event) => {
      validateRescueRestoreComments(event.target.value);
    };

    const rescueRestoreSubmitHandler = (event) => {
      setRescueRestorePrompt(false);
      const isRestoreFromRescue = true;

      callAPI({
        path: "restore-config",
        params: { gatewayIP },
        data: {
          isRescue: 1,
          fileName: undefined,
          comments: rescueRestoreComments,
        },
        responder: restoreConfigResponder,
        onComplete: restoreConfigOnCompleteHandler,
        onCompleteArguments: [isRestoreFromRescue],
      });
    };

    const configListOnCompleteHandler = (response) => {
      const payload = response.data;

      if (response.state === "CONFIG_LIST_SUCCESS") {
        if (payload.length) {
          setConfigList(payload);
          setSelectedConfigFileId(payload[0].id);
          setSelectedConfigFileName(payload[0].fileName);
        } else {
          setConfigListStatus("No Configurations Found..!");
        }
      } else {
        setConfigListStatus("Error fetching the list..!");
      }
    };

    React.useEffect(() => {
      callAPI({
        path: "config-list",
        params: { gatewayIP, limit: 10 },
        data: {},
        responder: configListResponder,
        onComplete: configListOnCompleteHandler,
        onCompleteArguments: [],
      });
    }, []);

    /* Passphrase last saved configuration */
    const validatePassPhrase = (value) => {
      const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
      const regexTest = !Boolean(regex.test(value));

      if (value.length < 1) {
        setIsPassPhraseError(true);
        setPassPhraseHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase Helper Text1",
          ),
        );
        return true;
      } else if (value.length < 4) {
        setIsPassPhraseError(true);
        setPassPhraseHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase Helper Text2",
          ),
        );
        return true;
      } else {
        setIsPassPhraseError(false);
        setPassPhraseHelperText("");
        return false;
      }
    };

    const toggleViewPassPhrase = (isEye) => {
      setShowPassPhrase(isEye);
    };

    const passPhraseChangeHandler = (event) => {
      setPassPhrase(event.target.value);
    };

    const passPhraseBlurHandler = (event) => {
      validatePassPhrase(event.target.value);
    };
    /* Passphrase last saved configuration */

    /** Passphrase restoring the Rescue Configuration */
    const validateRestorePassPhrase = (value) => {
      const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
      const regexTest = !Boolean(regex.test(value));

      if (value.length < 1) {
        setIsPassPhraseRestoreError(true);
        setPassPhraseRestoreHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Import Configuration.PassPhrase Helper Text1",
          ),
        );
        return true;
      } else if (value.length < 4) {
        setIsPassPhraseRestoreError(true);
        setPassPhraseRestoreHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Import Configuration.PassPhrase Helper Text2",
          ),
        );
        return true;
      } else {
        setIsPassPhraseRestoreError(false);
        setPassPhraseRestoreHelperText("");
        return false;
      }
    };
    const passPhraseRestoreChangeHandler = (event) => {
      setPassPhraseRestore(event.target.value);
    };

    const passPhraseRestoreBlurHandler = (event) => {
      validateRestorePassPhrase(event.target.value);
    };
    /** Passphrase restoring the Rescue Configuration */

    /** Passphrase import a configuration and restore */
    const validateImportPassPhrase = (value) => {
      const regex = new RegExp(/^[A-Za-z0-9-_]+$/);
      const regexTest = !Boolean(regex.test(value));

      if (value.length < 1) {
        setIsPassPhraseImportError(true);
        setPassPhraseImportHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Import Configuration.PassPhrase Helper Text1",
          ),
        );
        return true;
      } else if (value.length < 4) {
        setIsPassPhraseImportError(true);
        setPassPhraseImportHelperText(
          t(
            "page.configure.Configuration.Restore Configuration Moal.Import Configuration.PassPhrase Helper Text2",
          ),
        );
        return true;
      } else {
        setIsPassPhraseImportError(false);
        setPassPhraseImportHelperText("");
        return false;
      }
    };
    const passPhraseImportChangeHandler = (event) => {
      setPassPhraseImport(event.target.value);
    };

    const passPhraseImportBlurHandler = (event) => {
      validateImportPassPhrase(event.target.value);
    };
    /** Passphrase import a configuration and restore */

    /** import-config` and `restore-config API*/
    const ImportHandler = () => {
      setIsDisableSubmit(true);
      setIsDisabledImportRestorePromptActions(true);

      let formData = new FormData();
      let total;
      let loaded;

      formData.append("file", selectedFile[0]);
      setMessages("uploading");

      callAPI({
        path: "import-config",
        params: { gatewayIP },
        data: formData,
        onUploadProgress: (data, setUploadText) => {
          loaded = ValidateSize(data.loaded);
          total = ValidateSize(data.total);
          setUploadText(() => {
            return { data1: loaded, data2: total };
          });

          if (loaded === total) {
            setMessages("equal");
          }
        },
        onUploadProgressArguments: [setUploadText],
        responder: importConfigResponder,
        onComplete: (response) => {
          if (response.state === "IMPORT_CONFIG_SUCCESS") {
            callAPI({
              path: "restore-config",
              params: { gatewayIP },
              data: {
                isRescue: 0,
                fileName: response.data?.fileName ?? "",
                comments: commentImport,
                passPhrase: btoa(passPhraseImport),
              },
              responder: restoreConfigResponder,
              onComplete: restoreConfigOnCompleteHandler,
              onCompleteArguments: [response.data.fileName],
            });
          } else {
            setImportRestorePrompt(false);
            setIsDisabledImportRestorePromptActions(false);
            setDialogOpen(true);
            setErrorResponse(true);
            setMessage(
              <>
                {t("commons.errorMessages.importingConfiguration")}
                <br />
                <br />
                {t("commons.errorMessages.errorDetails")}
                <br />
                {Utility.getErrorsFromResponse(response)}
              </>,
            );
          }
        },
      });

      setFiles((prev) => {
        return {
          ...prev,
          disable: true,
          initial: true,
        };
      });
    };

    return (
      <>
        <Styled.DialogBox
          open={open}
          onClose={setOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: "1em",
              maxWidth: "768px",
              minWidth: "768px",
              height: "530px",
            },
          }}
        >
          <Styled.HeaderBox>
            <Styled.DialogTitle>
              {t(
                "page.configure.Configuration.Restore Configuration Moal.Title",
              )}
            </Styled.DialogTitle>

            <Styled.CloseButton onClick={handleDisagree}>
              <CloseOutlined fontSize="medium" />
            </Styled.CloseButton>
          </Styled.HeaderBox>

          <Styled.DialogContent>
            <Box style={{ width: "38%" }}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={toggleType}
                  onChange={toggleRestoreType}
                >
                  <Styled.FormControlLabel
                    value={`saved`}
                    isSelected={toggleType === "saved"}
                    control={<Radio size="small" />}
                    label={t(
                      "page.configure.Configuration.Restore Configuration Moal.Saved Checkbox",
                    )}
                  />

                  <Styled.FormControlLabel
                    value={`rescue`}
                    isSelected={toggleType === "rescue"}
                    control={<Radio size="small" />}
                    label={t(
                      "page.configure.Configuration.Restore Configuration Moal.Rescue Checkbox",
                    )}
                  />

                  <Styled.FormControlLabel
                    value={`restore`}
                    isSelected={toggleType === "restore"}
                    // checked={value === "restore" || showInput || success}
                    control={<Radio size="small" />}
                    label={t(
                      "page.configure.Configuration.Restore Configuration Moal.Import Checkbox",
                    )}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box style={{ width: "62%" }}>
              {toggleType === "saved" ? (
                <>
                  <Styled.SaveTitle>
                    {t(
                      "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Title",
                    )}
                  </Styled.SaveTitle>

                  <Box style={{ width: "100%" }}>
                    <Styled.ListWrapper>
                      <Styled.ListContainer>
                        {configListStatus ? (
                          <Box
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <Typography>{configListStatus}</Typography>
                          </Box>
                        ) : (
                          <>
                            <Styled.FormControl>
                              <RadioGroup
                                style={{ margin: "0rem 1rem" }}
                                aria-labelledby="saved-configuration-options"
                                name="controlled-radio-buttons-group"
                                defaultValue={selectedConfigFileId}
                                onChange={toggleConfigFileSelection}
                                value={selectedConfigFileId}
                              >
                                {configList.map((config) => {
                                  return (
                                    <>
                                      <Styled.FormControlLabel
                                        key={config.id}
                                        control={<Radio size={"small"} />}
                                        label={config.fileName}
                                        value={config.id}
                                        name={config.fileName}
                                      />

                                      <Divider variant="fullWidth" light />
                                    </>
                                  );
                                })}
                              </RadioGroup>
                            </Styled.FormControl>
                          </>
                        )}
                      </Styled.ListContainer>
                    </Styled.ListWrapper>

                    <Styled.FieldWrapper>
                      <GlobalTextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={t(
                          "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase",
                        )}
                        placeholder={t(
                          "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase",
                        )}
                        InputLabelProps={{ shrink: true }}
                        name="passphrase"
                        autoComplete="passphrase"
                        onChange={passPhraseChangeHandler}
                        onBlur={passPhraseBlurHandler}
                        value={passPhrase}
                        type={!showPassPhrase ? "password" : "text"}
                        error={isPassPhraseError}
                        helperText={passPhraseHelperText}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onMouseUp={() => toggleViewPassPhrase(false)}
                                onMouseDown={() => toggleViewPassPhrase(true)}
                                disabled={isPassPhraseError}
                              >
                                {showPassPhrase ? (
                                  <VisibilityOutlinedIcon
                                    style={{ color: "#0094FD" }}
                                  />
                                ) : (
                                  <VisibilityOffOutlinedIcon
                                    style={{ color: "#0094FD" }}
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Styled.FieldWrapper>

                    <Styled.FieldWrapper>
                      <GlobalTextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        label={t(
                          "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Comment",
                        )}
                        placeholder={t(
                          "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Comment Placeholder",
                        )}
                        InputLabelProps={{ shrink: true }}
                        name="comment"
                        autoComplete="comment"
                        aria-describedby="emailHelp"
                        onChange={savedFilesCommentsChangeHandler}
                        onBlur={savedFilesCommentsBlurHandler}
                        error={isSavedFileCommentsError}
                        helperText={savedFilesCommentsHelperText}
                      />
                    </Styled.FieldWrapper>

                    <DialogActions style={{ padding: "0.5rem 1rem" }}>
                      {disagreeTitle ? (
                        <GenericButton
                          buttonName={t(
                            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Cancel Button",
                          )}
                          backgroundColor="secondary"
                          disabled={false}
                          onClick={handleDisagree}
                        />
                      ) : null}

                      {agreeTitle ? (
                        <GenericButton
                          buttonName={t(
                            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Apply Button",
                          )}
                          backgroundColor="primary"
                          disabled={configListStatus}
                          onClick={() => {
                            const isCommentsError =
                              validateSavedFileComments(savedFilesComments);
                            const isPassPhraseError =
                              validatePassPhrase(passPhrase);
                            if (!isCommentsError && !isPassPhraseError) {
                              setSavedFilePrompt(true);
                            }
                          }}
                        />
                      ) : null}
                    </DialogActions>
                  </Box>
                </>
              ) : toggleType === "rescue" ? (
                <>
                  <Styled.RescueTitle>
                    {t(
                      "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Title",
                    )}
                  </Styled.RescueTitle>
                  <Styled.FieldWrapper>
                    <GlobalTextField
                      fullWidth
                      multiline
                      label={t(
                        "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Comment",
                      )}
                      name="comment"
                      autoComplete="comment"
                      aria-describedby="emailHelp"
                      variant="outlined"
                      margin="normal"
                      placeholder={t(
                        "page.configure.Configuration.Restore Configuration Moal.Rescue Configuration.Comment Placeholder",
                      )}
                      InputLabelProps={{ shrink: true }}
                      value={rescueRestoreComments}
                      onChange={rescueRestoreCommentsChangeHandler}
                      onBlur={rescueRestoreCommentsBlurHandler}
                      error={isRescueRestoreCommentsError}
                      helperText={rescueRestoreCommentsHelperText}
                    />
                  </Styled.FieldWrapper>

                  <DialogActions style={{ padding: "2em 1em 0 0" }}>
                    {disagreeTitle ? (
                      <GenericButton
                        disabled={false}
                        onClick={handleDisagree}
                        backgroundColor="secondary"
                        buttonName={disagreeTitle}
                      />
                    ) : null}

                    {agreeTitle ? (
                      <GenericButton
                        buttonName={t(
                          "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Apply Button",
                        )}
                        backgroundColor={"primary"}
                        onClick={() => {
                          const isError = validateRescueRestoreComments(
                            rescueRestoreComments,
                          );
                          if (!isError) {
                            setRescueRestorePrompt(true);
                          }
                        }}
                        disabled={false}
                      />
                    ) : null}
                  </DialogActions>
                </>
              ) : toggleType === "restore" && !showInput && !success ? (
                <Box style={{ width: "450px" }}>
                  <DropOrChooseFile
                    accept={TarExtensions}
                    onChange={onChanging}
                    disabled={files.initial}
                    onDragOver={onDragOver}
                    onDrop={onDropHandler}
                    fileName={files.name}
                    dragged={dragged}
                    filesFlag={files.flag}
                    filesTypename={files.typename}
                    filesChangeText={files.changeText}
                    filesError={files.error}
                    buttonName={
                      files.changeText ? "Select File" : "Select Different File"
                    }
                    filesSize={files.size !== ""}
                    fileSize={files.size}
                  />
                </Box>
              ) : toggleType === "restore" && showInput && !success ? (
                <>
                  <Styled.FieldWrapper>
                    <GlobalTextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Filename"
                      placeholder="Filename"
                      InputLabelProps={{ shrink: true }}
                      name="fileName"
                      autoComplete="fileName"
                      onChange={fileNameChangeHandler}
                      onBlur={fileNameBlurHandler}
                      value={fileName}
                      disabled={disableField}
                      error={isFileNameError}
                      helperText={fileNameHelperText}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {disableField ? (
                              <IconButton
                                onClick={() => setDisableField(false)}
                              >
                                <img src={edit} alt={"edit"} width={"25px"} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => setDisableField(true)}
                                disabled={fileNameHelperText}
                              >
                                <CloseRounded
                                  style={{ fontSize: "18px", color: "#0094FD" }}
                                />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Styled.FieldWrapper>
                  {/* Passphrase */}
                  <Styled.FieldWrapper>
                    <GlobalTextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      // size="small"
                      label={t(
                        "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase",
                      )}
                      placeholder={t(
                        "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.PassPhrase",
                      )}
                      InputLabelProps={{ shrink: true }}
                      name="passphrase"
                      autoComplete="passphrase"
                      onChange={passPhraseImportChangeHandler}
                      onBlur={passPhraseImportBlurHandler}
                      // aria-describedby="emailHelp"
                      value={passPhraseImport}
                      type={!showPassPhrase ? "password" : "text"}
                      error={isPassPhraseImportError}
                      helperText={passPhraseImportHelperText}
                      // ref={}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onMouseUp={() => toggleViewPassPhrase(false)}
                              onMouseDown={() => toggleViewPassPhrase(true)}
                              disabled={isPassPhraseImportError}
                            >
                              {showPassPhrase ? (
                                <VisibilityOutlinedIcon
                                  style={{ color: "#0094FD" }}
                                />
                              ) : (
                                <VisibilityOffOutlinedIcon
                                  style={{ color: "#0094FD" }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Styled.FieldWrapper>
                  {/* Passphrase */}
                  <Styled.FieldWrapper>
                    <GlobalTextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      multiline
                      label="Comments"
                      placeholder="Enter your comment for future reference"
                      InputLabelProps={{ shrink: true }}
                      name="comments"
                      autoComplete="comments"
                      aria-describedby="emailHelp"
                      onChange={onChangeComment}
                      value={commentImport}
                      onBlur={importCommentsBlurHandler}
                      error={isImportCommentError}
                      helperText={importCommentHelperText}
                      // onBlur={}
                    />
                  </Styled.FieldWrapper>

                  <DialogActions style={{ padding: "2em 1em 0 0" }}>
                    <GenericButton
                      disabled={false}
                      onClick={handleDisagree}
                      backgroundColor="secondary"
                      buttonName={t(
                        "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Cancel Button",
                      )}
                    />

                    <GenericButton
                      //onClick={onSave}
                      //onClick={ImportHandler}
                      onClick={() => {
                        const isErrorFileName = validateFileName(fileName);
                        const isError = validateImportComment(commentImport);
                        const isErrorPassPhrase =
                          validateImportPassPhrase(passPhraseImport);
                        if (
                          !isError &&
                          !isErrorPassPhrase &&
                          !isErrorFileName
                        ) {
                          setImportRestorePrompt(true);
                        }
                      }}
                      width={"11em"}
                      backgroundColor="primary"
                      buttonName={t(
                        "page.configure.Configuration.Restore Configuration Moal.Import Configuration.Apply Button",
                      )}
                      disabled={isDisableSubmit}
                    />
                  </DialogActions>
                </>
              ) : toggleType === "restore" && !showInput && success ? (
                <>
                  <Box style={{ width: "450px" }}>
                    <Styled.Rectangle>
                      <Styled.IconBox>
                        <Styled.IconWrapper>
                          <img src={upload} alt={"upload"} />
                        </Styled.IconWrapper>
                      </Styled.IconBox>

                      <Styled.SuccesContainer>
                        <Styled.SuccessTitle>
                          {t(
                            "page.configure.Configuration.Restore Configuration Moal.Configuration Name",
                          )}{" "}
                        </Styled.SuccessTitle>
                        <Styled.SuccessSubTitle>
                          {fileName}
                        </Styled.SuccessSubTitle>

                        <Styled.SuccessResponse>
                          {t(
                            "page.configure.Configuration.Restore Configuration Moal.Configuration Imported",
                          )}
                        </Styled.SuccessResponse>
                      </Styled.SuccesContainer>

                      <GenericButton
                        disabled={false}
                        onClick={handleDisagree}
                        backgroundColor="primary"
                        buttonName={t(
                          "page.configure.Configuration.Restore Configuration Moal.Close",
                        )}
                      />
                    </Styled.Rectangle>
                  </Box>
                </>
              ) : null}
            </Box>
          </Styled.DialogContent>
        </Styled.DialogBox>

        <Prompt
          open={savedFilePrompt}
          setOpen={setSavedFilePrompt}
          contentTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.Restore Configure Title",
          )}
          contentText={
            <>
              <Trans
                i18nKey={
                  "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.0"
                }
                values={{ modal: model ? controller : invisigate }}
                components={[<br />]}
              >
                Restoring this configuration will cause the{" "}
                {model ? controller : invisigate} to restart.
                <br />
                <br />
                Are you sure you want to restore to this configuration?
                <br />
              </Trans>
              <p style={{ color: "crimson" }}>
                <Trans
                  i18nKey={
                    "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.1"
                  }
                  values={{
                    gateWay:
                      gatewayConfig.chassis_model === "5010"
                        ? "Controller"
                        : "Invisigate",
                  }}
                  components={[<span />, <br />]}
                >
                  NOTE:
                  <span>
                    <br />
                  </span>
                  User will be logged out and{" "}
                  {gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate"}{" "}
                  will be restarted.
                </Trans>
              </p>
            </>
          }
          contentInfo={``}
          agreeTitle={"Restore"}
          disagreeTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Cancel Button",
          )}
          handleAgree={restoreSavedFileHandler}
          handleDisagree={() => setSavedFilePrompt(false)}
        />

        <Prompt
          open={rescueRestorePrompt}
          setOpen={setRescueRestorePrompt}
          contentTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.Restore Rescue Title",
          )}
          contentText={
            <>
              <Trans
                i18nKey={
                  "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.0"
                }
                values={{ modal: model ? controller : invisigate }}
                components={[<br />]}
              >
                Restoring this configuration will cause the{" "}
                {model ? controller : invisigate} to restart.
                <br />
                <br />
                Are you sure you want to restore to this configuration?
                <br />
              </Trans>
              <p style={{ color: "crimson" }}>
                <Trans
                  i18nKey={
                    "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.1"
                  }
                  values={{
                    gateWay:
                      gatewayConfig.chassis_model === "5010"
                        ? "Controller"
                        : "Invisigate",
                  }}
                  components={[<span />, <br />]}
                >
                  NOTE:
                  <span>
                    <br />
                  </span>
                  User will be logged out and{" "}
                  {gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate"}{" "}
                  will be restarted.
                </Trans>
              </p>
            </>
          }
          contentInfo={``}
          agreeTitle={"Restore"}
          disagreeTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Cancel Button",
          )}
          handleAgree={rescueRestoreSubmitHandler}
          handleDisagree={() => setRescueRestorePrompt(false)}
        />
        <Prompt
          open={importRestorePrompt}
          setOpen={setImportRestorePrompt}
          contentTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.Import Configure Title",
          )}
          contentText={
            <>
              <Trans
                i18nKey={
                  "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.0"
                }
                values={{ modal: model ? controller : invisigate }}
                components={[<br />]}
              >
                Restoring this configuration will cause the{" "}
                {model ? controller : invisigate} to restart.
                <br />
                <br />
                Are you sure you want to restore to this configuration?
                <br />
              </Trans>
              <p style={{ color: "crimson" }}>
                <Trans
                  i18nKey={
                    "page.configure.Configuration.Restore Configuration Moal.Action Options.Prompt.Restore Configure Prompt.List.1"
                  }
                  values={{
                    gateWay:
                      gatewayConfig.chassis_model === "5010"
                        ? "Controller"
                        : "Invisigate",
                  }}
                  components={[<span />, <br />]}
                >
                  NOTE:
                  <span>
                    <br />
                  </span>
                  User will be logged out and{" "}
                  {gatewayConfig.chassis_model === "5010"
                    ? "Controller"
                    : "Invisigate"}{" "}
                  will be restarted.
                </Trans>
              </p>
            </>
          }
          contentInfo={``}
          agreeTitle={"Restore"}
          disagreeTitle={t(
            "page.configure.Configuration.Restore Configuration Moal.Last Saved Configurations.Cancel Button",
          )}
          handleAgree={ImportHandler}
          handleDisagree={() => setImportRestorePrompt(false)}
          isDisableActions={isDisabledImportRestorePromptActions}
        />

        <AlertDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          contentTitle={
            error || errorResponse
              ? t("commons.errorAlertTitle")
              : t("commons.TaskCompleted")
          }
          contentText={message}
          handleAgree={handleDialogClose}
          agreeTitle={t("commons.okayText")}
        />
      </>
    );
  },
);

export default RestoreConfiguration;
