import { DeleteRounded } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Tooltip } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { withRouter } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import callAPI from "../../../apis/callAPI";
import { addDnsListApiResponder } from "../../../apis/responders/addDnsListApiResponder";
import { getdnsListApiResponder } from "../../../apis/responders/getdnsListApiResponder";
import { logoutApiResponder } from "../../../apis/responders/logoutApiResponder";
import { LogOutSessionContext } from "../../../App";
import Config from "../../../Config";
import Utility from "../../../redux/actions/Utility";
import OverlayContext from "../../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import AlertDialog from "../../IFVDataGrid/GridPortal/AlertDialog";
import Styled from "./MaterialComponents/DnsTable.style";
import { dnsTable } from "../../../utils/GeneralComponentNames";
import { GenericButton } from "../../../style/GenericButton/GenericButton";
import { Trans, useTranslation } from "react-i18next";

const initMessageState = () => {
  return {
    msgBtn: false,
    msg: "",
    getDnsFail: false,
    subMsg: "",
  };
};

const DnsTable = (props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const { address: gatewayIP } = useSelector((state) => state.activeGateway);

  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const [logoutSession, setLogoutSession] = useContext(LogOutSessionContext);

  const [rowsInEditMode, setRowsInEditMode] = useState([]);
  const [rowsWithActionInProgress, setRowsWithActionInProgress] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [newRowInTable, setNewRowInTable] = useState(false);
  const [load, setLoad] = useState(true);
  const [mapData, setMapData] = useState([]);
  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenError, setDialogOpenError] = useState(false);
  const [access, setAccess] = useState("");
  const [runEffect, setRunEffect] = useState("");
  const [dnsData, setDnsData] = useState("");
  const [message, setMessage] = useState(initMessageState);

  const markAsLoading = () => {
    setLoad(true);
  };

  const EditHandler = (dns) => {
    setRowsInEditMode((rows) => {
      let newRows = [...rows];
      newRows.push(dns);
      return newRows;
    });

    let editRecordInitialValue = dns;
    setEditedValues((edits) => {
      let newEdits = {
        ...edits,
      };
      newEdits[dns] = editRecordInitialValue;
      return newEdits;
    });

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      newErrors[dns] = t(
        `page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue`,
      );
      return newErrors;
    });
  };

  const DeleteHandler = (dns) => {
    setRowsWithActionInProgress((rows) => {
      let newRows = [...rows];
      newRows.push(dns);
      return newRows;
    });

    // Create array of new DNS values
    let newDNSValues = [...mapData];
    let index = newDNSValues.indexOf(dns);
    if (index !== -1) {
      newDNSValues.splice(index, 1);
    }
    // Make API call here and do the task done below in setTimeout in the onComplete handler of the API call.
    callAPI({
      path: "addDnsList",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        dnslist: newDNSValues.join(","),
      },
      data: {},
      responder: addDnsListApiResponder,
      onComplete: DeleteDnsListOnCompleteHandler,
      onCompleteArguments: [dns],
    });
  };

  const DeleteDnsListOnCompleteHandler = (responder, dns) => {
    setRowsWithActionInProgress((rows) => {
      let newRows = [...rows];
      let index = newRows.indexOf(dns);
      if (index !== -1) {
        newRows.splice(index, 1);
      }
      return newRows;
    });

    setDialogOpen(false);

    // Run this only if delete operation was successful
    if (responder.state === "ADDDNSLIST_SUCESS") {
      setMapData((rows) => {
        let newRows = [...rows];
        let index = newRows.indexOf(dns);
        if (index !== -1) {
          newRows.splice(index, 1);
        }
        return newRows;
      });

      setRunEffect("startLogout");
    } else {
      setDialogOpenError(true);
      setMessage((oldState) => {
        return {
          ...oldState,
          msgBtn: true,
          msg: (
            <p>
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.0",
              )}
              <br />
              <br />
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.1",
              )}
              <br />
              {Utility.getErrorsFromResponse(responder)}
            </p>
          ),
          subMsg: (
            <p>
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.2",
              )}
            </p>
          ),
        };
      });
    }
  };

  const CloseHandler = (dns) => {
    setRowsInEditMode((rows) => {
      let newRows = [...rows];
      let index = newRows.indexOf(dns);

      if (index !== -1) {
        newRows.splice(index, 1);
      }

      return newRows;
    });

    setEditedValues((edits) => {
      let newEdits = { ...edits };
      delete newEdits[dns];

      return newEdits;
    });

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      delete newErrors[dns];

      return newErrors;
    });
  };

  const handleEditRowEvent = (event, dns) => {
    let error = "";
    let changedValue = event.target.value.trim();

    setEditedValues((edits) => {
      let newEdits = { ...edits };
      newEdits[dns] = changedValue;

      return newEdits;
    });

    if (event.type === "blur") {
      if (changedValue.includes(":")) {
        const IPv6Pattern = new RegExp(
          /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
        );
        let test = IPv6Pattern.test(changedValue);
        if (!test) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIpv6",
          );
        } else if (changedValue === dns) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
          );
        } else if (mapData.indexOf(changedValue) !== -1) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.duplicate",
          );
        }
      } else {
        const ipRegex = new RegExp(
          /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
        );

        const ipSection = changedValue.split(".");
        let lastSection = !!!Number(ipSection[ipSection.length - 1]);

        if (changedValue.length === 0) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
          );
        } else if (!ipRegex.test(changedValue)) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIPv4",
          );
        } else if (changedValue === "0.0.0.0" || lastSection) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIPv4",
          );
        } else if (changedValue === dns) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
          );
        } else if (mapData.indexOf(changedValue) !== -1) {
          error = t(
            "page.configure.dnsTacMode.dnsTable.table.address.validation.duplicate",
          );
        }
      }
    }

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      newErrors[dns] = error;

      return newErrors;
    });
  };

  const AddDnsAddressField = () => {
    setNewRowInTable(true);

    let newRecordInitialValue = "";
    setEditedValues((edits) => {
      let newEdits = { ...edits };
      newEdits["new"] = newRecordInitialValue;

      return newEdits;
    });

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      newErrors["new"] = t(
        "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
      );

      return newErrors;
    });
  };

  const NewRowCloseHandler = () => {
    setNewRowInTable(false);

    setEditedValues((edits) => {
      let newEdits = { ...edits };
      delete newEdits["new"];

      return newEdits;
    });

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      delete newErrors["new"];

      return newErrors;
    });
  };

  const handleNewRowChangeEvent = (event) => {
    let error = "";
    let changedValue = event.target.value.trim();

    setEditedValues((edits) => {
      let newEdits = { ...edits };
      newEdits["new"] = changedValue;

      return newEdits;
    });

    if (changedValue.includes(":")) {
      const IPv6Pattern = new RegExp(
        /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
      );

      let test = IPv6Pattern.test(changedValue);

      if (!test) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIpv6",
        );
      } else if (mapData.indexOf(changedValue) !== -1) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.duplicate",
        );
      }
    } else {
      const ipRegex = new RegExp(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
      );

      const ipSection = changedValue.split(".");
      let lastSection = !!!Number(ipSection[ipSection.length - 1]);

      if (changedValue.length === 0) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
        );
      } else if (!ipRegex.test(changedValue)) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIPv4",
        );
      } else if (changedValue === "0.0.0.0" || lastSection) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.wrongIPv4",
        );
      } else if (mapData.indexOf(changedValue) !== -1) {
        error = t(
          "page.configure.dnsTacMode.dnsTable.table.address.validation.duplicate",
        );
      }
    }

    setEditErrors((errors) => {
      let newErrors = { ...errors };
      newErrors["new"] = error;

      return newErrors;
    });
  };

  const SaveHandler = (dns) => {
    setRowsWithActionInProgress((rows) => {
      let newRows = [...rows];
      newRows.push(dns);

      return newRows;
    });

    // Create array of new DNS values
    let newDNSValues = [...mapData];

    if (dns !== "new") {
      let index = newDNSValues.indexOf(dns);

      if (index !== -1) {
        newDNSValues.splice(index, 1, editedValues[dns]);
      } else {
        newDNSValues.push(editedValues[dns]);
      }
    } else {
      newDNSValues.push(editedValues[dns]);
    }

    // Make API call here and do the task done below in setTimeout in the onComplete handler of the API call.
    callAPI({
      path: "addDnsList",
      params: { gatewayIP, dnslist: newDNSValues.join(",") },
      data: {},
      responder: addDnsListApiResponder,
      onComplete: addDnsListOnCompleteHandler,
      onCompleteArguments: [dns, newDNSValues],
    });
  };

  const addDnsListOnCompleteHandler = (responder, dns, newDNSValues) => {
    setRowsWithActionInProgress((rows) => {
      let newRows = [...rows];
      let index = newRows.indexOf(dns);

      if (index !== -1) {
        newRows.splice(index, 1);
      }

      return newRows;
    });
    setDialogOpen(false);

    // Run this only if add operation was successful
    if (responder.state === "ADDDNSLIST_SUCESS") {
      if (dns === "new") {
        NewRowCloseHandler();
      }

      setRunEffect("startLogout");
      setMapData((rows) => newDNSValues);
    } else {
      setDialogOpenError(true);
      setMessage((oldState) => {
        return {
          ...oldState,
          msgBtn: true,
          msg: (
            <p>
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.0",
              )}
              <br />
              <br />
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.1",
              )}
              <br />
              {Utility.getErrorsFromResponse(responder)}
            </p>
          ),
        };
      });
    }
  };

  const getdnsListOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "GET_DNS_LIST_SUCESS") {
      data = response.data;

      if (!!data.length) {
        setMapData(data);
      } else {
        setMessage((oldState) => ({
          ...oldState,
          subMsg: <p style={{ color: "black" }}>No Records Avalilable</p>,
          getDnsFail: true,
        }));
      }
    } else {
      setDialogOpenError(true);
      setMessage((oldState) => {
        return {
          ...oldState,
          subMsg: (
            <p>
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.0",
              )}
            </p>
          ),
          msg: (
            <p>
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.0",
              )}
              <br />
              <br />
              {t(
                "page.configure.dnsTacMode.dnsTable.table.action.prompt.error.fetchError.1",
              )}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </p>
          ),
          getDnsFail: true,
        };
      });
    }
    setLoad(false);
  };

  const handleAgree = () => {
    if (runEffect === "startLogout") {
      history.push(AppConfig.pages.sgn.path);
      setLogoutSession(true);
    }

    setDialogOpenError(false);
  };

  const onCompleteLogoutHandler = useCallback(
    (responder) => {
      history.push(AppConfig.pages.sgn.path);
      setLogoutSession(true);
    },
    [AppConfig.pages.sgn.path, history, setLogoutSession],
  );

  useEffect(() => {
    if (runEffect === "startLogout") {
      callAPI({
        path: "logout",
        params: {},
        data: {},
        responder: logoutApiResponder,
        onComplete: onCompleteLogoutHandler,
      });
    }

    setRunEffect("");
  }, [onCompleteLogoutHandler, runEffect]);

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
    if (currentGatewayAddress !== gatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (typeof gatewayAddress === "string") {
      callAPI({
        path: "dnsList",
        params: {
          gatewayIP: AppOverlayContext.selectedGateway.address,
        },
        data: {},
        responder: getdnsListApiResponder,
        onComplete: getdnsListOnCompleteHandler,
      });
    }
  }, [gatewayAddress]);

  const text0 = t(
    `page.configure.dnsTacMode.dnsTable.table.action.prompt.confirmDelete.description.${
      access === "delete" ? `deletingText` : `savingText`
    }`,
  );

  const text1 = t(
    `commons.${access === "delete" ? `confirmText` : `saveText`}`,
  );

  return (
    <Styled.StyledWrapper>
      <Styled.StyledBoxHead>
        <Styled.StyledText>
          {t("page.configure.dnsTacMode.dnsTable.title")}
        </Styled.StyledText>
        {load ? (
          ""
        ) : (
          <GenericButton
            backgroundColor="primary"
            buttonName={`${t("page.configure.dnsTacMode.dnsTable.addButton")}`}
            style={{ width: "9em" }}
            id={`${dnsTable}-add-dns-button`}
            onClick={AddDnsAddressField}
            disabled={newRowInTable || mapData.length >= 3}
          />
        )}{" "}
      </Styled.StyledBoxHead>

      {load ? (
        <Styled.StyledSkeletonHolder>
          <WidthFillerSkeleton width="200"></WidthFillerSkeleton>
        </Styled.StyledSkeletonHolder>
      ) : (
        <Styled.StyleTableContainer>
          <Styled.Styledtable>
            <tr>
              <Styled.StyledTh>
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.address.columnName",
                )}
              </Styled.StyledTh>
              <Styled.StyledThAction>
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.action.columnName",
                )}
              </Styled.StyledThAction>
            </tr>

            {newRowInTable ? (
              <tr key={`new-dns-record`}>
                <Styled.StyledTdAddress>
                  <Styled.StyledTextField
                    fullWidth
                    disabled={rowsWithActionInProgress.indexOf("new") !== -1}
                    color=""
                    variant="outlined"
                    label={t(
                      "page.configure.dnsTacMode.dnsTable.table.address.inputPlaceholder",
                    )}
                    defaultValue={""}
                    onChange={(event) => handleNewRowChangeEvent(event)}
                    error={
                      editErrors["new"] !== "" &&
                      editErrors["new"] !==
                        t(
                          "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
                        ) &&
                      editErrors["new"] !==
                        t(
                          "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
                        )
                    }
                    helperText={
                      editErrors["new"] !== "" &&
                      editErrors["new"] !==
                        t(
                          "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
                        ) &&
                      editErrors["new"] !==
                        t(
                          "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
                        )
                        ? editErrors["new"]
                        : ""
                    }
                  />
                </Styled.StyledTdAddress>

                <Styled.StyledTdBtn>
                  <Styled.BtnGroup>
                    {rowsWithActionInProgress.indexOf("new") === -1 ? (
                      <React.Fragment>
                        <Tooltip title={t("commons.saveText")}>
                          <Styled.StyledButtonEdit
                            id={`dns-save-record-button`}
                            onClick={() => {
                              setDialogOpen(true);
                              setAccess("save2");
                              setDnsData("new");
                            }}
                            disabled={editErrors["new"] !== ""}
                          >
                            <Styled.DoneIcon />
                          </Styled.StyledButtonEdit>
                        </Tooltip>

                        <Tooltip title={t("commons.cancelText")}>
                          <Styled.StyledButtonDelete
                            id={`dns-discard-record-button`}
                            onClick={NewRowCloseHandler}
                          >
                            <CloseIcon />
                          </Styled.StyledButtonDelete>
                        </Tooltip>
                      </React.Fragment>
                    ) : (
                      <Styled.StyledClipLoaderContainer>
                        <ClipLoader size="1.5em" />
                      </Styled.StyledClipLoaderContainer>
                    )}
                  </Styled.BtnGroup>
                </Styled.StyledTdBtn>
              </tr>
            ) : (
              ""
            )}

            <>
              {message.getDnsFail ? (
                <Styled.ErrorMsg>{message.subMsg}</Styled.ErrorMsg>
              ) : (
                <>
                  {mapData.map((dns, index) => {
                    return (
                      <tr key={index}>
                        {rowsInEditMode.indexOf(dns) === -1 ? (
                          <Styled.StyledTdAddress>{dns}</Styled.StyledTdAddress>
                        ) : (
                          <Styled.StyledTdAddress>
                            <Styled.StyledTextField
                              fullWidth
                              disabled={
                                rowsWithActionInProgress.indexOf(dns) !== -1
                              }
                              variant="outlined"
                              label={t(
                                "page.configure.dnsTacMode.dnsTable.table.address.inputPlaceholder",
                              )}
                              defaultValue={dns}
                              onChange={(event) =>
                                handleEditRowEvent(event, dns)
                              }
                              onFocus={(event) =>
                                handleEditRowEvent(event, dns)
                              }
                              onBlur={(event) => handleEditRowEvent(event, dns)}
                              error={
                                editErrors[dns] !== "" &&
                                editErrors[dns] !==
                                  t(
                                    "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
                                  ) &&
                                editErrors[dns] !==
                                  t(
                                    "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
                                  )
                              }
                              helperText={
                                editErrors[dns] !== "" &&
                                editErrors[dns] !==
                                  t(
                                    "page.configure.dnsTacMode.dnsTable.table.address.validation.mandatory",
                                  ) &&
                                editErrors[dns] !==
                                  t(
                                    "page.configure.dnsTacMode.dnsTable.table.address.validation.sameValue",
                                  )
                                  ? editErrors[dns]
                                  : ""
                              }
                            />
                          </Styled.StyledTdAddress>
                        )}

                        <Styled.StyledTdBtn>
                          <Styled.BtnGroup>
                            {rowsWithActionInProgress.indexOf(dns) === -1 ? (
                              <React.Fragment>
                                {rowsInEditMode.indexOf(dns) === -1 ? (
                                  <Tooltip title={t("commons.editText")}>
                                    <Styled.StyledButtonEdit
                                      id={`${index}-edit-record-button`}
                                      onClick={() => EditHandler(dns)}
                                    >
                                      <Styled.EditRounded />
                                    </Styled.StyledButtonEdit>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title={t("commons.saveText")}>
                                    <Styled.StyledButtonEdit
                                      id={`${index}-edit-record-save-button`}
                                      onClick={() => {
                                        setDialogOpen(true);
                                        setAccess("save");
                                        setDnsData(dns);
                                      }}
                                      disabled={editErrors[dns] !== ""}
                                    >
                                      <Styled.DoneIcon />
                                    </Styled.StyledButtonEdit>
                                  </Tooltip>
                                )}
                                {rowsInEditMode.indexOf(dns) === -1 ? (
                                  <Tooltip title={t("commons.deleteText")}>
                                    <Styled.StyledButtonDelete
                                      id={`${index}-delete-record-button`}
                                      onClick={() => {
                                        setDialogOpen(true);
                                        setDnsData(dns);
                                        setAccess("delete");
                                      }}
                                    >
                                      <DeleteRounded />
                                    </Styled.StyledButtonDelete>
                                  </Tooltip>
                                ) : (
                                  <Styled.StyledButtonDelete
                                    id={`${index}-edit-record-cancel-button`}
                                    onClick={() => {
                                      setDnsData(dns);
                                      CloseHandler(dns);
                                    }}
                                  >
                                    <Tooltip title={t("commons.cancelText")}>
                                      <CloseIcon />
                                    </Tooltip>
                                  </Styled.StyledButtonDelete>
                                )}{" "}
                              </React.Fragment>
                            ) : (
                              <Styled.StyledClipLoaderContainer>
                                <ClipLoader size="1.5em" />
                              </Styled.StyledClipLoaderContainer>
                            )}
                          </Styled.BtnGroup>
                        </Styled.StyledTdBtn>
                      </tr>
                    );
                  })}
                </>
              )}
            </>
          </Styled.Styledtable>
        </Styled.StyleTableContainer>
      )}

      <AlertDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        divider={false}
        contentTitle={t(
          `page.configure.dnsTacMode.dnsTable.table.action.prompt.confirmDelete.title.${
            access === "delete" ? 0 : 1
          }`,
        )}
        contentText={
          access === "delete" ? (
            <>
              <p>
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.action.prompt.confirmDelete.description.0",
                  { text: text0 },
                )}
                <br />
                <br />
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.action.prompt.confirmDelete.description.1",
                )}
                <br />
                <br />
                <Trans
                  i18nKey={
                    "page.configure.dnsTacMode.dnsTable.table.action.prompt.confirmDelete.description.2"
                  }
                  values={{ text: text1 }}
                  components={[<b />]}
                >
                  Click <b>{text1}</b> to delete, otherwise click <b>Cancel</b>.
                </Trans>
              </p>
            </>
          ) : (
            <>
              <p>
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.action.prompt.outageWarn.0",
                )}
                <br />
                <br />
                {t(
                  "page.configure.dnsTacMode.dnsTable.table.action.prompt.outageWarn.1",
                )}
              </p>
            </>
          )
        }
        isred={access === "delete"}
        agreeTitle={
          access === "save" || access === "save2"
            ? t("commons.saveText")
            : t("commons.confirmText")
        }
        disagreeTitle={t("commons.cancelText")}
        handleAgree={() => {
          setDialogOpen(false);
          access === "delete"
            ? DeleteHandler(dnsData)
            : access === "save"
            ? SaveHandler(dnsData)
            : access === "save2" && SaveHandler(dnsData);
        }}
        handleDisagree={() => {
          setDialogOpen(false);
          CloseHandler(dnsData);
          NewRowCloseHandler();
        }}
      />

      <AlertDialog
        open={dialogOpenError}
        setOpen={setDialogOpenError}
        divider={false}
        contentTitle={t("errorText")}
        contentText={message.msg}
        agreeTitle={t("okayText")}
        handleAgree={handleAgree}
      />
    </Styled.StyledWrapper>
  );
};

export default withRouter(withCookies(DnsTable));
