import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import callAPI from "../../apis/callAPI";
import { getTrustLevel } from "../../apis/responders/getTrustLevel";
import {
  SaveTrustGroupsAPIResponder,
  TrustGroupsAPIResponder,
} from "../../apis/responders/trust-level-responder";
import Config from "../../Config";
import Utility from "../../redux/actions/Utility";
import ValidationHelper from "../../utils/validationHelper/ValidationHelper";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import CircularProgressWithLabel from "../PageLoader/CircularProgressWithLabel";
import GlobalLevelTrust from "./GlobalLevelTrust";
import Styled from "./MaterialComponents/TrustlevelManagement.style";
import { Trans, useTranslation } from "react-i18next";

const TrustLevel = (props) => {
  const minLevel = 0;
  const maxLevel = 7;
  return (
    <Styled.TrustLevelHolder>
      <CircularProgressWithLabel
        size={24}
        value={(100 * props.level) / (maxLevel - minLevel)}
        displayValue={props.level}
      />
    </Styled.TrustLevelHolder>
  );
};

const Priority = (props) => {
  const minLevel = 0; // this is set 0 only for percentage purpose
  const maxLevel = 8;

  return (
    <Styled.TrustLevelHolder>
      <CircularProgressWithLabel
        size={24}
        value={(100 * props.level) / (maxLevel - minLevel)}
        displayValue={props.level}
      />
    </Styled.TrustLevelHolder>
  );
};

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

const TrustLevelManagement = () => {
  const { address: gatewayIP } = useSelector((state) => state.activeGateway);
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [trustData, setTrustData] = useState([]);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const TrustGroupsOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "TRUST_GRPS_SUCESS" && response.data !== "") {
      data = response.data;
      settrustGrpData(data);
      setGroupsLoading(false);
    }
  };

  const getTrustLevelOnCompleteHandler = (response) => {
    let data = [];
    data = response.data;

    setTrustData(() => {
      const newState = {
        ...data,
        trustLevel: `${response.data.trustLevel}`,
      };

      return newState;
    });
    settrustLvlLoading(false);
  };

  const handleDiscard = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleEdit = (newRow, setTaskStatus) => {
    let status = {
      inProgress: false,
      error: false,
      message: ``,
    };

    setTaskStatus(status);
  };

  const handleSave = (row, setTaskStatus) => {
    let newRow = {
      ...row,
      priority: Number(row.priority ?? ""),
    };

    delete newRow["__isEditMode"];
    delete newRow["isChecked"];

    callAPI({
      path: "saveTrustLevelGrp",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
      },
      data: newRow,
      responder: SaveTrustGroupsAPIResponder,
      onComplete: SaveTrustGroupOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  let config = {
    editMode: "inline", // Can be "inline" | "popup"; Default: "inline"
    addHandler: { handleSave, handleDiscard },
  };

  const SaveTrustGroupOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "SVTRUST_GRPS_SUCESS") {
      // alert("Rows Deleted");
      let status = {
        inProgress: false,
        error: false,
        payload: {
          ...row,
        },
        // message: `Trust Level for group "${row.name}" saved successfully.`,
        message: t(
          "page.manage.Trust Level.Action Options.Prompt.Saved Status Prompt.Success",
          { rowName: row.name },
        ),
      };
      setTaskStatus(status);
    } else {
      // alert("Error updating the DNS list. Please try again.");
      let status = {
        inProgress: false,
        error: true,
        message: (
          <>
            <Trans
              i18nKey={
                "page.manage.Trust Level.Action Options.Prompt.Saved Status Prompt.Error"
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

  const columns = [
    {
      headerName: t("commons.Component.Table Content.Name Field.Header Name"),
      dataKey: "name",
      minWidth: 600,
      flexWidth: 1,
      type: "text",
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      isDisableEdit: true,
      inputValidator: (event, row) => {
        return { isValid: true, message: "" };
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Trust Level Field.Header Name",
      ),
      dataKey: "trustLevel",
      minWidth: 100,
      flexWidth: 0.5,
      type: "select-single",
      sortable: true,
      options: ["0", "1", "2", "3", "4", "5", "6", "7"],
      renderViewState: (columns, row, value) => {
        return <TrustLevel level={value} />;
      },
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.trustLevel;
          const tests2 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Trust Level Field.Validation.Errors.Mandatory",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests2);
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
      headerName: t("commons.Component.Table Content.Priority.Header Name"),
      dataKey: "priority",
      minWidth: 100,
      flexWidth: 0.5,
      type: "select-single",
      sortable: true,
      options: ["1", "2", "3", "4", "5", "6", "7", "8"],
      renderViewState: (columns, row, value) => {
        return <Priority level={value} />;
      },
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event.type === "blur") {
          const value1 = row.priority;
          const tests2 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: t(
                "commons.Component.Table Content.Priority.Validation.Errors.Mandatory",
              ),
            },
          ];
          data = ValidationHelper.batchValidator(tests2);
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
      headerName: t("page.manage.Trust Level.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      options: [],
      minWidth: 100,
      flexWidth: 0.2,
      headerAlignment: "center",
      contentAlignment: "left",
      sortable: false,
      actions: [
        {
          type: "__edit",
          name: t("page.manage.Trust Level.Table.EditTooltip"),
          handleDiscard: handleDiscard,
          handleSave: handleSave,
          handleEdit: handleEdit,
        },
      ],
    },
  ];

  let subconscious = {
    name: "ba-trustgrps-config", // Required; Can be a string, must uniquely identify the various implementations of IFVDataGrid in the same page;
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
        path: "trust-groups",
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
              // contentTitle: "Error Happened",
              // contentText: (
              //   <>
              //     <p>Unable to fetch or load more records from server</p>
              //     <p>Error Info:</p>
              //     {Utility.getErrorsFromResponse(response)}
              //   </>
              // ),
              contentTitle: t(
                "page.manage.Trust Level.Fetch Status.Error.Title",
              ),
              contentText: (
                <>
                  <Trans
                    i18nKey={
                      "page.manage.Trust Level.Fetch Status.Error.Content"
                    }
                    components={[<p />]}
                  >
                    <p>Unable to fetch or load more records from server</p>
                    <p>Error Info:</p>
                  </Trans>
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
              // const mod = payload.map((record) => ({
              //   ...record,
              //   member: record.member?.join(", ") ?? [],
              // }));

              const newState = [...oldState, ...payload];
              return isSuccess ? newState : oldState;
            });
          }, 300);
        },
      });
    },
  };

  let dataGridRef = useRef();
  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  ); // A key needs to be passed mandatorily to the grid
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [gridRows, setGridRows] = useState([]);
  let [groupsLoading, setGroupsLoading] = useState(true);
  let [trustLvlLoading, settrustLvlLoading] = useState(true);
  let [loading, setLoading] = useState(true);
  let [trustGrpData, settrustGrpData] = useState([]);

  const markAsLoading = () => {
    setLoading(true);
    settrustLvlLoading(true);
    setGroupsLoading(true);
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
    if (typeof gatewayAddress === "string") {
      callAPI({
        path: "getTrustLevel",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: getTrustLevel,
        onComplete: getTrustLevelOnCompleteHandler,
      });
    }
  }, [gatewayAddress]);

  useEffect(() => {
    if (typeof gatewayAddress === "string") {
      callAPI({
        path: "trust-groups",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: TrustGroupsAPIResponder,
        onComplete: TrustGroupsOnCompleteHandler,
      });
    }
  }, [gatewayAddress]);

  useEffect(() => {
    if (!groupsLoading && !trustLvlLoading) {
      setGridRows(trustGrpData);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    }
  }, [groupsLoading, trustLvlLoading]);

  return (
    <Styled.Container>
      <AppInContentHeader
        title={AppConfig.pages.trl.title}
        breadcrumb={AppConfig.pages.trl.breadcrumb}
      />
      <GlobalLevelTrust loading={loading} trustData={trustData} />
      <Styled.DataGridBox>
        <Suspense
          fallback={
            <Styled.SkeletonHolder>
              <WidthFillerSkeleton height="100%" />
            </Styled.SkeletonHolder>
          }
        >
          <Styled.TextHead>
            {t("page.manage.Trust Level.Text Heading")}
          </Styled.TextHead>
          <AsyncIFVDataGrid
            ref={dataGridRef}
            key={dataGridKey}
            name={subconscious.name}
            loadingData={[loading, setLoading]}
            config={[gridConfig, setGridConfig]}
            cols={[gridCols, setGridCols]}
            subconscious={[gridSubconscious, setGridSubconscious]}
            data={[gridRows, setGridRows]}
          />
        </Suspense>
      </Styled.DataGridBox>

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </Styled.Container>
  );
};

export default withRouter(withCookies(TrustLevelManagement));
