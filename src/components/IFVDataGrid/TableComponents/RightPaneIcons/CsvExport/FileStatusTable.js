import React, { useState, useRef, Suspense, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import styled from "styled-components";
import { Box, Button } from "@material-ui/core";
import GenericButton from "../MaterialComponents/GenericButton";
import callAPI from "../../../../../apis/callAPI";
import WidthFillerSkeleton from "../../../../General/WidthFillerSkeleton";
import { Trans, useTranslation } from "react-i18next";
import AlertDialog from "src/components/IFVDataGrid/GridPortal/AlertDialog";
import ReplayRoundedIcon from "@material-ui/icons/ReplayOutlined";

const AsyncIFVDataGrid = React.lazy(() => import("../../../IFVDataGrid"));

export const FileStatusTable = (props) => {
  const { t } = useTranslation();
  const columns = [
    {
      headerName: t("commons.Component.Table Content.ID Field.Header Name"),
      dataKey: "id",
      type: "text",
      minWidth: 120,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
      hideColumn: true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.File ID Field.Header Name",
      ),
      dataKey: "file_id",
      type: "text",
      minWidth: 150,
      flexWidth: 1.5,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      type: "text",
      minWidth: 300,
      flexWidth: 3,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.Status Field.Header Name"),
      dataKey: "status",
      type: "text",
      minWidth: 150,
      flexWidth: 1.5,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Status Notes Field.Header Name",
      ),
      dataKey: "status_notes",
      type: "text",
      minWidth: 500,
      flexWidth: 5,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Staged Date Field.Header Name",
      ),
      dataKey: "staged_date",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.Group Field.Header Name"),
      dataKey: "group",
      type: "text",
      minWidth: 140,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.IPv4 Field.Header Name"),
      dataKey: "ip1",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.IPv6 Field.Header Name"),
      dataKey: "ip2",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.MAC Field.Header Name"),
      dataKey: "mac",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Trust Level Field.Header Name",
      ),
      dataKey: "trust_level",
      type: "text",
      minWidth: 150,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t("commons.Component.Table Content.UDP Field.Header Name"),
      dataKey: "udp_enable",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.TCP Tagging Field.Header Name",
      ),
      dataKey: "tcp_ident_tag",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Remote Key Field.Header Name",
      ),
      dataKey: "rmtkey",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Enabled Field.Header Name",
      ),
      dataKey: "enable_flag",
      type: "text",
      minWidth: 200,
      flexWidth: 2,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      type: "text",
      minWidth: 500,
      flexWidth: 5,
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {},
      inputValidator: (event, row) => true,
    },
    {
      headerName: t(
        "commons.Component.Table Content.Action Option.Header Name",
      ),
      dataKey: "__action",
      type: "actions",
      minWidth: 100,
      headerAlignment: "center",
      contentAlignment: "left",
      sortable: false,
      hideAction: true,
      actions: [],
    },
  ];

  const config = { editMode: "inline", globalSearch: true };

  let subconscious = {
    name: "ba-view-bulk-records", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
    sort: {
      column: "name", // Can be a string, a valid dataKey of one of the defined columns; Default: dataKey of first column
      inverse: false, // Boolean, determines
    },
    pageSize: 10,
    page: 1,
    chunk: 0,
    handleLoadMoreData: (TableRows, Subconscious, LastButton) => {
      const successCode = "SUCCESS";
      const failureCode = "FAILURE";

      const [tableRows, setTableRows] = TableRows;
      const [gridSubconscious, setGridSubconscious] = Subconscious;
      const [gotoLastButton, setGotoLastButton] = LastButton;

      const file_id = tableRows[0]["file_id"];
      const page = gridSubconscious.chunk + 1;

      callAPI({
        path: "getStagingIdentityList",
        params: { gatewayIP, file_id, page },
        data: {},
        responder: (res, onComplete, onCompleteArgs = []) => {
          const isGoodResponse = res.state === "GOOD_RESPONSE";
          const is200 = res.response.code === 200;

          const state = isGoodResponse && is200 ? successCode : failureCode;
          const data =
            isGoodResponse && is200
              ? res.response.body
              : {
                  catchError: res?.error ?? undefined,
                  error: res?.response?.error ?? undefined,
                  errorFromJSON: res?.response?.errorFromJSON ?? undefined,
                };

          onComplete({ state, data }, ...onCompleteArgs);
        },
        onCompleteArguments: [TableRows, Subconscious, LastButton],
        onComplete: (response, TableRows, Subconscious, LastButton) => {
          const isSuccess = response.state === successCode;
          const payload = response.data ?? [];

          const [tableRows, setTableRows] = TableRows;
          const [gridSubconscious, setGridSubconscious] = Subconscious;
          const [gotoLastButton, setGotoLastButton] = LastButton;

          const disabled = !!!payload.length;

          setGridSubconscious((oldState) => ({
            ...oldState,
            page: oldState.totalPages,
            chunk:
              isSuccess && !!payload.length
                ? oldState.chunk + 1
                : oldState.chunk,
          }));

          // Not mandatory, But usefull with big payload
          setTimeout(() => {
            setGotoLastButton((oldState) => {
              const newState = { ...oldState, loading: false, disabled };
              return isSuccess
                ? newState
                : { ...oldState, loading: false, disabled };
            });

            setTableRows((oldState) => {
              const newState = [...oldState, ...payload];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let { rows, updateModalHeaderText, unProcessedFileId } = props;
  const { address: gatewayIP } = useSelector(($) => $.activeGateway);

  const initDataGridKey = () => subconscious.name + "-" + new Date().getTime();

  const dataGridRef = useRef();
  const [loading, setLoading] = useState(true);
  const [dataGridKey, setDataGridKey] = useState(initDataGridKey);
  const [gridConfig, setGridConfig] = useState(config);
  const [gridCols, setGridCols] = useState(columns);
  const [gridSubconscious, setGridSubconscious] = useState(subconscious);
  const [gridRows, setGridRows] = useState([]);

  const [showFileRecordStatus, setShowFileRecordStatus] = useState(null);
  const [recordInProgressList, setRecordInProgressList] = useState(null);
  const [recordProgressStatus, setRecordProgressStatus] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogBoxState, setDialogBoxState] = useState({
    contentTitle: "",
    contentText: "",
  });

  const showFileRecodProgress = (response) => {
    if (response.state === "FETCH_SUCCESS") {
      const fileDetails = {
        fileName: response.fileName,
        uploadDate: response.uploadDate,
        uploadTime: response.uploadTime,
      };

      const recordProgressStatusList = response?.data;

      updateModalHeaderText(fileDetails);
      setRecordInProgressList(recordProgressStatusList);
      setGridRows(
        response?.data.map(($) => {
          const staged_date1 = $.staged_date.split(" ")[0];
          const staged_date2 = $.staged_date.split(" ")[1];

          const date = `${$.staged_date.split(" ")[0]}`.includes("-")
            ? `${staged_date1.split("-")[1]}/${staged_date1.split("-")[2]}/${
                staged_date1.split("-")[0]
              }`
            : $.staged_date.split(" ")[0];

          const staged_date = `${date} ${staged_date2}`;

          return { ...$, staged_date };
        }) ?? [],
      );
      setRecordProgressStatus("success");

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setRecordProgressStatus("fail");
      setLoading(false);
    }
  };

  const handleFileRecordStatus = (fileId, fileName, uploadDate, uploadTime) => {
    setShowFileRecordStatus(true);
    // ADD FILE_ID HERE IN API
    callAPI({
      path: "getStagingIdentityList",
      params: { gatewayIP, file_id: fileId },
      data: {},
      responder: (res, onComplete, onCompleteArgs) => {
        const responder = {
          state: "UPLOAD_FAILURE",
          data: undefined,
          fileName: fileName,
          uploadDate: uploadDate,
          uploadTime: uploadTime,
        };

        if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
          responder.state = "FETCH_SUCCESS";
          responder.data = res.response.body;
        } else {
          responder.catchError = res.error;
          responder.error = res.response.error;
          responder.errorFromJSON = res.response.errorFromJSON;
        }

        onComplete(responder, ...onCompleteArgs);
      },
      onComplete: showFileRecodProgress,
    });
  };

  const handleGoBack = () => {
    setShowFileRecordStatus(false);
    setRecordInProgressList(null);
    setRecordProgressStatus(null);
    updateModalHeaderText(null);
  };

  // /skylightweb/?gatewayIP=<gatewayIP>&file_id=<identityFileId>
  const handleRetryBulkUpload = (fileID) => {
    callAPI({
      path: "retryImportIdentity",
      params: { gatewayIP, file_id: fileID },
      data: {},
      responder: (res, onComplete, onCompleteArgs) => {
        const responder = { state: "FAILURE", data: undefined };

        if (res.state === "GOOD_RESPONSE" && res.response.code === 200) {
          responder.state = "SUCCESS";
          responder.data = res.response.body;
        } else {
          responder.catchError = res.error;
          responder.error = res.response.error;
          responder.errorFromJSON = res.response.errorFromJSON;
          responder.statusCode = res.response.code;
        }

        onComplete(responder, ...onCompleteArgs);
      },
      onComplete: (response) => {
        if (response.state === "SUCCESS") {
          setIsDialogOpen(true);
          setDialogBoxState({
            contentTitle: t("commons.Retry Successful"),
            contentText: "",
            contentInfo: "",
          });
        } else {
          setIsDialogOpen(true);
          setDialogBoxState({
            contentTitle: `${t("commons.Error")}!`,
            contentText: `1: ${response.error.message}`,
          });
        }
      },
      onCompleteArguments: [],
    });
  };

  useEffect(() => {
    if (unProcessedFileId) {
      setShowFileRecordStatus(true);
      const uploadDateTime = rows?.uploaded_date?.split(" ");
      const time = uploadDateTime[1];
      const date = uploadDateTime[0]?.split("-");
      const formatedDate = date[1] + "/" + date[2] + "/" + date[0];
      const fileName = rows?.file_name.split(".")?.slice(0, -1)?.join(".");
      handleFileRecordStatus(unProcessedFileId, fileName, formatedDate, time);
    } else {
      setShowFileRecordStatus(false);
    }
  }, []);

  return (
    <>
      {showFileRecordStatus === false ? (
        <TableContainer
          theme={theme}
          component={Paper}
          style={{ display: showFileRecordStatus ? "none" : "auto" }}
        >
          <Table stickyHeader aria-label="simple table">
            {recordProgressStatus === "fail" ? (
              <p style={{ textAlign: "center", color: "red" }}>
                Something went wrong
              </p>
            ) : (
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: "2px solid rgba(2, 147, 254, 1)",
                  }}
                >
                  <TableCell
                    sx={{ color: "rgba(2, 147, 254, 1)", weight: 600 }}
                  >
                    {t(
                      "page.manage.identities.File Upload Status Modal.File Name",
                    )}{" "}
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(2, 147, 254, 1)", weight: 600 }}
                    align="center"
                  >
                    {t(
                      "page.manage.identities.File Upload Status Modal.Uploaded On",
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(2, 147, 254, 1)", weight: 600 }}
                    align="center"
                  >
                    {t(
                      "page.manage.identities.File Upload Status Modal.Status",
                    )}{" "}
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(2, 147, 254, 1)", weight: 600 }}
                    align="center"
                  >
                    {t(
                      "page.manage.identities.File Upload Status Modal.Action",
                    )}{" "}
                  </TableCell>
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              {rows.length > 0 ? (
                rows?.map((row) => {
                  const uploadDateTime = row.uploaded_date.split(" ");
                  const time = uploadDateTime[1];
                  const date = uploadDateTime[0].split("-");
                  const formatedDate = uploadDateTime[0];
                  const fileName = row.file_name
                    .split(".")
                    .slice(0, -1)
                    .join(".");

                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: theme.palette.grey[100],
                        },
                      }}
                      onClick={(event) => {
                        if (event.target.id !== "retry-button") {
                          handleFileRecordStatus(
                            row.id,
                            fileName,
                            formatedDate,
                            time,
                          );
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {fileName}
                      </TableCell>

                      <TableCell align="center">{`${formatedDate} ${time}`}</TableCell>

                      <TableCell align="center">{row.status}</TableCell>

                      <TableCell align="center" id="retry-button">
                        <GenericButton
                          visibility={true}
                          backgroundColor="#0074c7"
                          buttonName={t(`commons.retryText`)}
                          width="48px"
                          isShowAsIconButton={false}
                          id="retry-button"
                          disabled={!row.isRetryAvailable}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRetryBulkUpload(row.id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                  //
                })
              ) : (
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell colSpan={3}>
                    {t(
                      "page.manage.identities.File Upload Status Modal.Records",
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      <StyledBox
        style={{
          display: showFileRecordStatus ? "flex" : "none",
          padding: "0",
        }}
      >
        <Suspense
          fallback={
            <Box>
              <WidthFillerSkeleton height="100%" />
            </Box>
          }
        >
          <AsyncIFVDataGrid
            ref={dataGridRef}
            name={subconscious.name}
            key={dataGridKey}
            loadingData={[loading, setLoading]}
            config={[gridConfig, setGridConfig]}
            cols={[gridCols, setGridCols]}
            subconscious={[gridSubconscious, setGridSubconscious]}
            data={[gridRows, setGridRows]}
          />
        </Suspense>
      </StyledBox>

      {showFileRecordStatus && !unProcessedFileId ? (
        <GoBack>
          <GenericButton
            onClick={handleGoBack}
            backgroundColor="primary"
            disabled={false}
            buttonName={t("page.manage.identities.Table Button.Go Back")}
          />
        </GoBack>
      ) : null}

      {isDialogOpen && (
        <AlertDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          contentTitle={dialogBoxState.contentTitle}
          contentText={dialogBoxState.contentText}
          handleAgree={() => {
            setIsDialogOpen(false);
          }}
          agreeTitle={"Close"}
          divider
        />
      )}
    </>
  );
};

const theme = createTheme({
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          height: 350,
          minWidth: 550,
          borderRadius: "8px",
          // boxShadow: "0px 0px 8px 2px #ccc",
          border: "0.1em solid rgba(2,147,254,0.3)",
          marginTop: "0.3rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(2, 147, 254, 1)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          marginTop: "10rem",
          boxShadow: "0px 0px 8px 2px #ccc",
          color: "rgba(2, 147, 254, 1)",
        },
      },
    },
  },
});

const GoBack = styled.div`
  width: 90%;
  margin-top: 1rem;
  display: flex;
  justify-content: end;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 90vw;
  height: 60vh;
  padding: 1em;
  position: relative;
`;
