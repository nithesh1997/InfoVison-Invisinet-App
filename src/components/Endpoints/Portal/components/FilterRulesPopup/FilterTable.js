import React, { useEffect, useState } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import Styled from "./MaterialComponents/FilterTable.style";
import { Trans, useTranslation } from "react-i18next";

function FilterTable(props) {
  const [isHovered, setIsHovered] = useState(false);

  const { t } = useTranslation();

  const handleEdit = (event, label) => {
    let etype = event.type;
    let value = event.target.value;
    let id = event.target.id.split("-");
    let tid = parseInt(id[3]);
    let rnum = parseInt(id[4]);
    let itype = id[5];
    let ilabel = event.target.getAttribute("data-ba-label");
    let rnumstr = rnum.toString();
    let error = props.editState[tid][itype][ilabel][rnum].error;
    let helperText = props.editState[tid][itype][ilabel][rnum].helperText;

    if (etype === "focus") {
      error = false;
      helperText = "";
    }

    if (etype === "blur") {
      ({ value, error, helperText } = props.validate(itype, {
        value,
        error,
        helperText,
        $: { tid, itype, ilabel, rnum, relativeLabel: label },
      }));
    }

    props.setEditState((oldState) => {
      let newState = { ...oldState };

      if (newState[tid][itype][ilabel].linked === true) {
        if (etype === "focus") {
          newState[tid][itype][ilabel].focussed = true;
        }

        if (etype === "blur") {
          newState[tid][itype][ilabel].focussed = false;
        }

        Object.keys(newState[tid][itype][ilabel]).forEach((rulenum) => {
          if (rulenum === "linked" || rulenum === "focussed") {
            return;
          }

          if (rulenum !== rnumstr && value === "" && etype !== "blur") {
            newState[tid][itype][ilabel][rulenum] = {
              value: " ",
              error,
              helperText,
            };
          } else {
            newState[tid][itype][ilabel][rulenum] = {
              value,
              error,
              helperText,
            };
          }
        });
      } else {
        newState[tid][itype][ilabel][rnum] = {
          value,
          error,
          helperText,
        };
      }

      return newState;
    });
  };

  const handleLinkIconClick = (event) => {
    let tgt = event.target;

    while (true) {
      if (tgt.tagName.toLowerCase() === "button") {
        break;
      }

      tgt = tgt.parentNode;
    }

    let id = tgt.id.split("-");
    let tid = parseInt(id[3]);
    let rnum = parseInt(id[4]);
    let itype = id[5];
    let linked = id[6];
    let ilabel = tgt.getAttribute("data-ba-label");
    let value = props.editState[tid][itype][ilabel][rnum].value;
    let error = props.editState[tid][itype][ilabel][rnum].error;
    let helperText = props.editState[tid][itype][ilabel][rnum].helperText;

    props.setEditState((oldState) => {
      let newState = { ...oldState };
      if (linked === "linked") {
        newState[tid][itype][ilabel].linked = false;
      } else {
        newState[tid][itype][ilabel].linked = true;
        Object.keys(newState[tid][itype][ilabel]).forEach((rulenum) => {
          if (rulenum === "linked" || rulenum === "focussed") {
            return;
          }

          newState[tid][itype][ilabel][rulenum] = {
            value,
            error,
            helperText,
          };
        });
      }
      return newState;
    });
  };

  return (
    <ScrollSync proportional={false} vertical={false}>
      <Styled.TableWrapper>
        <Styled.Table>
          <ScrollSyncPane>
            <Styled.TableHeadWrapper>
              <Styled.TableHead>
                <Styled.TableRow>
                  <Styled.TableCell
                    style={{
                      width: "5.9%",
                      minWidth: "65px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.ruleNumber",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "11.3%",
                      minWidth: "125px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.description",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "15.8%",
                      minWidth: "175px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.sourceIp",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "11.5%",
                      minWidth: "130px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.sourcePort",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "15.8%",
                      minWidth: "175px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.destinationIp",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "11.5%",
                      minWidth: "130px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.destinationPort",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "8.1%",
                      minWidth: "90px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.protocol",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "8.1%",
                      minWidth: "90px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.action",
                    )}
                  </Styled.TableCell>
                  <Styled.TableCell
                    style={{
                      width: "11.99%",
                      minWidth: "90px",
                    }}
                  >
                    {t(
                      "page.Endpoint.Configure.configureFilterRulesModal.trustedUntrusted",
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
              <Styled.TableBody>
                {props.loadData.map((e) => {
                  let sip =
                    props.editState[e.templateId].sip[e.sipLabel][e.rulenum];
                  let dip =
                    props.editState[e.templateId].dip[e.dipLabel][e.rulenum];
                  let sport =
                    props.editState[e.templateId].sport[e.sportLabel][
                      e.rulenum
                    ];
                  let dport =
                    props.editState[e.templateId].dport[e.dportLabel][
                      e.rulenum
                    ];

                  const key = `${e.rulenum}_${e.ruletype}`;

                  return (
                    <Styled.TableRow key={key}>
                      {/* Rule Number */}
                      <Styled.TableCell
                        style={{
                          width: "5.9%",
                          minWidth: "65px",
                        }}
                      >
                        {e.rulenum}
                      </Styled.TableCell>

                      {/* Description */}
                      <Styled.TableCell
                        style={{
                          width: "11.3%",
                          minWidth: "125px",
                        }}
                      >
                        {e.desc}
                      </Styled.TableCell>

                      {/* Source IP Address */}
                      <Styled.TableCell
                        style={{
                          width: "15.8%",
                          minWidth: "175px",
                        }}
                      >
                        <Styled.TextField
                          className={
                            props.editState[e.templateId].sip[e.sipLabel]
                              .focussed === true
                              ? "sync-edit-active"
                              : ""
                          }
                          inputProps={{
                            id:
                              "ba-epc-ufr-" +
                              e.templateId +
                              "-" +
                              e.rulenum +
                              "-sip-input",
                            "data-ba-label": e.sipLabel,
                          }}
                          value={sip.value}
                          // defaultValue=""
                          error={sip.error}
                          helperText={sip.helperText}
                          onFocus={(event) => {
                            handleEdit(event, e.dipLabel);
                          }}
                          onChange={(event) => handleEdit(event, e.dipLabel)}
                          onBlur={(event) => handleEdit(event, e.dipLabel)}
                          disabled={
                            props.saving ||
                            e.rulenum === 1021 ||
                            e.rulenum === 1022 ||
                            e.rulenum === 1023
                          }
                          variant="outlined"
                          label={e.sipLabel}
                        />
                        {e.sipLabel === "" ? (
                          ""
                        ) : props.editState[e.templateId].sip[e.sipLabel]
                            .linked === true ? (
                          <Styled.Tooltip
                            title={
                              props?.endpointsRolesCheck ==
                              "Invisipoint Enforcer" ? (
                                <>
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.unlink",
                                  )}{" "}
                                  {Object.keys(
                                    props.editState[e.templateId].sip[
                                      e.sipLabel
                                    ],
                                  ).length - 2}{" "}
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                  )}{" "}
                                  <b>"{e.sipLabel}"</b>
                                  <br />
                                  <br />
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.uMessage",
                                  )}
                                </>
                              ) : (
                                <>
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.unlink",
                                  )}{" "}
                                  {Object.keys(
                                    props.editState[e.templateId].sip[
                                      e.sipLabel
                                    ],
                                  ).length - 4}{" "}
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                  )}{" "}
                                  <b>"{e.sipLabel}"</b>
                                  <br />
                                  <br />
                                  {t(
                                    "page.Endpoint.Configure.configureFilterRulesModal.uMessage",
                                  )}
                                </>
                              )
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className="linked"
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-sip-linked-icon"
                              }
                              data-ba-label={e.sipLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        ) : (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.link",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].sip[e.sipLabel],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.sipLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.lmessage",
                                )}
                                <br />
                                <Trans
                                  i18nKey={
                                    "page.Endpoint.Configure.configureFilterRulesModal.lmessage2"
                                  }
                                  components={[<b />]}
                                >
                                  <b>P.S.:</b> Note that if inputs have
                                  different values at the time of linking, value
                                  of input whose link button is clicked will be
                                  applied to all.
                                </Trans>
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className=""
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-sip-unlinked-icon"
                              }
                              data-ba-label={e.sipLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkOffRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        )}
                      </Styled.TableCell>

                      {/* Source Port */}
                      <Styled.TableCell
                        style={{
                          width: "11.5%",
                          minWidth: "130px",
                        }}
                      >
                        <Styled.TextField
                          className={
                            props.editState[e.templateId].sport[e.sportLabel]
                              .focussed === true
                              ? "sync-edit-active"
                              : ""
                          }
                          inputProps={{
                            id:
                              "ba-epc-ufr-" +
                              e.templateId +
                              "-" +
                              e.rulenum +
                              "-sport-input",
                            "data-ba-label": e.sportLabel,
                          }}
                          value={sport.value}
                          // defaultValue=""
                          error={sport.error}
                          helperText={sport.helperText}
                          onFocus={(event) => handleEdit(event)}
                          onChange={(event) => handleEdit(event)}
                          onBlur={(event) => handleEdit(event)}
                          disabled={
                            props.saving ||
                            e.rulenum === 1021 ||
                            e.rulenum === 1022 ||
                            e.rulenum === 1023
                          }
                          variant="outlined"
                          label={e.sportLabel}
                        />
                        {e.sportLabel === "" ? (
                          ""
                        ) : props.editState[e.templateId].sport[e.sportLabel]
                            .linked === true ? (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.unlink",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].sport[
                                    e.sportLabel
                                  ],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.sportLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.uMessage",
                                )}
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className="linked"
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-sport-linked-icon"
                              }
                              data-ba-label={e.sportLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        ) : (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.link",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].sport[
                                    e.sportLabel
                                  ],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.sportLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.lmessage",
                                )}
                                <br />
                                <Trans
                                  i18nKey={
                                    "page.Endpoint.Configure.configureFilterRulesModal.lmessage2"
                                  }
                                  components={[<b />]}
                                >
                                  <b>P.S.:</b> Note that if inputs have
                                  different values at the time of linking, value
                                  of input whose link button is clicked will be
                                  applied to all.
                                </Trans>
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className=""
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-sport-unlinked-icon"
                              }
                              data-ba-label={e.sportLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkOffRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        )}
                      </Styled.TableCell>

                      {/* Destination IP Address */}
                      <Styled.TableCell
                        style={{
                          width: "15.8%",
                          minWidth: "175px",
                        }}
                      >
                        <Styled.TextField
                          className={
                            props.editState[e.templateId].dip[e.dipLabel]
                              .focussed === true
                              ? "sync-edit-active"
                              : ""
                          }
                          inputProps={{
                            id:
                              "ba-epc-ufr-" +
                              e.templateId +
                              "-" +
                              e.rulenum +
                              "-dip-input",
                            "data-ba-label": e.dipLabel,
                          }}
                          value={dip.value}
                          // defaultValue=""
                          error={dip.error}
                          helperText={dip.helperText}
                          onFocus={(event) => handleEdit(event, e.sipLabel)}
                          onChange={(event) => handleEdit(event, e.sipLabel)}
                          onBlur={(event) => handleEdit(event, e.sipLabel)}
                          disabled={
                            props.saving ||
                            e.rulenum === 1021 ||
                            e.rulenum === 1022 ||
                            e.rulenum === 1023
                          }
                          variant="outlined"
                          label={e.dipLabel}
                        />
                        {e.dipLabel === "" ? (
                          ""
                        ) : props.editState[e.templateId].dip[e.dipLabel]
                            .linked === true ? (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.unlink",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].dip[e.dipLabel],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.dipLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.uMessage",
                                )}
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className="linked"
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-dip-linked-icon"
                              }
                              data-ba-label={e.dipLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        ) : (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.link",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].dip[e.dipLabel],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.dipLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.lmessage",
                                )}
                                <br />
                                <Trans
                                  i18nKey={
                                    "page.Endpoint.Configure.configureFilterRulesModal.lmessage2"
                                  }
                                  components={[<b />]}
                                >
                                  <b>P.S.:</b> Note that if inputs have
                                  different values at the time of linking, value
                                  of input whose link button is clicked will be
                                  applied to all.
                                </Trans>
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className=""
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-dip-unlinked-icon"
                              }
                              data-ba-label={e.dipLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkOffRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        )}
                      </Styled.TableCell>

                      {/* Destination Port */}
                      <Styled.TableCell
                        style={{
                          width: "11.5%",
                          minWidth: "130px",
                        }}
                      >
                        <Styled.TextField
                          className={
                            props.editState[e.templateId].dport[e.dportLabel]
                              .focussed === true
                              ? "sync-edit-active"
                              : ""
                          }
                          inputProps={{
                            id:
                              "ba-epc-ufr-" +
                              e.templateId +
                              "-" +
                              e.rulenum +
                              "-dport-input",
                            "data-ba-label": e.dportLabel,
                          }}
                          value={dport.value}
                          // defaultValue=""
                          error={dport.error}
                          helperText={dport.helperText}
                          onFocus={(event) => handleEdit(event)}
                          onChange={(event) => handleEdit(event)}
                          onBlur={(event) => handleEdit(event)}
                          disabled={
                            props.saving ||
                            e.rulenum === 1021 ||
                            e.rulenum === 1022 ||
                            e.rulenum === 1023
                          }
                          variant="outlined"
                          label={e.dportLabel}
                        />
                        {e.dportLabel === "" ? (
                          ""
                        ) : props.editState[e.templateId].dport[e.dportLabel]
                            .linked === true ? (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.unlink",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].dport[
                                    e.dportLabel
                                  ],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.dportLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.uMessage",
                                )}
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className="linked"
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-dport-linked-icon"
                              }
                              data-ba-label={e.dportLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        ) : (
                          <Styled.Tooltip
                            title={
                              <>
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.link",
                                )}{" "}
                                {Object.keys(
                                  props.editState[e.templateId].dport[
                                    e.dportLabel
                                  ],
                                ).length - 2}{" "}
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.message1",
                                )}{" "}
                                <b>"{e.dportLabel}"</b>
                                <br />
                                <br />
                                {t(
                                  "page.Endpoint.Configure.configureFilterRulesModal.lmessage",
                                )}
                                <br />
                                <Trans
                                  i18nKey={
                                    "page.Endpoint.Configure.configureFilterRulesModal.lmessage2"
                                  }
                                  components={[<b />]}
                                >
                                  <b>P.S.:</b> Note that if inputs have
                                  different values at the time of linking, value
                                  of input whose link button is clicked will be
                                  applied to all.
                                </Trans>
                              </>
                            }
                            arrow={true}
                          >
                            <Styled.LinkIcon
                              className=""
                              id={
                                "ba-epc-ufr-" +
                                e.templateId +
                                "-" +
                                e.rulenum +
                                "-dport-unlinked-icon"
                              }
                              data-ba-label={e.dportLabel}
                              onClick={handleLinkIconClick}
                            >
                              <Styled.LinkOffRoundedIcon />
                            </Styled.LinkIcon>
                          </Styled.Tooltip>
                        )}
                      </Styled.TableCell>

                      {/* Protocol */}
                      <Styled.TableCell
                        style={{
                          width: "8.1%",
                          minWidth: "90px",
                        }}
                      >
                        {e.protocol} ({e.protoStr})
                      </Styled.TableCell>

                      {/* Action */}
                      <Styled.TableCell
                        style={{
                          width: "8.1%",
                          minWidth: "90px",
                        }}
                      >
                        {e.action}
                      </Styled.TableCell>

                      {/* Trusted or Untrusted */}
                      <Styled.TableCell
                        style={{
                          width: "11.99%",
                          minWidth: "90px",
                        }}
                      >
                        {e.ruletype}
                      </Styled.TableCell>
                    </Styled.TableRow>
                  );
                })}
              </Styled.TableBody>
            </Styled.TableBodyWrapper>
          </ScrollSyncPane>
        </Styled.Table>
      </Styled.TableWrapper>
    </ScrollSync>
  );
}

export default FilterTable;
