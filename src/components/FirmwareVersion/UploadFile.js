import { Box, Typography } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import callAPI from "../../apis/callAPI";
import { uploadResponder } from "../../apis/responders/uploadResponder";
import upload from "../../images/upload blue.svg";
import zip_2 from "../../images/zip_2.svg";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import { Styled } from "./MaterialComponents/UploadFile.style";
import UploadInputFile from "./UploadInputFile";
import { Trans, useTranslation } from "react-i18next";

const UploadFile = forwardRef((props, ref) => {
  const AppOverlayContext = useContext(OverlayContext);

  const [gridRows, setGridRows] = props.firmware;
  const [showInput, setShowInput] = props.showInputs;

  const [selectedFile, setSelectedFile] = useState([]);
  const [filename, setFileName] = useState("");
  const [releaseNum, setReleaseNum] = useState("");
  const [product, setProduct] = useState("");
  const [messages, setMessages] = useState();
  const [error, setError] = useState();
  const [disableField, setDisableField] = useState(false);
  const [isUploadSuccess, setisUploadSuccess] = useState(false);
  const [singleValueState, setSingleValueState] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [diaMsg, setDiaMsg] = useState();
  const [diaTitle, setDiaTitle] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [files, setFiles] = useState({
    typename: "",
    size: "",
    disable: true,
    mimeType: "",
    flag: false,
    error: "",
    changeText: true,
    initial: false,
  });

  const [uploadText, setUploadText] = useState({
    data1: "",
    data2: "",
  });

  const { t } = useTranslation();

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
    setProduct("");
    setReleaseNum("");
    setFileName("");
    setError("");
    setSingleValueState("");
  };

  useImperativeHandle(ref, () => ({
    getAlert() {
      markAsLoading();
    },
  }));

  const TarExtensions = [
    ".tar.bz2",
    ".tar.gz",
    ".tar.lz",
    ".tar.lzma",
    ".tar.lzo",
    ".tar.xz",
    ".tar.Z",
    ".tar.zst",
    ".tar",
    ".taz",
    ".taZ",
    ".tb2",
    ".tbz",
    ".tbz2",
    ".tgz",
    ".tlz",
    ".txz",
    ".tZ",
    ".tz2",
    ".tzst",
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

  let res;
  var byte = 1024;
  var decimal = 2;
  var kiloBytes = byte;
  var megaBytes = byte * byte;
  var gigaBytes = byte * byte * byte;

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

  const onChanging = (e) => {
    const fileOpen = e.target.files[0];
    setSelectedFile(e.target.files);
    if (e.target.files.length === 0) {
      // TODO: Reset the file dialog.
      markAsLoading();
      // Keep the return statement below. DO NOT remove.
      return;
    }
    let formName = fileOpen.name;
    let fileSize = fileOpen.size;
    let filetype = fileOpen.type;
    let val;

    let mimeTar;

    ValidateSize(fileSize);
    val = TarExtensions.map((ext) => formName.endsWith(ext)).some(
      (match) => match === true,
    );

    mimeTar = TarMimeTypes.includes(filetype);

    let splitedFileName = fileOpen.name.split("_R");
    const filename = splitedFileName[0].split("_").join(" ");
    let ReleaseVersion = splitedFileName[1];

    const productID = fileOpen.name?.split("_K")[1]?.split("_") ?? "";
    const [productName] = TarExtensions.map((ext) => {
      if (productID[productID?.length - 1]?.includes(ext)) {
        return productID[productID.length - 1]?.split(ext)[0] ?? "";
      } else {
        return false;
      }
    }).filter(($) => $);

    if (fileOpen.name.includes("_R")) {
      setFileName(filename);

      if (ReleaseVersion.includes("_")) {
        let splitedNew = ReleaseVersion.split("_");
        setReleaseNum(splitedNew[0]);

        setProduct(productName);
      } else {
        let result = ReleaseVersion.slice(0, ReleaseVersion.lastIndexOf("."));
        setReleaseNum(result);
      }
    } else {
      let vals = fileOpen.name.split(".");

      setFileName(vals[0].split("_").join(""));
    }
    if (val !== true) {
      setShowInput(false);
      setFiles(() => {
        return {
          typename: formName,
          error: t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Tar",
          ),
          size: res,
          disable: true,
          changeText: false,
          initial: false,
        };
      });
    } else if (fileSize > megaBytes * 60) {
      setShowInput(false);

      setFiles(() => {
        return {
          typename: formName,
          size: res,
          error: t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Size",
          ),
          disable: true,
          changeText: false,
          initial: false,
        };
      });
    } else if (!mimeTar) {
      setShowInput(false);

      setFiles(() => {
        return {
          typename: formName,
          error: t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Type",
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
          typename: formName,
          size: res,
          disable: false,
          changeText: false,
        };
      });
    }
    setFiles((prev) => {
      return {
        ...prev,
        flag: true,
        changeText: false,
      };
    });
  };

  const CancelEvent = () => {
    props.handleClose();
    markAsLoading();
    setShowInput(false);
  };

  const onCompleteUploadHandler = (response, setUploadText) => {
    let data = response.data;

    if (response.state === "UPLOAD_SUCCESS") {
      setDisableField(false);
      setSpinner(false);
      setGridRows((oldState) => [...oldState, { ...data }]);
      setMessages("success");
      setisUploadSuccess(true);
      // setTimeout(() => {
      //   setMessages("");
      //   markAsLoading();
      //   //setShowInput(false);
      //   setisUploadSuccess(false);
      //   setProduct("");
      // }, 5000);
      setDialogOpen(true);
      setDiaTitle(true);
      setDiaMsg(
        <>
          {t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Task Alert.Message",
          )}
        </>,
      );
    } else {
      setDialogOpen(true);
      setSpinner(false);
      setDiaTitle(false);
      setDiaMsg(
        <>
          {t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Error Alert.Message",
          )}
          <br />
          <br />
          {t(
            "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Error Alert.Details Title",
          )}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );
      setMessages("");
      setFiles((prev) => {
        return {
          ...prev,
          disable: true,
          initial: false,
        };
      });
    }
    setTimeout(() => {
      //  setError("");
      setDisableField(false);
    }, 100);
  };

  const uploadHandler = () => {
    let barArray = {
      product: product,
      release: releaseNum,
    };
    let formData = new FormData();
    let total;
    let loaded;

    formData.append("file", selectedFile[0]);
    formData.append("firmware", JSON.stringify(barArray));
    setMessages("uploading");
    callAPI({
      path: "import-file",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
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
      responder: uploadResponder,
      onComplete: onCompleteUploadHandler,
    });
    setDisableField(true);
    setFiles((prev) => {
      return {
        ...prev,
        disable: true,
        initial: true,
      };
    });
  };

  return (
    <Styled.StyledBox>
      <Styled.StyledHead
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "rgba(2, 147, 254, 1)",
        }}
      >
        <div>
          <Typography
            style={{
              fontWeight: "600",
              padding: "0 0 0 1em",
            }}
          >
            {t(
              "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Title",
            )}
          </Typography>
        </div>

        <div>
          <Styled.CloseButton onClick={CancelEvent}>
            <CloseOutlined fontSize="medium" />
          </Styled.CloseButton>
        </div>
      </Styled.StyledHead>

      {showInput ? (
        <UploadInputFile
          Filename={[filename, setFileName]}
          ReleaseNum={[releaseNum, setReleaseNum]}
          product={[product, setProduct]}
          show={[showInput, setShowInput]}
          FormErrorState={[error, setError]}
          markAsLoading={markAsLoading}
          uploadHandler={uploadHandler}
          messageText={messageText}
          uploadText={uploadText}
          messages={messages}
          setMessages={setMessages}
          errors={error}
          files={files.disable}
          disableField={disableField}
          dialog={[dialogOpen, setDialogOpen]}
          diaMsg={[diaMsg, setDiaMsg]}
          diaTitle={diaTitle}
          IsUploadSuccess={[isUploadSuccess, setisUploadSuccess]}
          singleValueState={singleValueState}
          setSingleValueState={setSingleValueState}
          spinner={spinner}
          setSpinner={setSpinner}
        />
      ) : (
        <Box style={{ margin: " auto" }}>
          <Styled.StyledRectangle>
            <Styled.StyledIcnTypo>
              <Styled.IconWrapper>
                {files.flag ? (
                  <Styled.StyledImageBanner src={zip_2} />
                ) : (
                  <img src={upload} alt={"upload"} />
                )}
              </Styled.IconWrapper>
              <Box>
                <Styled.StyledTypography>
                  <p>{files.typename}</p>
                </Styled.StyledTypography>

                {files.changeText ? (
                  <Box style={{ marginTop: "auto" }}>
                    <Styled.StyledTypography>
                      {t(
                        "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Line1",
                      )}{" "}
                    </Styled.StyledTypography>
                    <Styled.StyledTypography>
                      {" "}
                      {t(
                        "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Line2",
                      )}
                    </Styled.StyledTypography>
                    <Styled.StyledTypography>
                      {t(
                        "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Line3",
                      )}
                    </Styled.StyledTypography>
                  </Box>
                ) : null}

                <Styled.StyledTypographySize>
                  {files.size === "" ? null : (
                    <Styled.FileSizeText>{files.size}</Styled.FileSizeText>
                  )}
                </Styled.StyledTypographySize>
              </Box>
            </Styled.StyledIcnTypo>

            <p
              style={{
                margin: "1em auto",
                textAlign: "center",
                fontSize: "12px",
                color: "crimson",
              }}
            >
              {files.error}
            </p>
            <Box style={{ margin: "0.2rem 0.5rem 0.2rem 0" }}>
              <input
                type="file"
                style={{ display: "none" }}
                id="contained-button"
                onChange={onChanging}
                accept={TarExtensions}
                disabled={files.initial}
                multiple
              />
              <Styled.FileBtn
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "0.3rem",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                htmlFor="contained-button"
              >
                {files.changeText
                  ? t(
                      "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Select Button",
                    )
                  : t(
                      "page.Endpoint.Manage Firmware.Upload Firmware File Modal.Different Button",
                    )}
              </Styled.FileBtn>
            </Box>
          </Styled.StyledRectangle>
        </Box>
      )}
    </Styled.StyledBox>
  );
});

export default UploadFile;

function messageText(uploadText, messages) {
  if (messages === "uploading") {
    return (
      <p
        style={{
          textAlign: "center",
          margin: "-2em 1em 1em 1em",
          fontSize: "14px",
        }}
      >{`Uploaded ${uploadText.data1} of ${uploadText.data2}...`}</p>
    );
  } else if (messages === "success") {
    return "";
  } else if (messages === "equal") {
    return (
      <p
        style={{
          margin: "-2em 1em 1em 1em",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        Processing uploaded file ...
      </p>
    );
  } else if (messages === "empty") {
    return <p>Uploading ...</p>;
  }
}
