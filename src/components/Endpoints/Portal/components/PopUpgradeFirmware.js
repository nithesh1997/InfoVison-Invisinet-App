import { Box, Button, Link, Radio, Typography } from "@material-ui/core";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import React, { useContext, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import {
  addFirmwareResponder,
  FirmwareResponder,
} from "../../../../apis/responders/FirmwareResponder";
import Config from "../../../../Config";
import Utility from "../../../../redux/actions/Utility";
import OverlayContext from "../../../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../../../General/WidthFillerSkeleton";
import AlertPopup from "./AlertPopup";
import { GenericButton } from "../../../../style/GenericButton/GenericButton";
import { firmware } from "../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";

const initModalAlert = {
  open: false,
  contentTitle: "",
  contentText: "",
  onClose: () => {},
  onCloseArgs: [],
};

const PopUpgradeFirmware = (props) => {
  const { setLoading, loading } = props;
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [searchResults, setSearchResults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [hide, setHide] = useState(true);
  const [disable, setDisable] = useState({
    apply: false,
    cancel: false,
    check: false,
  });

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [tableText, setTableText] = useState("");
  const [modalAlert, setModalAlert] = useState(initModalAlert);
  const [isHovered, setIsHovered] = useState(false);
  const [isVersion, setIsVersion] = useState(true);

  const { t } = useTranslation();

  const closeModalHandler = () => {
    modalAlert.onClose(...modalAlert.onCloseArgs);
    setModalAlert(initModalAlert);
  };

  useEffect(() => {
    setLoading(true);
    callAPI({
      path: "getFirmware",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data: {},
      responder: FirmwareResponder,
      onComplete: (response) => {
        setLoading(false);

        let data = [];
        if (response.state === "FIRMWARE_SUCCESS") {
          data = response.data;
          if (data.length === 0) {
            setTableText(
              t(
                "page.Endpoint.Configure.upgradeRemoteFirmwareModal.emptyMessage",
              ),
            );
            setHide(false);
          } else {
            setHide(true);
            setSearchResults((oldState) =>
              data.map((row, index) => ({
                isChecked: Boolean(index === 0),
                ...row,
              })),
            );
          }
        } else {
          setDisable((prev) => {
            return {
              ...prev,
              apply: true,
            };
          });
          setTableText(
            <div style={{ color: "crimson" }}>
              {t(
                "page.Endpoint.Configure.upgradeRemoteFirmwareModal.errorFetching",
              )}
              <br />
              <br />
              {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.details")}
              <br />
              {Utility.getErrorsFromResponse(response)}
            </div>,
          );
        }

        setIsTableLoading(false);
      },
    });
  }, []);

  let firm_id = searchResults
    .filter((e) => e.isChecked)
    .map((e) => e.id)
    .toString();

  let data = {
    endpoint_id: props.eligibleRows.map(({ endpoint_ID }) => endpoint_ID),
    firmware_id: parseInt(firm_id),
    task_id: 7,
  };

  const Applying = () => {
    callAPI({
      path: "addFirmware",
      params: { gatewayIP: AppOverlayContext.selectedGateway.address },
      data,
      responder: addFirmwareResponder,
      onComplete: addFirmwareOnCompleteHandler,
    });

    setSaving(true);
    setDisable((prev) => ({ ...prev, check: true, apply: true, cancel: true }));
  };

  const addFirmwareOnCompleteHandler = (response) => {
    if (response.state === "ADDFIRMWARE_SUCCESS") {
      setSaving(false);
      setDisable((prev) => {
        return {
          ...prev,
          check: false,
          apply: false,
          cancel: false,
        };
      });

      setModalAlert({
        open: true,
        contentTitle: t(
          "page.Endpoint.Configure.upgradeRemoteFirmwareModal.alert.succesTitle",
        ),
        contentText: t(
          "page.Endpoint.Configure.upgradeRemoteFirmwareModal.alert.successMessage",
        ),
        onCloseArgs: [],
        onClose: () => {
          setSaving(false);
          setDisable((prev) => ({
            ...prev,
            check: false,
            apply: false,
            cancel: false,
          }));
          props.cancelHandler();
        },
      });
    } else {
      const contentText = (
        <>
          <p>
            {" "}
            {t(
              "page.Endpoint.Configure.upgradeRemoteFirmwareModal.alert.errorMessage",
            )}
          </p>
          <br />
          <p>
            {t(
              "page.Endpoint.Configure.upgradeRemoteFirmwareModal.alert.details",
            )}{" "}
          </p>
          {Utility.getErrorsFromResponse(response)}
        </>
      );

      setModalAlert({
        open: true,
        contentTitle: t(
          "page.Endpoint.Configure.upgradeRemoteFirmwareModal.alert.errorTitle",
        ),
        contentText,
        onCloseArgs: [],
        onClose: () => {
          setSaving(false);
          setDisable((prev) => {
            return {
              ...prev,
              check: false,
              apply: false,
              cancel: false,
            };
          });
        },
      });
    }
  };

  const handleChange = (e, el) => {
    const checked = e.target.checked;

    setSearchResults(
      searchResults.map((data) => {
        if (data.id === el.id) {
          data.isChecked = true;
        } else {
          data.isChecked = false;
        }
        return data;
      }),
    );
  };

  return (
    <>
      {loading ? (
        <WidthFillerSkeleton height="400" width="800" />
      ) : (
        <>
          <Styled.TableWrapper>
            <Styled.SkeletonWrapper
              theme={{ display: isTableLoading ? "auto" : "none" }}
            >
              <WidthFillerSkeleton />
            </Styled.SkeletonWrapper>
          </Styled.TableWrapper>

          <Styled.Styleddiv>
            <Styled.TableHeadWrapper>
              <Styled.TableHead style={{ width: "100%" }}>
                <Styled.Td
                  style={{ minWidth: "39px", maxWidth: "39px" }}
                ></Styled.Td>
                <Styled.Td style={{ minWidth: "230px", maxWidth: "100px" }}>
                  {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.name")}
                </Styled.Td>
                <Styled.Td style={{ minWidth: "259px", maxWidth: "159px" }}>
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.releaseVersion",
                  )}
                </Styled.Td>
                <Styled.Td style={{ minWidth: "230px", maxWidth: "130px" }}>
                  {" "}
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.product",
                  )}
                </Styled.Td>
              </Styled.TableHead>
            </Styled.TableHeadWrapper>
            <Styled.RedundantTableBodyWrapper
              theme={{ isHovered }}
              onMouseOver={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Styled.EmptyTextWrapper
                theme={{ display: tableText ? "grid" : "none" }}
              >
                <Styled.EmptyText>{tableText}</Styled.EmptyText>
              </Styled.EmptyTextWrapper>
              <tbody
                style={{
                  //   overflowY: "scroll",
                  display: !tableText ? "auto" : "none",
                }}
              >
                <Styled.TableBodyWrapper>
                  {searchResults.map((el) => {
                    return (
                      <Styled.Styledtr
                        className="ba-uf-row"
                        key={el.id}
                        style={
                          el.isChecked === true
                            ? {
                                fontWeight: "600",
                                backgroundColor: "rgba(195, 247, 255, 1)",
                              }
                            : {}
                        }
                        onClick={(e) => handleChange(e, el)}
                      >
                        <Styled.Td
                          style={{ minWidth: "39px", maxWidth: "10px" }}
                        >
                          <Styled.StyledRadio
                            disabled={disable.check}
                            color=""
                            size="small" //checked={(e) => handleCheck(e, el)}
                            checked={el.isChecked}
                            value={el.id}
                            onClick={(e) => handleChange(e, el)}
                          />{" "}
                        </Styled.Td>
                        <Styled.Td
                          style={{ minWidth: "230px", maxWidth: "130px" }}
                        >
                          {el.fileName}
                        </Styled.Td>
                        <Styled.Td
                          style={{ minWidth: "259px", maxWidth: "159px" }}
                        >
                          {el.release}
                        </Styled.Td>
                        <Styled.Td
                          style={{ minWidth: "230px", maxWidth: "130px" }}
                        >
                          {el.product}
                        </Styled.Td>
                      </Styled.Styledtr>
                    );
                  })}
                </Styled.TableBodyWrapper>
              </tbody>
            </Styled.RedundantTableBodyWrapper>
          </Styled.Styleddiv>

          <Styled.ActionsWrapper>
            <Link
              underline="none"
              href={AppConfig.root + AppConfig.pages.mfw.path}
            >
              <GenericButton
                id={`${firmware}-upgradeRemoteFirmware-upload-button`}
                style={{ margin: "0em 1em 0em 0em" }}
                backgroundColor="primary"
                width={"17em"}
                buttonName={
                  <>
                    <FileUploadRoundedIcon style={{ color: "whitesmoke" }} />{" "}
                    {t(
                      "page.Endpoint.Configure.upgradeRemoteFirmwareModal.uploadButton",
                    )}
                  </>
                }
                disabled={false}
                onClick={false}
              />
            </Link>

            {hide ? (
              <Box style={{ display: "flex", gap: "10px" }}>
                <GenericButton
                  id={`${firmware}-upgradeRemoteFirmware-cancel-button`}
                  style={{
                    margin: "0em 1em 0em 0em",
                  }}
                  backgroundColor="secondary"
                  buttonName={t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.cancelButton",
                  )}
                  disabled={disable.cancel}
                  onClick={props.cancelHandler}
                />

                {saving ? (
                  <GenericButton
                    style={{
                      margin: "0em em 0em 1em",
                    }}
                    width={"7.8rem"}
                    backgroundColor="primary"
                    buttonName={
                      <>
                        {t(
                          "page.Endpoint.Configure.upgradeRemoteFirmwareModal.applyingButton",
                        )}
                        <Styled.StyledClipLoader
                          size="1.1em"
                          color="#fff"
                          style={{ marginLeft: "5em" }}
                        />
                      </>
                    }
                    disabled={false}
                    onClick={false}
                  />
                ) : (
                  <GenericButton
                    id={`${firmware}-upgradeRemoteFirmware-apply-button`}
                    style={{ margin: "0em 1em 0em 0em" }}
                    backgroundColor="primary"
                    buttonName={t(
                      "page.Endpoint.Configure.upgradeRemoteFirmwareModal.applyButton",
                    )}
                    disabled={disable.apply}
                    onClick={Applying}
                  />
                )}
              </Box>
            ) : (
              <Box></Box>
            )}
          </Styled.ActionsWrapper>

          <AlertPopup
            divider={false}
            open={modalAlert.open}
            contentTitle={modalAlert.contentTitle}
            contentText={modalAlert.contentText}
            agreeTitle={t("commons.okayText")}
            handleAgree={closeModalHandler}
            handleDisagree={closeModalHandler}
          />
        </>
      )}
    </>
  );
};

export default PopUpgradeFirmware;

const Styled = {
  TableWrapper: styled(Box)`
    box-sizing: border-box;
    width: 100%;
    margin-top: 0.3rem;
  `,

  EmptyTextWrapper: styled(Typography)`
    display: ${({ theme }) => theme.display};
    width: 100%;
    height: 100%;
    place-items: center;
  `,

  EmptyText: styled(Typography)``,

  SkeletonWrapper: styled(Box)`
    display: ${({ theme }) => theme.display};
    padding: 0.3em;
    width: 100%;
    height: 100%;
  `,

  ActionsWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.5em 0em;
  `,

  StyledClipLoader: styled(ClipLoader)``,

  Styleddiv: styled.div`
    display: ${({ theme }) => theme.display};
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    border: 0.1em solid rgba(2, 147, 254, 0.3);
    border-radius: 0.5em;
    //margin-top: 0em;
  `,

  TableHeadWrapper: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-shrink: 0;

    overflow-y: scroll;
    overflow-x: scroll;

    overflow-y: overlay;
    overflow-x: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      opacity: 1;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 73, 122, 0);
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track:hover {
      background: rgba(0, 73, 122, 0);
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */

    /*
  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
  `,

  TableHead: styled.thead`
    font-weight: 600;

    background-color: rgba(235, 247, 255, 0);
    background-color: #eff2f7;
    background-color: #fff;
    color: rgba(2, 147, 254, 1);
    & > td {
      border-bottom: 0.1em solid rgba(2, 147, 254, 1);
    }
  `,

  TableBodyWrapper: styled.div`
    & > tr:nth-child(2n) > td {
      background-color: rgba(235, 247, 255, 0.4);
      // border-left: 0.1em solid rgba(2, 147, 254, 0.1);
      // border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
    }

    & > tr:nth-child(2n + 1) > td {
      background-color: rgba(235, 247, 255, 0);
      // border-left: 0.1em solid rgba(2, 147, 254, 0.1);
      // border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
    }
  `,

  RedundantTableBodyWrapper: styled("div")`
    height: 35vh;
    overflow-y: scroll;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.7em;
      height: 0.7em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 73, 122, 0);
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track:hover {
      background: rgba(0, 73, 122, 0);
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */

    /*
  &::-webkit-scrollbar {
    display: none;
  }


  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  */
  `,

  Styledtr: styled.tr`
    &:hover {
      background: #f1fdfc;
    }
  `,

  StyledButton: styled(Button)`
    width: auto;
    margin: 0em 0em;
    padding: 0.5em 1em;
    background-color: rgba(2, 147, 254, 1);
    &:hover {
      background-color: rgba(0, 95, 163, 1);
    }
  `,

  Td: styled.td`
    padding: 0.8em;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    text-align: left;
    word-wrap: break-word;
  `,

  StyledRadio: styled(Radio)`
    color: rgb(0 148 253);
    width: 5px;
    height: 5px;

    & .Mui-checked {
      color: rgb(0 148 253);
      font-size: 0.95rem;
    }

    &:hover {
      color: rgba(0, 148, 253, 0.6);
      background-color: rgba(0, 148, 253, 0.1);
    }
  `,

  CancelBtn: styled(Button)`
    color: #000000;
    border: black 1px solid;
    font-weight: bold;

    background: transparent;
    margin: 0em 0em;
    padding: 0.5em 1.5em;
    &:hover {
      background: #eee;
    }
  `,

  ApplyBtn: styled(Button)`
    color: #ffffff;
    font-weight: bold;

    background: #018ff6;
    margin: 0em 1em;
    padding: 0.5em 1.5em;
    &:hover {
      background: #0d47a1;
    }
    &:disabled {
      color: #fff;
    }
  `,

  StyledBox: styled(Box)`
    display: flex;
    margin: 1.3em 0em;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  `,
};
