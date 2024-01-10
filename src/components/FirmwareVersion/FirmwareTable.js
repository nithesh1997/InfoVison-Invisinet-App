import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import callAPI from "../../apis/callAPI";
import {
  DeleteFirwareAPIResponder,
  FirmwareResponder,
} from "../../apis/responders/FirmwareResponder";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { Trans, useTranslation } from "react-i18next";

const AsyncIFVDataGrid = React.lazy(() => import("../IFVDataGrid/IFVDataGrid"));

const Firmware = (props) => {
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };

  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);

  const { t } = useTranslation();

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
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

    delete newRow["__isEditMode"];
    delete newRow["id"];

    callAPI({
      path: "deleteFirmware",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: { firmware_id: row.id },
      responder: DeleteFirwareAPIResponder,
      onComplete: DeleteFirmwareOnCompleteHandler,
      onCompleteArguments: [row, setTaskStatus],
    });
  };

  const DeleteFirmwareOnCompleteHandler = (response, row, setTaskStatus) => {
    if (response.state === "DELETE_FIRMWARE_SUCESS") {
      let status = {
        inProgress: false,
        error: false,
        message: t(
          "page.Endpoint.Manage Firmware.Action Options.Prompt.Delete Status Prompt.Success",
          { fileName: row.fileName },
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
                "page.Endpoint.Manage Firmware.Action Options.Prompt.Delete Status Prompt.Error"
              }
              components={[<br />]}
              values={{ fileName: row.fileName }}
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
      dataKey: "fileName",
      type: "text",
      minWidth: 150 * 1.5,
      flexWidth: 1.5,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return { isValid: true, message: "" };
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Release Version Field.Header Name",
      ),
      dataKey: "release",
      type: "numbers",
      minWidth: 150 * 1.5,
      flexWidth: 1.5,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (Number(valA.split(".").join("")) > Number(valB.split(".").join("")))
          return 1;
        if (Number(valA.split(".").join("")) < Number(valB.split(".").join("")))
          return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return { isValid: true, message: "" };
      },
    },
    {
      headerName: t(
        "commons.Component.Table Content.Product Field.Header Name",
      ),
      dataKey: "product",
      type: "text",
      minWidth: 150 * 1.5,
      flexWidth: 1.5,
      sortable: true,
      sortComparator: (valA, valB, rowA, rowB) => {
        if (valA.toLowerCase() > valB.toLowerCase()) return 1;
        if (valA.toLowerCase() < valB.toLowerCase()) return -1;
        return 0;
      },
      inputValidator: (event, row) => {
        return { isValid: true, message: "" };
      },
    },
    {
      headerName: t("page.Endpoint.Manage Firmware.Action Options.Header Name"),
      dataKey: "__action",
      type: "actions",
      sortable: false,
      minWidth: 250 * 0.6,
      flexWidth: 0.6,
      actions: [
        // {
        //   type: "__edit",
        //   name:  t("page.Endpoint.Manage Firmware.Action Options.Tool Tip.Edit"),
        //   handleDiscard: handleDiscard,
        //   handleSave: handleSaveTwo,
        //   handleEdit: handleEdit,
        //   hideEditInRow: false,
        // },
        {
          prompt: {
            contentTitle: t(
              "page.Endpoint.Manage Firmware.Action Options.Prompt.Delete Status Prompt.Delete Confirm Title",
            ),
            contentText: (
              <Trans
                i18nKey={
                  "page.Endpoint.Manage Firmware.Action Options.Prompt.Delete Status Prompt.Delete Confirm Content"
                }
                components={[<br />, <b />]}
              >
                You have initiated the process of deleting this firmware
                <br />
                <br />
                Click <b>Confirm</b> to delete, otherwise click
                <b>Cancel</b>.
              </Trans>
            ),
          },
          type: "__delete",
          name: t(
            "page.Endpoint.Manage Firmware.Action Options.Tool Tip.Delete",
          ),
          handleDelete: handleDelete,
        },
      ],
    },
  ];
  let subconscious = {
    name: "ba-Firmware-config",
    sort: {
      column: "releasenumber",
      inverse: false,
    },
    pageSize: 10,
    page: 1,
  };
  let config = {
    editMode: "inline",
    // Can be "inline" | "popup"; Default: "inline"
    addHandler: {
      handleSave: () => {},
      handleDiscard: handleDiscard,
    },
  };
  let dataGridRef = useRef();
  let [dataGridKey, setDataGridKey] = useState(
    subconscious.name + "-" + new Date().getTime(),
  );
  let [gridConfig, setGridConfig] = useState(config);
  let [gridCols, setGridCols] = useState(columns);
  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  const [gridRows, setGridRows] = props.firmware;
  let [loading, setLoading] = useState(true);
  const AppOverlayContext = useContext(OverlayContext);

  const markAsLoading = () => {
    setLoading(true);
  };
  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      markAsLoading();
      setGatewayAddress(currentGatewayAddress);
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (gatewayAddress) {
      callAPI({
        path: "getFirmware",
        params: { gatewayIP: gatewayAddress },
        data: {},
        responder: FirmwareResponder,
        onComplete: firmwareOnCompleteHandler,
      });
    }
  }, [gatewayAddress]);

  const firmwareOnCompleteHandler = (response) => {
    let data = [];
    data = response.data;
    if (response.state === "FIRMWARE_SUCCESS") {
      setGridRows(data);
      setLoading(false);
      setDataGridKey(subconscious.name + "-" + new Date().getTime());
    } else {
      //   setAlertDialog({
      //     open: true,
      //     contentTitle: "Error Fetching Firmware",
      //     contentText: Utility.getErrorsFromResponse(response),
      //   });
    }
  };

  return (
    <>
      <Suspense fallback={<WidthFillerSkeleton />}>
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

      <AlertDialog
        open={alertDialog.open}
        contentTitle={alertDialog.contentTitle}
        contentText={alertDialog.contentText}
        agreeTitle={t("commons.okayText")}
        handleAgree={handleAlertDialogClose}
        handleDisagree={handleAlertDialogClose}
        divider={false}
      />
    </>
  );
};
export default Firmware;
