import React, { createRef, useContext, useEffect, useState } from "react";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/StatsContainerWidgetViewMoreModal.style";
import Style from "../../style/index";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const parseName = (word) => {
  const _word = word.toLocaleLowerCase().replace(/[^a-zA-Z0-9\s]/g, "");
  const $0 = _word.split(" ").filter((e) => e);
  const $1 = $0.splice(1).map((_) => _[0].toLocaleUpperCase() + _.slice(1));

  return [...$0, ...$1].join("");
};

export default function StatsContainerWidgetViewMoreModal(props) {
  const { t, i18n } = useTranslation();
  const searchInputRef = createRef();

  const { chassis_model } = useSelector(($) => $.gatewayConfig);
  const AppOverlayContext = useContext(OverlayContext);
  const { name, payload, isStats, display } = AppOverlayContext.widgetData;
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(payload);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const onClose = () => {
    AppOverlayContext.setWidgetData((e) => ({ ...e, display: false }));
  };

  useEffect(() => {
    setData(
      payload.filter((el) => {
        return el.name.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    );
  }, [searchTerm, payload]);

  return (
    <Style.GlobalModal
      open={display}
      onClose={onClose}
      transparent={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      Content={
        <>
          <div
            style={{ width: "615px" }}
            container
            className={props.flag && "hide"}
          >
            <div>
              <Styled.ModalHeader>
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
                  {t(
                    `page.home.dashboard.widget.portal.title.${parseName(
                      name,
                    )}`,
                  )}
                </h6>

                <Styled.CloseIconComponent onClick={onClose} />
              </Styled.ModalHeader>

              <div style={{ padding: "1rem" }}>
                <Styled.DivComponent>
                  <Styled.SearchDivComponent>
                    <Styled.SearchInputComponent
                      ref={searchInputRef}
                      type="text"
                      placeholder={t(
                        "page.home.dashboard.widget.portal.search.placeholder",
                        {
                          name: parseName(name),
                        },
                      )}
                      value={searchTerm}
                      onChange={handleChange}
                      disabled={false}
                    />

                    <Styled.IComponent
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
                    />
                  </Styled.SearchDivComponent>
                </Styled.DivComponent>

                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "0.5em",
                    boxShadow: "0em 0em 2em -1.5em #333",
                  }}
                >
                  <table
                    style={{
                      paddingTop: "0.5rem",
                      paddingBottom: "1rem",
                      overflow: "auto",
                      width: "100%",
                      color: "#212529",
                      verticalAlign: "top",
                      borderColor: "#dee2e6",
                      display: "table",
                      borderCollapse: "collapse",
                      padding: ".5rem .5rem",
                    }}
                  >
                    <thead style={{ verticalAlign: "bottom" }}>
                      <Styled.TrHead>
                        <Styled.ThComponent
                          scope="col"
                          style={{ width: isStats ? "40%" : "70%" }}
                        >
                          {t(
                            `page.home.dashboard.widget.portal.title.${parseName(
                              name,
                            )}`,
                          )}
                        </Styled.ThComponent>

                        {isStats ? (
                          <>
                            {chassis_model !== "5010" && (
                              <Styled.ThComponent
                                scope="col"
                                style={{
                                  width: "30%",
                                  textAlign: "right",
                                }}
                              >
                                {t(
                                  "page.home.dashboard.widget.portal.table.thead.trusted",
                                )}
                              </Styled.ThComponent>
                            )}

                            <Styled.ThComponent
                              scope="col"
                              style={{
                                width: "30%",
                                textAlign: "right",
                              }}
                            >
                              {t(
                                "page.home.dashboard.widget.portal.table.thead.untrusted",
                              )}
                            </Styled.ThComponent>
                          </>
                        ) : (
                          <Styled.ThComponent
                            scope="col"
                            style={{
                              width: "30%",
                            }}
                          >
                            {t(
                              "page.home.dashboard.widget.portal.table.thead.count",
                            )}
                          </Styled.ThComponent>
                        )}
                      </Styled.TrHead>
                    </thead>
                  </table>

                  <Styled.ScrollContainer>
                    <table
                      style={{
                        paddingTop: "0.5rem",
                        paddingBottom: "1rem",
                        overflow: "auto",
                        width: "100%",
                        color: "#212529",
                        verticalAlign: "top",
                        borderColor: "#dee2e6",
                        display: "table",
                        borderCollapse: "collapse",
                        padding: ".5rem .5rem",
                      }}
                    >
                      {props.loading ? (
                        <WidthFillerSkeleton />
                      ) : (
                        <tbody>
                          {isStats
                            ? data.map(
                                ({
                                  name,
                                  groupid,
                                  trustedData,
                                  unTrustedData,
                                }) => (
                                  <Styled.TrComponent
                                    className="ba-gw-row"
                                    key={groupid}
                                  >
                                    <Styled.TdComponent
                                      style={{
                                        width: "42%",
                                        textAlign: "left",
                                      }}
                                    >
                                      {name}
                                    </Styled.TdComponent>

                                    <Styled.TdComponent
                                      style={{
                                        width: "30%",
                                        textAlign: "right",
                                      }}
                                    >
                                      {trustedData}
                                    </Styled.TdComponent>

                                    <Styled.TdComponent
                                      style={{
                                        width: "30%",
                                        textAlign: "right",
                                      }}
                                    >
                                      {unTrustedData}
                                    </Styled.TdComponent>
                                  </Styled.TrComponent>
                                ),
                              )
                            : data.map((el) => (
                                <Styled.TrComponent
                                  className="ba-gw-row"
                                  key={el.key}
                                >
                                  <Styled.TdComponent style={{ width: "70%" }}>
                                    {el.name}
                                  </Styled.TdComponent>

                                  <Styled.TdComponent style={{ width: "30%" }}>
                                    {el.count}
                                  </Styled.TdComponent>
                                </Styled.TrComponent>
                              ))}
                        </tbody>
                      )}
                    </table>
                  </Styled.ScrollContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
