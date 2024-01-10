export const READY_HANDLER = (
  currentRow,
  PayloadState,
  RunEffectState,
  ButtonStates,
  TableStates,
) => {
  const { PromptState } = TableStates;

  const [payload, setPayload] = PayloadState;
  const [runEffect, setRunEffect] = RunEffectState;
  const [promptState, setPromptState] = PromptState;

  setPayload((oldState) => ({ ...oldState, loading: true }));

  setTimeout(() => {
    setPromptState(true);
  }, 10);
};
