import { Box, Tooltip, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Styled } from "./PreProcessValidation.Styled";

export default function PreProcessValidationTable({
  isEligible,
  EPC_CheckState,
  logs,
  loading,
  inEligibleIndics,
}) {
  const eligibles = ["Not Running"];

  const [isHovered, setIsHovered] = useState(false);

  const rows = Object.values(EPC_CheckState.endpoints).filter((e) => {
    const check = eligibles.includes(e.taskStatus);

    return isEligible ? check : !check;
  });

  const grammerly = !!rows.length ? "s" : "";

  return (
    <Styled.Content>
      <Styled.Message theme={{ error: !isEligible }}>
        {isEligible
          ? `List of Endpoint${grammerly} that will be pending`
          : `List of Endpoint${grammerly} that will be processed`}
      </Styled.Message>

      <Styled.Divider />

      <Styled.TableWrapper>
        <Styled.Table>
          <Styled.TableHead style={{ width: "100%" }}>
            <Styled.TableHeadWrapper style={{ width: "100%" }}>
              <Styled.TableHeadCell
                style={{
                  textAlign: "left",
                  width: !isEligible ? "20%" : "40%",
                  borderRight: "1px solid #0094FD",
                }}
              >
                Name
              </Styled.TableHeadCell>
              <Styled.TableHeadCell
                style={{
                  textAlign: "left",
                  width: "60%",
                  borderRight: !isEligible ? "1px solid #0094FD" : "",
                }}
              >
                Serial #
              </Styled.TableHeadCell>
              {!isEligible ? (
                <Styled.TableHeadCell
                  style={{ textAlign: "center", width: "20%" }}
                >
                  Reason
                </Styled.TableHeadCell>
              ) : null}
            </Styled.TableHeadWrapper>
          </Styled.TableHead>

          <Styled.TableBody style={{ width: "100%" }}>
            <Styled.TableBodyWrapper
              style={{ width: "100%" }}
              theme={{ isHovered }}
              onMouseOver={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {loading === "loading" ? (
                <Box
                  style={{
                    display: "grid",
                    placeItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                [...logs].map((data) => {
                  return (
                    <Styled.TableRow>
                      <Styled.TableBodyCell
                        style={{
                          textAlign: "left",
                          width: !isEligible ? "20%" : "40%",
                          borderRight: "1px solid #0094FD",
                        }}
                      >
                        <Styled.ListItemText>{data.name}</Styled.ListItemText>
                      </Styled.TableBodyCell>

                      <Styled.TableBodyCell
                        style={{
                          textAlign: "left",
                          width: "60%",
                          borderRight: !isEligible ? "1px solid #0094FD" : "",
                        }}
                      >
                        <Styled.ListItemText>
                          {data.epcclient_ID}
                        </Styled.ListItemText>
                      </Styled.TableBodyCell>

                      {!isEligible ? (
                        <Styled.TableBodyCell
                          style={{
                            textAlign: "left",
                            width: "20%",
                            display: "grid",
                            placeItems: "center",
                            // gridTemplateColumns: "50% 50%",
                          }}
                        >
                          {data.icons.map(({ icon, tooltip }) => {
                            return <Tooltip title={tooltip}>{icon}</Tooltip>;
                          })}
                        </Styled.TableBodyCell>
                      ) : null}
                    </Styled.TableRow>
                  );
                })
              )}
            </Styled.TableBodyWrapper>
          </Styled.TableBody>
        </Styled.Table>
      </Styled.TableWrapper>
    </Styled.Content>
  );
}
