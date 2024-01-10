export const WAITING_HANDLER = (
  currentRow,
  PayloadState,
  RunEffectState,
  ButtonStates,
  TableStates,
) => {
  const [payload, setPayload] = PayloadState;
  const [runEffect, setRunEffect] = RunEffectState;

  setTimeout(() => {
    setRunEffect((oldState) => "TERMINATED");
  }, 10);
};
