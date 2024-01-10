import { Button, Grid } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import React, { createRef, useContext, useEffect, useState } from "react";
import { PlusCircle } from "react-bootstrap-icons";
import ReactCardFlip from "react-card-flip";
import { withCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import callAPI from "../../apis/callAPI";
import { DeleteGatewayAPIResponder } from "../../apis/responders/delete-gareway-api-responder";
import { GatewayListAPIResponder } from "../../apis/responders/gateway-list-api-responder";
import { setActiveGateway } from "../../Gateway/activeGatewaySlice";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import AddGateway from "./AddGateway";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { gateway } from "../../utils/GeneralComponentNames";
import { GatewayList } from "./GatewayList";
import AlertDialog from "../IFVDataGrid/GridPortal/AlertDialog";
import { Trans, useTranslation } from "react-i18next";
import * as common from "../../common";
import Prompt from "../DeletePrompt/Prompt";

window.gatewaysThatAreBeingDeleted = [];
window.gatewayListData = [];

const StyledCloseIconComponent = styled(CloseIcon)`
  padding: 0.25em;
  margin: -0.5rem -0.5rem 0rem auto;
  color: rgb(0, 0, 0);
  cursor: pointer;
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  border: 0px;
  border-radius: 0.25rem;
  opacity: 0.5;
  color: black;
`;

const StyledModalHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1em 1.25em;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
`;

const SearchDivComponent = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 0.25em;
  align-items: center;
  display: flex;
  float: left;

  &.hide {
    opacity: 0.5;
  }
`;

const AddButtonComponent = styled(Button)`
  /* font-family: "", "sans-serif", Courier, monospace; */
  float: right;
  font-size: 11px;
  line-height: 24px;
  background: ${({ theme }) => (theme.disabled ? "#24242410" : "#8fdc6a")};
  color: #000;
  border-radius: 5px;
  border: none;
  padding: 4px 15px;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => (theme.disabled ? "#24242410" : "#58d61b")};
    color: #000;
  }
`;

const StyledOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1040;
  width: 100%;
  height: 74vh;
  background-color: rgb(0, 0, 0);
  opacity: 0.25;
`;

const SearchInputComponent = styled.input`
  border: 0;
  margin-bottom: 0px;
  background-color: transparent;
  width: 100;
  width: 100%;
  outline: none;
  box-shadow: none;
  /* font-family: "", sans-serif; */
  font-size: 1rem;
  font-weight: 400;
  padding: 10px 10px 9px 20px;
  outline: none !important;
  box-shadow: none !important;
  font-size: 11px;
  line-height: 24px;
  padding: 4px 15px;
`;

const IComponent = styled(SearchIcon)`
  color: #0d6efd;
  font-size: 1.25rem;
  margin-right: 1rem;
  margin-left: 1rem;
  cursor: pointer;
`;

const StyledDivComponent = styled.div`
  padding-bottom: 1rem;
  overflow: auto;
`;

const StyledPlusCircle = styled(PlusCircle)`
  font-size: 17px;
  &.hide {
    font-size: 17px;
  }
`;

const Gates = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const searchInputRef = createRef();

  const AppOverlayContext = useContext(OverlayContext);
  const initialAlertDialog = { open: false, contentTitle: "", contentText: "" };
  const [alertDialog, setAlertDialog] = useState(initialAlertDialog);
  let [loading, setLoading] = useState(true);
  let [gatewayListData, setGatewayListData] = useState(window.gatewayListData);
  let [attemptError, setAttemptError] = useState(false);
  let [attemptErrorText, setAttemptErrorText] = useState("");
  let [isDisplayGateway, setIsDisplayGateway] = useState(false);
  let [isDeleteGateway, setIsDeleteGateway] = useState(false);
  let [selectedGateWayForDelete, setSelectedGateWayForDelete] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const [selectedGateway, setSelectedGateway] = useState(
    AppOverlayContext.selectedGateway,
  );

  const [deleteSelectedGateway, setDeleteSelectedGateway] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [togled, setTogled] = useState(false);

  const [errorText, setErrorText] = useState("");
  const [deleteText, setDeleteText] = useState("");
  const [helpText, setHelpText] = useState(" ");

  const [countFlag, setCountFlag] = useState(true);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [disabledContinue, setDisabledContinue] = useState(true);

  const [forceChange, setForceChange] = useState({});
  const [rowsCount, setRowsCount] = useState(0);

  const [state, setState] = useState(false);
  const [isBem, setIsBem] = useState(false);

  const [prompt, setPrompt] = useState(false);
  const [message, setMessage] = useState("");

  const isDisabled = Boolean(!isBem && gatewayListData.length >= 2);

  const hostAddress = window.location.hostname;

  const handleAlertDialogClose = (callback) => {
    setAlertDialog(initialAlertDialog);
  };

  const togglePopup = (flagText) => {
    setIsDisplayGateway(!isDisplayGateway);

    setIsOpen((oldState) => {
      if (flagText === "open") {
        setIsAddDisabled(true);
        return true;
      }

      if (flagText === "close") {
        setIsAddDisabled(false);
        return false;
      }

      if (!flagText) {
        setIsAddDisabled(oldState);
        return !oldState;
      }
    });

    if (countFlag) {
      setRowsCount(
        gatewayListData.filter((gateway) => {
          return gateway.name.toLowerCase().includes(searchTerm.toLowerCase());
        }).length,
      );

      setCountFlag(false);
    }
  };

  const deletePopup = (ev, e, el) => {
    setIsDeleteGateway(!isDeleteGateway);
    setSelectedGateWayForDelete(el);
    //setModalDisplay("block");
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const deleteGateway = (event, el) => {
    setIsDeleteGateway(!isDeleteGateway);

    event.stopPropagation();

    window.gatewaysThatAreBeingDeleted = [
      ...window.gatewaysThatAreBeingDeleted,
      el.address,
    ];

    setTogled(!togled);

    callAPI({
      path: "deleteGateway",
      data: { address: el.address },
      responder: DeleteGatewayAPIResponder,
      onComplete: DeleteGatewayOnCompleteHandler,
      onCompleteArguments: [el],
    });

    setTimeout(() => {
      setErrorText("");
      setDeleteText("");
    }, 9000);
  };

  const DeleteGatewayOnCompleteHandler = (response, el) => {
    if (response.state === "DELETE_GATEWAY_SUCESS") {
      setAttemptError(false);
      setAttemptErrorText("");

      window.gatewaysThatAreBeingDeleted =
        window.gatewaysThatAreBeingDeleted.filter((val) => val !== el.address);

      setTogled(togled);

      window.gatewayListData = window.gatewayListData.filter(
        (ell) => ell.address !== el.address,
      );

      setGatewayListData(() => {
        const newState = [...AppOverlayContext.gatewayList];

        return newState.filter(({ address }) => address !== el.address);
      });

      AppOverlayContext.setGatewayList((latest) => {
        let newList = [...latest];
        newList = newList.filter((val) => val.address !== el.address);
        return newList;
      });

      if (el.address === AppOverlayContext.selectedGateway.address) {
        let r = window.gatewayListData.findIndex(
          (ell) => ell.offline === "false" || ell.offline === false,
        );

        if (r === -1) {
          setForceChange({});
          setSelectedGateway({});
          window.sessionStorage.removeItem("ba-selected-gateway");
          AppOverlayContext.setSelectedGateway({});
          dispatch(setActiveGateway({ name: "", address: "", checked: false }));

          // Handle no online gateways available
          let location = JSON.parse(JSON.stringify(props.location));
          let search = new URLSearchParams(location.search);

          search.set("forceAdd", "true");
          location.search = search.toString();

          if (location.key) {
            delete location.key;
          }

          props.history.push(location);
        } else {
          const newState = {
            name: window.gatewayListData[r].name,
            address: window.gatewayListData[r].address,
            checked: true,
          };

          setForceChange(newState);
          setSelectedGateway(newState);
          dispatch(setActiveGateway(newState));
        }
      } else if (el.address === selectedGateway.address) {
        setSelectedGateway(AppOverlayContext.selectedGateway);

        dispatch(
          setActiveGateway({
            ...AppOverlayContext.selectedGateway,
          }),
        );
      }

      setDeleteText(
        "Successfully removed invisigate/controller " + el.name + ".",
      );
      setIsDelete(isDelete);
    } else {
      setTogled(togled);
      setAttemptError(true);

      window.gatewaysThatAreBeingDeleted =
        window.gatewaysThatAreBeingDeleted.filter((val) => val !== el.address);

      // TODO: NEED TO BE A POPUP
      setPrompt(true);
      setMessage(
        <>
          {t("commons.errorMessages.errorDeletingGateway", {
            name: el.name,
          })}
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(response, true).join("\n- ")},
        </>,
      );

      setIsDelete(!isDelete);
    }
  };

  const handleSelect = (event, el) => {
    let deleteClicked = false;

    if (deleteClicked) {
      return;
    }

    setSelectedGateway({
      name: el.name,
      address: el.address,
      checked: true,
    });

    setCheckedItems((checkedItems) => {
      if (event.target.checked) {
        return {
          ...checkedItems,
          [el.name]: event.target.checked,
        };
      } else {
        let ci = JSON.parse(JSON.stringify(checkedItems));
        delete ci[el.name];
        return ci;
      }
    });
  };

  // Gateway List api call
  const GatewayListOnCompleteHandler = (response) => {
    if (response.state === "GATEWAY_LIST_SUCESS" && response.data !== "") {
      let data = [];
      data = response.data;

      data = data.map((gw) => {
        let newgw = { ...gw };

        if (typeof newgw.name !== "string") {
          newgw.name = "";
        }

        return newgw;
      });

      window.gatewayListData = data;
      AppOverlayContext.setGatewayList(window.gatewayListData);
      setGatewayListData(window.gatewayListData);
      setLoading(false);
    } else {
      setLoading(
        <>
          {t("commons.errorMessages.errorLoadingGatewayList")}

          <br />
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(response)}
        </>,
      );
      setHelpText("Please try reloading the page or reopening this modal.");
    }
  };

  useEffect(() => {
    setDeleteSelectedGateway(selectedGateway);

    setLoading(true);

    callAPI({
      path: "getGatewaysStatus",
      data: {},
      responder: GatewayListAPIResponder,
      onComplete: GatewayListOnCompleteHandler,
    });
  }, []);

  useEffect(() => {
    const results = gatewayListData.filter((gateway) =>
      gateway.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResults(results);
  }, [searchTerm, gatewayListData]);

  useEffect(() => {
    let search = new URLSearchParams(props.location.search);
    let gs = search.get("gatewaySelection");
    let fa = search.get("forceAdd");
    if (gs === "initial") {
      setHelpText(
        `To continue further, please select a ${common.GATEWAY}/${common.TAC_SERVER} from the above list.`.toLowerCase(),
      );
    } else if (gs === "switch") {
      if (fa === "true") {
        setHelpText(
          `To select a ${common.GATEWAY}/${common.TAC_SERVER}, please add an active ${common.GATEWAY}/${common.TAC_SERVER} to select it in the above list.`.toLowerCase(),
        );
      } else {
        setHelpText(t("commons.gateway.manage.add.prompt.selectActive"), {
          GATEWAY: common.GATEWAY,
          TAC_SERVER: common.TAC_SERVER,
        });
      }
    } else {
      setHelpText(" ");
    }

    let sgw = window.sessionStorage.getItem("ba-selected-gateway");
    if (sgw === null) {
      setSelectedGateway({});
    } else {
      try {
        sgw = JSON.parse(sgw);
        setSelectedGateway(sgw);
      } catch (err) {
        setSelectedGateway({});
        window.sessionStorage.removeItem("ba-selected-gateway");
      }
    }
    setDisabledContinue(true);
  }, []);

  useEffect(() => {
    if (
      forceChange.address !== undefined &&
      forceChange.address === selectedGateway.address
    ) {
      setForceChange({});
      window.sessionStorage.setItem(
        "ba-selected-gateway",
        JSON.stringify(selectedGateway),
      );
      AppOverlayContext.setSelectedGateway(selectedGateway);
    }
    let search = new URLSearchParams(props.location.search);
    let gs = search.get("gatewaySelection");
    let fa = search.get("forceAdd");
    if (gs === "initial") {
      if (selectedGateway.address === undefined) {
        setDisabledContinue(true);
        setHelpText(
          "To continue further, please select a gateway/server from the above list.",
        );
      } else {
        setDisabledContinue(false);
        setHelpText(() => (
          <React.Fragment>
            <b>Name:</b> {selectedGateway.name} | <b>Address:</b>{" "}
            {selectedGateway.address}
            <br />
            Please click <code>"Save and Continue"</code> to select the above
            gateway/server.
          </React.Fragment>
        ));
      }
    } else if (gs === "switch") {
      if (selectedGateway.address === undefined) {
        setDisabledContinue(true);
        setHelpText(
          t("commons.gateway.manage.add.prompt.selectActive", {
            GATEWAY: common.GATEWAY,
            TAC_SERVER: common.TAC_SERVER,
          }),
        );
      } else {
        let sgw = window.sessionStorage.getItem("ba-selected-gateway");
        try {
          sgw = JSON.parse(sgw);
          if (sgw.address === selectedGateway.address) {
            setDisabledContinue(true);
            setHelpText(
              t("commons.gateway.manage.add.prompt.selectActive", {
                GATEWAY: common.GATEWAY,
                TAC_SERVER: common.TAC_SERVER,
              }),
            );
          } else {
            setDisabledContinue(false);
            setHelpText(() => {
              const gatewayName = selectedGateway.name;
              const gatewayAddress = selectedGateway.address;

              return (
                <p>
                  <Trans
                    i18nKey={"commons.gateway.manage.select.confirm.1"}
                    values={{
                      GATEWAY: common.GATEWAY,
                      TAC_SERVER: common.TAC_SERVER,
                    }}
                    components={[<code />]}
                  >
                    Please click <code>"Save and Continue"</code> to switch to
                    the above gateway/server.
                  </Trans>
                </p>
              );
            });
          }
        } catch (err) {
          setDisabledContinue(false);
          setHelpText(() => (
            <React.Fragment>
              <Trans
                i18nKey={"commons.gateway.manage.select.confirm.0"}
                gatewayName={{ gatewayName: selectedGateway.name }}
                gatewayAddress={{ gatewayAddress: selectedGateway.address }}
              >
                <b>Name: </b> {{ gatewayName: selectedGateway.name }}|{" "}
                <b>Address: </b> {{ gatewayAddress: selectedGateway.address }}
              </Trans>
              <br />
              {t("commons.gateway.manage.select.confirm.1")}
            </React.Fragment>
          ));
        }
      }
    } else {
      setHelpText(" ");
    }
  }, [selectedGateway, AppOverlayContext.gatewaySelectionMode, forceChange]);

  useEffect(() => {
    setState(!state);
  }, [isOpen, isDisplayGateway]);

  useEffect(() => {
    callAPI({
      path: "isBem",
      data: {},
      responder: (res, onComplete, onCompleteArguments) => {
        const responder = {
          state: "IS_BEM_FAILURE",
          data: undefined,
        };

        if (res.state === "GOOD_RESPONSE") {
          responder.state = "IS_BEM_SUCCESS";
          responder.data = res.response.body;
        }
        onComplete(responder, ...onCompleteArguments);
      },
      onComplete: (response) => {
        const newState = response.data ?? false;
        setIsBem(newState);
      },
    });
  }, []);

  useEffect(() => {
    if (!AppOverlayContext.componentsShown.includes("mng-gtw")) {
      setIsOpen(false);
      setIsAddDisabled(false);
    }
  }, [AppOverlayContext.componentsShown]);

  let forceAdd = new URLSearchParams(props.location.search).get("forceAdd");

  return (
    <>
      <div container className={props.flag && "hide"}>
        <div>
          <StyledModalHeader>
            <h6
              class="modal-title fw-bold"
              id="staticBackdropLabel"
              style={{
                fontSize: "1rem",
                marginTop: 0,
                marginBottom: 0,
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {t(`commons.gateway.manage.select.title`, {
                GATEWAY: common.GATEWAY,
                TAC_SERVER: common.TAC_SERVER,
              })}
            </h6>

            <StyledCloseIconComponent
              style={{
                opacity: forceAdd === "true" ? 0 : 1,
                pointerEvents: forceAdd === "true" ? "none" : "all",
              }}
              onClick={() => {
                togglePopup("close");
                AppOverlayContext.setComponentsShown(
                  AppOverlayContext.componentsShown
                    .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
                    .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
                );
                AppOverlayContext.setGatewaySelectionMode("");
              }}
            />
          </StyledModalHeader>

          <div style={{ padding: "1rem" }}>
            <StyledDivComponent className={isDisplayGateway && "hide"}>
              <SearchDivComponent className={isDisplayGateway && "hide "}>
                <SearchInputComponent
                  ref={searchInputRef}
                  type="text"
                  placeholder={`${t("commons.gateway.manage.search.text", {
                    GATEWAY: common.GATEWAY,
                    TAC_SERVER: common.TAC_SERVER,
                  })?.toLowerCase()}`}
                  value={searchTerm}
                  onChange={handleChange}
                  disabled={loading !== false || gatewayListData.length === 0}
                />

                <IComponent
                  style={{
                    color: "#0d6efd",
                    fontSize: "1.25rem",
                    marginRight: "1rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      searchInputRef !== null &&
                      searchInputRef !== undefined
                    ) {
                      if (
                        searchInputRef.current !== null &&
                        searchInputRef.current !== undefined
                      ) {
                        searchInputRef.current.focus();
                      }
                    }
                  }}
                ></IComponent>
              </SearchDivComponent>

              <AddButtonComponent
                className={isDisplayGateway && "hide "}
                onClick={() => togglePopup("open")}
                disabled={isAddDisabled || isDisabled}
                theme={{ disabled: isAddDisabled || isDisabled }}
              >
                <StyledPlusCircle className={props.flag && "hide "} />
                <span
                  style={{
                    paddingLeft: "5px",
                    verticalAlign: "super",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  {t(`commons.gateway.manage.add.buttonName`)}
                </span>
              </AddButtonComponent>
            </StyledDivComponent>

            {isDeleteGateway && (
              <>
                <AlertDialog
                  open={alertDialog.open}
                  contentTitle={alertDialog.contentTitle}
                  contentText={alertDialog.contentText}
                  agreeTitle={t("commons.confirmText")}
                  disagreeTitle={t("commons.cancelText")}
                  handleAgree={(e) => {
                    deleteGateway(e, selectedGateWayForDelete);
                    handleAlertDialogClose();
                  }}
                  handleDisagree={handleAlertDialogClose}
                />
              </>
            )}

            <ReactCardFlip
              isFlipped={!isOpen}
              flipSpeedBackToFront="1"
              flipSpeedFrontToBack="1"
            >
              <div
                style={{
                  width: "100%",
                  height: "60vh",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "start",
                  margin: "0 auto",
                  padding: "1em",
                  backgroundColor: "#fff",
                  borderRadius: "0.5em",
                  boxShadow: "0em 0em 2em -1.5em #333",
                }}
              >
                <AddGateway
                  handleClose={togglePopup}
                  disableAdding={isDisabled}
                  state={state}
                  setGatewayListData={setGatewayListData}
                  setSelectedGateway={setSelectedGateway}
                  setHelpText={setHelpText}
                  isCardOpen={isOpen}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  height: "60vh",
                  backgroundColor: "#fff",
                  borderRadius: "0.5em",
                  boxShadow: "0em 0em 2em -1.5em #333",
                  padding: "0.25em 0em",
                }}
              >
                <GatewayList
                  isHovered={isHovered}
                  setIsHovered={setIsHovered}
                  loading={loading}
                  searchResults={searchResults}
                  AppOverlayContext={AppOverlayContext}
                  selectedGateway={selectedGateway}
                  isBem={isBem}
                  handleSelect={handleSelect}
                  isChecked={isChecked}
                  hostAddress={hostAddress}
                  deletePopup={deletePopup}
                  deleteGateway={deleteGateway}
                  setAlertDialog={setAlertDialog}
                />

                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1em",
                  }}
                >
                  <p
                    style={
                      deleteText !== ""
                        ? {
                            width: "100%",
                            textAlign: "center",
                            fontWeight: "400",
                            color: "green",
                            marginBottom: 0,
                            marginTop: 0,
                          }
                        : {
                            width: "100%",
                            textAlign: "center",
                            fontWeight: "400",
                            color: "red",
                            marginBottom: 0,
                            marginTop: 0,
                          }
                    }
                  >
                    {deleteText !== "" && deleteText}
                    {errorText}
                  </p>

                  <p
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "400",
                      display: loading !== false ? "none" : "block",
                    }}
                  >
                    {helpText}
                  </p>

                  <GenericButton
                    id={`${gateway}-save-continue-button`}
                    width={i18n.language === "es" ? "11.5rem" : "10rem"}
                    backgroundColor="primary"
                    buttonName={t(`commons.gateway.manage.select.buttonName`)}
                    disabled={disabledContinue}
                    onClick={() => {
                      window.sessionStorage.setItem(
                        "ba-selected-gateway",
                        JSON.stringify(selectedGateway),
                      );
                      AppOverlayContext.setSelectedGateway(selectedGateway);
                      dispatch(
                        setActiveGateway({ address: selectedGateway.address }),
                      );
                      AppOverlayContext.setComponentsShown(
                        AppOverlayContext.componentsShown
                          .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
                          .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") + ",gtw-bnr",
                      );
                      AppOverlayContext.setGatewaySelectionMode("");
                    }}
                  />
                </Grid>
              </div>
            </ReactCardFlip>
          </div>
        </div>
      </div>
      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={t("commons.errorText")}
        contentText={message}
        contentInfo={``}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setPrompt(false)}
      />
    </>
  );
};

export default withRouter(withCookies(Gates));
