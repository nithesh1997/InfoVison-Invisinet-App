import { Box, IconButton, TextField, Typography } from "@material-ui/core";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import React, { useState } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";

const StyledTextField = styled(TextField)`
  width: 100%;

  & .MuiInputLabel-root {
    width: calc(100% - 1.25em);

    font-weight: 400;
    font-size: 1.15em;
    line-height: 1.4em;
    transform: translate(0.9em, 0.9em) scale(1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & .MuiInputLabel-root.MuiInputLabel-shrink {
    width: calc(125% - 1.25em);
    transform: translate(1em, -0.45em) scale(0.75);
  }

  & .MuiInputBase-input {
    padding: 0.75em;
    font-weight: 400;
    font-size: 1em;
    line-height: 1.25em;
  }

  &.sync-edit-active .MuiOutlinedInput-root {
    background-color: #fff8eb;
    /* background-color: #fff1d8; */
  }

  &.sync-edit-active .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(2, 147, 254, 1);
  }

  &.sync-edit-active .MuiInputLabel-root.MuiInputLabel-shrink {
    font-weight: 600;
    color: rgba(2, 147, 254, 1);
  }

  &.sync-edit-active
    .MuiOutlinedInput-root.Mui-error
    .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(220, 20, 60, 0.8);
  }

  &.sync-edit-active .MuiInputLabel-root.MuiInputLabel-shrink.Mui-error {
    font-weight: 600;
    color: crimson;
  }

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(2, 147, 254, 0.6);
  }

  & .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border: 0.1em solid rgba(0, 0, 0, 0.26);
  }

  & .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline {
    border: 0.1em solid rgba(0, 0, 0, 0.26);
  }

  &
    .MuiOutlinedInput-root.Mui-focused.Mui-error
    .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(220, 20, 60, 0.8);
  }

  & .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(220, 20, 60, 0.4);
  }

  & .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(220, 20, 60, 0.6);
  }

  &
    .MuiOutlinedInput-root.Mui-error.Mui-disabled
    .MuiOutlinedInput-notchedOutline {
    border: 0.1em solid rgba(220, 20, 60, 0.2);
  }

  &
    .MuiOutlinedInput-root.Mui-error.Mui-disabled:hover
    .MuiOutlinedInput-notchedOutline {
    border: 0.1em solid rgba(220, 20, 60, 0.2);
  }

  &
    .MuiOutlinedInput-root.Mui-focused.Mui-error:hover
    .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(220, 20, 60, 0.8);
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 0.13em solid rgba(2, 147, 254, 1);
  }

  & .MuiInputLabel-root.MuiInputLabel-shrink.Mui-focused {
    font-weight: 600;
    color: rgba(2, 147, 254, 1);
  }

  & .MuiInputLabel-root.MuiInputLabel-shrink.Mui-focused.Mui-error {
    color: crimson;
  }

  & .MuiInputLabel-root.Mui-error.Mui-disabled {
    color: rgba(237, 20, 61, 0.8);
  }

  & .MuiFormHelperText-root {
    margin: 0.5em 0.5em 0em 0.5em;
    /* font-family: ; */
    font-weight: 400;
    font-size: 1em;
    line-height: 1.25em;
  }

  & .MuiFormHelperText-root.Mui-error {
    font-weight: 500;
    color: crimson;
  }
`;

function ViewFilterTable(props) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const d = {};
  props.newData.forEach((e1) => {
    d[e1.id] = e1.templateName;
  });

  return (
    <>
      <ScrollSync proportional={false} vertical={false}>
        <Styled.TableWrapper>
          <Styled.Table>
            <ScrollSyncPane>
              <Styled.TableHeadWrapper>
                <Styled.TableHead>
                  <Styled.TableRow>
                    <Styled.TableCell
                      style={{
                        width: "11.3%",
                        minWidth: "125px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.templateName",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "8.9%",
                        minWidth: "65px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.ruleNumber",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "11.3%",
                        minWidth: "125px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.description",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "15.8%",
                        minWidth: "175px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.sourceIp",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "13.5%",
                        minWidth: "150px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.sourcePort",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "15.8%",
                        minWidth: "175px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.destinationIp",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "13.5%",
                        minWidth: "150px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.destinationPort",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "8.1%",
                        minWidth: "90px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.protocol",
                      )}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "8.1%",
                        minWidth: "90px",
                      }}
                    >
                      {t("page.Endpoint.Configure.viewFilterRulesModal.action")}
                    </Styled.TableCell>
                    <Styled.TableCell
                      style={{
                        width: "8.1%",
                        minWidth: "90px",
                      }}
                    >
                      {t(
                        "page.Endpoint.Configure.viewFilterRulesModal.trustedUntrusted",
                      )}
                    </Styled.TableCell>
                  </Styled.TableRow>
                </Styled.TableHead>
              </Styled.TableHeadWrapper>
            </ScrollSyncPane>
            <ScrollSyncPane>
              <Styled.TableBodyWrapper
                onMouseOver={() => setTimeout(() => setIsHovered(true), 100)}
                onMouseLeave={() => setTimeout(() => setIsHovered(false), 100)}
                theme={{ isHovered }}
              >
                {props.flag ? (
                  <Box
                    style={{
                      width: "100%",
                      height: "350px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        // fontFamily: "",
                        fontWeight: "400",
                        fontSize: "1em",
                      }}
                    >
                      {props.message}
                    </Typography>
                  </Box>
                ) : (
                  <Styled.TableBody>
                    {props.loadData.map((e) => {
                      return (
                        <Styled.TableRow key={e.id}>
                          <Styled.TableCell
                            style={{
                              width: "11.3%",
                              minWidth: "125px",
                            }}
                          >
                            {d[e.templateId]}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "5.9%",
                              minWidth: "65px",
                            }}
                          >
                            {e.rulenum}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "11.3%",
                              minWidth: "125px",
                            }}
                          >
                            {e.desc}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "15.8%",
                              minWidth: "175px",
                            }}
                          >
                            {e.sip}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "13.5%",
                              minWidth: "150px",
                            }}
                          >
                            {e.sport}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "15.8%",
                              minWidth: "175px",
                            }}
                          >
                            {e.dip}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "13.5%",
                              minWidth: "150px",
                            }}
                          >
                            {e.dport}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "8.1%",
                              minWidth: "90px",
                            }}
                          >
                            {e.protocol}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "8.1%",
                              minWidth: "90px",
                            }}
                          >
                            {e.action}
                          </Styled.TableCell>
                          <Styled.TableCell
                            style={{
                              width: "8.1%",
                              minWidth: "90px",
                            }}
                          >
                            {e.ruletype}
                          </Styled.TableCell>
                        </Styled.TableRow>
                      );
                    })}
                  </Styled.TableBody>
                )}
              </Styled.TableBodyWrapper>
            </ScrollSyncPane>
          </Styled.Table>
        </Styled.TableWrapper>
      </ScrollSync>
    </>
  );
}
export default ViewFilterTable;

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
  LinkRoundedIcon: styled(LinkRoundedIcon)`
    &.MuiSvgIcon-root {
      width: 0.5em;
      height: 0.5em;
      color: rgba(255, 255, 255, 1);
    }
  `,
  LinkOffRoundedIcon: styled(LinkOffRoundedIcon)`
    &.MuiSvgIcon-root {
      width: 0.5em;
      height: 0.5em;
      color: rgba(51, 51, 51, 1);
    }
  `,
  TableWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    flex-grow: 1;
    margin: 0em 0em 0em 1em;
  `,
  Table: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* font-family: ; */
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

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  `,
  TableBodyWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    height: 100%;
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
      width: 0.5em;
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
    flex-grow: 1;
    position: relative;
  `,
  TableRow: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    & > td {
      flex-shrink: 0;
    }

    & > td:last-child {
      flex-grow: 1;
    }
  `,
  TableCell: styled.div`
    border-bottom: 1px solid #eee;
    padding: 1em;
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
