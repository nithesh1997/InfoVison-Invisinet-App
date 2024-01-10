import { Box, IconButton } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { gatewayServices } from "../../../utils/GeneralComponentNames";
import WidthFillerSkeleton from "../../General/WidthFillerSkeleton";
import { Styled } from "../GatewayserviceStyling/Network.style.js/networkTable.style";

function NetworkTimeTable(props) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Styled.NewWrapper>
      <Styled.WrapperTwo>
        <Styled.Typo>
          {t(
            `page.gatewayServer.services.context.networkTimeProtocol.table.title`,
          )}
        </Styled.Typo>
        <StyledCloseRounded
          id={`${gatewayServices}-ntp-close-icon-btn`}
          onClick={props.handleClosePortal}
        >
          <CloseRounded />
        </StyledCloseRounded>
      </Styled.WrapperTwo>

      {props.loading ? (
        <Box style={{ padding: "1em" }}>
          <WidthFillerSkeleton />
        </Box>
      ) : (
        <Styled.TableWrapper>
          <Styled.Table>
            <Styled.TableHead style={{ width: "100%" }}>
              <Styled.TableHeadWrapper style={{ width: "100%" }}>
                <Styled.TableHeadCell
                  style={{
                    textAlign: "center",
                    width: "70%",
                    borderRight: "1px solid #0094FD",
                  }}
                >
                  {t(
                    `page.gatewayServer.services.context.networkTimeProtocol.table.columns.serverHostnameOrIP.text`,
                  )}
                </Styled.TableHeadCell>

                <Styled.TableHeadCell
                  style={{ textAlign: "center", width: "30%" }}
                >
                  {t(
                    `page.gatewayServer.services.context.networkTimeProtocol.table.columns.status.text`,
                  )}
                </Styled.TableHeadCell>
              </Styled.TableHeadWrapper>
            </Styled.TableHead>

            <Styled.TableBody style={{ width: "100%" }}>
              <Styled.TableBodyWrapper
                style={{ width: "100%" }}
                theme={{ isHovered }}
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {props.data.map((e) => {
                  return (
                    <Styled.TableRow>
                      <Styled.TableBodyCell
                        style={{
                          textAlign: "left",
                          width: "70%",
                          borderRight: "1px solid #0094FD",
                        }}
                      >
                        <Styled.ListItemText>{e.server}</Styled.ListItemText>
                      </Styled.TableBodyCell>

                      <Styled.TableBodyCell
                        style={{ textAlign: "center", width: "30%" }}
                      >
                        <Styled.ListItemText>
                          {e.status.toLocaleLowerCase() === "good"
                            ? t(`commons.enabledText`)
                            : t(`commons.disabledText`)}
                        </Styled.ListItemText>
                      </Styled.TableBodyCell>
                    </Styled.TableRow>
                  );
                })}
              </Styled.TableBodyWrapper>
            </Styled.TableBody>
          </Styled.Table>
        </Styled.TableWrapper>
      )}
    </Styled.NewWrapper>
  );
}

export default NetworkTimeTable;

const StyledCloseRounded = styled(IconButton)`
  padding: 0.25em;

  &:hover {
    background: rgba(2, 147, 254, 0.2);
  }
`;
