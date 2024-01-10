import { Tooltip } from "@mui/material";
import { Box, IconButton, Radio } from "@material-ui/core";
import React from "react";
import { Trash } from "react-bootstrap-icons";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import ServiceToggle from "./ServiceToggle";
import { useTranslation } from "react-i18next";
import * as common from "../../common";

const StyledRadio = styled(Radio)`
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
    color: ${(props) => props.color};
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

export const GatewayList = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <ScrollSync proportional={false} vertical={false}>
      <Styled.TableWrapper>
        <Styled.Table>
          <ScrollSyncPane>
            <Styled.TableHeadWrapper>
              <Styled.TableHead>
                <Styled.TableRow>
                  <Styled.TableCell style={{ width: "5em", minWidth: "5em" }} />

                  <Styled.TableCell style={{ minWidth: "200px" }}>
                    {t("commons.gateway.manage.table.columns.console", {
                      GATEWAY: common.GATEWAY,
                      TAC_SERVER: common.TAC_SERVER,
                    })}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "250px" }}>
                    {t("commons.gateway.manage.table.columns.address")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "250px" }}>
                    {t("commons.gateway.manage.table.columns.certExpireOn")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "75px" }}>
                    {t("commons.gateway.manage.table.columns.offline")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "100px" }}>
                    {t("commons.gateway.manage.table.columns.type")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "75px" }}>
                    {t("commons.gateway.manage.table.columns.UDP")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ minWidth: "300px" }}>
                    {t("commons.gateway.manage.table.columns.tokenDatagram")}
                  </Styled.TableCell>

                  <Styled.TableCell style={{ width: "5em", minWidth: "5em" }} />
                </Styled.TableRow>
              </Styled.TableHead>
            </Styled.TableHeadWrapper>
          </ScrollSyncPane>

          <ScrollSyncPane>
            <Styled.TableBodyWrapper
              onMouseOver={() =>
                setTimeout(() => props.setIsHovered(true), 100)
              }
              onMouseLeave={() =>
                setTimeout(() => props.setIsHovered(false), 100)
              }
              theme={{ isHovered: props.isHovered }}
            >
              <Styled.TableBody>
                {props.loading === true ? (
                  <div
                    style={{
                      padding: "2em 1em",
                      margin: "0 auto",
                      width: "60%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {t("commons.gateway.manage.table.prompt.loadingText")}...
                  </div>
                ) : props.loading === false ? (
                  props.searchResults.length > 0 ? (
                    props.searchResults.map((el) => {
                      return (
                        <Styled.TableRow
                          key={el.id}
                          className={
                            "ba-gw-row" +
                            (el.offline
                              ? " offline"
                              : typeof props.AppOverlayContext.selectedGateway
                                  .address === "string"
                              ? props.AppOverlayContext.selectedGateway
                                  .address === el.address
                                ? " selected"
                                : ""
                              : "") +
                            (props.selectedGateway.address === el.address
                              ? " checked"
                              : "")
                          }
                          style={
                            typeof props.AppOverlayContext.selectedGateway
                              .address === "string"
                              ? props.AppOverlayContext.selectedGateway
                                  .address === el.address
                                ? { backgroundColor: "#BFF2F7" }
                                : {}
                              : {}
                          }
                          theme={{ isBem: props.isBem }}
                          onClick={(e) => {
                            !el.offline && props.handleSelect(e, el);
                          }}
                        >
                          <Styled.TableCell
                            style={{ width: "5em", minWidth: "5em" }}
                          >
                            <div>
                              <StyledRadio
                                color="primary"
                                size="small"
                                disabled={el.offline}
                                checked={
                                  props.selectedGateway.address === el.address
                                    ? props.selectedGateway.checked
                                    : props.isChecked
                                }
                                onClick={(e) => props.handleSelect(e, el)}
                              />
                            </div>
                          </Styled.TableCell>

                          <Styled.TableCell style={{ minWidth: "200px" }}>
                            {el.name}
                          </Styled.TableCell>

                          <Styled.TableCell style={{ minWidth: "250px" }}>
                            {el.address}
                          </Styled.TableCell>

                          <Styled.TableCell style={{ minWidth: "250px" }}>
                            {el.gwcertexpiryUTC}
                          </Styled.TableCell>

                          <Styled.TableCell style={{ minWidth: "75px" }}>
                            {el.offline ? "True" : "False"}
                          </Styled.TableCell>

                          <Styled.TableCell style={{ minWidth: "100px" }}>
                            {el.model === "Model 5010"
                              ? `${t("commons.serverText")}`
                              : `${t("commons.gatewayText", {
                                  GATEWAY: common.GATEWAY,
                                })}`}
                          </Styled.TableCell>

                          <Styled.TableCell
                            style={{
                              // width: "15%",
                              minWidth: "75px",
                            }}
                          >
                            <ServiceToggle
                              isOffline={el.offline}
                              gatewayAddress={el.address}
                              toggleName={"udp"}
                              toggleStatus={el.tac_for_udp ?? false}
                              isDisabled={false}
                            />
                          </Styled.TableCell>

                          <Styled.TableCell
                            style={{
                              // width: "15%",
                              minWidth: "200px",
                            }}
                          >
                            <ServiceToggle
                              isOffline={el.offline}
                              gatewayAddress={el.address}
                              toggleName={"data-gram"}
                              toggleStatus={el.terminal_tac_entity ?? false}
                              isDisabled={el.model === "Model 5010" ?? false}
                            />
                          </Styled.TableCell>

                          <Styled.TableCell
                            style={{
                              width: "5em",
                              minWidth: "5em",
                            }}
                          >
                            {window.gatewaysThatAreBeingDeleted.indexOf(
                              el.address,
                            ) > -1 ? (
                              <StyledClipLoaderContainer>
                                <ClipLoader size="3vh" />
                              </StyledClipLoaderContainer>
                            ) : (
                              <Tooltip
                                arrow={true}
                                title={t(
                                  "commons.gateway.manage.table.action.delete.tooltip",
                                )}
                              >
                                <StyledIconButton
                                  className="ba-gw-delete-button"
                                  color={"#333"}
                                  hoverBg={"rgba( 220, 20, 60, 0.1 )"}
                                  disabled={props.hostAddress === el.address}
                                  theme={{
                                    disabled: props.hostAddress === el.address,
                                  }}
                                  onClick={(e) => {
                                    props.setAlertDialog({
                                      open: true,
                                      contentTitle: t(
                                        "commons.gateway.manage.table.prompt.confirmDelete.title",
                                      ),
                                      contentText: (
                                        <p>
                                          {t(
                                            "commons.gateway.manage.table.prompt.confirmDelete.text",
                                            {
                                              GATEWAY: common.GATEWAY,
                                              TAC_SERVER: common.TAC_SERVER,
                                            },
                                          )}
                                          ?
                                        </p>
                                      ),
                                    });
                                    props.deletePopup(
                                      props.deleteGateway,
                                      e,
                                      el,
                                    );
                                  }}
                                >
                                  <StyledTrash
                                    color={
                                      props.hostAddress === el.address
                                        ? "#4A4A4A"
                                        : "rgba( 220, 20, 60, 1 )"
                                    }
                                  />
                                </StyledIconButton>
                              </Tooltip>
                            )}
                          </Styled.TableCell>
                        </Styled.TableRow>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        padding: "2em 1em",
                        margin: "0 auto",
                        width: "60%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {t(
                        "commons.gateway.manage.select.warning.noGatewaySelected",
                      )}
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      padding: "2em 1em",
                      margin: "0 auto",
                      width: "60%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "crimson",
                    }}
                  >
                    {props.loading}
                  </div>
                )}
              </Styled.TableBody>
            </Styled.TableBodyWrapper>
          </ScrollSyncPane>
        </Styled.Table>
      </Styled.TableWrapper>
    </ScrollSync>
  );
};

const Styled = {
  LinkIcon: styled(IconButton)`
    position: absolute;
    top: 0.2em;
    right: 0.1em;
    z-index: 1;
    padding: 0.15em;
    background-color: white;
    border: 0.05em solid rgba(2, 147, 254, 1);

    &.linked {
      border: 0.05em solid rgba(2, 147, 254, 1);
      background-color: rgba(2, 147, 254, 1);
    }

    &:hover {
      background-color: #d6eeff;
    }

    &.linked:hover {
      border: 0.05em solid #0d47a1;
      background-color: #0d47a1;
    }
  `,

  TableWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    flex-grow: 1;
    margin: 0.75em;
  `,
  Table: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    width: auto;
    height: 38vh;
    /* font-family: Montserrat; */
    box-sizing: border-box;
    border: 0.1em solid rgba(2, 147, 254, 0.3);
    border-radius: 0.5em;
    overflow: hidden;
  `,
  TableHeadWrapper: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-shrink: 0;
    overflow-y: scroll;
    overflow-y: overlay;
    overflow-x: overlay;
    pointer-events: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  `,
  TableBodyWrapper: styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    overflow-x: scroll;
    overflow-y: scroll;

    overflow-x: overlay;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.35em;
      height: 0.5em;
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

    & > tr:nth-child(2n) > td {
      background-color: rgba(235, 247, 255, 0.4);
      border-left: 0.1em solid rgba(2, 147, 254, 0.1);
      border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
    }

    & > tr:nth-child(2n + 1) > td {
      background-color: rgba(235, 247, 255, 0);
      border-left: 0.1em solid rgba(2, 147, 254, 0.1);
      border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
    }
  `,
  TableHead: styled.div`
    width: 100%;
    font-weight: 600;

    background-color: rgba(235, 247, 255, 0);
    background-color: #eff2f7;
    background-color: #fff;
    color: rgba(2, 147, 254, 1);
    & > div > div {
      border-left: 0.1em solid rgba(2, 147, 254, 0.1);
      border-bottom: 0.1em solid rgba(2, 147, 254, 1);
    }
  `,
  TableBody: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
  `,
  TableRow: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    width: fit-content;
    cursor: pointer;

    & > td {
      flex-shrink: 0;
    }

    & > td:last-child {
      flex-grow: 1;
    }

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

    &.checked {
      /* pointer-events: ${({ theme }) => (theme.isBem ? "auto" : "none")}; */
      background-color: #dff2f7;
    }

    &.selected {
      background-color: #bff2f7;
    }

    &.offline {
      pointer-events: auto;
      cursor: auto;
      background-color: #f1f1f1;
    }

    &.offline > *:nth-child(2),
    &.offline > *:nth-child(3),
    &.offline > *:nth-child(4) {
      color: rgba(51, 51, 51, 0.8);
    }
  `,
  TableCell: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0.75em 1em;
    font-size: 12px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    position: relative;
  `,
  TableCellRow: styled.div`
    border-bottom: 1px solid #eee;
    padding: 0.8em;
    font-size: 12px;
  `,
};
