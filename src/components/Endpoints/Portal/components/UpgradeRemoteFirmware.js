import { Box, Typography } from "@material-ui/core";
import { CloseSharp, SyncDisabledRounded } from "@material-ui/icons";
import AppBlockingRoundedIcon from "@mui/icons-material/AppBlockingRounded";
import BrowserNotSupportedOutlinedIcon from "@mui/icons-material/BrowserNotSupportedOutlined";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styled from "styled-components";
import callAPI from "../../../../apis/callAPI";
import { GetTaskStatusResponder } from "../../../../apis/responders/GetTaskStatusResponder";
import Utility from "../../../../redux/actions/Utility";
import { CloseButton } from "../../../IFVDataGrid/styled-materials/CloseButton";
import { Popup } from "../../../IFVDataGrid/styled-materials/Popup";
import { PopupHeader } from "../../../IFVDataGrid/styled-materials/PopupHeader";
import { StyledMat } from "../ClearFilterRuleAction/StyledMat";
import PreProcessValidation from "../PreProcessValidation/PreProcessValidation";
import AlertPopup from "./AlertPopup";
import PopUpgradeFirmware from "./PopUpgradeFirmware";
import { endpoint } from "../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";
import loadingText from "../../../../images/right.svg";
const Styled = {
  TacAlertWrapper: styled(Box)`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  `,
  TacAlertText: styled(Typography)`
    /* font-family: ""; */
    font-weight: 500;
    color: #dc143c;
  `,
};

const TableCloseButton = styled(CloseButton)`
  margin: 3.5rem 0 0 0;
  margin-top: 2em;
  margin-right: 3%;
`;

const PopupWrapper = styled(Popup)`
  width: ${({ isSpinner }) => (isSpinner ? "500px" : "95vw")};
  // height: 585px;
  height: ${({ isSpinner }) => (isSpinner ? "300px" : "70vh")};
  margin-top: 0em;
  display: ${({ isSpinner }) => (isSpinner ? "grid" : "auto")};
  place-items: ${({ isSpinner }) => (isSpinner ? "center" : "auto")};
`;

const CustomPopupContent = styled(Box)`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0.5em auto;
  display: flex;
  padding: 0rem 1rem 0rem 1rem;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  /*
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  */
`;

const PopupTitle = styled(Typography)`
  & {
    /* font-family: "", sans-serif; */
  }
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 700;
  line-height: 1.5;
  color: rgba(2, 147, 254, 1);
`;

const PopupVersion = styled(Typography)`
  & {
    /* font-family: "", sans-serif; */
  }
  font-size: 0.8rem;
  margin-top: 0;
  margin-left: 0.5em;
  margin-bottom: 0;
  font-weight: 600;
  line-height: 1.5;
`;

const VersionBox = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-left: 2%;
  margin-top: 1%;
  align-items: space-evenly;
  gap: 0.4rem;
  width: 96%;
  padding: 0.5em;
  background-color: #ebf7ff;
  border-left: 0.2em solid #0094fd;
  border-radius: 0.25em;
`;

const payloadAction = { isLoading: true, payload: [], error: "" };
const initEpcCheck = { state: "init", message: "" };

const initModalAlert = {
  open: false,
  contentTitle: "",
  contentText: "",
  onClose: () => {},
  onCloseArgs: [],
};

export const UpgradeRemoteFirmware = forwardRef(
  (
    {
      portalState,
      setPortalState,
      upgradeRemoteFirmware,
      setUpgradeRemoteFirmware,
      AppOverlayContext,
    },
    ref,
  ) => {
    const isBulkAction = upgradeRemoteFirmware.isBulkAction;
    const gatewayIP = AppOverlayContext.selectedGateway.address;

    const [isAsyncDone, setIsAsyncDone] = useState(false);
    const [payloadState, setPayloadState] = useState(payloadAction);
    const [isBlocker, setIsBlocker] = useState(true);

    const [epCheckState, setEPCheckState] = useState(initEpcCheck);
    const [notEligibles, setNotEligibles] = useState([]);
    const [eligibles, setEligibles] = useState([]);
    const [eligibleRows, setEligibleRows] = useState([]);
    const [inEligibleRows, setInEligibleRows] = useState([]);
    const [logsLoading, setLogsLoading] = useState("loading");
    const [modalAlert, setModalAlert] = useState(initModalAlert);
    const [inEligibleIndics, setinEligibleIndics] = useState({});
    const [loadingRemote, setLoadingRemote] = useState("fetching");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();

    const closeModalHandler = () => {
      modalAlert.onClose(...modalAlert.onCloseArgs);
      setModalAlert(initModalAlert);
    };

    const onCompleteGetTaskStatus = (response, endpoints) => {
      setLogsLoading("");
      setLoadingRemote("validating");
      if (response.state === "GET_TASK_STATUS_SUCCESS") {
        setTimeout(() => {
          setLoadingRemote("");
        }, 500);
        let data = response.data;
        let inEligibleCount = 0;
        let totalEPs = Object.keys(endpoints).length;

        setNotEligibles(() => {
          return upgradeRemoteFirmware.selectedRows
            .map(({ endpoint_ID }) => endpoint_ID)
            .filter((id) => {
              return !!data.map(({ endpointId }) => endpointId).includes(id);
            });
        });

        /*         setInEligibleRows(() => {
          const check1 = upgradeRemoteFirmware.selectedRows
            .map(({ id, name, endpoint_ID, epcclient_ID, enabled, roles }) => ({
              id,
              name,
              endpoint_ID,
              epcclient_ID,
              enabled,
              roles,
            }))
            .filter(({ id }) => {
              return !!data.map(({ endpointId }) => endpointId).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [{ icon: <AutorenewRounded />, tooltip: "In-Progress" }],
            }));

          const check2 = upgradeRemoteFirmware.selectedRows
            .map(({ id, name, endpoint_ID, epcclient_ID, enabled, roles }) => ({
              id,
              name,
              endpoint_ID,
              epcclient_ID,
              enabled,
              roles,
            }))
            .filter(({ enabled }) => enabled === "False")
            .filter(({ id }) => {
              return !!!check1.map(({ id }) => id).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [{ icon: <SyncDisabledRounded />, tooltip: "Disabled" }],
            }));

          const check3 = upgradeRemoteFirmware.selectedRows
            .map(({ id, name, endpoint_ID, epcclient_ID, enabled, roles }) => ({
              id,
              name,
              endpoint_ID,
              epcclient_ID,
              enabled,
              roles,
            }))
            .filter(({ roles }) => roles !== "TAC-ID")
            .filter(({ id }) => {
              return !!!check1.map(({ id }) => id).includes(id);
            })
            .filter(({ id }) => {
              return !!!check2.map(({ id }) => id).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [
                {
                  icon: <AppBlockingRoundedIcon />,
                  tooltip: "This endpoint is not a TAC-ID.",
                },
              ],
            }));

          setIsBlocker(!![...check1, ...check2, ...check3].length);

          return [...check1, ...check2, ...check3];
        }); */

        setInEligibleRows(() => {
          const firstCheck = upgradeRemoteFirmware.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!data.map(({ endpointId }) => endpointId).includes(id);
            })
            .map((row) => ({
              ...row,
              icons: [
                {
                  icon: <HourglassBottomRoundedIcon />,
                  tooltip: t(
                    "page.Endpoint.Configure.bulkTable.progressTooltip",
                  ),
                },
              ],
            }));

          const firstUncheck = upgradeRemoteFirmware.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ id }) => {
              return !!!data.map(({ endpointId }) => endpointId).includes(id);
            });

          const secondCheck = [...firstCheck, ...firstUncheck]
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(
              ({ roles }) => roles !== "TAC-ID" || roles === "Remote Keying",
            )
            // .filter(({ id }) => {
            //   return !!!firstCheck.map(({ id }) => id).includes(id);
            // })
            // .filter(({ id }) => {
            //   return !!!lastCheck.map(({ id }) => id).includes(id);
            // })
            .map((row) => ({
              ...row,
              icons: [
                ...row.icons,
                {
                  icon: <AppBlockingRoundedIcon />,
                  tooltip: t("page.Endpoint.Configure.bulkTable.noTac"),
                },
              ],
            }));

          const secondUncheck = [...firstCheck, ...firstUncheck]
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(({ roles }) => roles === "TAC-ID");

          const lastCheck = [...secondCheck, ...secondUncheck]
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons = [],
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                icons,
              }),
            )
            .filter(
              ({ enabled, roles }) =>
                enabled === "False" || roles === "Remote Keying",
            )
            //   .filter(({ id }) => !!!firstCheck.map(({ id }) => id).includes(id))
            .map((row) => {
              const icons = [
                ...row.icons,
                {
                  icon: <SyncDisabledRounded />,
                  tooltip: t(
                    "page.Endpoint.Configure.bulkTable.epcDisableTooltip",
                  ),
                },
              ];

              if (row.roles === "Remote Keying") {
                icons.push({
                  icon: <BrowserNotSupportedOutlinedIcon />,
                  tooltip: t("page.Endpoint.Configure.bulkTable.remoteTooltip"),
                });
              }

              return {
                ...row,
                icons,
              };
            });

          const newState = [
            ...firstCheck.filter(
              (_1) => !!!secondCheck.filter((_2) => _1.id === _2.id).length,
            ),
            ...secondCheck.filter(
              (_1) => !!!lastCheck.filter((_2) => _1.id === _2.id).length,
            ),
            ...lastCheck,
          ];

          setIsBlocker(!![...firstCheck, ...secondCheck, ...lastCheck].length);

          return newState;
        });

        setEligibles(() => {
          return upgradeRemoteFirmware.selectedRows
            .map(({ endpoint_ID }) => endpoint_ID)
            .filter((id) => {
              return !!!data.map(({ endpointId }) => endpointId).includes(id);
            });
        });

        setEligibleRows(() => {
          const newState = upgradeRemoteFirmware.selectedRows
            .map(
              ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                fwversion,
              }) => ({
                id,
                name,
                endpoint_ID,
                epcclient_ID,
                enabled,
                roles,
                fwversion,
              }),
            )
            .filter(({ id }) => {
              return !!!data.map(({ endpointId }) => endpointId).includes(id);
            })
            .filter(({ enabled }) => enabled === "True")
            .filter(({ roles }) => roles === "TAC-ID");

          return newState;
        });

        data.forEach((task) => {
          if (endpoints[task.endpointId]) {
            inEligibleCount += 1;
            endpoints[task.endpointId].taskStatus = task.status;
          }
        });

        if (inEligibleCount === 0) {
          setEPCheckState({
            state: "check-complete-all-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        } else if (inEligibleCount < totalEPs) {
          setEPCheckState({
            state: "check-complete-partially-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        } else {
          setEPCheckState({
            state: "check-complete-not-eligible",
            eligibileCount: totalEPs - inEligibleCount,
            inEligibleCount,
            endpoints,
          });
        }
      } else {
        setEPCheckState({
          state: "check-error",
          message: (
            <>
              {/* Error upgrading remote firmware. Please try again.
              <br />
              <br />
              Details:
              <br /> */}
              <Trans
                i18nKey={
                  "page.Endpoint.Configure.upgradeRemoteFirmwareModal.errorUpgrade"
                }
                components={[<br />]}
              >
                Error upgrading remote firmware. Please try again.
                <br />
                <br />
                Details:
                <br />
              </Trans>
              {Utility.getErrorsFromResponse(response)}
            </>
          ),
        });
      }
    };

    useEffect(() => {
      if (!isBulkAction && !!!logsLoading) {
        setErrorMessage(() => {
          return inEligibleRows.length ? (
            <p>
              {/* The selected endpoint already has a Upgrade remote firmware task. */}
              {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.bulk1")}
              <br />
              <br />
              {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.bulk2")}
            </p>
          ) : !!!eligibleRows.length ? (
            <p>
              {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.bulk3", {
                epCheckState: epCheckState.inEligibleCount,
              })}
              <br />
              <br />
              {/* Please wait for it to complete before trying to upgrade the remote firmware for this endpoint again. */}
              {t("page.Endpoint.Configure.upgradeRemoteFirmwareModal.bulk4")}
            </p>
          ) : null;
        });
      }
    }, [
      eligibleRows.length,
      epCheckState.inEligibleCount,
      inEligibleRows.length,
      isBulkAction,
      logsLoading,
    ]);

    const closePopup = useCallback(() => {
      setPortalState({ type: "", isPortal: false });
      setUpgradeRemoteFirmware({
        tableRows: undefined,
        selectedRows: [],
        setTaskStatus: () => {},
      });
    }, []);

    const cancelHandler = useCallback(() => {
      if (upgradeRemoteFirmware.tableRows === undefined) {
        upgradeRemoteFirmware.setTaskStatus({
          inProgress: false,
          error: false,
          message: ``,
        });
        if (isBulkAction === false) {
          upgradeRemoteFirmware.setDontClosePopup(true);
        }
      } else {
        const payload = upgradeRemoteFirmware.tableRows.map((row) => ({
          ...row,
          isChecked: false,
        }));

        upgradeRemoteFirmware.setTaskStatus({
          loading: false,
          payload,
          error: false,
          message: "",
        });

        if (isBulkAction === false) {
          upgradeRemoteFirmware.setDontClosePopup(true);
        }
      }

      closePopup();
    }, [closePopup, upgradeRemoteFirmware]);

    const HandleOpenTable = () => setIsBlocker(false);

    const HandleCloseTable = () => {
      setIsBlocker(false);
      cancelHandler();
    };

    useImperativeHandle(ref, () => ({
      closePortal: () => {
        cancelHandler();
      },
    }));

    useEffect(() => {
      isAsyncDone === true && closePopup();
    }, [closePopup, isAsyncDone]);

    useEffect(() => {
      setPortalState((oldState) => ({
        ...oldState,
        isProgressPending: payloadState.isLoading,
      }));
    }, [payloadState.isLoading, setPortalState]);

    useEffect(() => {
      const $ = "something";

      if (typeof $ === "string") {
        setPayloadState({
          isLoading: false,
          payload: [],
          error: "",
        });
      } else {
        setPayloadState({
          isLoading: false,
          payload: [],
          error: "Something Went Wrong!",
        });
      }

      // Generate list of endpoints
      let endpoints = {};
      upgradeRemoteFirmware.selectedRows.forEach((ep) => {
        endpoints[ep.endpoint_ID] = {
          id: ep.id,
          endpoint_ID: ep.endpoint_ID,
          name: ep.name,
          epcclient_ID: ep.epcclient_ID,
          taskStatus: "Not Running",
        };
      });

      // Fetch active tasks
      callAPI({
        path: "get-task-status",
        params: { gatewayIP, taskId: 7 },
        data: {},
        responder: GetTaskStatusResponder,
        onComplete: onCompleteGetTaskStatus,
        onCompleteArguments: [endpoints],
      });
    }, []);

    return (
      <>
        {isBlocker && upgradeRemoteFirmware.selectedRows.length >= 2 ? (
          // <StyledPortal.Wrapper>
          <StyledMat.Wrapper isSpinner={loadingRemote}>
            {loadingRemote === "fetching" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.loading",
                  )}
                </Typography>
              </>
            ) : loadingRemote === "validating" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                  {/* Validating Endpoints... */}
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.validating",
                  )}
                </Typography>
              </>
            ) : (
              <PreProcessValidation
                disabled={!!!eligibleRows.length}
                title={t(
                  "page.Endpoint.Configure.upgradeRemoteFirmwareModal.title",
                )}
                onClose={cancelHandler}
                loading={logsLoading}
                qualifiedRecords={eligibleRows}
                unQualifiedRecords={inEligibleRows}
                isUpgradeRemoteFirmware
                footerActions={{
                  onAbort: HandleCloseTable,
                  onConfirm: HandleOpenTable,
                }}
              />
            )}
            {/* </StyledPortal.Wrapper> */}
          </StyledMat.Wrapper>
        ) : (
          <PopupWrapper
            id={`${endpoint}-upgradeRemoteFirmware-modal`}
            isSpinner={loadingRemote || errorMessage}
          >
            {loadingRemote === "fetching" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.loading",
                  )}
                </Typography>
              </>
            ) : loadingRemote === "validating" ? (
              <>
                <StyledMat.LoadingText src={loadingText} />
                <Typography style={{ /* fontFamily: "", */ fontWeight: 500 }}>
                  {t(
                    "page.Endpoint.Configure.upgradeRemoteFirmwareModal.validating",
                  )}
                </Typography>
              </>
            ) : (
              <>
                {" "}
                {errorMessage ? (
                  <CloseButton onClick={cancelHandler}>
                    <CloseSharp fontSize="medium" />
                  </CloseButton>
                ) : (
                  <PopupHeader>
                    <PopupTitle>
                      {" "}
                      {t(
                        "page.Endpoint.Configure.upgradeRemoteFirmwareModal.title",
                      )}{" "}
                    </PopupTitle>
                    <CloseButton
                      id={`${endpoint}-upgradeRemoteFirmware-modal-close-button`}
                      onClick={cancelHandler}
                    >
                      <CloseSharp fontSize="medium" />
                    </CloseButton>
                  </PopupHeader>
                )}
                {!(
                  !upgradeRemoteFirmware.isBulkAction &&
                  upgradeRemoteFirmware?.selectedRows[0].roles !== "TAC-ID"
                ) &&
                !errorMessage &&
                upgradeRemoteFirmware.selectedRows.length <= 1 ? (
                  <VersionBox style={{ display: loading ? "none" : "flex" }}>
                    <PopupVersion>
                      <b>
                        {" "}
                        {t(
                          "page.Endpoint.Configure.upgradeRemoteFirmwareModal.currentVersion",
                        )}{" "}
                      </b>{" "}
                      {upgradeRemoteFirmware.selectedRows[0].fwversion}
                    </PopupVersion>
                  </VersionBox>
                ) : null}
                <CustomPopupContent>
                  {!upgradeRemoteFirmware.isBulkAction &&
                  (upgradeRemoteFirmware?.selectedRows[0].roles !== "TAC-ID" ??
                    false) ? (
                    <Styled.TacAlertWrapper>
                      <Styled.TacAlertText>
                        <Trans
                          i18nKey={
                            "page.Endpoint.Configure.upgradeRemoteFirmwareModal.tacMessage"
                          }
                          components={[<b />]}
                        >
                          Remote Firmware upgrade is restricted to role with
                          <b>`TAC-ID`</b> only!
                        </Trans>
                      </Styled.TacAlertText>
                    </Styled.TacAlertWrapper>
                  ) : errorMessage ? (
                    <Styled.TacAlertWrapper style={{ textAlign: "center" }}>
                      <Styled.TacAlertText>{errorMessage}</Styled.TacAlertText>
                    </Styled.TacAlertWrapper>
                  ) : (
                    <PopUpgradeFirmware
                      closePopup={closePopup}
                      cancelHandler={cancelHandler}
                      UpgradeRemoteFirmware={upgradeRemoteFirmware}
                      eligibleRows={eligibleRows}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  )}
                </CustomPopupContent>
              </>
            )}
            <AlertPopup
              divider={false}
              open={modalAlert.open}
              contentTitle={modalAlert.contentTitle}
              contentText={modalAlert.contentText}
              agreeTitle={t("commons.okayText")}
              handleAgree={closeModalHandler}
              handleDisagree={closeModalHandler}
            />
          </PopupWrapper>
        )}
      </>
    );
  },
);
