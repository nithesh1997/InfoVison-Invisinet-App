import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import callAPI from "../../apis/callAPI";
import {
  DelResrcListAPIResponder,
  ProResourceAPIResponder,
  ResourceListAPIResponder,
  SaveResrcListAPIResponder,
} from "../../apis/responders/resources-api-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/ResourceManagement.style";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));
const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const DataGridResList = (props) => {
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [rlgridRows, rlsetGridRows] = useState([]);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);

    // setTimeout(() => {
    //   callback();
    // }, 1000);
  };

  const ResListOnCompleteHandler = (response) => {
    let data = [];
    if (response.state === "ResourceList_SUCESS" && response.data !== "") {
      data = response.data;
      data = data.map((resList) => ({
        ...resList,
        member: resList.member.join(", "),
      }));

      setresListData(data);
      setresLisLoading(false);
    }
  };

  const ProResourceOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "ProResource_SUCESS" && response.data !== "") {
      data = response.data;
      setProResourceData(data);
      setProResourceDataLoading(false);
    }
  };

  const handleEdit = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleSave = (row, setTaskStatus, oldRow) => {
    let newRow = {
      name: row["name"],
      comment: row["comment"],
      member: row["member"],
      id: row["id"],
    };

    if (row.member !== null && typeof row.member !== "object") {
      newRow.member = row.member === "" ? [] : row.member.split(", ");
    }

    delete newRow["__isEditMode"];

    if (oldRow === undefined) {
      delete newRow["id"];
    }

    callAPI({
      path: "modify-resource-list",
      params: { gatewayIP },
      data: newRow,
      responder: SaveResrcListAPIResponder,
      onComplete: SaveResrcListOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const SaveResrcListOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SaveResrcList_SUCESS") {
      /* For Gateway */
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row },
        message: t(
          "page.manage.Resource List.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Resource List.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  const handleAdd = (row, setTaskStatus, oldRow) => {
    let newRow = {
      name: row["name"],
      comment: row["comment"],
      member: row["member"],
      id: row["id"],
    };

    if (row.member !== null && typeof row.member !== "object") {
      newRow.member = row.member === "" ? [] : row.member.split(", ");
    }

    delete newRow["__isEditMode"];

    if (oldRow === undefined) {
      delete newRow["id"];
    }

    callAPI({
      path: "save-resList",
      params: { gatewayIP },
      data: newRow,
      responder: SaveResrcListAPIResponder,
      onComplete: EditResrcListOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus, oldRow === undefined],
    });
  };

  const EditResrcListOnCompleteHandler = (
    response,
    row,
    setTaskStatus,
    isAddOperation,
  ) => {
    if (response.state === "SaveResrcList_SUCESS") {
      /* For Gateway */
      // if (isAddOperation) {
      //   markAsLoading();
      //   return;
      // }
      /* For Gateway */

      if (row.id === "_newRow") {
        row.id = response.data.id;
      }

      let status = {
        inProgress: false,
        error: false,
        payload: { ...row },
        message: t(
          "page.manage.Resource List.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Resource List.Action Options.Prompt.Saved Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  const handleDiscard = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleDelete = (row, setTaskStatus) => {
    let newRow = { ...row };
    if (row.member !== null && typeof row.member !== "object") {
      newRow.member = row.member === "" ? [] : row.member.split(", ");
    }
    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "delete-resList",
      params: { gatewayIP },
      data: newRow,
      responder: DelResrcListAPIResponder,
      onComplete: DelProResrcOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DelProResrcOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DelResrcList_SUCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.manage.Resource List.Action Options.Prompt.Delete Status Prompt.Success",
          { rowName: row.name },
        ),
      };
      setTaskStatus(status);
    } else {
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Resource List.Action Options.Prompt.Delete Status Prompt.Error"
              }
              values={{ rowName: row.name }}
              components={[<br />]}
            ></Trans>
            {Utility.getErrorsFromResponse(response)}
          </>
        ),
      };
      setTaskStatus(status);
    }
  };

  let rlconfig = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    addHandler: {
      handleSave: (row, setTaskStatus) => {
        handleAdd(row, setTaskStatus);
      },
      handleDiscard: handleDiscard,
    },
  };

  const resListcolumns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      minWidth: 200,
      flexWidth: 1.6,
      type: "text",
      sortable: true,
      isDisableEdit: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const pattern = new RegExp(/^[A-Za-z0-9/-]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Mandatory",
              ),
            },
            {
              runner: ValidationHelper.testRegex,
              args: [_, pattern],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Alpha-Numeric Only",
              ),
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [_, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Name Field.Validation.Errors.Charater Less Then Value",
              ),
            },
          ];
          const result = ValidationHelper.batchValidator(tests);

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Members Field.Header Name",
      ),
      dataKey: "member",
      minWidth: 400,
      flexWidth: 2,
      type: "select-multiple",
      sortable: true,
      options: [],
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        if (event._reactName === "onBlur") {
          const _ = event.target.value;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: t(
                "commons.Component.Table Content.Members Field.Validation.Errors.Mandatory",
              ),
            },
          ];

          const isInLimit =
            _.split(", ").length <= 8
              ? ""
              : t(
                  "commons.Component.Table Content.Members Field.Validation.Errors.Resources Not Exceed",
                );
          const result = ValidationHelper.batchValidator(tests) || isInLimit;

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Comment Field.Header Name",
      ),
      dataKey: "comment",
      minWidth: 250,
      flexWidth: 1.9,
      type: "multiline",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";

        if (event.type === "blur") {
          const value1 = row.comment;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: "",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value1, 63],
              success: "",
              error: t(
                "commons.Component.Table Content.Comment Field.Validation.Errors.Comment allow 63 or less Char",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests1);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      headerName: t("page.manage.Resource List.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      minWidth: 240 * 0.6,
      flexWidth: 0.6,
      headerAlignment: "center",
      actions: [
        {
          type: "__edit",
          name: t("page.manage.Resource List.Action Options.Tool Tip.Edit"),
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
        {
          prompt: {
            contentTitle: t(
              "page.manage.Resource List.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.manage.Resource List.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this resource list.
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t("page.manage.Resource List.Action Options.Tool Tip.Delete"),
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  let rlsubconscious = {
    name: "ba-resList-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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

      const page = gridSubconscious.chunk + 1;

      callAPI({
        path: "resourcelist",
        params: { gatewayIP, page },
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

          if (!isSuccess) {
            setAlertDialog({
              open: true,
              contentTitle: "Error Happened",
              contentText: (
                <>
                  <p>Unable to fetch or load more records from server</p>
                  <p>Error Info:</p>
                  {Utility.getErrorsFromResponse(response)}
                </>
              ),
            });
          }

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
              const mod = payload.map((record) => ({
                ...record,
                member: record.member?.join(", ") ?? [],
              }));

              const newState = [...oldState, ...mod];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let rldataGridRef = useRef();
  let [rldataGridKey, rlsetDataGridKey] = useState(
    rlsubconscious.name + "-" + new Date().getTime(),
  ); // A key needs to be passed mandatorily to the grid
  let [rlgridConfig, rlsetGridConfig] = useState(rlconfig);
  let [rlgridCols, rlsetGridCols] = useState(resListcolumns);
  let [rlgridSubconscious, rlsetGridSubconscious] = useState(rlsubconscious);
  let [resLisloading, setresLisLoading] = useState(true);
  let [rlloading, rlsetLoading] = useState(true);
  let [resListData, setresListData] = useState([]);
  let [resDataLoading, setProResourceDataLoading] = useState(true);
  let [resData, setProResourceData] = useState([]);
  const markAsLoading = () => {
    setProResourceDataLoading(true);
    setresLisLoading(true);
    rlsetLoading(true);
  };
  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      resLisloading === true &&
      resDataLoading === true
    ) {
      callAPI({
        path: "resourcelist",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ResourceListAPIResponder,
        onComplete: ResListOnCompleteHandler,
      });
      callAPI({
        path: "resources",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: ProResourceAPIResponder,
        onComplete: ProResourceOnCompleteHandler,
      });
    }
  }, [gatewayAddress, resLisloading, resDataLoading]);

  useEffect(() => {
    if (!resLisloading && !resDataLoading) {
      let allRes = [...new Set([...resData.map((res) => res.name)])];

      let dynamicOptionFilledColumns = resListcolumns.map((col) => {
        let newCol = { ...col };
        if (newCol.dataKey === "member") {
          newCol.options = allRes;
        }
        return newCol;
      });

      rlsetGridCols(dynamicOptionFilledColumns);
      rlsetGridRows(resListData);
      rlsetLoading(false);
      rlsetDataGridKey(rlsubconscious.name + "-" + new Date().getTime());
    }
  }, [resLisloading, resDataLoading]);

  return (
    <Styled.StyledContainer component={"section"}>
      <Styled.Header>
        <AppInContentHeader
          title={AppConfig.pages.rsl.title}
          breadcrumb={AppConfig.pages.rsl.breadcrumb}
        />
      </Styled.Header>

      <Styled.StyledDataGridBox>
        <Suspense
          fallback={
            <Styled.StyledSkeletonHolder>
              <WidthFillerSkeleton height="100%" />
            </Styled.StyledSkeletonHolder>
          }
        >
          <AsyncIFVDataGrid
            ref={rldataGridRef}
            key={rldataGridKey}
            name={rlsubconscious.name}
            loadingData={[rlloading, rlsetLoading]}
            config={[rlgridConfig, rlsetGridConfig]}
            cols={[rlgridCols, rlsetGridCols]}
            subconscious={[rlgridSubconscious, rlsetGridSubconscious]}
            data={[rlgridRows, rlsetGridRows]}
          />
        </Suspense>
      </Styled.StyledDataGridBox>

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </Styled.StyledContainer>
  );
};

export default withRouter(withCookies(DataGridResList));
