export const initialButtonState = {
  flag: {
    isSpinner: false,
    isDisabled: false,
    isClicked: false,
    isAsyncTaskCompleted: false,
    isSyncTaskCompleted: false,
  },
  asyncTask: {
    isLoading: false,
    payload: [],
    error: "",
    success: "",
  },
};
