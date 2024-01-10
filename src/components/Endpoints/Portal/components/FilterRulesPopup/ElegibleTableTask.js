import React, { useState } from "react";
import { Styled } from "./BulkActioTableStyle";

export default function ConfigureFilterRulesElegibleTable(props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Styled.Modal>
      <Styled.Content>
        <Styled.Message>
          List of Endpoint(s) eligible for new task.
        </Styled.Message>

        <Styled.Divider />

        <Styled.TableWrapper>
          <Styled.Table>
            <Styled.TableHead style={{ width: "100%" }}>
              <Styled.TableHeadWrapper style={{ width: "100%" }}>
                <Styled.TableHeadCell
                  style={{
                    textAlign: "center",
                    width: "50%",
                    borderRight: "1px solid #2d7ee950",
                  }}
                >
                  Name
                </Styled.TableHeadCell>
                <Styled.TableHeadCell
                  style={{
                    textAlign: "center",
                    width: "50%",
                  }}
                >
                  Serial #
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
                {Object.values(props.epCheckState.endpoints)
                  .filter((e) => e.taskStatus === "Not Running")
                  .map((data) => {
                    return (
                      <Styled.TableRow>
                        <Styled.TableBodyCell
                          style={{
                            textAlign: "center",
                            width: "50%",
                            borderRight: "1px solid #2d7ee940",
                          }}
                        >
                          <Styled.ListItemText style={{ fontSize: "14px" }}>
                            {data.name}
                          </Styled.ListItemText>
                        </Styled.TableBodyCell>

                        <Styled.TableBodyCell
                          style={{
                            textAlign: "left",
                            width: "50%",
                          }}
                        >
                          <Styled.ListItemText style={{ fontSize: "14px" }}>
                            {data.epcclient_ID}
                          </Styled.ListItemText>
                        </Styled.TableBodyCell>
                      </Styled.TableRow>
                    );
                  })}
              </Styled.TableBodyWrapper>
            </Styled.TableBody>
          </Styled.Table>
        </Styled.TableWrapper>
      </Styled.Content>
    </Styled.Modal>
  );
}
