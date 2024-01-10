import { Box, Grid, IconButton, Radio } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import React, { createRef, useContext, useEffect, useState } from "react";
//import breakpoint from "../Gateway/Breakpoint";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import ReactCardFlip from "react-card-flip";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
import { createBreakpoint, createMap } from "styled-components-breakpoint";
import callAPI from "../../apis/callAPI";
import { DeleteGatewayAPIResponder } from "../../apis/responders/delete-gareway-api-responder";
import { GatewayListAPIResponder } from "../../apis/responders/gateway-list-api-responder";
import OverlayContext from "../AppContent/AppOverlayContext";
import AddGateway from "../GatewayManagement/AddGateway";
import { useTranslation } from "react-i18next";
import * as common from "../../common";

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const breakpoint = createBreakpoint(breakpoints);
const map = createMap(breakpoints);

const gatewayListDataMap = [
  {
    gatewayName: "BRGW-I-401",
    expiryDate: "01/09/2021",
    address: "ec2-44-236-115-1.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-402",
    expiryDate: "02/09/2021",
    address: "ec2-44-236-115-2.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-403",
    expiryDate: "03/09/2021",
    address: "ec2-44-236-115-3.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-404",
    expiryDate: "04/09/2021",
    address: "ec2-44-236-115-4.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-405",
    expiryDate: "05/09/2021",
    address: "ec2-44-236-115-5.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-406",
    expiryDate: "06/09/2021",
    address: "ec2-44-236-115-6.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-407",
    expiryDate: "07/09/2021",
    address: "ec2-44-236-115-7.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-408",
    expiryDate: "08/09/2021",
    address: "ec2-44-236-115-8.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-409",
    expiryDate: "09/09/2021",
    address: "ec2-44-236-115-9.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-410",
    expiryDate: "10/09/2021",
    address: "ec2-44-236-115-10.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-411",
    expiryDate: "11/09/2021",
    address: "ec2-44-236-115-11.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-412",
    expiryDate: "12/09/2021",
    address: "ec2-44-236-115-12.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-413",
    expiryDate: "13/09/2021",
    address: "ec2-44-236-115-13.us-west-2.compute.amazonaws.com",
  },
  {
    gatewayName: "BRGW-I-414",
    expiryDate: "14/09/2021",
    address: "ec2-44-236-115-14.us-west-2.compute.amazonaws.com",
  },
];
gatewayListDataMap.forEach((el) => (el.id = Math.random()));

const SelectButtonComponent = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  float: right;
  background-color: rgb(0, 148, 253);
  color: transparent;
  font-size: 0.7rem;
  border-radius: 0.25rem;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  border: 1px solid rgb(70, 153, 179);
  opacity: 0;
  &.hide {
    font-size: 0.7rem;
    line-height: 1;
    height: 30px;
    width: 80px;
  }
  &:hover {
    opacity: 1;
    color: #fff;
    background-color: rgb(0, 148, 253);
    font-size: 0.9rem;
  }
`;

const RemoveButtonComponent = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  float: right;
  background-color: rgb(0, 148, 253);
  color: transparent;
  font-size: 0.7rem;
  border-radius: 0.25rem;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  border: 1px solid rgb(70, 153, 179);
  opacity: 1;
  &.hide {
    font-size: 0.7rem;
    line-height: 1;
    height: 30px;
    width: 80px;
  }
`;

const StyledTdComponent = styled.td`
  //color: #fff;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
  padding: 0.5rem 0.5rem;
  line-height: 1.5;
  font-size: 0.75rem;
  /* font-family: "Montserrat", sans-serif; */
`;

const StyledTrComponent = styled.tr`
  cursor: pointer;
  pointer-events: all;

  &:hover {
    background: #f1fdfc;
  }
  &:hover .selecthide {
    opacity: 1;
    color: #fff;
    background-color: #eff2f7;
    font-size: 0.75rem;
    &:hover {
      cursor: pointer;
      opacity: 1;
      color: #fff;
      background-color: #eff2f7;
      font-size: 0.75rem;
    }

    &input:checked[type="checkbox"] {
      background-image: url(../images/tickicon.png);
      background-size: 10px auto;
      border: 1px solid rgb(143 220 106);
    }
  }

  & .selected {
    opacity: 1;
    color: #fff;
    background-color: #eff2f7;
    font-size: 0.75rem;
    cursor: default;
    pointer-events: none;
  }
`;

const GridComponent = styled(Grid)`
  //margin-top: 50px;
  &.hide {
    // margin-top: 25px;
  }
`;

const StyledCloseIconComponent = styled(CloseIcon)`
  padding: 0.25em;
  margin: -0.5rem -0.5rem -0.5rem auto;
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
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
`;

const SearchDivComponent = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  align-items: center;
  display: flex;
  float: left;
  &.hide {
    //height: 35px;
    opacity: 0.5;
  }
`;

const AddButtonComponent = styled.button`
  float: right;
  font-size: 11px;
  line-height: 24px;
  background: #8fdc6a;
  color: #000;
  border-radius: 5px;
  border: none;
  padding: 4px 15px;
  text-decoration: none;
  &:hover {
    background: #58d61b;
    color: #000;
  }
  &.hide {
    font-size: 0.85rem;
    height: 35px;
    //width: 100px;
    &:hover {
      background: #8fdc6a;
    }
  }
`;

const StyledBox = styled(Box)`
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const SubmitButtonComponent = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  float: right;
  color: #f8f9fa;
  border-color: #f8f9fa;
  border: 1px solid #fff;
  // background-color: transparent;
  background-color: #eff2f7;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  &:hover {
    //background: rgba(0, 0, 0, 0.2);
    background-color: #eff2f7;
    color: #fff;
  }
  &.hide {
    font-size: 0.85rem;
    line-height: 1;
    height: 35px;
    width: 100px;
  }
  &[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const SelectedButtonComponent = styled.button`
  cursor: pointer;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  width: 70px;
  height: 25px;
  float: right;
  color: #fff;
  background-color: rgb(0, 148, 253);
  font-size: 0.65rem;
  border-radius: 0.25rem;
  line-height: 0;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding-left: 7px;
  &.hide {
    font-size: 0.75rem;
    line-height: 1;
    height: 25px;
    width: 80px;
    line-height: 0;
    padding-left: 8px;
  }
  &:hover {
    background-color: rgb(0, 148, 253);
    color: #fff;
  }
`;

const ImgComponent = styled.img`
  width: 100%;
  &.hide {
    width: 80%;
  }
`;
const H4Component = styled.h4`
  color: #fff;
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  padding-left: 22px;
  /* font-family: "Montserrat", sans-serif; */
  &.hide {
    font-size: calc(1.01rem + 0.3vw);
    margin-bottom: 0;
    font-weight: 400;
    line-height: 0.8;
    padding-left: 12px;
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
`;

const ScrollContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-left: 10px;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(179, 177, 177);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(136, 136, 136);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(100, 100, 100);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:active {
    background: rgb(68, 68, 68);
    border-radius: 10px;
  }
`;
const StyledSpanComponent = styled.span`
  width: 6px;
  height: 10px;
  background: #80be44;
  border-left: 1px solid #52942d;
  display: inline-block;
  float: left;
`;

const StyledLabelComponent = styled.label`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  color: #fff;
  border: 1px solid #dee2e6;
  padding-left: 20px;
  padding-right: 20px;
  padding: 0.375rem 0.75rem;
  align-items: center;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 15%;
`;
const StyledthComponent = styled.th`
  //color: #0094fd;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
  padding: 0.5rem 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
  /* font-family: "Montserrat", sans-serif; */
`;

const SyledOverlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
`;

const SearchInputComponent = styled.input`
  border: 0;
  margin-bottom: 0px;
  background-color: transparent;
  width: 100;
  width: 100%;
  outline: none;
  box-shadow: none;
  /* font-family: "Montserrat", sans-serif; */
  font-size: 1rem;
  font-weight: 400;
  //color: white;
  padding: 10px 10px 9px 20px;
  //color: #fff;
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

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-grow: 1;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  /* padding-top: 0.5em; */
`;

const StyledInputComponent = styled.input`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

const SaveButtonComponent = styled.button`
  cursor: pointer;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  /* font-family: "Montserrat", sans-serif; */
  color: #fff;
  background: #018ff6;
  border-color: #018ff6;
  border: 1px solid transparent;
  padding: 0.375rem 2rem;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.25rem;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  &:hover {
    background: #1e6ee4;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  &.hide {
    padding-left: 1rem;
    padding-right: 2.5em;
  }
`;

const StyledDivComponent = styled.div`
  //padding-top: 1rem;
  padding-bottom: 1rem;
  overflow: auto;
  //padding-left: 20px;
  &.hide {
    //padding-left: 12px;
    opacity: 0.5;
  }
`;

const StyledFooterGrid = styled(Grid)`
  display: flex;
  flex-directin: row;
  justify-content: center;
  margin-top: 50px;
  &.hide {
    margin-top: 35px;
  }
`;

const StyledPlusCircle = styled(PlusCircle)`
  font-size: 17px;
  &.hide {
    font-size: 17px;
  }
`;
const StyledCircle = styled.div`
  /* border-width: 0.25em;
  left: calc(50% - 120px);
  position: relative;
  top: 20em; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  padding: 10px;
  background-color: #fff;
`;
const StyledRadio = styled(Radio)`
  //color: #fff;

  &.Mui-checked {
    color: rgb(0 148 253);
    font-size: 0.95rem;
    pointer-events: none;
  }

  &:hover {
    color: rgba(0, 148, 253, 0.6);
    background-color: rgba(0, 148, 253, 0.1);
  }
`;

const StyledTrHead = styled.tr`
  &:hover {
    background-color: transparent;
  }
`;

const StyledIconButton = styled(IconButton)`
  color: ${(props) => props.color};
  margin: 0em 0.15em;
  padding: 1em;
  font-size: 0.85em;

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }

  &.Mui-disabled {
    opacity: 0.6;
    pointer-events: all;
    cursor: not-allowed;
  }

  &.Mui-disabled:hover {
    background-color: transparent;
  }
`;

const StyledTrash = styled(Trash)`
  font-size: 1.4em;
  color: ${(props) => props.color};
`;

const StyledClipLoaderContainer = styled(Box)`
  margin-left: 0.75em;
  margin-top: 0.5em;
`;

window.gatewaysThatAreBeingDeleted = [];
window.gatewayListData = [];
const StyledSelectGateWayDiv = styled.div`
  display: ${(props) => props.display};
`;

const StyledAddGateWayDiv = styled.div`
  display: ${(props) => props.display};
  max-width: 400px;
  margin: 0 auto;
  margin-top: 3rem !important;
  margin-bottom: 3rem !important;
`;

const StyledAddGateWayHeader = styled.h6`
  font-weight: 700 !important;
`;

const WidgetModal = (props) => {
  const AppOverlayContext = useContext(OverlayContext);
  const searchInputRef = createRef();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedCheckedItems, setSelectedCheckedItems] = useState();
  const [selectedGateway, setSelectedGateway] = useState({});
  const [deleteSelectedGateway, setDeleteSelectedGateway] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  let [gatewayListData, setGatewayListData] = useState(window.gatewayListData);
  const [togled, setTogled] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [deleteText, setDeleteText] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [forceChange, setForceChange] = useState({});
  let [attemptError, setAttemptError] = useState(false);
  let [attemptErrorText, setAttemptErrorText] = useState("");
  // let [gatewaysThatAreBeingDeleted, setGatewaysThatAreBeingDeleted] = useState([]);
  let [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);
  let [isDisplayGateway, setIsDisplayGateway] = useState(false);
  const { t } = useTranslation();

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setIsDisplayGateway(!isDisplayGateway);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //   const toggleChanger = () => {
  //     setToggled(!toggled);
  //   };

  // const dateChanger = (date) => {
  //   var decimalDate = parseInt("0x" + date);
  //   var myDate = new Date(1000 * decimalDate);
  //   return myDate.toLocaleString();
  // };

  const hexToTimeString = (hex) => {
    let ts = new Date(parseInt("0x" + hex) * 1000);
    ts = ts
      .toISOString()
      .replace(/-/g, "/")
      .replace(/T/g, " ")
      .replace(/\.\d{3}Z$/, " UTC");
    return ts;
  };

  const changeHandler = (event, el) => {
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

  useEffect(() => {
    setDeleteSelectedGateway(selectedGateway);
  }, []);

  const deleteGateway = (event, el) => {
    event.stopPropagation();

    window.gatewaysThatAreBeingDeleted = [
      ...window.gatewaysThatAreBeingDeleted,
      el.address,
    ];

    setTogled(!togled);

    callAPI({
      path: "deleteGateway",
      data: {
        address: el.address,
      },
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
    if (response.state === "DELETE_GATEWAY_SUCESS" && response.data !== "") {
      setAttemptError(false);
      setAttemptErrorText("");

      window.gatewaysThatAreBeingDeleted =
        window.gatewaysThatAreBeingDeleted.filter((val) => val !== el.address);

      setTogled(togled);
      if (el.name === selectedGateway.name) {
        let r = searchResults.findIndex((ell) => ell.name === el.name);
        if (r === 0) {
          r = 1;
        } else {
          r = 0;
        }
        setForceChange({
          name: searchResults[r].name,
          address: searchResults[r].address,
          checked: true,
        });
        setSelectedGateway({
          name: searchResults[r].name,
          address: searchResults[r].address,
          checked: true,
        });
      }
      window.gatewayListData = window.gatewayListData.filter(
        (ell) => ell.address !== el.address,
      );
      setGatewayListData(window.gatewayListData);
      setDeleteText("Successfully removed gateway " + el.name + ".");
      setIsDelete(isDelete);
    } else {
      setTogled(togled);
      setAttemptError(true);

      window.gatewaysThatAreBeingDeleted =
        window.gatewaysThatAreBeingDeleted.filter((val) => val !== el.address);

      setErrorText(t("commons.errorMessages.errorDetails", { name: el.name }));
      setIsDelete(!isDelete);
    }
  };

  const handleSelect = (event, el) => {
    // Check if click was on delete button
    let node = event.target;
    let deleteClicked = false;
    while (true) {
      if (typeof node.className !== "string") {
        node = node.parentNode;
        continue;
      }

      if (
        node.className.match(/((^)|( ))ba-gw-delete-button(( )|($))/) !== null
      ) {
        deleteClicked = true;
        break;
      }

      if (node.className.match(/((^)|( ))ba-gw-row(( )|($))/) !== null) {
        break;
      }

      node = node.parentNode;
    }

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

  const handleDeleteSelect = (event, el) => {
    setDeleteSelectedGateway({
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
    let data = [];

    if (response.state === "GATEWAY_LIST_SUCESS" && response.data !== "") {
      data = response.data;
    }

    window.gatewayListData = data;
    AppOverlayContext.setGatewayList(window.gatewayListData);
    setGatewayListData(window.gatewayListData);
  };

  useEffect(() => {
    callAPI({
      path: "gatewayList",
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

  const handleChecked = () => {
    setIsChecked(!isChecked);
  };

  const [helpText, setHelpText] = useState(" ");
  const [disabledContinue, setDisabledContinue] = useState(true);
  useEffect(() => {
    let search = new URLSearchParams(props.location.search);
    let gs = search.get("gatewaySelection");
    if (gs === "initial") {
      setHelpText(
        "To continue further, please select a gateway from the above table.",
      );
    } else if (gs === "switch") {
      setHelpText(
        "To switch gateway, please select a gateway from the above table.",
      );
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
    if (gs === "initial") {
      if (selectedGateway.address === undefined) {
        setDisabledContinue(true);
        setHelpText(
          "To continue further, please select a gateway from the above table.",
        );
      } else {
        setDisabledContinue(false);
        setHelpText(() => (
          <React.Fragment>
            <b>Name: {selectedGateway.name}</b>&nbsp;&nbsp;&nbsp;&nbsp;
            <i>Address: {selectedGateway.address}</i>
            <br />
            Please click <code>"Save and Continue"</code> to select the above
            gateway.
          </React.Fragment>
        ));
      }
    } else if (gs === "switch") {
      if (selectedGateway.address === undefined) {
        setDisabledContinue(true);
        setHelpText(
          "To switch gateway, please select a gateway from the above table.",
        );
      } else {
        let sgw = window.sessionStorage.getItem("ba-selected-gateway");
        try {
          sgw = JSON.parse(sgw);
          if (sgw.address === selectedGateway.address) {
            setDisabledContinue(true);
            setHelpText(
              "To switch gateway, please select a gateway from the above table.",
            );
          } else {
            setDisabledContinue(false);
            setHelpText(() => (
              <React.Fragment>
                <b>Name: {selectedGateway.name}</b>&nbsp;&nbsp;&nbsp;&nbsp;
                <i>Address: {selectedGateway.address}</i>
                <br />
                Please click <code>"Save and Continue"</code> to switch to the
                above gateway.
              </React.Fragment>
            ));
          }
        } catch (err) {
          setDisabledContinue(false);
          setHelpText(() => (
            <React.Fragment>
              <b>Name: {selectedGateway.name}</b>&nbsp;&nbsp;&nbsp;&nbsp;
              <i>Address: {selectedGateway.address}</i>
              <br />
              Please click <code>"Save and Continue"</code> to switch to the
              above gateway.
            </React.Fragment>
          ));
        }
      }
    } else {
      setHelpText(" ");
    }
  }, [selectedGateway, AppOverlayContext.gatewaySelectionMode, forceChange]);

  return (
    <div
      style={{
        width: "calc(100vw - 63px)",
        height: "100vh",
        position: "absolute",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#29292930",
        webkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        container
        className={props.flag && "hide"}
        style={{
          background: "#F9F9F9",
          borderRadius: "0.3em",
        }}
      >
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
                // fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Select {common.GATEWAY}
            </h6>
            <StyledCloseIconComponent onClick={props.toggleModal} />
          </StyledModalHeader>
          <div style={{ padding: "1rem" }}>
            <StyledDivComponent className={isDisplayGateway && "hide"}>
              <SearchDivComponent className={isDisplayGateway && "hide "}>
                <SearchInputComponent
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search gateways ..."
                  value={searchTerm}
                  onChange={handleChange}
                  disabled={isDisplayGateway && true}
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
                type="button"
                className={isDisplayGateway && "hide "}
                onClick={togglePopup}
                disabled={isDisplayGateway && true}
              >
                <StyledPlusCircle className={props.flag && "hide "} />
                <span
                  style={{
                    paddingLeft: "5px",
                    verticalAlign: "super",
                    fontSize: "12px",
                  }}
                >
                  Add Gateway
                </span>
              </AddButtonComponent>
            </StyledDivComponent>
            <ReactCardFlip
              isFlipped={!isOpen}
              flipSpeedBackToFront="1"
              flipSpeedFrontToBack="1"
            >
              {isOpen && (
                <div
                  style={{
                    height: "55vh",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                >
                  <AddGateway handleClose={togglePopup} />
                </div>
              )}
              {!isOpen && (
                <div style={{ height: "55vh" }}>
                  <ScrollContainer>
                    <table
                      style={{
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                        overflow: "auto",
                        width: "100%",
                        marginBottom: "1rem",
                        color: "#212529",
                        verticalAlign: "top",
                        borderColor: "#dee2e6",
                        display: "table",
                        borderCollapse: "collapse",
                        padding: ".5rem .5rem",
                      }}
                    >
                      <thead style={{ verticalAlign: "bottom" }}>
                        <StyledTrHead>
                          <th
                            scope="col"
                            class="tablecheckbox"
                            style={{
                              width: "50px",
                              textAlign: "center",
                              borderBottom: "1px solid #dee2e6",
                            }}
                          ></th>
                          <StyledthComponent
                            scope="col"
                            style={{
                              width: "160px",
                            }}
                          >
                            {common.GATEWAY}
                          </StyledthComponent>
                          <StyledthComponent
                            scope="col"
                            style={{
                              width: "400px",
                            }}
                          >
                            Address
                          </StyledthComponent>
                          <StyledthComponent
                            scope="col"
                            style={{
                              width: "190px",
                            }}
                          >
                            Certificate Expiry
                          </StyledthComponent>
                          {
                            //props.flag &&
                            <StyledthComponent
                              scope="col"
                              style={{
                                width: "50px",
                              }}
                            ></StyledthComponent>
                          }
                        </StyledTrHead>
                      </thead>
                      <tbody>
                        {searchResults.map((el) => (
                          <StyledTrComponent
                            className="ba-gw-row"
                            key={el.key}
                            style={
                              AppOverlayContext.selectedGateway !== null
                                ? AppOverlayContext.selectedGateway.address ===
                                  el.address
                                  ? { backgroundColor: "#EFF2F7" }
                                  : {}
                                : {}
                            }
                            onClick={(e) => handleSelect(e, el)}
                          >
                            <th
                              scope="row"
                              class="tablecheckbox"
                              style={{
                                //color: "#fff",
                                borderBottom: "1px solid #dee2e6",
                                width: "50px",
                              }}
                            >
                              <div class="form-check mx-2">
                                <StyledRadio
                                  color="primary"
                                  size="small"
                                  checked={
                                    selectedGateway.address === el.address
                                      ? selectedGateway.checked
                                      : isChecked
                                  }
                                  onClick={(e) => handleSelect(e, el)}
                                />
                              </div>
                            </th>
                            <StyledTdComponent>{el.name}</StyledTdComponent>
                            <StyledTdComponent>{el.address}</StyledTdComponent>
                            <StyledTdComponent>
                              {hexToTimeString(el.certexpy)}
                            </StyledTdComponent>
                            {
                              <StyledTdComponent>
                                {window.gatewaysThatAreBeingDeleted.indexOf(
                                  el.address,
                                ) > -1 ? (
                                  <StyledClipLoaderContainer>
                                    <ClipLoader size="3vh" />
                                  </StyledClipLoaderContainer>
                                ) : (
                                  <StyledIconButton
                                    className="ba-gw-delete-button"
                                    color={"#333"}
                                    hoverBg={"rgba( 220, 20, 60, 0.1 )"}
                                    disabled={
                                      Object.keys(gatewayListData).length === 1
                                    }
                                    //selectedGateway.address === el.address &&
                                    onClick={(e) => {
                                      if (
                                        Object.keys(gatewayListData).length !==
                                        1
                                      ) {
                                        deleteGateway(e, el);
                                      }
                                    }}
                                  >
                                    <StyledTrash
                                      color={"rgba( 220, 20, 60, 1 )"}
                                    />
                                  </StyledIconButton>
                                )}
                              </StyledTdComponent>
                            }
                          </StyledTrComponent>
                        ))}
                      </tbody>
                    </table>
                  </ScrollContainer>

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
                        //color: "white",
                      }}
                    >
                      {helpText}
                    </p>
                    <SaveButtonComponent
                      type="button"
                      onClick={() => {
                        window.sessionStorage.setItem(
                          "ba-selected-gateway",
                          JSON.stringify(selectedGateway),
                        );
                        AppOverlayContext.setSelectedGateway(selectedGateway);
                        AppOverlayContext.setComponentsShown(
                          AppOverlayContext.componentsShown
                            .replace(/(,mng-gtw,)|(,mng-gtw$)/, ",")
                            .replace(/(,gtw-bnr,)|(,gtw-bnr$)/, ",") +
                            ",gtw-bnr",
                        );
                        AppOverlayContext.setGatewaySelectionMode("");
                      }}
                      disabled={disabledContinue}
                    >
                      Save & Continue
                    </SaveButtonComponent>
                  </Grid>
                </div>
              )}
            </ReactCardFlip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withCookies(WidgetModal));
