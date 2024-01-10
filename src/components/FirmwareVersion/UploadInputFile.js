import { Box } from "@material-ui/core";
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { DROPDOWN } from "./AutocompleteFirmware";
import { INPUTUPLOAD } from "./InputUpload";
import { Styled } from "./MaterialComponents/UploadFile.style";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { Trans, useTranslation } from "react-i18next";

function UploadInputFile(props) {
  const [isHovered, setIsHovered] = useState(false);

  const [showInput, setShowInput] = props.show;
  const [product, setProduct] = props.product;
  const [releaseNum, setReleaseNum] = props.ReleaseNum;
  const [filename, setFileName] = props.Filename;
  const [isUploadSuccess, setisUploadSuccess] = props.IsUploadSuccess;
  const [error, setError] = props.FormErrorState;
  let errorColor;
  const [fileattemptErrorColor, setFileAttemptErrorColor] = useState(false);
  const [helText, setHelpText] = useState("");
  const [helTextRelease, setHelpTextRelease] = useState("");
  const [helTextProduct, setHelpTextProduct] = useState("");
  const [options, setOptions] = useState(["TACID-2"]);
  const [runEffect, setRunEffect] = useState("");
  const [dialogOpen, setDialogOpen] = props.dialog;
  const [diaMsg, setDiaMsg] = props.diaMsg;
  const [releaseAttemptErrorColor, setReleaseAttemptErrorColor] =
    useState(false);
  const [productAttemptErrorColor, setProductAttemptErrorColor] =
    useState(false);
  const [isNameValid, setIsNameValid] = useState(false);

  const { t } = useTranslation();

  const validateName = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9/-\s]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setFileAttemptErrorColor(true);
      setHelpText(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Name Mandatory",
        ),
      );
      return false;
    } else if (regexTest === true) {
      setFileAttemptErrorColor(true);
      setHelpText(
        t("page.Endpoint.Manage Firmware.Upload Firmware File Modal.Regex"),
      );
      return false;
    } else if (value.includes("__")) {
      setFileAttemptErrorColor(true);
      setHelpText(
        t("page.Endpoint.Manage Firmware.Upload Firmware File Modal.Regex"),
      );
      return false;
    } else if (value.endsWith("_")) {
      setFileAttemptErrorColor(true);
      setHelpText(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Valid Version",
        ),
      );
      return false;
    } else {
      setFileAttemptErrorColor(false);
      setHelpText("");
      return true;
    }
  };

  const validateRelease = (value) => {
    const regex = new RegExp(/^([0-9]+\.)([0-9]+\.)([0-9]+\.)([0-9]+)$/);
    const regexTest = !Boolean(regex.test(value));

    if (value.length < 1) {
      setReleaseAttemptErrorColor(true);
      setHelpTextRelease(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Release Mandatory",
        ),
      );
      return false;
    } else if (regexTest) {
      setReleaseAttemptErrorColor(true);
      setHelpTextRelease(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Valid Release",
        ),
      );
      return false;
    } else if (value.endsWith(".")) {
      setReleaseAttemptErrorColor(true);
      setHelpTextRelease(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Release Regex",
        ),
      );
      return false;
    } else if (value.includes("..")) {
      setReleaseAttemptErrorColor(true);
      setHelpTextRelease(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Invalid Version",
        ),
      );
      return false;
    } else if (value === 0) {
      setReleaseAttemptErrorColor(true);
      setHelpTextRelease(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Valid Release",
        ),
      );
      return false;
    } else {
      setReleaseAttemptErrorColor(false);
      setHelpTextRelease("");
      return true;
    }
  };

  const validateProduct = (value) => {
    const regex = new RegExp(/^[A-Za-z0-9/-\s]+$/);
    const regexTest = !Boolean(regex.test(value));

    if (value?.length < 1) {
      setProductAttemptErrorColor(true);
      errorColor = "#cc0000";
      setHelpTextProduct(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Product Mandatory",
        ),
      );
      return false;
    } else if (regexTest) {
      setProductAttemptErrorColor(true);
      errorColor = "#cc0000";
      setHelpTextProduct(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Product Regex",
        ),
      );
      return false;
    } else if (value.endsWith("-")) {
      errorColor = "#cc0000";
      setProductAttemptErrorColor(true);
      setHelpTextProduct(
        t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Product Sample",
        ),
      );
      return false;
    } else {
      setProductAttemptErrorColor(false);
      setHelpTextProduct("");
      errorColor = "";
      return true;
    }
  };

  const validation = () => {
    const $1 = validateName(filename);
    const $2 = validateRelease(releaseNum);
    const $3 = validateProduct(props.singleValueState);

    if ($1 && $2 && $3) {
      setTimeout(() => {
        setRunEffect("validate");
      }, 0);
    }
  };

  const handleProductChange = useCallback((event, selectedOption) => {
    if (
      selectedOption === null ||
      selectedOption === undefined ||
      typeof selectedOption !== "string"
    ) {
      selectedOption = "";
    }

    if (selectedOption.includes('Add "')) {
      selectedOption = selectedOption.match(/Add "(.+)"/)[1];
    }

    props.setSingleValueState(selectedOption);

    setOptions((options) => {
      let lastIndexForOptionsList = options.length - 1;
      if (lastIndexForOptionsList > -1) {
        if (options[lastIndexForOptionsList].includes('Add "')) {
          options.splice(lastIndexForOptionsList, 2);
        }
      }
      if (options.indexOf(selectedOption) === -1) {
        options.push(selectedOption);
      }

      options = options.filter(
        (val) => val.trim() !== "" && val.trim() !== "Type to add ...",
      );

      if (options.length === 0) {
        options.push("Type to add ...");
      }
      return options;
    });

    const newEvent = {
      ...event,
      target: { ...event.target, value: selectedOption || "" },
    };
  }, []);

  const renderInput = useCallback(
    (params) => {
      return (
        <INPUTUPLOAD
          {...params}
          // disabled={props.disableField}
          variant="outlined"
          margin="normal"
          fullWidth
          color="secondary"
          label={t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Product",
          )}
          type="text"
          onBlur={(event) => validateProduct(event.target.value)}
          onFocus={(event) => setHelpTextProduct("")}
          // backgroundOnBlur={productAttemptErrorColor ? "#cc0000" : "#0293fe"}
          borderColorOnFocus={"#0094FD"}
          labelColorOnFocus={"#0094FD"}
          labelColor={errorColor}
          borderColor={errorColor}
          onChange={(event) => {
            if (!!!product) {
              setProduct(event.target.value);
            } else if (product !== event.target.value) {
              setProduct(event.target.value);
            }
            setOptions((options) => {
              let input = event.target.value.trim();
              let lastIndex = options.length - 1;
              if (options.indexOf(input) === -1 && input !== "") {
                if (lastIndex > -1) {
                  if (options[lastIndex].includes('Add "')) {
                    options[lastIndex] = `Add "${input}"`;
                  } else {
                    options.push(`Add "${input}"`);
                  }
                } else {
                  options.push(`Add "${input}"`);
                }
              } else {
                if (lastIndex > -1) {
                  if (options[lastIndex].includes('Add "')) {
                    options.splice(lastIndex, 1);
                  }
                }
              }
              options = options.filter(
                (val) => val.trim() !== "" && val.trim() !== "Type to add ...",
              );
              if (options.length === 0) {
                options.push("Type to add ...");
              }

              return options;
            });
          }}
        />
      );
    },
    [props.disableField],
  );

  const removeErrorOnFormFocus = (event) => {
    setError("");
  };

  useEffect(() => {
    if (product === "") {
      setProduct(props.singleValueState);
    } else {
      if (runEffect === "validate") {
        props.uploadHandler();
        props.setSpinner(true);
      }

      setRunEffect("");
    }
  }, [product, props, runEffect]);

  useEffect(() => {
    setIsNameValid(validateName(filename));
    props.setSingleValueState(product);
    setOptions((oldState) => [...oldState, product || null].filter(($) => $));
  }, []);

  // useEffect(() => {
  //   // if (!!!product) {
  //   //   setProduct(props.singleValueState);
  //   // }
  // }, [product, props.singleValueState]);

  return (
    <>
      {" "}
      <Styled.Wrapper
        theme={{ isHovered }}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box style={{ width: "80%" }}>
          <INPUTUPLOAD
            fullWidth
            type="text"
            disabled={isNameValid || props.disableField}
            variant="outlined"
            margin="normal"
            color="secondary"
            label="Filename"
            backgroundOnBlur={fileattemptErrorColor ? "#cc0000" : "#0094FD"}
            borderColorOnFocus={"#0094FD"}
            labelColorOnFocus={"#0094FD"}
            labelColor={fileattemptErrorColor ? "#cc0000" : ""}
            borderColor={fileattemptErrorColor ? "#cc0000" : ""}
            onFocus={removeErrorOnFormFocus}
            onChange={(event) => setFileName(event.target.value)}
            onBlur={(event) => validateName(event.target.value)}
            value={filename}
          />
          <Styled.StyledError>{helText}</Styled.StyledError>
        </Box>

        <Box style={{ width: "80%" }}>
          <INPUTUPLOAD
            disabled={props.disableField}
            variant="outlined"
            margin="normal"
            fullWidth
            color="secondary"
            label={t(
              "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Release",
            )}
            type="text"
            backgroundOnBlur={releaseAttemptErrorColor ? "#cc0000" : "#0094FD"}
            borderColorOnFocus={"#0094FD"}
            labelColorOnFocus={"#0094FD"}
            labelColor={releaseAttemptErrorColor ? "#cc0000" : ""}
            borderColor={releaseAttemptErrorColor ? "#cc0000" : ""}
            value={releaseNum}
            onFocus={removeErrorOnFormFocus}
            onChange={(event) => setReleaseNum(event.target.value)}
            onBlur={(event) => validateRelease(event.target.value)}
          />
          <Styled.StyledError>{helTextRelease}</Styled.StyledError>
        </Box>

        <Box style={{ width: "80%", padding: "0 0 1em 0" }}>
          <DROPDOWN
            id="free-solo-product-id"
            freeSolo={false}
            disabled={props.disableField}
            options={options}
            getOptionDisabled={(option) => option === "Type to add ..."}
            getOptionLabel={(option) => option}
            value={props.singleValueState}
            renderInput={renderInput}
            onFocus={removeErrorOnFormFocus}
            backgroundOnBlur={"brown"}
            onChange={handleProductChange}
            onBlur={(e) => {
              validateProduct(e.target.value);
            }}
          />

          <Styled.StyledError>{helTextProduct}</Styled.StyledError>
        </Box>

        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "1em 0 0 0 ",
            gap: "2em",
          }}
        >
          <GenericButton
            style={{ height: "35px" }}
            buttonName={t(
              "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Cancel Button",
            )}
            backgroundColor={"secondary"}
            disabled={isUploadSuccess || props.disableField}
            onClick={() => {
              props.markAsLoading();
              setShowInput(false);
            }}
          />

          <GenericButton
            buttonName={
              props.disableField ? (
                <CircularProgress size={20} />
              ) : (
                t(
                  "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Upload Button",
                )
              )
            }
            backgroundColor={"primary"}
            style={{ height: "35px" }}
            disabled={isUploadSuccess || props.disableField}
            onClick={validation}
          />
        </Box>

        {/* <Box>{props.errors}</Box> */}
      </Styled.Wrapper>
      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        divider={false}
        contentTitle={
          props.diaTitle
            ? t(
                "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Task Alert.Title",
              )
            : t(
                "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Error Alert.Title",
              )
        }
        contentText={diaMsg}
        agreeTitle={t(
          "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Error Alert.Ok Button",
        )}
        handleAgree={() => {
          setDialogOpen(false);
          setShowInput(false);
          props.setMessages("");
          props.markAsLoading();
          setisUploadSuccess(false);
          setProduct("");
        }}
      />
    </>
  );
}

export default UploadInputFile;
