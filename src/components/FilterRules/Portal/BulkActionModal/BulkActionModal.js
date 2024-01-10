import { useEffect, useState } from "react";
import { Props } from "./BulkActionModal.default";
import { Styled } from "./BulkActionModal.style";

export const BulkActionModal = (props = Props) => {
  const { display, title, error } = props;
  const { message, messageBody } = props;
  const { accept, acceptText, onAcceptArgs, onAccept } = props;
  const { reject, rejectText, onRejectArgs, onReject } = props;
  const { close, closeText, onCloseArgs, onClose } = props;

  // const messageKeys = Object.keys(props.messageBody ?? {});
  let messageRows = Object.values(messageBody ?? {});

  messageRows = messageRows.map((row) => ({
    ...row,
    already: typeof row.message === "string" && row.message.includes("Already"),
  }));
  messageRows.sort((a, b) => {
    // If either of a or b has error = true and the other doesn't, sort the one with error = true before the other one.
    if (a.error === true && b.error !== true) {
      return -1;
    }
    if (b.error === true && a.error !== true) {
      return 1;
    }
    // If both a and b have error = true, sort based on ruleNumber.
    if (a.error === true && b.error === true) {
      return a.ruleNumber - b.ruleNumber;
    }

    // If both a and b don't have error = true, sort based on success message.
    if (a.error !== true && b.error !== true) {
      // If either of a or b has already = false and the other doesn't, sort the one with already = false before the other one.
      if (a.already !== true && b.already === true) {
        return -1;
      }
      if (b.already !== true && a.already === true) {
        return 1;
      }
      // If both a and b have already = false, sort based on ruleNumber.
      /* if (a.already !== true && b.already !== true) {
        return a.ruleNumber - b.ruleNumber;
      } */

      // If both a and b don't have already = false, sort based on rule number directly as they're already messages.
      /* if (a.already === true && b.already === true) {
        return a.ruleNumber - b.ruleNumber;
      } */
    }

    return a.ruleNumber - b.ruleNumber;
  });

  // const [isKeys, setIsKeys] = useState(true);
  const [items, setItems] = useState(messageRows);

  const [successButton, setSuccessButton] = useState({ isSelected: false });
  const [failureButton, setFailureButton] = useState({ isSelected: false });

  const [isHovered, setIsHovered] = useState(false);

  /* useEffect(() => {
    if (isKeys && messageKeys.length) {
      setItems(messageKeys);
      setIsKeys(false);
    }
  }, [isKeys, messageKeys]); */

  useEffect(() => {
    props.setModalSpinner({ status: "close", text: "" });
  }, []);

  return (
    <Styled.Modal
      open={display}
      onClose={onClose}
      aria-labelledby="bulk-action-modal-title"
      aria-describedby="bulk-action-modal-message"
    >
      <Styled.TitleWrapper>
        <Styled.Title id="bulk-action-modal-title">{title}</Styled.Title>
      </Styled.TitleWrapper>

      <Styled.Content
        style={{
          // width: "500px",
          // maxHeight: "400px",
          height: "60vh",
          maxHeight: "800px",
        }}
      >
        <Styled.Message id="bulk-action-modal-message" theme={{ error }}>
          {message ?? ""}
        </Styled.Message>

        <Styled.Divider />

        {items.length ? (
          <Styled.TableWrapper>
            <Styled.Table>
              <Styled.TableHead style={{ width: "100%" }}>
                <Styled.TableHeadWrapper style={{ width: "100%" }}>
                  <Styled.TableHeadCell
                    style={{
                      textAlign: "center",
                      width: "30%",
                      borderRight: "1px solid #2d7ee950",
                    }}
                  >
                    Rule Number
                  </Styled.TableHeadCell>
                  <Styled.TableHeadCell
                    style={{ textAlign: "center", width: "70%" }}
                  >
                    Task Status
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
                  {items.map((row) => {
                    return (
                      <Styled.TableRow
                        id={"ba-fr-bulk-action-result-row-" + row.ruleNumber}
                        key={"ba-fr-bulk-action-result-row-" + row.ruleNumber}
                      >
                        <Styled.TableBodyCell
                          style={{
                            textAlign: "center",
                            width: "30%",
                            borderRight: "1px solid #2d7ee940",
                          }}
                          theme={{
                            error: row.error,
                            isAlready: row.already,
                          }}
                        >
                          <Styled.ListItemText style={{ fontSize: "14px" }}>
                            {row.ruleNumber}
                          </Styled.ListItemText>
                        </Styled.TableBodyCell>

                        <Styled.TableBodyCell
                          style={{
                            textAlign: "left",
                            width: "70%",
                          }}
                          theme={{
                            error: row.error,
                            isAlready: row.already,
                          }}
                        >
                          <Styled.ListItemText style={{ fontSize: "14px" }}>
                            {row.message}
                          </Styled.ListItemText>
                        </Styled.TableBodyCell>
                      </Styled.TableRow>
                    );
                  })}
                </Styled.TableBodyWrapper>
              </Styled.TableBody>
            </Styled.Table>
          </Styled.TableWrapper>
        ) : null}
      </Styled.Content>

      <Styled.Actions>
        {reject ? (
          <Styled.RejectButton onClick={() => onReject(...onAcceptArgs)}>
            {rejectText}
          </Styled.RejectButton>
        ) : null}
        {accept ? (
          <Styled.AcceptButton onClick={() => onAccept(...onRejectArgs)}>
            {acceptText}
          </Styled.AcceptButton>
        ) : null}
        {close ? (
          <Styled.CloseButton onClick={() => onClose(...onCloseArgs)}>
            {closeText}
          </Styled.CloseButton>
        ) : null}
      </Styled.Actions>
    </Styled.Modal>
  );
};
