export const ABORTED_HANDLER = (
  currentRow,
  PayloadState,
  RunEffectState,
  ButtonStates,
  TableStates,
) => {
  const [payload, setPayload] = PayloadState;
  const [runEffect, setRunEffect] = RunEffectState;

  setTimeout(() => {
    setPayload((oldState) => ({ ...oldState, loading: false }));
    setRunEffect((oldState) => "");
  }, 3000);
};
